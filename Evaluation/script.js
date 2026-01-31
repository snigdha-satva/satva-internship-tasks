/* In this, the main logic to shift the data from 'possible' zone to destination column is:
    1. Priority based shifting only exists in most-likely -> likely -> possible only, i.e. in the mapping table.
    2. Shift of 'possible' cell data to destination doesn't happen directly.
    3. On line 253, we use filtering to display only those data slots whose ids are not in mapped table.
    4. This means that if data is removed from possible column, it's id is removed from the mapping table.
    5. This will make line 253 work and it will display that removed data in the destination column.
*/


let masterData = []; // This is to save the data from master file
let destinationData = []; // This is to save the data from destination file
let mappings = {}; // This is to store the mappings in the local storage
let currentFilter = 'All'; // Applies a custom filter for selecting 'All' filters
let destinationFilter = 'All'; // Does the same for destination file

const token = localStorage.getItem("jwtToken"); // To authorize the user
// Filtering the destination column data during global filtering
// Hard coded it since data between two files was very different
const TYPE_MAPPINGS = {
    'Assets': ['ASSETS'],
    'Liabilities': ['LIABILITIES'],
    'Equity': ['EQUITY/CAPITAL'],
    'Revenue': ['Professional Services Revenue', 'Product Revenue'],
    'COGS': ['Outside (or "1099") Professional Services Costs', 'Product Costs'],
    'Expense': ['Labor Expense'],
    'Other Rev & Exp': ['Other']
};

if (!token) location.href = "login.html"; // For authentication


document.addEventListener('DOMContentLoaded', function() {
    loadExcelFiles(); // Loads the two excel files from this current directory
    document.getElementById('submitBtn').addEventListener('click', saveToLocalStorage); // Saves the data to local storage
    document.getElementById('searchDestination').addEventListener('input', renderDestinationColumn); // Implements the search functionality in the destination column
});

// We use async to ensure that it returns a promise so we can use load...().then() without explicitly returning anything
async function loadExcelFiles() {
    // We use await here so that Js waits before the files are fully loaded
    // This will ensure that data is visible first so that we don't get empty UI
    await loadMasterFile();
    await loadDestinationFile();
    loadFromLocalStorage(); // Loads the data saved in local storage
    updateLastUpdated(); // This displays the last saved data in the UI
    initializeSortable(); // Implements the right shift sorting logic
}

// We use async here so that we can use await in it
async function loadMasterFile() {
    try {
        const response = await fetch('Master Chart of account.xlsx'); // Fetches the data from master file
        const arrayBuffer = await response.arrayBuffer(); // response is a fetch API object and response.arrayBuffer() reads the response body(raw binary memory)
        const data = new Uint8Array(arrayBuffer); // Converts raw binary data to array-like objects of bytes
        const workbook = XLSX.read(data, {type: 'array'}); // Enters the data to ajax excel workbook
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]; // Creates a sheet in workbook
        const jsonData = XLSX.utils.sheet_to_json(firstSheet); // Converts the sheet data to json
        
        masterData = jsonData // Maps the columns of master excel file in the json
            .map((row, index) => ({
                id: 'master_' + index,
                number: row['Number'] || '',
                name: row['Name'] || '',
                type: row['Type'] || 'Other',
                count: row['Count'] || ''
            }))
            .filter(item => item.number && item.name); // Matches according to the name and number
        
        createFilterButtons(); // Creates button for global filtering
        renderMappingTable(); // Renders the middle three columns for mapping
    } catch (error) {
        console.error('Error loading master file:', error);
    }
}

async function loadDestinationFile() {
    try {
        const response = await fetch('destination.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        destinationData = jsonData
            .map((row, index) => ({
                id: 'dest_' + index,
                number: row['AccountCode'] || '',
                name: row['AccountName'] || '',
                type: row['AccountTypeName'] || '',
                subAccountName: row['SubAccountName'] || '',
                count: ''
            }))
            .filter(item => item.number && item.name);
        
        createDestinationFilters(); // Creates filter buttons for destination column
        renderDestinationColumn(); // Renders the data in destination column
    } catch (error) {
        console.error('Error loading destination file:', error);
    }
}

function createFilterButtons() {
    const types = ['All', ...new Set(masterData.map(item => item.type))]; // Creates one common 'All' and fetches other types from the master file
    const container = document.getElementById('filterButtons');
    container.innerHTML = '';
    
    // Creates a new button for each type of data
    types.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (type === 'All' ? ' active' : ''); // Checks if filter is set to all and makes it active by default otherwise not active
        btn.textContent = type; // Names the button according to type
        btn.onclick = () => filterByType(type); // Filters data on click
        container.appendChild(btn); // Adds the button to the filter section
    });
}

// Does the same but for destination column
function createDestinationFilters() {
    const types = ['All', ...new Set(destinationData.map(item => item.type))];
    const container = document.getElementById('destinationFilters');
    container.innerHTML = '';
    
    types.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'filter-tab' + (type === 'All' ? ' active' : '');
        btn.textContent = type;
        btn.onclick = () => filterDestinationType(type);
        container.appendChild(btn);
    });
}

function filterByType(type) {
    currentFilter = type;
    destinationFilter = 'All'; // For resetting the destination column filtering
    
    // Checks all the buttons and adds active class if condition is true and removes it from previously selected
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === type);
    });
    
    // Resets the active destination filter to 'All'
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === 'All');
    });
    
    renderMappingTable(); // Renders the actual data based on filter
    renderDestinationColumn(); // Similar for destination column
}

// Similar implementation but for destination column
function filterDestinationType(type) {
    destinationFilter = type;
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === type);
    });
    renderDestinationColumn();
}

// This gets the mapped ids from local storage for every transaction for the mapping table
function getMappedItemIds() {
    const mappedIds = new Set();
    Object.values(mappings).forEach(mapping => {
        if (mapping.mostLikely) mappedIds.add(mapping.mostLikely.id);
        if (mapping.likely) mappedIds.add(mapping.likely.id);
        if (mapping.possible) mappedIds.add(mapping.possible.id);
    });
    return mappedIds;
}

// This maps the master type to it's corresponding destination types using the TYPE_MAPPINGS specified
function getDestinationTypesForMasterType(masterType) {
    if (masterType === 'All') {
        return null;
    }
    return TYPE_MAPPINGS[masterType] || [];
}

function renderMappingTable() {
    const container = document.getElementById('mappingTableBody');
    // Filters the global data depending on the type of filter
    const filtered = currentFilter === 'All' ? masterData : masterData.filter(item => item.type === currentFilter);
    container.innerHTML = ''; // Initially nothing is there
    
    //Applies the filter for every row in source account structure
    filtered.forEach(sourceAccount => {
        const mapping = mappings[sourceAccount.number] || { // Displays the data from local storage or sets it to null
            mostLikely: null,
            likely: null,
            possible: null
        };
        
        const row = document.createElement('div'); // Creates new row of data
        row.className = 'mapping-row'; // Sets the class name
        row.setAttribute('data-source-number', sourceAccount.number); // Sets the attribute number for source row to the number fetched from master data
        
        row.innerHTML = `
            <div class="row-cell source-cell">
                <span class="account-number">${sourceAccount.number}</span>
                <span class="account-name">${sourceAccount.name}</span>
                ${sourceAccount.count ? `<span class="account-count">${sourceAccount.count}</span>` : ''}
            </div>
            <div class="row-cell mapping-cell" data-source-number="${sourceAccount.number}" data-zone="mostLikely">
                ${mapping.mostLikely ? createMappedAccountHTML(mapping.mostLikely) : '<div class="empty-slot">Drop here</div>'}
            </div>
            <div class="row-cell mapping-cell" data-source-number="${sourceAccount.number}" data-zone="likely">
                ${mapping.likely ? createMappedAccountHTML(mapping.likely) : '<div class="empty-slot">Drop here</div>'}
            </div>
            <div class="row-cell mapping-cell" data-source-number="${sourceAccount.number}" data-zone="possible">
                ${mapping.possible ? createMappedAccountHTML(mapping.possible) : '<div class="empty-slot">Drop here</div>'}
            </div>
        `;
        
        container.appendChild(row);
    });
}

// Gets the data stored in local storage
function createMappedAccountHTML(item) {
    return `
        <div class="account-item" draggable="true" data-id="${item.id}" data-type="${item.type}">
            <span class="account-number">${item.number}</span>
            <span class="account-name">${item.name}</span>
        </div>
    `;
}

function renderDestinationColumn() {
    const container = document.getElementById('destinationColumn');
    const searchTerm = document.getElementById('searchDestination').value.toLowerCase();
    const mappedIds = getMappedItemIds();
    
    let filtered = destinationData;
    
    if (destinationFilter !== 'All') {
        filtered = filtered.filter(item => item.type === destinationFilter); // Filters according to destination types
    } else if (currentFilter !== 'All') { // For global filtering
        const mappedTypes = getDestinationTypesForMasterType(currentFilter); // Gets the mapped types for global filtering
        if (mappedTypes) {
            if (currentFilter === 'Other Rev & Exp') {
                filtered = filtered.filter(item => {
                    const subName = item.subAccountName.toLowerCase();
                    // Returns the data only when it has 'other' & ('revenue' || 'expense') in it's subAccountName
                    return subName.includes('other') && (subName.includes('revenue') || subName.includes('expense'));
                });
            } else {
                filtered = filtered.filter(item => mappedTypes.includes(item.type)); // Filtring for global match depending on TYPE_MAPPING
            }
        }
    }
    
    // filtered = filtered.filter(item => !mappedIds.has(item.id)); // It displays the slots whose ids are not in the mapping table
    
    // Search logic for destination column
    if (searchTerm) {
        filtered = filtered.filter(item => {
            const numberMatch = item.number.toString().toLowerCase().includes(searchTerm);
            const nameMatch = item.name.toLowerCase().includes(searchTerm);
            return numberMatch || nameMatch;
        });
    }
    
    container.innerHTML = filtered.map(item => createDestinationAccountHTML(item)).join('');
}

// Creates draggable slots of data and fills it with needed data
function createDestinationAccountHTML(item) {
    return `
        <div class="account-item" draggable="true" data-id="${item.id}" data-type="${item.type}">
            <span class="account-number">${item.number}</span>
            <span class="account-name">${item.name}</span>
        </div>
    `;
}

function initializeSortable() {
    const tableBody = document.getElementById('mappingTableBody');
    const destinationColumn = document.getElementById('destinationColumn');
    
    tableBody.addEventListener('dragover', handleDragOver); // Handles when slot is dragged over to table
    tableBody.addEventListener('dragleave', handleDragLeave); // Handles when dragging is not valid or user cancels it
    tableBody.addEventListener('drop', handleDrop); // Handles when slot is dropped in table 
    
    destinationColumn.addEventListener('dragstart', handleDragStart); // Handles when user starts dragging slot from destination table
    tableBody.addEventListener('dragstart', handleDragStartFromMapping); // Handles the same for table
    
    destinationColumn.addEventListener('dragover', handleDestinationDragOver); // When slot is dragged back to destination column
    destinationColumn.addEventListener('drop', handleDestinationDrop); // When slot is dropped in destination column
    
    document.addEventListener('dragend', handleDragEnd); // Handles the drop when mouse is released
}

// Prepares data so that it will be displayed when dropped
function handleDragStart(e) {
    if (e.target.classList.contains('account-item')) {
        const itemId = e.target.getAttribute('data-id');
        e.dataTransfer.setData('text/plain', JSON.stringify({
            source: 'destination', // Used incase we cancel the drag
            itemId: itemId
        }));
        e.target.classList.add('dragging'); // Sets current state to be able to be dragged
    }
}

function handleDragStartFromMapping(e) {
    // Checks if drag source is valid
    if (e.target.classList.contains('account-item') && e.target.parentElement.classList.contains('mapping-cell')) {
        const cell = e.target.parentElement; // Gets the parent cell
        const sourceNumber = cell.getAttribute('data-source-number'); // Specifies which row
        const zone = cell.getAttribute('data-zone'); // Specifies which column
        const itemId = e.target.getAttribute('data-id'); // Which item
        // Saves the drag data
        e.dataTransfer.setData('text/plain', JSON.stringify({
            source: 'mapping',
            sourceNumber: sourceNumber,
            zone: zone,
            itemId: itemId
        }));
        e.target.classList.add('dragging');
    }
}

// Shows that we can drop in the cell
function handleDragOver(e) {
    e.preventDefault(); // If we remove this, no data will be displaye
    const cell = e.target.closest('.mapping-cell'); // Finds closest mapping cell
    if (cell) {
        cell.classList.add('drag-over'); // Highlights the cell when hovered over it
    }
}

// Shows that we can no longer drop in the cell, i.e. we are out of drop-area
function handleDragLeave(e) {
    const cell = e.target.closest('.mapping-cell');
    if (cell && !cell.contains(e.relatedTarget)) { // Checks if we left the drop-area fully
        cell.classList.remove('drag-over'); // Removes the highlight
    }
}
// Allows items to be dropped on the destination column by preventing the browser's default drag behavior
function handleDestinationDragOver(e) {
    e.preventDefault();
}

// Displays the data in the destination column after we drop it (Works like an undo button)
function handleDestinationDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    
    const parsedData = JSON.parse(data);
    
    // Only process it if slot came from the mapping table
    if (parsedData.source === 'mapping') {
        const sourceMapping = mappings[parsedData.sourceNumber];
        if (sourceMapping) {
            sourceMapping[parsedData.zone] = null; // Removes item from mapping slot
        }
        renderMappingTable();
        renderDestinationColumn();
    }
}

function handleDrop(e) {
    e.preventDefault();
    const cell = e.target.closest('.mapping-cell');
    if (!cell) return;
    
    cell.classList.remove('drag-over');
    
    const sourceNumber = cell.getAttribute('data-source-number');
    const targetZone = cell.getAttribute('data-zone'); // We get this as soon as we drop the slot in any of the three zones
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Checks if dragged from destination
    if (data.source === 'destination') {
        handleDropFromDestination(data.itemId, sourceNumber, targetZone);
    } else if (data.source === 'mapping') { // Or from the mapping table
        handleDropFromMapping(data, sourceNumber, targetZone);
    }
    
    renderMappingTable();
    renderDestinationColumn();
}

// Removes the draggable classes once we drop the slot
function handleDragEnd(e) {
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function isItemInRow(sourceNumber, itemNumber) {
    const mapping = mappings[sourceNumber];
    if (!mapping) return false;
    
    const zones = ['mostLikely', 'likely', 'possible'];
    for (const zone of zones) {
        if (mapping[zone] && mapping[zone].number === itemNumber) {
            return true;
        }
    }
    return false;
}

function handleDropFromDestination(itemId, sourceNumber, targetZone) {
    const item = destinationData.find(d => d.id === itemId);
    if (!item) return;
    
    if (isItemInRow(sourceNumber, item.number)) {
        Swal.fire({
            icon: 'error',
            title: 'Duplicate Not Allowed',
            text: 'This item already exists in this row!'
        });
        return;
    }
    
    // If not saved in local storage, assign null to them
    if (!mappings[sourceNumber]) {
        mappings[sourceNumber] = { mostLikely: null, likely: null, possible: null };
    }
    
    const mapping = mappings[sourceNumber];
    
    if (targetZone === 'mostLikely') {
        const displaced = mapping.mostLikely; // If a slot is already present in most likely zone
        mapping.mostLikely = {...item}; // Saves the slot data to local storage
        

        if (displaced) {
            const displaced2 = mapping.likely; // Save the likely zone data
            mapping.likely = displaced; // Replaces the data of most-likely in likely
            
            if (displaced2) {
                mapping.possible = displaced2; // Replaces possible zone data with likely-zone
            }
        }
    } else if (targetZone === 'likely') { // Same logic
        const displaced = mapping.likely;
        mapping.likely = {...item};
        
        if (displaced) {
            mapping.possible = displaced;
        }
    } else if (targetZone === 'possible') { // Same logic
        mapping.possible = {...item};
    }
}

function handleDropFromMapping(data, targetSourceNumber, targetZone) { // targetSourceNumber is the row number
    if (data.sourceNumber === targetSourceNumber) { // For same row
        const mapping = mappings[targetSourceNumber]; // Get current mapping of the row
        if (!mapping) return; // If drop didn't happen then do nothing
        
        const item = mapping[data.zone]; // Get cell data from that column
        if (!item) return;
        console.log(item)
        mapping[data.zone] = null; // Remove data from current column
        
        if (targetZone === 'mostLikely') {
            const displaced = mapping.mostLikely;
            mapping.mostLikely = item;
            
            if (displaced) {
                const displaced2 = mapping.likely;
                mapping.likely = displaced;
                
                if (displaced2) {
                    mapping.possible = displaced2;
                }
            }
        } else if (targetZone === 'likely') {
            const displaced = mapping.likely;
            mapping.likely = item;
            
            if (displaced) {
                mapping.possible = displaced;
            }
        } else if (targetZone === 'possible') {
            mapping.possible = item;
        }
    } else { // Dropped from other row
        const sourceMapping = mappings[data.sourceNumber];
        if (!sourceMapping) return;
        
        const item = sourceMapping[data.zone];
        if (!item) return;
        
        if (isItemInRow(targetSourceNumber, item.number)) {
            Swal.fire({
                icon: 'error',
                title: 'Duplicate Not Allowed',
                text: 'This item already exists in this row!'
            });
            return;
        }
        
        sourceMapping[data.zone] = null;
        
        if (!mappings[targetSourceNumber]) {
            mappings[targetSourceNumber] = { mostLikely: null, likely: null, possible: null };
        }
        
        const targetMapping = mappings[targetSourceNumber];
        
        if (targetZone === 'mostLikely') {
            const displaced = targetMapping.mostLikely;
            targetMapping.mostLikely = {...item};
            
            if (displaced) {
                const displaced2 = targetMapping.likely;
                targetMapping.likely = displaced;
                
                if (displaced2) {
                    targetMapping.possible = displaced2;
                }
            }
        } else if (targetZone === 'likely') {
            const displaced = targetMapping.likely;
            targetMapping.likely = {...item};
            
            if (displaced) {
                targetMapping.possible = displaced;
            }
        } else if (targetZone === 'possible') {
            targetMapping.possible = {...item};
        }
    }
}

function saveToLocalStorage() {
    const dataToSave = {
        mappings,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('accountMappings', JSON.stringify(dataToSave));
    updateLastUpdated();
    alert('Data saved successfully!');
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('accountMappings');
    if (saved) {
        const data = JSON.parse(saved);
        mappings = data.mappings || {};
        renderMappingTable();
    }
}

function updateLastUpdated() {
    const saved = localStorage.getItem('accountMappings');
    if (saved) {
        const data = JSON.parse(saved);
        const date = new Date(data.timestamp);
        const formatted = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('lastUpdated').textContent = `Last Updated on ${formatted}`;
    }
}

$("#logoutBtn").click(() => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('jwtToken');
      window.location.href = 'login.html';
    }
});

$("#storageBtn").click(() => {
    if (confirm("Are you sure you want to clear your data??")) {
      localStorage.removeItem('accountMappings');
      window.location.href = 'index.html';
    }
});
