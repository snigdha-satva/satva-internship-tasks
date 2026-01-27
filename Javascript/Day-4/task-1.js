let workbook
let worksheet

document.addEventListener('DOMContentLoaded', () => {
    workbook = new ExcelJS.Workbook() // Loads the new workbook
    worksheet = workbook.addWorksheet('Timesheet') // Adds a worksheet to it
    // This defines the keys for all the columns
    worksheet.columns = [
        { key: 'uid' },
        { key: 'project' },
        { key: 'date' },
        { key: 'phase' },
        { key: 'status' },
        { key: 'logged' },
        { key: 'billable' },
        { key: 'notes' },
        { key: 'stock' },
        { key: 'link' },
        { key: 'desc' }
    ]

    restoreSession() // This is for restoring the session as previous
    bindEvents() // This is so that combining every event
    refreshAll() // This resets the whole table
})

function bindEvents() {
    const body = document.getElementById('excelTableBody')
    // This is for checking if row is filled or not
    body.addEventListener('input', refreshAll) // This adds an event listener for input
    body.addEventListener('change', refreshAll) // This for change
    document.getElementById('addRowButton').addEventListener('click', addRows) // This adds no. of rows.
    document.getElementById('deleteLastRowButton').addEventListener('click', deleteLastRow) // This deletes the last row.
}

// This is for synchronizing the HTML 
function refreshAll() {
    worksheet.spliceRows(1, worksheet.rowCount) // Removes all the rows in the worksheet
    const rows = [...document.querySelectorAll('#excelTableBody tr')] // This converts all rows in table to an array from node
    rows.forEach((tr, i) => { // For every row, it updates UID, normalizes the b & l hrs & checks if the row is complete
        updateUID(tr, i + 1)
        normalizeHours(tr)
        if (isRowComplete(tr)) saveRow(tr, i + 1)
    })
    saveSession() // This is for saving the current session
    renderBlackTable() // This renders the table after the row is saved in worksheet
}

// Checks if the row is complete or not
function isRowComplete(tr) {
    return [
        '.projectName',
        '.durationInput',
        '.phase',
        '.status',
        '.loggedHours',
        '.billableHours',
        '.notes',
        '.bcLink',
        '.bcDescription'
    ].every(sel => tr.querySelector(sel).value)
}

function normalizeHours(tr) {
    const l = tr.querySelector('.loggedHours')
    const b = tr.querySelector('.billableHours')
    if (l.value && b.value && b.value > l.value) b.value = l.value // Keeps the b & l hrs same if b > l
}

// This saves the row
function saveRow(tr, index) {
    const r = worksheet.getRow(index) // This gets a row from worksheet
    // This saves the values in the row
    r.values = [
        tr.querySelector('.uid').innerText,
        tr.querySelector('.projectName').value,
        tr.querySelector('.durationInput').value,
        tr.querySelector('.phase').value,
        tr.querySelector('.status').value,
        tr.querySelector('.loggedHours').value,
        tr.querySelector('.billableHours').value,
        tr.querySelector('.notes').value,
        tr.querySelector('.outOfStock').checked,
        tr.querySelector('.bcLink').value,
        tr.querySelector('.bcDescription').value
    ]
    r.commit() // This commits the changes in the worksheet
}

// This displays the output table
function renderBlackTable() {
    const table = document.getElementById('displayTable')
    const body = document.getElementById('displayTableBody')
    body.innerHTML = ''
    worksheet.eachRow(row => {
        const tr = document.createElement('tr') // This gets the row from table
        row.values.slice(1).forEach(v => {
            const td = document.createElement('td')
            td.innerText = v ?? ''
            tr.appendChild(td)
        })
        body.appendChild(tr)
    })
    table.style.display = worksheet.rowCount ? 'table' : 'none'
}

function addRows() {
    const input = document.getElementById('addRowCount').value.trim()
    const count = Number(input)

    if (!count || count < 1) return
    const body = document.getElementById('excelTableBody')
    let template = body.querySelector('tr')
    if (!template) template = createEmptyRow()
    for (let i = 0; i < count; i++) {
        const clone = template.cloneNode(true)
        clone.querySelectorAll('input, select').forEach(e => {
            if (e.type === 'checkbox') e.checked = false
            else e.value = ''
        })
        body.appendChild(clone)
    }
    refreshAll()
}

function deleteLastRow() {
    const body = document.getElementById('excelTableBody')
    if (!body.children.length) return

    const rows = [...body.children]
    let last = rows[rows.length - 1]

    if (!isRowComplete(last) && rows.length > 1) {
        body.removeChild(last)
    } else if (isRowComplete(last)) {
        body.removeChild(last)
        worksheet.spliceRows(rows.length, 1)
    }

    if (!body.children.length) body.appendChild(createEmptyRow())
    refreshAll()
}

function updateUID(tr, id) {
    tr.querySelector('.uid').innerText = id
}

function saveSession() {
    const data = []
    worksheet.eachRow(row => data.push(row.values.slice(1)))
    sessionStorage.setItem('timesheet', JSON.stringify(data))
}

function restoreSession() {
    const data = JSON.parse(sessionStorage.getItem('timesheet') || '[]')
    const body = document.getElementById('excelTableBody')
    body.innerHTML = ''

    if (!data.length) {
        body.appendChild(createEmptyRow())
        return
    }

    data.forEach((r, i) => {
        const tr = createEmptyRow()
        body.appendChild(tr)
        tr.querySelector('.projectName').value = r[1] || ''
        tr.querySelector('.durationInput').value = r[2] || ''
        tr.querySelector('.phase').value = r[3] || ''
        tr.querySelector('.status').value = r[4] || ''
        tr.querySelector('.loggedHours').value = r[5] || ''
        tr.querySelector('.billableHours').value = r[6] || ''
        tr.querySelector('.notes').value = r[7] || ''
        tr.querySelector('.outOfStock').checked = r[8] || false
        tr.querySelector('.bcLink').value = r[9] || ''
        tr.querySelector('.bcDescription').value = r[10] || ''
    })
}

function createEmptyRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
        <td class="uid">1</td>
        <td>
            <select class="form-select projectName">
                <option value="">Select</option>
                <option>Javascript Project</option>
                <option>Training Project</option>
            </select>
        </td>
        <td><input type="date" class="form-control durationInput"></td>
        <td>
            <select class="form-select phase">
                <option value="">Select</option>
                <option>Communication</option>
                <option>Analysis</option>
                <option>Deployment</option>
                <option>Design</option>
                <option>Prototype</option>
                <option>Bug Fixing</option>
            </select>
        </td>
        <td>
            <select class="form-select status">
                <option value="">Select</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Solved</option>
                <option>Working</option>
            </select>
        </td>
        <td><input type="time" class="form-control loggedHours"></td>
        <td><input type="time" class="form-control billableHours"></td>
        <td><input type="text" class="form-control notes"></td>
        <td class="text-center"><input type="checkbox" class="form-check-input outOfStock"></td>
        <td><input type="url" class="form-control bcLink"></td>
        <td><input type="text" class="form-control bcDescription"></td>
    `
    return tr
}