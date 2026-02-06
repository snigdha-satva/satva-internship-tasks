USE dataDB;

CREATE TYPE CustomerType AS TABLE (
    CustomerName NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    City NVARCHAR(50)
);

CREATE TYPE ProductType AS TABLE (
    ProductName NVARCHAR(100),
    Price DECIMAL(10, 2),
    Stock INT
);

DECLARE @BulkCustomers CustomerType;

INSERT INTO @BulkCustomers (CustomerName, Email, Phone, City) VALUES
('[BULK] Alice Cooper', 'bulk.alice.cooper@email.com', '555-1001', 'Denver'),
('[BULK] Bob Miller', 'bulk.bob.miller@email.com', '555-1002', 'Portland'),
('[BULK] Carol White', 'bulk.carol.white@email.com', '555-1003', 'Nashville');

INSERT INTO Customers (CustomerName, Email, Phone, City)
SELECT CustomerName, Email, Phone, City
FROM @BulkCustomers;

SELECT * FROM Customers WHERE CustomerName LIKE '%BULK%';


DECLARE @BulkProducts ProductType;

INSERT INTO @BulkProducts (ProductName, Price, Stock) VALUES
('[BULK] Wireless Keyboard Pro', 65.00, 150),
('[BULK] 4K Webcam', 89.99, 80),
('[BULK] Desk Organizer Set', 30.00, 200);

INSERT INTO Products (ProductName, Price, Stock)
SELECT ProductName, Price, Stock
FROM @BulkProducts;

SELECT * FROM Products WHERE ProductName LIKE '%BULK%';

-- Same Approach but with Procedures:

CREATE OR ALTER PROCEDURE BulkInsertCustomers
    @Customers CustomerType READONLY
AS
BEGIN
    INSERT INTO Customers (CustomerName, Email, Phone, City)
    SELECT CustomerName, Email, Phone, City
    FROM @Customers;
END;

CREATE OR ALTER PROCEDURE BulkInsertProducts
    @Products ProductType READONLY
AS
BEGIN
    INSERT INTO Products (ProductName, Price, Stock)
    SELECT ProductName, Price, Stock
    FROM @Products;
END


-- 2. Write query which give top 10 customers order by city
SELECT TOP 10 *
FROM Customers
ORDER BY City;

-- 3. Write a query which gives the result using the’ Like.’ keyword.
SELECT * FROM Customers
WHERE CITY LIKE '%NEW%';

-- 4. Write a query using ‘In’ Key world on the City column of the Customer table.
SELECT * FROM Customers
WHERE City IN ('New York', 'Chicago');

-- 5. Use the MERGE statement to update existing product details or insert new products into the products table based on incoming data.

DECLARE @IncomingProducts ProductType;

INSERT INTO @IncomingProducts (ProductName,Price, Stock) VALUES
('Laptop Pro', 1250.00, 60),
('Tablet', 450.00, 80),
('Monitor', 300.00, 40);

MERGE Products AS target
USING @IncomingProducts AS source
ON target.ProductName = source.ProductName
WHEN MATCHED THEN
    UPDATE SET
        Price = source.Price,
        Stock = source.Stock
WHEN NOT MATCHED THEN
    INSERT (ProductName, Price, Stock)
    VALUES (source.ProductName, source.Price, source.Stock);

SELECT * FROM Products;

-- 6. Use the MERGE statement to update existing customer details or insert new customers into the customers table based on incoming data.
DECLARE @IncomingCustomers CustomerType;

INSERT INTO @IncomingCustomers (CustomerName, Email, Phone, City) VALUES
('John Smith', 'john.smith@email.com', '1234567899', 'Boston'),
('Anna Williams', 'anna.w@email.com', '9998887777', 'Seattle');

MERGE Customers AS target
USING @IncomingCustomers AS source
ON target.Email = source.Email
WHEN MATCHED THEN
    UPDATE SET 
        CustomerName = source.CustomerName,
        Phone = source.Phone,
        City = source.City
WHEN NOT MATCHED THEN
    INSERT (CustomerName, Email, Phone, City)
    VALUES (source.CustomerName, source.Email, source.Phone, source.City);


-- 7. Procedure to Insert a new order into the Orders table and retrieve the generated OrderID. Update the order, Add or Update Payment table accordingly. Make sure to consider partial payment.
CREATE OR ALTER PROCEDURE InsertOrderWithPayment
    @CustomerID INT = NULL,
    @ProductID INT = NULL,
    @Quantity INT = NULL,
    @AmountPaid DECIMAL(10, 2) = 0,
    @NewOrderID INT OUTPUT
AS
BEGIN
    DECLARE @TotalAmount DECIMAL(10,2)
    
    IF @NewOrderID IS NULL
    BEGIN 
        SELECT @TotalAmount = Price * @Quantity
        FROM Products
        WHERE ProductID = @ProductID;

        INSERT INTO Orders (CustomerID, ProductID, Quantity, OrderDate, TotalAmount)
        VALUES (@CustomerID, @ProductID, @Quantity, GETDATE(), @TotalAmount);

        SET @NewOrderID = SCOPE_IDENTITY();
    END

    ELSE IF @Quantity IS NOT NULL
    BEGIN
        SELECT @TotalAmount = p.Price * @Quantity
        FROM Orders o JOIN Products p ON o.ProductID = p.ProductID
        WHERE o.OrderID = @NewOrderID;

        UPDATE Orders SET Quantity = @Quantity, TotalAmount = @TotalAmount
        WHERE OrderID = @NewOrderID;
    END

    IF @AmountPaid > 0
    BEGIN
        INSERT INTO Payment (OrderID, AmountPaid, PaymentStatus)
        VALUES (@NewOrderID, @AmountPaid, CASE WHEN @AmountPaid >= (SELECT TotalAmount FROM Orders WHERE OrderID = @NewOrderID)
                THEN 'Completed' ELSE 'Partial' END);
    END

    SELECT o.OrderID, o.TotalAmount, ISNULL(SUM(p.AmountPaid), 0) AS TotalPaid,
           o.TotalAmount - ISNULL(SUM(p.AmountPaid), 0) AS Balance
    FROM Orders o LEFT JOIN Payment p ON o.OrderID = p.OrderID
    WHERE o.OrderID = @NewOrderID
    GROUP BY o.OrderID, o.TotalAmount;
END;

DECLARE @ID INT;
EXEC InsertOrderWithPayment @NewOrderID = @ID OUTPUT, @CustomerID = 3, @ProductID = 1, @Quantity = 2, @AmountPaid = 1500;
-- Update order quantity and add payment
EXEC InsertOrderWithPayment @NewOrderID = 1, @Quantity = 3, @AmountPaid = 300;

-- Add payment only
EXEC InsertOrderWithPayment @NewOrderID = 1, @AmountPaid = 200;

SELECT * FROM Orders;


-- 8. Implement a stored procedure to delete customers from the Customers table, handling cascading deletes for related orders.
CREATE OR ALTER PROCEDURE DeleteCustomer
    @CustomerID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM Customers WHERE CustomerID = @CustomerID;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END;

SELECT * FROM Customers;
EXEC DeleteCustomer @CustomerID = 6;
SELECT * FROM Customers;

-- ADVANCED QUERIES

-- 1. Calculate Total Sales Revenue per Product Join the Orders, Payment, and Products tables to calculate the total sales revenue for each product. Display the product name along with the total revenue.

SELECT 
    p.ProductName,
    SUM(pay.AmountPaid) AS TotalRevenue
FROM Products p
JOIN Orders o ON p.ProductID = o.ProductID
JOIN Payment pay ON o.OrderID = pay.OrderID
GROUP BY p.ProductID, p.ProductName
ORDER BY TotalRevenue DESC;

-- 2. Identify Customers with High Order Frequency Create a query using CTEs to identify customers who have placed orders more than 5 times in the last six months.Display customer information such as name and email along with their order frequency.
WITH CustomerOrderFrequency AS (
    SELECT 
        c.CustomerID,
        c.CustomerName,
        c.Email,
        COUNT(o.OrderID) AS OrderCount
    FROM Customers c
    JOIN Orders o ON c.CustomerID = o.CustomerID
    WHERE o.OrderDate >= DATEADD(MONTH, -6, GETDATE())
    GROUP BY c.CustomerID, c.CustomerName, c.Email
)
SELECT CustomerID, CustomerName, Email, OrderCount
FROM CustomerOrderFrequency
WHERE OrderCount > 5
ORDER BY OrderCount DESC;

-- 3. Calculate Average Order Value per Customer
WITH CustomerOrderSummary AS (
    SELECT 
        c.CustomerID,
        c.CustomerName,
        c.Email,
        SUM(o.TotalAmount) AS TotalSpent,
        COUNT(o.OrderID) AS OrderCount
    FROM Customers c
    JOIN Orders o ON c.CustomerID = o.CustomerID
    GROUP BY c.CustomerID, c.CustomerName, c.Email
)
SELECT 
    CustomerID,
    CustomerName,
    Email,
    TotalSpent,
    OrderCount,
    TotalSpent / OrderCount AS AverageOrderValue
FROM CustomerOrderSummary
ORDER BY AverageOrderValue DESC;

-- 4. Find Best-Selling Products
WITH ProductSales AS (
    SELECT 
        p.ProductID,
        p.ProductName,
        SUM(o.Quantity) AS TotalQuantitySold
    FROM Products p
    JOIN Orders o ON p.ProductID = o.ProductID
    GROUP BY p.ProductID, p.ProductName
)
SELECT TOP 10
    ProductID,
    ProductName,
    TotalQuantitySold
FROM ProductSales
ORDER BY TotalQuantitySold DESC;