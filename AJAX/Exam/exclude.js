const token = localStorage.getItem("jwtToken");
const API_URL = "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction";

let excludedTransactionsCompany1 = JSON.parse(localStorage.getItem('excludedTransactionsCompany1') || '[]');
let excludedTransactionsCompany2 = JSON.parse(localStorage.getItem('excludedTransactionsCompany2') || '[]');
let allData = [];

if (!token) location.href = "index.html";

$("#includeBtn").prop("disabled", true);

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
      renderExcludedTransactions();
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

function renderExcludedTransactions() {
  const container = $("#excludedContainer");
  container.empty();

  const company1Title = $('<div class="col-title mb-3">Company 1 - Excluded Transactions</div>');
  container.append(company1Title);

  allData.forEach((tx) => {
    if (tx.company === "Company1" && excludedTransactionsCompany1.includes(tx.transactionId)) {
      const card = $(`
        <div class="transaction-card border p-2 mb-2 bg-light d-flex align-items-center" data-id="${tx.transactionId}" data-company="company1">
          <input type="checkbox" class="include-check me-3" data-id="${tx.transactionId}" data-company="company1" style="transform: scale(1.2);">
          <div class="flex-grow-1">
            <div>${tx.transactionType}</div>
            <small>${tx.transactionDate}</small>
            <div class="fw-bold">$${tx.amount}</div>
          </div>
        </div>
      `);
      container.append(card);
    }
  });

  const company2Title = $('<div class="col-title mb-3 mt-4">Company 2 - Excluded Transactions</div>');
  container.append(company2Title);

  allData.forEach((tx) => {
    if (tx.company === "Company2" && excludedTransactionsCompany2.includes(tx.transactionId)) {
      const card = $(`
        <div class="transaction-card border p-2 mb-2 bg-success text-white d-flex align-items-center" data-id="${tx.transactionId}" data-company="company2">
          <input type="checkbox" class="include-check me-3" data-id="${tx.transactionId}" data-company="company2" style="transform: scale(1.2);">
          <div class="flex-grow-1">
            <div>${tx.transactionType}</div>
            <small>${tx.transactionDate}</small>
            <div class="fw-bold">$${tx.amount}</div>
          </div>
        </div>
      `);
      container.append(card);
    }
  });
}

$(document).on("change", ".include-check", function () {
  $("#includeBtn").prop("disabled", $(".include-check:checked").length === 0);
});

$("#includeBtn").click(() => {
  const checkedIdsCompany1 = [];
  const checkedIdsCompany2 = [];

  $(".include-check[data-company='company1']:checked").each(function () {
    checkedIdsCompany1.push($(this).data("id"));
  });

  $(".include-check[data-company='company2']:checked").each(function () {
    checkedIdsCompany2.push($(this).data("id"));
  });

  if (checkedIdsCompany1.length) {
    excludedTransactionsCompany1 = excludedTransactionsCompany1.filter(
      id => !checkedIdsCompany1.includes(id)
    );
    localStorage.setItem('excludedTransactionsCompany1', JSON.stringify(excludedTransactionsCompany1));
  }

  if (checkedIdsCompany2.length) {
    excludedTransactionsCompany2 = excludedTransactionsCompany2.filter(
      id => !checkedIdsCompany2.includes(id)
    );
    localStorage.setItem('excludedTransactionsCompany2', JSON.stringify(excludedTransactionsCompany2));
  }

  window.location.href = "reconcile.html";
});
