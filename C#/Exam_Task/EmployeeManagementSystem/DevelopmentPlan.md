# Development Plan - Employee Management System

## Project Overview

This project consists of two parts:

- Part 1: A C# Console Application to manage employee data stored in a JSON file.
- Part 2: A Web Application (HTML / Bootstrap / JavaScript / jQuery / Ajax) to display and interact with that JSON data.

---

## Part 1 - C# Console Application

### Goal

Build a console app that allows users to add and delete employees, with data persisted in a sorted JSON file.

---

### Step 1 - Project Setup

- Create a new C# Console Application project.
- Add an `App.config` file with a key for the JSON file storage path.
- Set target framework to .NET 6 or above.

---

### Step 2 - Define Models and Enums

Create the following in a `Models` folder:

**Department Enum (with color attribute)**

```
Sales      -> Red
Marketing  -> Green
Development -> Black
QA         -> Blue
HR         -> Orange
SEO        -> Pink
```

Use a custom attribute or a helper method to associate a color string with each enum value.

**Employee Class**

Fields:

- EmployeeID (string, unique)
- Name (string)
- DOB (DateTime)
- Gender (char: F or M)
- Designation (string)
- City (string)
- State (string)
- Postcode (string)
- Phone (string)
- Email (string)
- DateOfJoining (DateTime)
- TotalExperience (calculated, read-only, in years and months)
- Remarks (string, optional)
- Department (Department enum)
- MonthlySalary (decimal)

---

### Step 3 - File Management

Create a `FileManager` class responsible for:

- Reading the JSON file from the path defined in `App.config`.
- Writing the updated list back to the JSON file.
- Generating the file name dynamically as `EmployeeData_DDMMYYYY.json` using today's date.
- Creating the file if it does not exist on first run.

---

### Step 4 - Validation

Create a `Validator` class with static methods for:

- EmployeeID: required, unique (check against existing list).
- Name: required, letters and spaces only.
- DOB: valid date, must be in the past, employee must be at least 18 years old.
- Gender: must be F or M only.
- Designation: required.
- City, State: required, letters only.
- Postcode: required, numeric, 4 to 6 digits.
- Phone: required, numeric, 10 digits.
- Email: required, valid email format (use Regex).
- DateOfJoining: valid date, must be in the past, cannot be before DOB.
- Department: must match a valid enum value.
- MonthlySalary: required, must be a positive decimal number.
- Remarks: optional, no validation required.

---

### Step 5 - Business Logic

Create an `EmployeeService` class with methods:

- `AddEmployee(Employee emp)`: validate, check for duplicate EmployeeID, add to list, sort by salary descending, save to file.
- `DeleteEmployee(string id)`: find by ID, remove from list, save to file.
- `GetAllEmployees()`: load and return the current employee list from the JSON file.
- `CalculateTotalExperience(DateTime joiningDate)`: return years and months from joining date to today.

---

### Step 6 - Console Menu

Create a `MenuHandler` class to manage the main loop:

```
Press 1 - Add New Employee
Press 2 - Delete Employee
Press 3 - Exit
```

**Option 1 - Add Employee:**

- Prompt for each field one by one using the format: `Please enter [FieldName]:`
- Validate each input and re-prompt on failure with a clear error message.
- On success, save and display a confirmation message.
- Return to the main menu.

**Option 2 - Delete Employee:**

- Prompt: `Please provide the employee ID which you want to delete:`
- If found: delete and confirm.
- If not found: display error message "Employee with ID [X] not found."
- Return to the main menu.

**Option 3 - Exit:**

- Display a goodbye message and terminate.

---

### Step 7 - Exception Handling

- Wrap all file read/write operations in try-catch blocks.
- Wrap the main menu loop in a top-level try-catch to prevent unhandled crashes.
- Display user-friendly error messages on all exceptions.
- Log errors to console with the exception message.

---

### Step 8 - Sorting

- After every add or delete operation, sort the employee list by MonthlySalary descending before saving to the JSON file.

---

### Part 1 - Folder Structure

```
EmployeeConsoleApp/
  Models/
    Employee.cs
    DepartmentEnum.cs
  Services/
    EmployeeService.cs
    FileManager.cs
  Helpers/
    Validator.cs
    DepartmentColorHelper.cs
  UI/
    MenuHandler.cs
  App.config
  Program.cs
```

---

## Part 2 - Web Application

### Goal

Build a web page that reads the JSON file produced by the console app and displays employee data in a table with search, sort, and paging. A modal popup shows full employee details.

---

### Step 1 - Project Setup

- Create a folder for the web project.
- Use Bootstrap 5 for layout and styling.
- Use jQuery and Ajax to load the JSON data.
- The HTML, CSS, and JS will be in a single folder with no back-end server required (JSON served as a static file, or via a simple local server if CORS is a concern).

---

### Step 2 - Employee List Table

Display the following columns in the table:

- Name
- Gender (display F or M)
- Department (display with the matching color as per enum)
- Email
- Phone
- Actions (View icon button)

Use Bootstrap table classes for styling.

---

### Step 3 - Ajax Data Loading

- On page load, use `$.ajax()` or `$.getJSON()` to fetch the JSON file.
- Parse the response and populate the table dynamically using jQuery DOM manipulation.
- Handle errors with a user-friendly message if the file cannot be loaded.

---

### Step 4 - Sorting

Allow sorting on the following columns only:

- Name
- Email
- Department

Clicking a column header toggles between ascending and descending order. Display a sort indicator arrow in the header.

---

### Step 5 - Search / Filter

- A search input box above the table filters the displayed rows in real time.
- Filtering applies to all visible columns (Name, Gender, Department, Email, Phone).
- No server call needed - filter the already-loaded data array in memory.

---

### Step 6 - Pagination

- Display a configurable number of rows per page (default 10).
- Render pagination controls below the table (Previous, page numbers, Next).
- Pagination updates dynamically when search or sort is applied.

---

### Step 7 - Date Formatting

- Create a JavaScript utility function `formatDate(dateString)` that converts any date to the format `04-Mar-2022`.
- Use this function in all places where dates are displayed (DOB, DateOfJoining).

---

### Step 8 - Department Color Mapping

Create a JavaScript object that maps department names to colors matching the enum definition:

```
Sales      -> Red
Marketing  -> Green
Development -> Black
QA         -> Blue
HR         -> Orange
SEO        -> Pink
```

Apply the color to the department cell text using inline style or a CSS utility class.

---

### Step 9 - View Employee Modal

On clicking the eye icon in the Actions column:

- Open a Bootstrap modal popup.
- Display all employee fields in a clean layout.
- Use the `formatDate()` function for date fields.
- Show Total Experience as calculated (e.g., 3 Years 4 Months).
- Apply department color to the Department field.

---

### Step 10 - Exception Handling

- Handle Ajax failure with a visible error alert on the page.
- Wrap data processing in try-catch to handle malformed JSON gracefully.

---

### Part 2 - File Structure

```
EmployeeWebApp/
  index.html
  css/
    custom.css
  js/
    app.js
    dateHelper.js
    departmentColors.js
  data/
    EmployeeData_DDMMYYYY.json  (copied from console app output)
```

---

## Development Sequence

| Step | Task                                         | Part   |
| ---- | -------------------------------------------- | ------ |
| 1    | Set up C# console project and App.config     | Part 1 |
| 2    | Create Employee model and Department enum    | Part 1 |
| 3    | Build FileManager for JSON read/write        | Part 1 |
| 4    | Build Validator class                        | Part 1 |
| 5    | Build EmployeeService with CRUD logic        | Part 1 |
| 6    | Build MenuHandler with console UI            | Part 1 |
| 7    | Test Add, Delete, Exit flows                 | Part 1 |
| 8    | Verify JSON file output and sorting          | Part 1 |
| 9    | Set up HTML page with Bootstrap              | Part 2 |
| 10   | Implement Ajax JSON loading                  | Part 2 |
| 11   | Build table rendering with department colors | Part 2 |
| 12   | Add search, sort, and pagination             | Part 2 |
| 13   | Build modal popup for employee detail        | Part 2 |
| 14   | Test end-to-end with real JSON data          | Both   |

---

## Queries to Clarify Before Starting

1. Should the JSON file name change each day, meaning a new file is created daily, or does one file persist and its name reflects the creation date only?
2. For Total Experience, should it be stored in the JSON as a string (e.g., "3 Years 4 Months") or calculated fresh on display in the web app?
3. Is duplicate detection for employees based only on EmployeeID, or should Name plus DOB also be checked?
4. For the web app, is the JSON file served from the same folder (static), or should a small local server setup (e.g., Node or Python) be assumed to avoid CORS issues?
5. Should the web app support mobile/responsive layout, or is desktop-only sufficient?
