const EmployeeApp = (function () {
    "use strict";

    const CONFIG = {
        dataUrl: "data/EmployeeData.json",
        itemsPerPage: 5,
        debounceDelay: 300
    };

    const STATE = {
        allEmployees: [],
        filteredEmployees: [],
        currentPage: 1,
        sortColumn: null,
        sortDescending: false,
        searchTerm: ""
    };

    function formatDate(dateString) {
        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return dateString;
            }

            const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            const day = date.getDate().toString().padStart(2, "0");
            const month = months[date.getMonth()];
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        } catch {
            return dateString;
        }
    }

    function escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function getDepartmentBadge(department) {
        const safeDept = escapeHtml(department);
        return `<span class="dept-badge dept-${safeDept}">${safeDept}</span>`;
    }

    function getGenderDisplay(gender) {
        if (!gender) return "";
        const upperGender = gender.toUpperCase();
        return upperGender === "F" ? "F" : upperGender === "M" ? "M" : gender;
    }

    function formatCurrency(amount) {
        try {
            return parseFloat(amount).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR"
            });
        } catch {
            return amount;
        }
    }

    function showLoading() {
        $("#loadingSpinner").removeClass("d-none");
        $(".table-responsive").addClass("d-none");
    }

    function hideLoading() {
        $("#loadingSpinner").addClass("d-none");
        $(".table-responsive").removeClass("d-none");
    }

    function showError(message) {
        $("#errorText").text(message);
        $("#errorMessage").removeClass("d-none");
    }

    function hideError() {
        $("#errorMessage").addClass("d-none");
    }

    function getJsonFileName() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `data/EmployeeData_${year}${month}${day}.json`;
    }

    function fetchEmployees() {
        showLoading();
        hideError();

        const primaryUrl = getJsonFileName();
        const fallbackUrl = CONFIG.dataUrl;

        $.ajax({
            url: primaryUrl + "?v=" + new Date().getTime(),
            method: "GET",
            dataType: "json",
            success: function (data) {
                handleDataLoaded(data);
            },
            error: function () {
                $.ajax({
                    url: fallbackUrl + "?v=" + new Date().getTime(),
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        handleDataLoaded(data);
                    },
                    error: function (xhr, status, error) {
                        hideLoading();
                        showError(
                            "Failed to load employee data. Please ensure the JSON file exists in the data folder. (" +
                            error + ")"
                        );
                    }
                });
            }
        });
    }

    function handleDataLoaded(data) {
        if (!Array.isArray(data)) {
            hideLoading();
            showError("Invalid data format received.");
            return;
        }

        STATE.allEmployees = data;
        STATE.filteredEmployees = [...data];
        STATE.currentPage = 1;

        hideLoading();
        renderTable();
        renderPagination();
        updateRecordCount();
    }

    function renderTable() {
        const tbody = $("#employeeTableBody");
        tbody.empty();

        const startIndex = (STATE.currentPage - 1) * CONFIG.itemsPerPage;
        const endIndex = startIndex + CONFIG.itemsPerPage;
        const pageEmployees = STATE.filteredEmployees.slice(startIndex, endIndex);

        if (pageEmployees.length === 0) {
            $("#noRecords").removeClass("d-none");
            return;
        }

        $("#noRecords").addClass("d-none");

        pageEmployees.forEach(function (employee, index) {
            const row = $("<tr></tr>");
            const employeeJson = escapeHtml(JSON.stringify(employee));

            row.html(
                '<td>' + escapeHtml(employee.EmployeeID) + '</td>' +
                '<td>' + escapeHtml(employee.Name) + '</td>' +
                '<td>' + getDepartmentBadge(employee.Department) + '</td>' +
                '<td>' + '<a href="#">' + escapeHtml(employee.Email) + '</a>' + '</td>' +
                '<td>' + '<a href="#">' + escapeHtml(employee.Phone) + '</a>' + '</td>' +
                '<td>' + getGenderDisplay(employee.Gender) + '</td>' +
                '<td class="text-center">' +
                '<button class="btn btn-sm btn-outline-primary view-btn" ' +
                'data-index="' + (startIndex + index) + '" ' +
                'title="View Details">' +
                '<i class="bi bi-eye-fill"></i>' +
                '</button>' +
                '</td>'
            );

            tbody.append(row);
        });

        bindViewButtons();
        updatePageInfo(startIndex, endIndex);
    }

    function bindViewButtons() {
        $(".view-btn").off("click").on("click", function () {
            const index = $(this).data("index");
            const employee = STATE.filteredEmployees[index];

            if (employee) {
                showEmployeeDetail(employee);
            }
        });
    }

    function showEmployeeDetail(employee) {
        const modalBody = $("#modalBody");
        modalBody.empty();

        const details = [
            { label: "Name", value: employee.Name },
            { label: "Date of Birth", value: employee.FormattedDOB || formatDate(employee.DOB) },
            { label: "Gender", value: employee.Gender === "M" ? "Male" : employee.Gender === "F" ? "Female" : employee.Gender },
            { label: "Designation", value: employee.Designation },
            { label: "City", value: employee.City },
            { label: "State", value: employee.State },
            { label: "Postcode", value: employee.Postcode },
            { label: "Phone", value: employee.Phone },
            { label: "Email", value: employee.Email },
            { label: "Date of Joining", value: employee.FormattedDateOfJoining || formatDate(employee.DateOfJoining) },
            { label: "Total Experience", value: employee.TotalExperienceDisplay || (employee.TotalExperience + " year(s)") },
            { label: "Department", value: null, html: getDepartmentBadge(employee.Department) },
            { label: "Monthly Salary", value: formatCurrency(employee.MonthlySalary) },
            { label: "Remarks", value: employee.Remarks || "N/A" }
        ];

        details.forEach(function (detail) {
            const row = $('<div class="detail-row"></div>');
            const label = $('<div class="detail-label"></div>').text(detail.label);
            const value = $('<div class="detail-value"></div>');

            if (detail.html) {
                value.html(detail.html);
            } else {
                value.text(detail.value);
            }

            row.append(label).append(value);
            modalBody.append(row);
        });

        const modal = new bootstrap.Modal(document.getElementById("employeeDetailModal"));
        modal.show();
    }

    function sortEmployees(column) {
        if (STATE.sortColumn === column) {
            STATE.sortDescending = !STATE.sortDescending;
        } else {
            STATE.sortColumn = column;
            STATE.sortDescending = false;
        }

        STATE.filteredEmployees.sort(function (a, b) {
            let valueA = a[column] || "";
            let valueB = b[column] || "";

            if (typeof valueA === "string") {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            let comparison = 0;
            if (valueA < valueB) comparison = -1;
            if (valueA > valueB) comparison = 1;

            return STATE.sortDescending ? -comparison : comparison;
        });

        STATE.currentPage = 1;
        renderTable();
        renderPagination();
        updateSortIndicators(column);
    }

    function updateSortIndicators(activeColumn) {
        $("th.sortable").removeClass("active");
        $("th.sortable .sort-icon")
            .removeClass("bi-arrow-up bi-arrow-down")
            .addClass("bi-arrow-down-up");

        const activeHeader = $('th.sortable[data-sort="' + activeColumn + '"]');
        activeHeader.addClass("active");

        const icon = activeHeader.find(".sort-icon");
        icon.removeClass("bi-arrow-down-up");

        if (STATE.sortDescending) {
            icon.addClass("bi-arrow-down");
        } else {
            icon.addClass("bi-arrow-up");
        }
    }

    function filterEmployees(searchTerm) {
        STATE.searchTerm = searchTerm.toLowerCase().trim();

        if (STATE.searchTerm === "") {
            STATE.filteredEmployees = [...STATE.allEmployees];
        } else {
            STATE.filteredEmployees = STATE.allEmployees.filter(function (employee) {
                return (
                    (employee.EmployeeID || "").toLowerCase().includes(STATE.searchTerm) ||
                    (employee.Name || "").toLowerCase().includes(STATE.searchTerm) ||
                    (employee.Email || "").toLowerCase().includes(STATE.searchTerm) ||
                    (employee.Department || "").toLowerCase().includes(STATE.searchTerm) ||
                    (employee.EmployeeID || "").toLowerCase().includes(STATE.searchTerm) ||
                    (employee.Phone || "").toLowerCase().includes(STATE.searchTerm)
                );
            });
        }

        if (STATE.sortColumn) {
            sortEmployees(STATE.sortColumn);
            return;
        }

        STATE.currentPage = 1;
        renderTable();
        renderPagination();
        updateRecordCount();
    }

    function renderPagination() {
        const pagination = $("#pagination");
        pagination.empty();

        const totalPages = Math.ceil(STATE.filteredEmployees.length / CONFIG.itemsPerPage);

        if (totalPages <= 1) {
            return;
        }

        const prevItem = $('<li class="page-item"></li>');
        prevItem.toggleClass("disabled", STATE.currentPage === 1);
        prevItem.html('<a class="page-link" data-page="prev">&laquo;</a>');
        pagination.append(prevItem);

        const maxVisiblePages = 5;
        let startPage = Math.max(1, STATE.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = $('<li class="page-item"></li>');
            pageItem.toggleClass("active", i === STATE.currentPage);
            pageItem.html('<a class="page-link" data-page="' + i + '">' + i + '</a>');
            pagination.append(pageItem);
        }

        const nextItem = $('<li class="page-item"></li>');
        nextItem.toggleClass("disabled", STATE.currentPage === totalPages);
        nextItem.html('<a class="page-link" data-page="next">&raquo;</a>');
        pagination.append(nextItem);

        bindPaginationEvents(totalPages);
    }

    function bindPaginationEvents(totalPages) {
        $(".page-link").off("click").on("click", function (event) {
            event.preventDefault();
            const page = $(this).data("page");

            if (page === "prev" && STATE.currentPage > 1) {
                STATE.currentPage--;
            } else if (page === "next" && STATE.currentPage < totalPages) {
                STATE.currentPage++;
            } else if (typeof page === "number") {
                STATE.currentPage = page;
            }

            renderTable();
            renderPagination();
        });
    }

    function updateRecordCount() {
        const total = STATE.allEmployees.length;
        const filtered = STATE.filteredEmployees.length;

        if (STATE.searchTerm) {
            $("#recordCount").text("Showing " + filtered + " of " + total + " employees");
        } else {
            $("#recordCount").text("Total: " + total + " employees");
        }
    }

    function updatePageInfo(startIndex, endIndex) {
        const total = STATE.filteredEmployees.length;
        const actualEnd = Math.min(endIndex, total);

        if (total > 0) {
            $("#pageInfo").text(
                "Showing " + (startIndex + 1) + " to " + actualEnd + " of " + total + " entries"
            );
        } else {
            $("#pageInfo").text("");
        }
    }

    function debounce(func, delay) {
        let timeoutId;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        };
    }

    function bindEvents() {
        $("#searchInput").on(
            "input",
            debounce(function () {
                filterEmployees($(this).val());
            }, CONFIG.debounceDelay)
        );

        $("th.sortable").on("click", function () {
            const column = $(this).data("sort");
            sortEmployees(column);
        });
    }

    function init() {
        bindEvents();
        fetchEmployees();
    }

    return {
        init: init
    };
})();

$(document).ready(function () {
    EmployeeApp.init();
});
