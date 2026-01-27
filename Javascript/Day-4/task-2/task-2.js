document.addEventListener('DOMContentLoaded', () => {
    function setCookie(key, value, days = 365) {
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${key}=${value};expires=${expiry.toUTCString()};path=/`;
    }

    function getCookie(key) {
        const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function resetCookie(key) {
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') root.setAttribute('data-bs-theme', 'dark');
        else if (theme === 'light') root.setAttribute('data-bs-theme', 'light');
        else root.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    function initSettings() {
        let currency = getCookie('currency') || '₹';
        let theme = getCookie('theme') || 'system';
    
        if (theme === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
    
        setCookie('currency', currency);
        setCookie('theme', theme);
    
        applyTheme(theme);
    
        const currencyInput = $(`input[name="currency"][value="${currency}"]`);
        if (currencyInput.length) currencyInput.prop('checked', true);
    
        const themeInput = $(`input[name="theme"][value="${theme}"]`);
        if (themeInput.length) themeInput.prop('checked', true);
    }
    

    initSettings();

    $('input[name="currency"]').change(function () {
        setCookie('currency', $(this).val());
    });

    $('input[name="theme"]').change(function () {
        setCookie('theme', $(this).val());
        applyTheme($(this).val());
    });

    $('#clearPreferences').click(() => {
        resetCookie('currency');
        resetCookie('theme');
        location.reload();
    });

    function fetchExpenses() {
        return JSON.parse(localStorage.getItem('expenses')) || [];
    }

    function storeExpenses(data) {
        localStorage.setItem('expenses', JSON.stringify(data));
    }

    const currencyRates = { '₹': 1, '$': 82, '€': 90 };

    window.goToStep2 = function () {
        if (!$('#expenseTitle').val().trim() || !$('#expenseAmount').val()) {
            alert('Please fill all required fields');
            return;
        }
        $('#step1').addClass('d-none');
        $('#step2').removeClass('d-none');
        $('#step1-tab').removeClass('active');
        $('#step2-tab').addClass('active');
    };

    window.goToStep1 = function () {
        $('#step2').addClass('d-none');
        $('#step1').removeClass('d-none');
        $('#step2-tab').removeClass('active');
        $('#step1-tab').addClass('active');
    };

    window.showConfirmModal = function () {
        if (!$('#category').val() || !$('#date').val() || !$('#paymentMode').val() || !$('#currency').val()) {
            alert('Please complete all details');
            return;
        }
        $('#confirmTitle').text($('#expenseTitle').val());
        $('#confirmAmount').text($('#expenseAmount').val() + ' ' + getCookie('currency'));
        $('#confirmType').text($('input[name="expenseType"]:checked').val());
        $('#confirmCategory').text($('#category').val());
        $('#confirmDate').text($('#date').val());
        $('#confirmPayment').text($('#paymentMode').val());
        new bootstrap.Modal($('#confirmModal')).show();
    };

    window.saveExpense = function () {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('edit');
        const expenseData = {
            id: editId || Date.now().toString(),
            title: $('#expenseTitle').val(),
            amount: +$('#expenseAmount').val(),
            type: $('input[name="expenseType"]:checked').val(),
            category: $('#category').val(),
            date: $('#date').val(),
            paymentMode: $('#paymentMode').val(),
            currency: $('#currency').val()
        };
        let expenses = fetchExpenses();
        if (editId) expenses = expenses.map(e => e.id === editId ? expenseData : e);
        else expenses.push(expenseData);
        storeExpenses(expenses);
        bootstrap.Modal.getInstance($('#confirmModal')).hide();
        window.location.href = 'view.html';
    };

    window.displayExpenses = function () {
        const tbody = $('#expenseTableBody');
        if (!tbody.length) return;
        let expenses = fetchExpenses();
        const search = $('#searchExpense').val()?.toLowerCase() || '';
        const filter = $('#filterCategory').val() || '';
        const sortOption = $('#sortBy').val();
        expenses = expenses.filter(e =>
            e.title.toLowerCase().includes(search) &&
            (!filter || e.category.toLowerCase() === filter.toLowerCase())
        );
        if (sortOption) {
            if (sortOption === 'date-desc') expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            else if (sortOption === 'date-asc') expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            else if (sortOption === 'amount-desc') expenses.sort((a, b) => b.amount - a.amount);
            else if (sortOption === 'amount-asc') expenses.sort((a, b) => a.amount - b.amount);
        }
        tbody.html(expenses.length
            ? expenses.map(e => `<tr>
                    <td>${e.title}</td>
                    <td>${e.amount} ${e.currency}</td>
                    <td>${e.type}</td>
                    <td>${e.category}</td>
                    <td>${e.date}</td>
                    <td>${e.paymentMode}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editExpense('${e.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteExpense('${e.id}')">Delete</button>
                    </td>
                </tr>`).join('')
            : `<tr><td colspan="7" class="text-center">No expenses added</td></tr>`
        );
    };

    window.editExpense = id => {
        const params = new URLSearchParams();
        params.set('edit', id);
        window.location.href = 'add.html?' + params.toString();
    };

    window.deleteExpense = id => {
        if (!confirm('Delete this expense?')) return;
        let expenses = fetchExpenses();
        expenses = expenses.filter(e => e.id !== id);
        storeExpenses(expenses);
        displayExpenses();
        updateDashboard();
    };

    window.updateDashboard = function () {
        const expenses = fetchExpenses();
        const defaultCurrency = getCookie('currency') || '₹';
        let income = 0, expense = 0;
        expenses.forEach(e => {
            const amt = e.currency === defaultCurrency ? e.amount : e.amount * currencyRates[e.currency] / currencyRates[defaultCurrency];
            e.type === 'income' ? income += +amt : expense += +amt;
        });
        if ($('#totalIncome').length) $('#totalIncome').text(defaultCurrency + income.toFixed(2));
        if ($('#totalExpenses').length) $('#totalExpenses').text(defaultCurrency + expense.toFixed(2));
        if ($('#balanceAmount').length) $('#balanceAmount').text(defaultCurrency + (income - expense).toFixed(2));
        if ($('#transactionCount').length) $('#transactionCount').text(expenses.length);
    };

    $('form').each(function () {
        $(this).submit(function (e) {
            e.preventDefault();
            $(this).find('input, select').each(function () {
                if (!$(this).val()) {
                    alert('Please complete all required fields');
                    return false;
                }
            });
        });
    });

    displayExpenses();
    updateDashboard();
    $('#searchExpense, #filterCategory, #sortBy').on('input change', displayExpenses);

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (editId) {
        const expenses = fetchExpenses();
        const e = expenses.find(exp => exp.id === editId);
        if (e) {
            $('#expenseTitle').val(e.title);
            $('#expenseAmount').val(e.amount);
            $(`input[name="expenseType"][value="${e.type}"]`).prop('checked', true);
            $('#category').val(e.category);
            $('#date').val(e.date);
            $('#paymentMode').val(e.paymentMode);
            $('#currency').val(e.currency);
        }
    }
});
