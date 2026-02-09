CREATE DATABASE practiceDB;

USE practiceDB;

CREATE TABLE Students (
	StudentID INT NOT NULL PRIMARY KEY,
	SSN VARCHAR(11) NOT NULL,
	Email VARCHAR(100) NOT NULL,
	FirstName VARCHAR(50),
	LastName VARCHAR(50),
	DateOfBirth DATE,
	DepartmentID INT,
	EnrollmentYear INT
);

INSERT INTO Students VALUES
(1, '123-45-6789', 'john.doe@email.com', 'John', 'Doe', '2000-05-15', 101, 2020),
(2, '234-56-7890', 'jane.smith@email.com', 'Jane', 'Smith', '2001-08-22', 102, 2021),
(3, '345-67-8901', 'bob.wilson@email.com', 'Bob', 'Wilson', '1999-03-10', 101, 2019),
(4, '456-78-9012', 'alice.brown@email.com', 'Alice', 'Brown', '2002-11-30', 103, 2022);

SELECT * FROM Students;

-- Super Key: Set of one or more columns that can uniquely identify a record in a table.
-- It may contain additional columns that are not strictly necessary for uniqueness

-- Super Key: {StudentID}
SELECT StudentID, COUNT(*) as RecordCount
FROM Students
GROUP BY StudentID
HAVING COUNT(*) > 1; --Returns nothing = unique

-- Super Key: {StudentID, FirstName} - Contains unnecessary column
SELECT StudentID, FirstName, COUNT(*) as RecordCount
FROM Students
GROUP BY StudentID, FirstName
HAVING COUNT(*) > 1; -- Unique




-- INDEXES:
-- An index is a database object that improves the speed of data retreival operations on a table
-- at the cost of additional storage space and writes operations.
CREATE TABLE SalesData (
	SaleID INT IDENTITY(1, 1),
	ProductID INT NOT NULL,
	CustomerID INT NOT NULL,
	SaleDate DATE NOT NULL,
	Quantity INT NOT NULL,
	UnitPrice DECIMAL(10, 2) NOT NULL,
	TotalAmount AS (Quantity * UnitPrice) PERSISTED, -- Persisted stores the computed value physically on the disk in the table, just like a normal column
	Region VARCHAR(50),
	SalesRepID INT,
	PaymentMethod VARCHAR(20),
	ShippingAddress VARCHAR(200),
	Notes VARCHAR(500)
);

-- Insert 100,000 sample records for testing
DECLARE @i INT = 1;
WHILE @i <= 100000
BEGIN
    INSERT INTO SalesData (ProductID, CustomerID, SaleDate, Quantity, 
                           UnitPrice, Region, SalesRepID, PaymentMethod)
    VALUES (
        (@i % 100) + 1,                                    -- ProductID (1-100)
        (@i % 1000) + 1,                                   -- CustomerID (1-1000)
        DATEADD(DAY, -(@i % 365), GETDATE()),             -- Random dates in last year
        (@i % 10) + 1,                                     -- Quantity (1-10)
        ROUND(RAND(CHECKSUM(NEWID())) * 100 + 10, 2),     -- UnitPrice (10-110)
        CASE @i % 4 
            WHEN 0 THEN 'North'
            WHEN 1 THEN 'South'
            WHEN 2 THEN 'East'
            ELSE 'West'
        END,
        (@i % 50) + 1,                                     -- SalesRepID (1-50)
        CASE @i % 3
            WHEN 0 THEN 'Credit Card'
            WHEN 1 THEN 'Cash'
            ELSE 'Bank Transfer'
        END
    );
    SET @i = @i + 1;
END;

EXEC sp_spaceused 'SalesData';



-- CLUSTERED INDEX:
-- It determines the physical order of data in a table.
-- Only 1 clustered index per table.
-- The table data is stored in the order of the clustered index.
-- When you create a PRIMARY KEY, SQL Server creates a clustered index by default ( unless we specify NONCLUSTERED)
-- The leaf level of a clustered index contains the actual data rows

-- Check current state (no clustered index yet)
SELECT
    OBJECT_NAME(object_id) AS TableName,
    name AS IndexName,
    type_desc AS IndexType
FROM sys.indexes
WHERE object_id = OBJECT_ID('SalesData');

-- Create Clustered Index
CREATE CLUSTERED INDEX CIX_SalesData_SaleID
ON SalesData(SaleID);

-- NONCLUSTERED INDEX:
-- It is a seperate structure from the data rows.
-- Can have multiple non-clustered indexes per table.
-- Contains index key column and a pointer to the data row.
-- The leaf level contains the index plus:
--      - Row Locator (RID) if table is a heap.
--      - Clustered Index key if table has a clustered index.

-- Create Non-clustered Index with multiple columns
CREATE NONCLUSTERED INDEX NIX_SalesDara_SaleID
ON SalesData(ProductID, Region);

-- Using INCLUDE: Include columns are added to leaf level but not sorted
CREATE NONCLUSTERED INDEX IX_SalesData_SalesRepID_Inc 
ON SalesData(SalesRepID)
INCLUDE (SaleDate, Quantity, UnitPrice, TotalAmount);


-- VIEWS IN SQL SERVER
-- It's a virtual table based on the result set of a SQL statement.
-- It contains rows and columns like a real table.
-- The fields in a view come from one or more real tables.
-- Does not store data physically (except indexed views)
-- Simplifies complex queries.
-- Provides security by restricting access to data

CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(50) NOT NULL,
    Description VARCHAR(200)
);

CREATE TABLE ProductsTable (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName VARCHAR(100) NOT NULL,
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    UnitPrice DECIMAL(10,2),
    UnitsInStock INT,
    UnitsOnOrder INT,
    ReorderLevel INT,
    Discontinued BIT DEFAULT 0
);

CREATE TABLE Suppliers (
    SupplierID INT PRIMARY KEY IDENTITY(1,1),
    CompanyName VARCHAR(100) NOT NULL,
    ContactName VARCHAR(50),
    City VARCHAR(50),
    Country VARCHAR(50),
    Phone VARCHAR(20)
);

CREATE TABLE ProductSuppliers (
    ProductID INT,
    SupplierID INT,
    PRIMARY KEY (ProductID, SupplierID),
    FOREIGN KEY (ProductID) REFERENCES ProductsTable(ProductID),
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

-- Insert sample data
INSERT INTO Categories VALUES 
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Food', 'Food and beverages'),
('Books', 'Books and publications');

INSERT INTO ProductsTable VALUES
('Laptop', 1, 999.99, 50, 10, 20, 0),
('Smartphone', 1, 699.99, 100, 25, 30, 0),
('T-Shirt', 2, 29.99, 200, 50, 100, 0),
('Jeans', 2, 59.99, 150, 30, 50, 0),
('Coffee', 3, 12.99, 300, 100, 150, 0),
('Novel', 4, 19.99, 80, 20, 25, 0),
('Old Phone', 1, 199.99, 10, 0, 5, 1);  -- Discontinued

INSERT INTO Suppliers VALUES
('TechCorp', 'John Tech', 'New York', 'USA', '123-456-7890'),
('FashionHub', 'Jane Fashion', 'Los Angeles', 'USA', '234-567-8901'),
('FoodSupply', 'Bob Food', 'Chicago', 'USA', '345-678-9012');

INSERT INTO ProductSuppliers VALUES
(1, 1), (2, 1), (3, 2), (4, 2), (5, 3), (6, 1);

-- Creating VIEWS

-- SIMPLE VIEW:
-- It's based on a single table and doesn't contain functions, GROUP BY, DISTINCT and JOINS.
-- These can be updated

-- Creating basic simple view
CREATE VIEW ActiveProducts
AS
SELECT
    ProductID,
    ProductName,
    UnitPrice
FROM ProductsTable
WHERE Discontinued = 0;

SELECT * FROM ActiveProducts;


-- COMPLEX VIEWS
-- These can contain multiple tables (JOIN), Aggregate Functions, GROUP BY, Subqueries & Distinct
-- These cannot be updated
-- View with JOIN
CREATE VIEW vw_ProductsWithCategories
AS
SELECT 
    p.ProductID,
    p.ProductName,
    c.CategoryName,
    p.UnitPrice,
    p.UnitsInStock,
    p.Discontinued
FROM ProductsTable p
INNER JOIN Categories c ON p.CategoryID = c.CategoryID;

SELECT * FROM vw_ProductsWithCategories WHERE CategoryName = 'Electronics';

-- Views can support INSERT, UPDATE, DELETE operations if:
--      1. The view is based on a single table.
--      2. It includes all NOT NULL Columns without defaults
--      3. It doesn't contain aggregate functions.
--      4. It doesn't contain DISTINCT, Group By or HAVING.
--      5. No calculated columns

-- Create an updatable view
CREATE VIEW vw_ProductsSimple
AS
SELECT 
    ProductID,
    ProductName,
    CategoryID,
    UnitPrice,
    UnitsInStock,
    UnitsOnOrder,
    ReorderLevel,
    Discontinued
FROM ProductsTable;

INSERT INTO vw_ProductsSimple (ProductName, CategoryID, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued)
VALUES ('New Tablet', 1, 499.99, 25, 10, 15, 0);

-- Verify
SELECT * FROM vw_ProductsSimple WHERE ProductName = 'New Tablet';
SELECT * FROM ProductsTable WHERE ProductName = 'New Tablet';


-- WITH CHECK OPTION:
-- It ensures that all data modifications through the view conformto the view's WHERE clause criteria.
-- Prevents INSERT/UPDATE that would make rows invisible in the view
-- Ensures data integrity

CREATE VIEW vw_ElectronicsOnly
AS
SELECT 
    ProductID,
    ProductName,
    CategoryID,
    UnitPrice,
    UnitsInStock
FROM ProductsTable
WHERE CategoryID = 1
WITH CHECK OPTION;

INSERT INTO vw_ElectronicsOnly (ProductName, CategoryID, UnitPrice, UnitsInStock)
VALUES ('Smart Watch', 1, 299.99, 40);



-- FUNCTIONS IN MS SQL SERVER

-- System defined Scalar Functions:
--      1. These return a single value.
--      2. MS SQL provides various built-in scalar functions

DECLARE @text VARCHAR(100) = '  Hello World  ';
DECLARE @email VARCHAR(100) = 'John.Doe@Company.com';

-- LEN - Returns length (excluding trailing spaces)
SELECT LEN(@text) AS TextLength;  -- 13

-- DATALENGTH - Returns length in bytes (including trailing spaces)
SELECT DATALENGTH(@text) AS DataLength;  -- 15

-- LTRIM / RTRIM / TRIM - Remove spaces
SELECT LTRIM(@text) AS LeftTrimmed;       -- 'Hello World  '
SELECT RTRIM(@text) AS RightTrimmed;      -- '  Hello World'
SELECT TRIM(@text) AS FullyTrimmed;       -- 'Hello World'

-- UPPER / LOWER - Case conversion
SELECT UPPER(@email) AS UpperCase;        -- 'JOHN.DOE@COMPANY.COM'
SELECT LOWER(@email) AS LowerCase;        -- 'john.doe@company.com'


-- Aggregate Functions:
--      They perform calculations on sets of values and return a single value.
--      There are following types: COUNT, SUM, AVG, MIN, MAX


-- User Defined Scalar functions:

-- Simple Scalar Function
CREATE OR ALTER FUNCTION CalculateTax
(
    @Amount DECIMAL(10, 2),
    @TaxRate DECIMAL(5, 2) = 0.08
)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    RETURN @Amount * @TaxRate;
END;

SELECT dbo.CalculateTax(100, 0.10) as TaxAmount;
SELECT dbo.CalculateTax(100, DEFAULT) as TaxAmount;



-- INLINE TABLE-VALUED FUNCTIONS:
-- It returns a table as a single SELECT statement
-- More efficient than TVF
-- Can be used like a parameterized view
-- Optimizer can inline the function

CREATE OR ALTER FUNCTION fn_GetProductsByCategory
(
    @CategoryName VARCHAR(30)
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        SaleID,
        ProductName,
        Category,
        Quantity,
        UnitPrice,
        Quantity * UnitPrice AS TotalAmount,
        SaleDate
    FROM SalesRecords
    WHERE Category = @CategoryName
);

SELECT * FROM fn_GetProductsByCategory('Electronics');
SELECT * FROM fn_GetProductsByCategory('Clothing') ORDER BY TotalAmount DESC;


-- Multi-statement Table-Valued Functions:
-- It returns a table that is built using multiple statements.
-- More flexibility than inlinr TVF.
-- Can contain complex logic, loops and variables.
-- Generally slower than inline TVF.

CREATE OR ALTER FUNCTION fn_GetSalesSummaryReport
(
    @Year INT
)
RETURNS @Report TABLE
(
    Category VARCHAR(30),
    SaleCount INT,
    TotalQuantity INT,
    TotalRevenue DECIMAL(15,2),
    AverageOrderValue DECIMAL(10,2),
    ReportGeneratedAt DATETIME
)
AS
BEGIN
    INSERT INTO @Report
    SELECT 
        Category,
        COUNT(*),
        SUM(Quantity),
        SUM(Quantity * UnitPrice),
        AVG(Quantity * UnitPrice),
        GETDATE()
    FROM SalesRecords
    WHERE YEAR(SaleDate) = @Year
    GROUP BY Category;
    
    -- Add a total row
    INSERT INTO @Report
    SELECT 
        'TOTAL',
        COUNT(*),
        SUM(Quantity),
        SUM(Quantity * UnitPrice),
        AVG(Quantity * UnitPrice),
        GETDATE()
    FROM SalesRecords
    WHERE YEAR(SaleDate) = @Year;
    
    RETURN;
END;


-- CURSORS IN MS SQL:
-- A cursor is a database object used to retreive, manipulate, and navigate through a result set row by riw.
-- These are generally slower than set-based operations.
-- However,they are useful whenrow-by-row processing is required.

CREATE TABLE OrdersForCursor (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerName VARCHAR(50),
    OrderDate DATE,
    TotalAmount DECIMAL(10,2),
    Status VARCHAR(20),
    ProcessedDate DATETIME NULL,
    ProcessingNotes VARCHAR(200) NULL
);

INSERT INTO OrdersForCursor (CustomerName, OrderDate, TotalAmount, Status) VALUES
('John Smith', '2024-01-01', 150.00, 'Pending'),
('Jane Doe', '2024-01-02', 275.50, 'Pending'),
('Bob Wilson', '2024-01-03', 89.99, 'Pending'),
('Alice Brown', '2024-01-04', 432.00, 'Pending'),
('Charlie Davis', '2024-01-05', 67.50, 'Pending'),
('Eva Martinez', '2024-01-06', 198.75, 'Pending');


-- Cursor Lifecycle:
--      1. DECLARE: Define cursor and it's select statement
--      2. OPEN: Execute the SELECT and populate the cursor.
--      3. FETCH: Retrieve rows one at a time
--      4. Process: Work with the fetched data
--      5. CLOSE: Close the cursor (Can be reopened)
--      6. DEALLOCATE: Release cursor resources



-- 1. DECLARE
DECLARE OrderCursor CURSOR FOR
    SELECT OrderID, CustomerName, TotalAmount
    FROM OrdersForCursor
    WHERE Status = 'Pending'
    ORDER BY OrderDate;

-- 2. OPEN
OPEN OrderCursor;

DECLARE @OrderID INT;
DECLARE @CustomerName VARCHAR(50);
DECLARE @TotalAmount DECIMAL(10,2);
-- 3. FETCH
FETCH NEXT FROM OrderCursor INTO @OrderID, @CustomerName, @TotalAmount;

-- 4. Process
WHILE @@FETCH_STATUS = 0 -- 0: SUCCESS, -1: No more rows, -2: Row Deleted
BEGIN
    PRINT 'Processing Order #' + CAST(@OrderID AS VARCHAR(10)) + 
          ' for ' + @CustomerName + 
          ' - Amount: $' + CAST(@TotalAmount AS VARCHAR(20));
    
    -- Fetch next row
    FETCH NEXT FROM OrderCursor INTO @OrderID, @CustomerName, @TotalAmount;
END;

-- 5. CLOSE
CLOSE OrderCursor;

-- 6. DEALLOCATE
DEALLOCATE OrderCursor;

-- ROW-BY-ROW Processing with Cursors
-- These are useful when we need to:
--      1. Process each row individually with complex logic.
--      2. Call stored procedures for each row.
--      3. Perform operations that can't be done with set-based queries
--      4. Generate sequential numbers or running totals (Legacy Approach)




-- TRIGGERS
-- It's a special type of stored procedure that automatically executes when an event occurs in the database.

-- TYPES OF TRIGGERS:
-- 1. DML Triggers: Fire on INSERT, UPDATE, DELETE
-- 2. DDL Triggers: Fire on CREATE, ALTER, DROP
-- 3. Logon Triggers: Fire on Logon events

CREATE TABLE Products_Trigger (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName VARCHAR(100) NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    LastModified DATETIME DEFAULT GETDATE(),
    ModifiedBy VARCHAR(50) DEFAULT SUSER_SNAME()
);

CREATE TABLE Products_AuditLog (
    AuditID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT,
    Action VARCHAR(10),
    OldProductName VARCHAR(100),
    NewProductName VARCHAR(100),
    OldUnitPrice DECIMAL(10,2),
    NewUnitPrice DECIMAL(10,2),
    OldStockQuantity INT,
    NewStockQuantity INT,
    ChangedBy VARCHAR(50),
    ChangedAt DATETIME DEFAULT GETDATE(),
    HostName VARCHAR(50) DEFAULT HOST_NAME()
);

CREATE TABLE StockMovements (
    MovementID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT,
    MovementType VARCHAR(20),
    Quantity INT,
    MovementDate DATETIME DEFAULT GETDATE(),
    Notes VARCHAR(200)
);

-- Insert sample data
INSERT INTO Products_Trigger (ProductName, UnitPrice, StockQuantity) VALUES
('Laptop', 999.99, 50),
('Mouse', 29.99, 200),
('Keyboard', 79.99, 150),
('Monitor', 299.99, 75);


-- AFTER INSERT TRIGGER: Executes ater an INSERT statement completes successfully.
CREATE OR ALTER TRIGGER Products_AfterInsert
ON Products_Trigger
AFTER INSERT
AS
BEGIN
    INSERT INTO Products_AuditLog (
        ProductID, Action, 
        NewProductName, NewUnitPrice, NewStockQuantity,
        ChangedBy
    )
    SELECT -- Set based Insert, not row-by-row
        i.ProductID, 'INSERT',
        i.ProductName, i.UnitPrice, i.StockQuantity,
        SUSER_SNAME() -- Returns current login name
    FROM inserted i; -- Inserted consists of all newly inserted rows
    
    PRINT 'TRIGGER: New product(s) logged to audit table.';
END;

-- Test the trigger
INSERT INTO Products_Trigger (ProductName, UnitPrice, StockQuantity)
VALUES ('Webcam', 89.99, 60);

-- Check audit log
SELECT * FROM Products_AuditLog;


-- AFTER DELETE TRIGGER: 
-- Executes after a DELETE Statement completes successfully.
-- Uses the DELETED Table to access the removed data

CREATE OR ALTER TRIGGER Products_AfterDelete
ON Products_Trigger
AFTER DELETE
AS
BEGIN
    INSERT INTO Products_AuditLog (
        ProductID, Action,
        OldProductName, OldUnitPrice, OldStockQuantity,
        ChangedBy
    )
    SELECT
        d.ProductID, 'DELETE',
        d.ProductName, d.UnitPrice, d.StockQuantity,
        SUSER_SNAME()
    FROM deleted d;
    
    PRINT 'TRIGGER: Product deletion logged.';
END;

DELETE FROM Products_Trigger WHERE ProductName = 'USB Cable';
SELECT * FROM Products_AuditLog WHERE Action = 'DELETE';



-- INSERTED Table:
--      1. Contains rows for INSERT operations.
--      2. Contains new (updated) rows for UPDATE operations.
--      3. Empty for DELETE Operations.

-- DELETED Table:
--      1. Empty for INSERT operations.
--      2. Contains old (original) rows for UPDATE operations.
--      3. Contains deleted rows for DELETE operations.


/* TRIGGERS LIMITATIONS
  1. Not allowed in Triggers:
      - ALTER DATABASE
      - CREATE DATABASE
      - DROP DATABASE
      - RESTORE DATABASE
      - RESTORE LOG
      - RECONFIGURE
  2. Recursive Triggers:
      - Enable recursive triggers at database level
      - ALTER DATABASE LearnngSQL SET RECURSIVE_TRIGGERS ON;
  3. Cannot return result sets (in some contexts)
      - Triggers should not return result sets to clients
      - Use PRINT or log to tables instead
  4. Performance Impact
      - Triggers add overhead to every DML Impact
*/




-- NORMALIZATION

/*
1. First Normal Form (1NF):
    - Each column must contain only atomic values
    - Each column contains values of a single type
    - Each row must have a primary key
    - No arrays, comma-seperated lists or multiple values in a single column.

2. Second Normal Form (2NF):
    - Must be in 1NF
    - No Partial dependencies (No non-key attribute should depend on only part of a composite primary key)

3. Third Normal Form (3NF):
    - Must be in 2NF
    - Not Transitive Dependencies (No non-key attribute should depend on another non-key attribute)

4. Boyce-Codd Normal Form (3NF):
    - Must be in 3NF
    - For every non-trivial functional dependency X-> Y, X must be superkey

5. Fourth Normal Form (4NF):
    - Must be in BCNF
    - No multi-valued dependencies (A table should not contain two or more independent
      multi-valued facts about an entity)

6. Fifth Normal Form (5NF):
    - Must be in 5NF
    - No Join Dependencies (A table cannot be decomposed into smaller tables without losing
      information (lossless decomposition)
    - Every join dependency is implied by candidate keys.
*/