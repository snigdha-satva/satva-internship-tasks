const excludedKey = "excludedTransactions";

$(document).ready(() => {
  renderExcluded();
});

function getExcluded() {
  return JSON.parse(localStorage.getItem(excludedKey) || '[]');
}

function renderExcluded() {
  const excluded = getExcluded();
  const container = $("#excludedContainer");
  container.empty();

  if (!excluded.length) {
    container.html("<div class='text-muted p-3'>No excluded transactions</div>");
    $("#includeBtn").prop("disabled", true);
    return;
  }

  excluded.forEach(id => {
    container.append(`
      <div class="row mb-2 align-items-start border rounded p-2 bg-white shadow-sm" data-c1="${id}">
        <div class="col-md-1 text-center pt-2">
          <input type="checkbox" class="include-check" style="transform: scale(1.2);">
        </div>

        <div class="col-md-4">
          <div class="tx-card border p-2 bg-light" data-id="${id}">
            <div class="fw-bold text-primary">Excluded Transaction</div>
            <div class="small text-muted">ID: ${id}</div>
          </div>
        </div>
      </div>
    `);
  });
}

$(document).on("change", ".include-check", function () {
  const anyChecked = $(".include-check:checked").length > 0;
  $("#includeBtn").prop("disabled", !anyChecked);
});

$("#includeBtn").click(() => {
  const checkedIds = [];
  $(".include-check:checked").each(function () {
    const id = $(this).closest("[data-c1]").data("c1");
    checkedIds.push(id);
  });

  if (!checkedIds.length) return;

  let excluded = getExcluded();
  excluded = excluded.filter(id => !checkedIds.includes(id));

  localStorage.setItem(excludedKey, JSON.stringify(excluded));

  window.location.href = "reconcile.html";
});
