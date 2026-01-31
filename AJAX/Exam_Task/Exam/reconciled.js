const reconciledKey = "reconciled";
 
$(document).ready(() => {
  renderReconciled();
});
 
/* LOAD DATA */
function getReconciled() {
  const data = JSON.parse(localStorage.getItem(reconciledKey) || "[]");
  console.log("Reconciled data loaded from Storage:", data);
  return data;
}
 
function renderReconciled() {
  const data = getReconciled();
  const container = $("#reconciledContainer");
  container.empty();
 
  if (!data.length) {
    container.html("<div class='text-muted p-3'>No reconciled transactions</div>");
    $("#unreconcileBtn").prop("disabled", true);
    return;
  }
 
  data.forEach(r => {
    container.append(`
      <div class="row mb-2 align-items-start border rounded p-2 bg-white shadow-sm" data-c1="${r.c1Id}">
        <div class="col-md-1 text-center pt-2">
          <input type="checkbox" class="unreconcile-check" style="transform: scale(1.2);">
        </div>
 
        <div class="col-md-4">
          <div class="tx-card border p-2 bg-light" data-id="${r.c1Id}">
            <div class="fw-bold text-primary">C1 Transaction</div>
            <div class="small text-muted">ID: ${r.c1Id}</div>
            <div class="fw-bold">Total: $${r.c2.reduce((s, x) => s + x.amount, 0)}</div>
          </div>
        </div>
 
        <div class="col-md-7">
          <div class="d-flex flex-wrap gap-1">
            ${r.c2.map(c => `
              <div class="tx-card border p-2 bg-success text-white rounded small" style="min-width: 150px;">
                <div class="fw-bold">C2 Transaction</div>
                <div>ID: ${c.id} — $${c.amount}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>
    `);
  });
}
 
$(document).on("change", ".unreconcile-check", function () {
  const anyChecked = $(".unreconcile-check:checked").length > 0;
  $("#unreconcileBtn").prop("disabled", !anyChecked);
});
 
$("#unreconcileBtn").click(() => {
  const checkedC1Ids = [];
 
  $(".unreconcile-check:checked").each(function () {
    const id = $(this).closest("[data-c1]").data("c1");
    checkedC1Ids.push(String(id));
  });
 
  if (!checkedC1Ids.length) return;
 
  const reconciled = getReconciled();
  const updatedReconciled = reconciled.filter(r => !checkedC1Ids.includes(String(r.c1Id)));
 
  localStorage.setItem(reconciledKey, JSON.stringify(updatedReconciled));
  console.log("Updated Reconciled Storage after removal:", updatedReconciled);
 
  window.location.href = "reconcile.html";
});
 
