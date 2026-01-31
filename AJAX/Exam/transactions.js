/*NOTE: Debit calculation is for Credit and vice versa */

const API_URL = "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction";
const token = localStorage.getItem("jwtToken");

const company1 = document.getElementById("reconciliation-container");
const company2 = document.getElementById("company2");
const debitEl = document.getElementById("debit-total");
const creditEl = document.getElementById("credit-total");
const reconcileBtn = document.getElementById("reconcileBtn");
const excludeBtn = document.getElementById("excludeBtn");

let allData = [];
let debit = 0;
let credit = 0;
let c1ToC2Map = {};
let excludedTransactionsCompany1 = JSON.parse(localStorage.getItem('excludedTransactionsCompany1') || '[]');
let excludedTransactionsCompany2 = JSON.parse(localStorage.getItem('excludedTransactionsCompany2') || '[]');
let excludedTransactions = JSON.parse(localStorage.getItem('excludedTransactions') || '[]');
let reconciledTransactionsCompany1 = JSON.parse(localStorage.getItem('reconciledTransactionsCompany1') || '[]');
let reconciledTransactionsCompany2 = JSON.parse(localStorage.getItem('reconciledTransactionsCompany2') || '[]');

if (!token) location.href = "index.html";
$("#includeBtn").prop("disabled", true);
fetchTransactions();

function fetchTransactions() {
  $.ajax({
    url: API_URL,
    type: "GET",
    headers: { Authorization: "Bearer " + token },
    success: function (res) {
      allData = [ // Get all data from the API_URL
        ...res.fromCompanyTransaction.map((tx) => mapTransaction(tx, "Company1")),
        ...res.toCompanyTransaction.map((tx) => mapTransaction(tx, "Company2")),
      ];
      renderTransactions(); // Display all the transactions
      initDragDrop(); // Enable drag and drop
    },
    error: function () {
      alert("Failed to load transactions");
    },
  });
}

function mapTransaction(tx, company) {
  let debit = 0,
    credit = 0;
  tx.lines.forEach((line) =>
    line.isCredit ? (credit += line.amount) : (debit += line.amount) // Checks if data is credit or debit and adds them to their variables
  );
  return {
    // Return all the data in the transaction
    transactionId: tx.transactionId,
    transactionType: tx.transactionType,
    transactionDate: tx.date,
    company,
    amount: debit || credit, // Since debit and credit are same, we can enter any of the two
  };
}

// Display the transaction
function renderTransactions() {
  company1.innerHTML = `<div class="col-title">Company 1</div>`;
  company2.innerHTML = `<div class="col-title">Company 2</div>`;

  allData.forEach((tx) => {
    // Displays only if transaction is not in exclude or reconciled
    if (tx.company === "Company1" && !excludedTransactionsCompany1.includes(tx.transactionId) && !reconciledTransactionsCompany1.includes(String(tx.transactionId))) {
      const row = $(`
        <div class="row mb-2 align-items-start" data-c1id="${tx.transactionId}">
          <div class="col-md-1 text-center pt-2">
            <input type="checkbox" class="exclude-check" data-id="${tx.transactionId}" data-company="company1" style="transform: scale(1.2);">
          </div>
          <div class="col-md-5">
            <div class="transaction-card border p-2 bg-light" data-id="${tx.transactionId}" data-amount="${tx.amount}">
              <div>${tx.transactionType}</div>
              <small>${tx.transactionDate}</small>
              <div class="fw-bold">$${tx.amount}</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="drop-area border rounded  bg-white" data-c1id="${tx.transactionId}">
              <small class="text-muted"></small>
            </div>
          </div>
        </div>
      `);
      $("#reconciliation-container").append(row);
    // Displays only if transaction is not in exclude or reconciled
    } else if (tx.company === "Company2" && !excludedTransactionsCompany2.includes(tx.transactionId) && !reconciledTransactionsCompany2.includes(String(tx.transactionId))) {
      const c2Card = $(`
        <div class="transaction-card d-flex border row p-2 mb-2 bg-success text-white" data-id="${tx.transactionId}" data-amount="${tx.amount}">
          <div class="col-md-1 text-center pt-2">
            <input type="checkbox" class="exclude-check" data-id="${tx.transactionId}" data-company="company2" style="transform: scale(1.2);">
          </div>
          <div class="col-md-11">
            <div>${tx.transactionType}</div>
            <small>${tx.transactionDate}</small>
            <div class="fw-bold">$${tx.amount}</div>
        </div>
        </div>
      `);
      $("#company2").append(c2Card);
    }
  });
}

function initDragDrop() {
  // Creates a new Sortable object on company 2
  // This makes the transactions draggable
  new Sortable(document.getElementById("company2"), {
    group: { name: "shared", put: true },
    sort: true,
    animation: 150,
  });

  // This makes the drop-area for putting company 2 data in it
  $(".drop-area").each(function () {
    new Sortable(this, {
      group: "shared",
      animation: 150,
      onAdd: function (evt) {
        const c1Id = $(evt.to).data("c1id"); // evt.to is id where event was dropped and this gets the data of that id
        if (!c1ToC2Map[c1Id]) c1ToC2Map[c1Id] = []; // If nothing exists in this drop ara, it creates an empty array
        c1ToC2Map[c1Id].push($(evt.item));

        $(evt.to).addClass("expanded");
        updateTotals(); // Update credit & debit
      },
      onRemove: function (evt) {
        const c1Id = $(evt.from).data("c1id");
        // Removes only the selected item's data
        c1ToC2Map[c1Id] = c1ToC2Map[c1Id].filter((el) => el[0] !== evt.item);
        if (c1ToC2Map[c1Id].length === 0) { // If there was only one slot in it, length of array should become zero once removed
          delete c1ToC2Map[c1Id]; // Delete the mapping
          $(evt.from).removeClass("expanded");
        }

        updateTotals();
      },
    });
  });
}

function updateTotals() {
  let totalDebit = 0;
  let totalCredit = 0;

  for (const c1Id in c1ToC2Map) { // Loops over all the parent cards
    const droppedC2 = c1ToC2Map[c1Id]; // Gets the array of dropped slot
    const c1Card = $(`.transaction-card[data-id="${c1Id}"]`); // Finds the parent c1 in DOM
    if (!c1Card.length) continue; // If parent card doesn't exist, skip

    const c1Amount = Number(c1Card.data("amount")); // Reads amount of parent transaction
    const debitSum = droppedC2.reduce(
      (sum, el) => sum + Number($(el).data("amount")),
      0
    );// Goes through every dropped slot in the parent's dropped area and returns the final sum

    totalDebit += debitSum; // This adds the total credit
    totalCredit += c1Amount; // This addds the total debit
  }

  debitEl.textContent = totalDebit;
  creditEl.textContent = totalCredit;

  // Keep the reconcile button disabled until debit and credit are equal 
  reconcileBtn.disabled = totalDebit !== totalCredit || totalCredit === 0;
}


$("#reconcileBtn").click(() => {
  const existing = JSON.parse(localStorage.getItem("reconciled") || "[]");

  Object.keys(c1ToC2Map).forEach((c1Id) => {
    if (c1ToC2Map[c1Id].length > 0) {
      const c1Transaction = allData.find(tx => tx.transactionId === c1Id); // Gets transactions that are made for Company 1
      const c2Transactions = c1ToC2Map[c1Id].map((e) => { // Gets for Company 2
        const c2Id = $(e).data("id"); // Unique id for company2 transaction
        const c2Transaction = allData.find(tx => tx.transactionId === c2Id);
        return {
          id: c2Id,
          amount: Number($(e).data("amount")),
          transactionType: c2Transaction ? c2Transaction.transactionType : "",
          transactionDate: c2Transaction ? c2Transaction.transactionDate : ""
        };
      });

      existing.push({
        c1Id,
        c1Amount: c1Transaction ? c1Transaction.amount : 0,
        c1Type: c1Transaction ? c1Transaction.transactionType : "",
        c1Date: c1Transaction ? c1Transaction.transactionDate : "",
        c2: c2Transactions
      });

      if (!reconciledTransactionsCompany1.includes(String(c1Id))) {
        reconciledTransactionsCompany1.push(String(c1Id));
      }

      c1ToC2Map[c1Id].forEach((e) => {
        const c2Id = $(e).data("id");
        if (!reconciledTransactionsCompany2.includes(String(c2Id))) {
          reconciledTransactionsCompany2.push(String(c2Id));
        }
      });
    }
  });

  localStorage.setItem("reconciled", JSON.stringify(existing));
  localStorage.setItem("reconciledTransactionsCompany1", JSON.stringify(reconciledTransactionsCompany1));
  localStorage.setItem("reconciledTransactionsCompany2", JSON.stringify(reconciledTransactionsCompany2));
  console.log("New Reconciled items saved:", existing);
  window.location.href = "reconciled.html";
});
$(document).on("change", ".exclude-check", function () {
  $("#excludeBtn").prop("disabled", $(".exclude-check:checked").length === 0);
});
$("#excludeBtn").click(() => {
  const checkedIdsCompany1 = [];
  const checkedIdsCompany2 = [];

  $(".exclude-check[data-company='company1']:checked").each(function () {
    const id = $(this).data("id");
    checkedIdsCompany1.push(id);
    const transaction = allData.find(tx => tx.transactionId === id);
    if (transaction) {
      excludedTransactions.push(transaction);
    }
  });

  $(".exclude-check[data-company='company2']:checked").each(function () {
    const id = $(this).data("id");
    checkedIdsCompany2.push(id);
    const transaction = allData.find(tx => tx.transactionId === id);
    if (transaction) {
      excludedTransactions.push(transaction);
    }
  });

  if (checkedIdsCompany1.length) {
    excludedTransactionsCompany1 = [...excludedTransactionsCompany1, ...checkedIdsCompany1];
    localStorage.setItem('excludedTransactionsCompany1', JSON.stringify(excludedTransactionsCompany1));
  }

  if (checkedIdsCompany2.length) {
    excludedTransactionsCompany2 = [...excludedTransactionsCompany2, ...checkedIdsCompany2];
    localStorage.setItem('excludedTransactionsCompany2', JSON.stringify(excludedTransactionsCompany2));
  }

  window.location.href = "exclude.html";
});

$("#logoutBtn").click(() => {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem('jwtToken');
    window.location.href = 'index.html';
  }
});