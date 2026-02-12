-- SQL EXAM TASKS
CREATE DATABASE examDB;

USE examDB;

-- 1. Create tables
CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Address VARCHAR(255)
);

CREATE TABLE Products (
    ProductID INT IDENTITY(101,1) PRIMARY KEY,
    ProductName VARCHAR(150) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price > 0),
    StockQuantity INT NOT NULL CHECK (StockQuantity >= 0)
);

CREATE TABLE Orders (
    OrderID INT IDENTITY(201,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2)

    CONSTRAINT FK_Orders_Customers
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE Cart (
    CartID INT IDENTITY(301,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    AddedDate DATE NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Cart_Customers
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),

    CONSTRAINT FK_Cart_Products
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE OrderDetails (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10,2) NOT NULL CHECK (UnitPrice > 0),
    CONSTRAINT FK_OrderDetails_Orders
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT FK_OrderDetails_Products
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
-- Insert data
INSERT INTO Customers (Name, Email, Address) VALUES
('John Doe', 'john@example.com', '123 Elm St'),
('Jane Smith', 'jane@example.com', '456 Oak St'),
('Alice Brown', 'alice@example.com', '789 Pine St'),
('Bob Wilson', 'bob@example.com', '321 Maple St'),
('Carol Davis', 'carol@example.com', '654 Birch St');


INSERT INTO Products (ProductName, Price, StockQuantity) VALUES
('Laptop', 800.00, 50),
('Smartphone', 500.00, 30),
('Headphones', 150.00, 100),
('Tablet', 300.00, 40),
('Monitor', 400.00, 25);


INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
(1, '2024-08-01', 1200.00),
(2, '2024-08-03', 500.00),
(1, '2024-08-05', 800.00),
(3, '2024-08-10', 300.00),
(3, '2024-08-12', 450.00),
(3, '2024-08-15', 600.00),
(1, '2024-08-18', 700.00),
(4, '2024-08-20', 900.00),
(4, '2024-08-22', 1000.00),
(5, '2023-12-10', 250.00);



INSERT INTO Cart (CustomerID, ProductID, Quantity, AddedDate) VALUES
(1, 101, 2, '2024-07-28'),
(2, 102, 1, '2024-07-29'),
(3, 103, 3, '2024-07-30');

INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice) VALUES
(201, 101, 1, 800.00),  
(201, 103, 2, 150.00),
(202, 102, 1, 500.00),  
(203, 101, 1, 800.00),
(204, 103, 3, 150.00),
(205, 102, 2, 500.00),
(206, 104, 1, 300.00),
(207, 105, 1, 400.00),
(208, 101, 1, 800.00),
(208, 103, 2, 150.00),
(209, 102, 1, 500.00),
(210, 104, 1, 300.00);

SELECT * FROM Customers;
SELECT * FROM Products;
SELECT * FROM Orders;
SELECT * FROM Cart;
SELECT * FROM OrderDetails;

-- 2. Write an SQL query to group orders by customer and report the total amount spent by each customer.
SELECT 
    c.CustomerID, 
    c.Name, 
    SUM(o.TotalAmount) AS TotalAmountSpent
FROM Customers c
JOIN Orders o
ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.Name

-- 3. Write a query to list the top 5 products based on the highest number of orders.
SELECT TOP 5
    p.ProductID,
    p.ProductName,
    COUNT(od.OrderID) AS OrderCount
FROM Products p
JOIN OrderDetails od
ON p.ProductID = od.ProductID
GROUP BY p.ProductID, p.ProductName
ORDER BY OrderCount DESC

-- 4. Create a stored procedure to insert a new product or update the existing product's details (name, price, stock quantity) if the ProductID already exists.
CREATE OR ALTER PROCEDURE InsertOrUpdateProduct
(
    @ProductID INT,
    @ProductName VARCHAR(150),
    @Price DECIMAL(10,2),
    @StockQuantity INT
)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
    BEGIN
        UPDATE Products
        SET 
            ProductName = @ProductName,
            Price = @Price,
            StockQuantity = @StockQuantity
        WHERE ProductID = @ProductID;
    END
    ELSE
    BEGIN
        INSERT INTO Products (ProductName, Price, StockQuantity)
        VALUES (@ProductName, @Price, @StockQuantity);
    END
END;

EXEC InsertOrUpdateProduct
    @ProductID = 106,
    @ProductName = 'Keyboard',
    @Price = 120.00,
    @StockQuantity = 60;

SELECT * FROM Products;


-- 5. Write a stored procedure to insert a new order and update the product stock quantity accordingly
CREATE OR ALTER PROCEDURE InsertOrderWithDetails
(
    @CustomerID INT,
    @ProductID INT,
    @Quantity INT
)
AS
BEGIN
    DECLARE @OrderID INT;
    DECLARE @UnitPrice DECIMAL(10,2);
    DECLARE @AvailableStock INT;
        
    SELECT @UnitPrice = Price, @AvailableStock = StockQuantity
    FROM Products
    WHERE ProductID = @ProductID;

    IF @AvailableStock < @Quantity
    BEGIN
        PRINT 'Insufficient stock available. Cannot process order.';
        RETURN;
    END
    
    INSERT INTO Orders (CustomerID, OrderDate)
    VALUES (@CustomerID, GETDATE());
    
    SET @OrderID = SCOPE_IDENTITY();
    
    INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice)
    VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice);
    
    UPDATE Products
    SET StockQuantity = StockQuantity - @Quantity
    WHERE ProductID = @ProductID;
END;


EXEC InsertOrderWithDetails
    @CustomerID = 3,
    @ProductID = 103,
    @Quantity = 500;

SELECT * FROM Orders;
SELECT * FROM OrderDetails;
SELECT * FROM Products;

-- 6. Create a function to calculate the discount based on the order total amount
CREATE OR ALTER FUNCTION CalculateDiscount
(
    @TotalAmount DECIMAL(10, 2)
)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    RETURN CASE
        WHEN @TotalAmount >= 1000 THEN @TotalAmount * 0.20
        WHEN @TotalAmount >= 500 THEN @TotalAmount * 0.10
        ELSE 0.00
    END;
END;

SELECT dbo.CalculateDiscount(1500) AS Discount_1500;
SELECT dbo.CalculateDiscount(750) AS Discount_750;
SELECT dbo.CalculateDiscount(300) AS Discount_300;


-- 7. Write a stored procedure that uses this function to apply the discount and return the final payable amount for a given OrderID.
CREATE OR ALTER PROCEDURE FinalDiscountedPrice
    @OrderID INT
AS
BEGIN
    SELECT
        OrderID,
        TotalAmount AS OriginalAmount,
        dbo.CalculateDiscount(TotalAmount) AS DiscountApplied,
        (TotalAmount - dbo.CalculateDiscount(TotalAmount)) AS FinalAmount
    FROM Orders
    WHERE OrderID = @OrderID;
END;

EXEC FinalDiscountedPrice 202;

-- 8. Create a stored procedure that accepts a comma-separated list of ProductIDs, splits the values, and joins with the Products table to display the product details
CREATE OR ALTER PROCEDURE DisplayProductDetails
    @ProductIDs VARCHAR(120)
AS
BEGIN
    SELECT p.* FROM Products p
    JOIN STRING_SPLIT(@ProductIDs, ',') s
    ON p.ProductID = TRY_CAST(s.value AS INT)
END;

EXEC DisplayProductDetails '101, 102';

-- 9. Write a stored procedure to calculate the following statistics for each product: 
CREATE OR ALTER PROCEDURE CalculateStatistics

AS
BEGIN
    SELECT
        p.ProductID,
        p.ProductName,
        SUM(o.Quantity) AS TotalSold,
        SUM(o.Quantity * o.UnitPrice) as TotalRevenue,
        AVG(o.Quantity) AS AvgOrderQty,
        ROUND(ISNULL(STDEV(o.Quantity), 0), 2) AS StdDevOrderQty
    FROM Products p
    INNER JOIN OrderDetails o
    ON p.ProductID = o.ProductID
    GROUP BY p.ProductID, p.ProductName
END;

EXEC CalculateStatistics;


-- 10. Write a stored procedure to find customers who have not placed any orders in the last 6 months.
CREATE OR ALTER PROCEDURE NoOrdersInSixMonths
AS
BEGIN
   SELECT
        c.CustomerID,
        c.Name,
        MAX(o.OrderDate) AS LastOrderDate
    FROM Customers c
    LEFT JOIN Orders o
        ON c.CustomerID = o.CustomerID
    GROUP BY c.CustomerID, c.Name
    HAVING MAX(o.OrderDate) IS NULL
       OR MAX(o.OrderDate) < DATEADD(MONTH, -6, GETDATE());
END;

EXEC NoOrdersInSixMonths;

-- 12. Write a store procedure Implement a CASE statement within a query to categorize customers based on their total purchase amount into 'Gold', 'Silver', or 'Bronze' tiers
CREATE OR ALTER PROCEDURE CategorizeCustomers
AS
BEGIN
    SELECT
        c.CustomerID,
        c.Name,
        CASE
            WHEN COUNT(DISTINCT o.OrderID) >= 3 AND SUM(o.Quantity * o.UnitPrice) > 1000 THEN 'Gold'
            WHEN COUNT(DISTINCT o.OrderID) = 2 AND SUM(o.Quantity * o.UnitPrice) > 500 THEN 'Silver'
            ELSE 'Bronze'
        END AS Category,
        COUNT(DISTINCT o.OrderID) AS [Number Of Orders],
        SUM(o.Quantity * o.UnitPrice) AS [Order Amount]
    FROM Customers c
    JOIN Orders ord ON c.CustomerID = ord.CustomerID
    JOIN OrderDetails o ON ord.OrderID = o.OrderID
    GROUP BY c.CustomerID, c.Name
END;

EXEC CategorizeCustomers;