const API_URL = "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction";
const token = localStorage.getItem("jwtToken");

const company1 = document.getElementById("reconciliation-container");
const company2 = document.getElementById("company2");
const debitEl = document.getElementById("debit-total");
const creditEl = document.getElementById("credit-total");
const reconcileBtn = document.getElementById("reconcileBtn");
const excludeBtn = document.getElementById("excludeBtn");

let excludedTransactions = JSON.parse(localStorage.getItem('excludedTransactions') || '[]');
let allData = [];
let debit = 0;
let credit = 0;
let c1ToC2Map = {};

if (!token) location.href = "index.html";

fetchTransactions();

function fetchTransactions() {
  $.ajax({
    url: API_URL,
    type: "GET",
    headers: { Authorization: "Bearer " + token },
    success: function (res) {
      allData = [
        ...res.fromCompanyTransaction.map((tx) => mapTransaction(tx, "Company1")),
        ...res.toCompanyTransaction.map((tx) => mapTransaction(tx, "Company2")),
      ];
      renderTransactions();
      initDragDrop();
    },
    error: function () {
      alert("Failed to load transactions");
    },
  });
}

function mapTransaction(tx, company) {
  let debit = 0, credit = 0;
  tx.lines.forEach((line) =>
    line.isCredit ? (credit += line.amount) : (debit += line.amount)
  );
  return {
    transactionId: tx.transactionId,
    transactionType: tx.transactionType,
    transactionDate: tx.date,
    company,
    amount: debit || credit,
  };
}

function renderTransactions() {
  company1.innerHTML = `<div class="col-title">Company 1</div>`;
  company2.innerHTML = `<div class="col-title">Company 2</div>`;

  allData.forEach((tx) => {
    if (excludedTransactions.includes(tx.transactionId)) {
      return; // Skip rendering excluded transactions
    }

    if (tx.company === "Company1") {
      const row = $(`
        <div class="row mb-2 align-items-start" data-c1id="${tx.transactionId}">
          <div class="col-md-6">
            <div class="transaction-card border p-2 bg-light" data-id="${tx.transactionId}" data-amount="${tx.amount}">
              <input type="checkbox" class="exclude-check" style="transform: scale(1.2);" data-id="${tx.transactionId}">
              <div>${tx.transactionType}</div>
              <small>${tx.transactionDate}</small>
              <div class="fw-bold">$${tx.amount}</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="drop-area border rounded p-2 bg-white" data-c1id="${tx.transactionId}">
              <small class="text-muted"></small>
            </div>
          </div>
        </div>
      `);
      $("#reconciliation-container").append(row);
    } else {
      const c2Card = $(`
        <div class="transaction-card border p-2 mb-2 bg-success text-white" data-id="${tx.transactionId}" data-amount="${tx.amount}">
          <input type="checkbox" class="exclude-check" style="transform: scale(1.2);" data-id="${tx.transactionId}">
          <div>${tx.transactionType}</div>
          <small>${tx.transactionDate}</small>
          <div class="fw-bold">$${tx.amount}</div>
        </div>
      `);
      $("#company2").append(c2Card);
    }
  });
}
function initDragDrop() {
    new Sortable(document.getElementById("company2"), {
      group: { name: "shared", put: true },
      sort: true,
      animation: 150,
    });
  
    $(".drop-area").each(function () {
      new Sortable(this, {
        group: "shared",
        animation: 150,
        onAdd: function (evt) {
          const c1Id = $(evt.to).data("c1id");
          if (!c1ToC2Map[c1Id]) c1ToC2Map[c1Id] = [];
          c1ToC2Map[c1Id].push(evt.item);
  
          // Update the totals for debit and credit when a transaction is added to the drop-area
          const amount = Number($(evt.item).data("amount"));
          debit += amount;  // Increase the debit for Company1
          credit -= amount; // Decrease the credit for Company1
  
          $(evt.to).addClass("expanded");
          updateTotals();
        },
        onRemove: function (evt) {
          const c1Id = $(evt.from).data("c1id");
  
          // Adjust the debit and credit when an item is removed and sent back to Company2
          const removedAmount = Number($(evt.item).data("amount"));
          const c1Amount = Number($(`.transaction-card[data-id="${c1Id}"]`).data("amount"));
          
          // When an item is returned to Company2, adjust the amounts accordingly
          debit -= removedAmount;  // Decrease debit for Company1
          credit += removedAmount; // Increase credit for Company1
  
          // Clean up the mapping and update the total
          c1ToC2Map[c1Id] = c1ToC2Map[c1Id].filter((i) => i !== evt.item);
          if (c1ToC2Map[c1Id].length === 0) $(evt.from).removeClass("expanded");
  
          updateTotals();
        },
      });
    });
  }
// Handle Exclude button click to move transactions to the Excluded screen
excludeBtn.addEventListener("click", () => {
    const selectedIds = Array.from(
      document.querySelectorAll(".exclude-check:checked")
    ).map(cb => cb.dataset.id);
  
    if (selectedIds.length === 0) {
      alert("No transactions selected for exclusion.");
      return;  // Don't proceed if no transactions are selected
    }
  
    // Add selected transaction IDs to the excludedTransactions array
    excludedTransactions = [...excludedTransactions, ...selectedIds];
  
    // Update localStorage with the new list of excluded transactions
    localStorage.setItem("excludedTransactions", JSON.stringify(excludedTransactions));
  
    // Remove the selected transactions from the allData array
    allData = allData.filter(tx => !selectedIds.includes(String(tx.transactionId)));
  
    // Re-render transactions (this will now exclude the selected ones from the Unreconciled screen)
    renderTransactions();
  
    alert(`${selectedIds.length} transaction(s) excluded.`);
  });
  