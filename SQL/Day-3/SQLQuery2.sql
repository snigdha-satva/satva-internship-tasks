USE PaymentDB;

-- 1 Insert
CREATE PROCEDURE InsertCustomer
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @Email VARCHAR(100),
    @Phone VARCHAR(20)
AS
BEGIN
    INSERT INTO Customer (FirstName, LastName, Email, Phone)
    VALUES (@FirstName, @LastName, @Email, @Phone);
END;


EXEC InsertCustomer @FirstName = 'Alice', @LastName = 'Anderson', @Email = 'alice.a@email.com', @Phone = '555-0111';
EXEC InsertCustomer @FirstName = 'Bob', @LastName = 'Brown', @Email = 'bob.b@email.com', @Phone = '555-0222';
EXEC InsertCustomer @FirstName = 'Charlie', @LastName = 'Clark', @Email = 'charlie.c@email.com', @Phone = '555-0333';
EXEC InsertCustomer @FirstName = 'Diana', @LastName = 'Davis', @Email = 'diana.d@email.com', @Phone = '555-0444';
EXEC InsertCustomer @FirstName = 'Edward', @LastName = 'Evans', @Email = 'edward.e@email.com', @Phone = '555-0555';
EXEC InsertCustomer @FirstName = 'Frank', @LastName = 'Foster', @Email = 'frank.f@email.com', @Phone = '555-0666';

SELECT * FROM Customer;


CREATE PROCEDURE InsertProduct
    @Name VARCHAR(100),
    @Price DECIMAL(10,2),
    @Description TEXT
AS
BEGIN
    INSERT INTO [Product] (Name, Price, [Description])
    VALUES (@Name, @Price, @Description);
END;


EXEC InsertProduct @Name = 'Laptop Pro', @Price = 999.99, @Description = 'High-performance laptop with 16GB RAM';
EXEC InsertProduct @Name = 'External SSD', @Price = 129.99, @Description = '1TB External Solid State Drive';
EXEC InsertProduct @Name = 'Wireless Mouse', @Price = 49.99, @Description = 'Ernomic wireless mouse';
EXEC InsertProduct @Name = 'Mechanical Keyboard', @Price = 149.99, @Description = 'RGB Mechanical Gaming Keyboard';
EXEC InsertProduct @Name = 'Monitor 27inch', @Price = 299.99, @Description = '27 inch 4K IPS Monitor';
EXEC InsertProduct @Name = 'USB Hub', @Price = 29.99, @Description = '7-Port USB 3.0 Hub';

SELECT * FROM [Product];


CREATE PROCEDURE InsertOrder
    @CustomerID INT,
    @OrderDate DATETIME,
    @Qty INT,
    @Rate DECIMAL(10,2),
    @TotalAmount DECIMAL(10,2),
    @ProductID INT
AS
BEGIN
    INSERT INTO [Order] (CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID)
    VALUES (@CustomerID, @OrderDate, @Qty, @Rate, @TotalAmount, @ProductID);
END;


EXEC InsertOrder @CustomerID = 1, @OrderDate = '2025-01-15 10:00:00', @Qty = 1, @Rate = 999.99, @TotalAmount = 999.99, @ProductID = 1;
EXEC InsertOrder @CustomerID = 2, @OrderDate = '2025-01-16 11:00:00', @Qty = 2, @Rate = 129.99, @TotalAmount = 259.98, @ProductID = 2;
EXEC InsertOrder @CustomerID = 1, @OrderDate = '2025-01-20 14:00:00', @Qty = 1, @Rate = 149.99, @TotalAmount = 149.99, @ProductID = 4;
EXEC InsertOrder @CustomerID = 3, @OrderDate = '2025-01-25 09:00:00', @Qty = 2, @Rate = 299.99, @TotalAmount = 599.98, @ProductID = 5;
EXEC InsertOrder @CustomerID = 4, @OrderDate = '2025-01-18 10:30:00', @Qty = 3, @Rate = 49.99, @TotalAmount = 149.97, @ProductID = 3;
EXEC InsertOrder @CustomerID = 5, @OrderDate = '2025-01-22 15:00:00', @Qty = 1, @Rate = 299.99, @TotalAmount = 299.99, @ProductID = 5;
EXEC InsertOrder @CustomerID = 2, @OrderDate = '2025-01-28 11:00:00', @Qty = 1, @Rate = 999.99, @TotalAmount = 999.99, @ProductID = 1;
EXEC InsertOrder @CustomerID = 3, @OrderDate = '2024-11-15 10:00:00', @Qty = 1, @Rate = 29.99, @TotalAmount = 29.99, @ProductID = 6;
EXEC InsertOrder @CustomerID = 1, @OrderDate = '2025-01-25 09:00:00', @Qty = 2, @Rate = 49.99, @TotalAmount = 99.98, @ProductID = 3;

SELECT * FROM [Order];


CREATE PROCEDURE InsertPayment
    @OrderID INT,
    @Amount DECIMAL(10,2),
    @PaymentDate DATETIME
AS
BEGIN
    INSERT INTO Payment (OrderID, Amount, PaymentDate)
    VALUES (@OrderID, @Amount, @PaymentDate);
END;


EXEC InsertPayment @OrderID = 1, @Amount = 999.99, @PaymentDate = '2025-01-15 11:00:00';
EXEC InsertPayment @OrderID = 2, @Amount = 259.98, @PaymentDate = '2025-01-16 12:00:00';
EXEC InsertPayment @OrderID = 3, @Amount = 149.99, @PaymentDate = '2025-01-20 15:00:00';
EXEC InsertPayment @OrderID = 5, @Amount = 149.97, @PaymentDate = '2025-01-18 14:00:00';
EXEC InsertPayment @OrderID = 6, @Amount = 299.99, @PaymentDate = '2025-01-22 16:00:00';
EXEC InsertPayment @OrderID = 7, @Amount = 500.00, @PaymentDate = '2025-01-28 12:00:00';

SELECT * FROM Payment;


-- Update Data
CREATE PROCEDURE UpdateCustomer
    @CustomerID INT,
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @Email VARCHAR(100),
    @Phone VARCHAR(20)
AS
BEGIN
    UPDATE Customer
    SET FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        Phone = @Phone
    WHERE CustomerID = @CustomerID;
END;


EXEC UpdateCustomer @CustomerID = 1, @FirstName = 'Alice', @LastName = 'Anderson-Smith', @Email = 'alice.smith@email.com', @Phone = '555-9999';

SELECT * FROM Customer WHERE CustomerID = 1;


CREATE PROCEDURE UpdateProduct
    @ProductID INT,
    @Name VARCHAR(100),
    @Price DECIMAL(10,2),
    @Description TEXT
AS
BEGIN
    UPDATE [Product]
    SET Name = @Name,
        Price = @Price,
        [Description] = @Description
    WHERE ProductID = @ProductID;
END;


EXEC UpdateProduct @ProductID = 1, @Name = 'Laptop Pro Max', @Price = 1199.99, @Description = 'High-performance laptop with 32GB RAM';

SELECT * FROM [Product] WHERE ProductID = 1;


CREATE PROCEDURE UpdateOrder
    @OrderID INT,
    @CustomerID INT,
    @OrderDate DATETIME,
    @Qty INT,
    @Rate DECIMAL(10,2),
    @TotalAmount DECIMAL(10,2),
    @ProductID INT
AS
BEGIN
    UPDATE [Order]
    SET CustomerID = @CustomerID,
        OrderDate = @OrderDate,
        Qty = @Qty,
        Rate = @Rate,
        TotalAmount = @TotalAmount,
        ProductID = @ProductID
    WHERE OrderID = @OrderID;
END;


EXEC UpdateOrder @OrderID = 1, @CustomerID = 1, @OrderDate = '2025-01-15 11:00:00', @Qty = 2, @Rate = 999.99, @TotalAmount = 1999.98, @ProductID = 1;

SELECT * FROM [Order] WHERE OrderID = 1;


CREATE PROCEDURE UpdatePayment
    @PaymentID INT,
    @OrderID INT,
    @Amount DECIMAL(10,2),
    @PaymentDate DATETIME
AS
BEGIN
    UPDATE Payment
    SET OrderID = @OrderID,
        Amount = @Amount,
        PaymentDate = @PaymentDate
    WHERE PaymentID = @PaymentID;
END;


EXEC UpdatePayment @PaymentID = 1, @OrderID = 1, @Amount = 1999.98, @PaymentDate = '2025-01-15 12:00:00';

SELECT * FROM Payment WHERE PaymentID = 1;


-- Get Data
CREATE PROCEDURE GetCustomer
    @CustomerID INT = NULL
AS
BEGIN
    IF @CustomerID IS NULL
        SELECT * FROM Customer;
    ELSE
        SELECT * FROM Customer WHERE CustomerID = @CustomerID;
END;


EXEC GetCustomer;
EXEC GetCustomer @CustomerID = 1;
EXEC GetCustomer @CustomerID = 2;
EXEC GetCustomer @CustomerID = 3;


CREATE PROCEDURE GetProduct
    @ProductID INT = NULL
AS
BEGIN
    IF @ProductID IS NULL
        SELECT * FROM [Product];
    ELSE
        SELECT * FROM [Product] WHERE ProductID = @ProductID;
END;


EXEC GetProduct;
EXEC GetProduct @ProductID = 1;
EXEC GetProduct @ProductID = 2;
EXEC GetProduct @ProductID = 5;


CREATE PROCEDURE GetOrder
    @OrderID INT = NULL
AS
BEGIN
    IF @OrderID IS NULL
        SELECT * FROM [Order];
    ELSE
        SELECT * FROM [Order] WHERE OrderID = @OrderID;
END;


EXEC GetOrder;
EXEC GetOrder @OrderID = 1;
EXEC GetOrder @OrderID = 2;
EXEC GetOrder @OrderID = 5;


CREATE PROCEDURE GetPayment
    @PaymentID INT = NULL
AS
BEGIN
    IF @PaymentID IS NULL
        SELECT * FROM Payment;
    ELSE
        SELECT * FROM Payment WHERE PaymentID = @PaymentID;
END;


EXEC GetPayment;
EXEC GetPayment @PaymentID = 1;
EXEC GetPayment @PaymentID = 2;
EXEC GetPayment @PaymentID = 3;


-- Delete Data
CREATE PROCEDURE DeleteCustomer
    @CustomerID INT
AS
BEGIN
    DELETE FROM Customer WHERE CustomerID = @CustomerID;
END;


CREATE PROCEDURE DeleteProduct
    @ProductID INT
AS
BEGIN
    DELETE FROM [Product] WHERE ProductID = @ProductID;
END;


CREATE PROCEDURE DeleteOrder
    @OrderID INT
AS
BEGIN
    DELETE FROM [Order] WHERE OrderID = @OrderID;
END;


CREATE PROCEDURE DeletePayment
    @PaymentID INT
AS
BEGIN
    DELETE FROM Payment WHERE PaymentID = @PaymentID;
END;


-- Create a stored procedure that updates the price of a product given its  ProductID. 
CREATE PROCEDURE UpdateProductPrice
    @ProductID INT,
    @Price DECIMAL(10,2)
AS
BEGIN
    UPDATE [Product]
    SET Price = @Price
    WHERE ProductID = @ProductID;
END;


EXEC UpdateProductPrice @ProductID = 2, @Price = 119.99;
EXEC UpdateProductPrice @ProductID = 3, @Price = 44.99;

SELECT * FROM [Product] WHERE ProductID IN (2, 3);


-- Write a stored procedure that takes parameters for CustomerID, OrderDate,  ProductID, Qty, and Rate, and inserts a new order into the Order table,  calculating the TotalAmount based on the Qty and Rate. 
CREATE PROCEDURE InsertOrderWithCalculation
    @CustomerID INT,
    @OrderDate DATETIME,
    @ProductID INT,
    @Qty INT,
    @Rate DECIMAL(10,2)
AS
BEGIN
    DECLARE @TotalAmount DECIMAL(10,2);
    SET @TotalAmount = @Qty * @Rate;
    
    INSERT INTO [Order] (CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID)
    VALUES (@CustomerID, @OrderDate, @Qty, @Rate, @TotalAmount, @ProductID);
END;


EXEC InsertOrderWithCalculation @CustomerID = 2, @OrderDate = '2025-02-05 14:00:00', @ProductID = 5, @Qty = 3, @Rate = 299.99;
EXEC InsertOrderWithCalculation @CustomerID = 4, @OrderDate = '2025-02-06 10:00:00', @ProductID = 2, @Qty = 2, @Rate = 119.99;
EXEC InsertOrderWithCalculation @CustomerID = 5, @OrderDate = '2025-02-07 11:00:00', @ProductID = 4, @Qty = 1, @Rate = 149.99;

SELECT * FROM [Order] WHERE OrderDate >= '2025-02-01';


-- Write a stored procedure that takes parameters for CustomerID, OrderDate,  ProductID, Qty, and Rate, and inserts a new order into the Order table,  calculating the TotalAmount based on the Qty and Rate. 
CREATE PROCEDURE RecordPayment
    @OrderID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    INSERT INTO Payment (OrderID, Amount, PaymentDate)
    VALUES (@OrderID, @Amount, GETDATE());
END;


EXEC RecordPayment @OrderID = 9, @Amount = 99.98;
EXEC RecordPayment @OrderID = 10, @Amount = 899.97;
EXEC RecordPayment @OrderID = 11, @Amount = 239.98;

SELECT * FROM Payment;

-- Create a stored procedure that retrieves the total payments made by each  customer by joining the Customer and Payment tables and aggregating the  amounts for each customer.
CREATE PROCEDURE GetTotalPaymentsByCustomer
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        ISNULL(SUM(p.Amount), 0) AS TotalPayments
    FROM Customer c
    LEFT JOIN [Order] o ON c.CustomerID = o.CustomerID
    LEFT JOIN Payment p ON o.OrderID = p.OrderID
    GROUP BY c.CustomerID, c.FirstName, c.LastName;
END;


EXEC GetTotalPaymentsByCustomer;

-- Write a stored procedure that identifies customers who have not made any  payments by comparing the Customer table with the Payment table and returning  the relevant records. 
CREATE PROCEDURE GetCustomersWithoutPayments
AS
BEGIN
    SELECT DISTINCT c.*
    FROM Customer c
    LEFT JOIN [Order] o ON c.CustomerID = o.CustomerID
    LEFT JOIN Payment p ON o.OrderID = p.OrderID
    WHERE p.PaymentID IS NULL;
END;


EXEC GetCustomersWithoutPayments;


-- Develop a stored procedure that calculates the total revenue for a given period  by summing up the TotalAmount from the Order table for orders placed within  that period. 
CREATE PROCEDURE GetTotalRevenueByPeriod
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT ISNULL(SUM(TotalAmount), 0) AS TotalRevenue
    FROM [Order]
    WHERE OrderDate BETWEEN @StartDate AND @EndDate;
END;


EXEC GetTotalRevenueByPeriod @StartDate = '2025-01-01', @EndDate = '2025-01-31';
EXEC GetTotalRevenueByPeriod @StartDate = '2025-02-01', @EndDate = '2025-02-28';
EXEC GetTotalRevenueByPeriod @StartDate = '2024-01-01', @EndDate = '2024-12-31';
EXEC GetTotalRevenueByPeriod @StartDate = '2025-01-01', @EndDate = '2025-12-31';


-- .Design a stored procedure that retrieves all orders along with customer and  product details by joining the Order, Customer, and Product tables.
CREATE PROCEDURE GetOrdersWithDetails
AS
BEGIN
    SELECT 
        o.OrderID,
        o.OrderDate,
        o.Qty,
        o.Rate,
        o.TotalAmount,
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        p.ProductID,
        p.Name AS ProductName,
        p.Price
    FROM [Order] o
    INNER JOIN Customer c ON o.CustomerID = c.CustomerID
    INNER JOIN [Product] p ON o.ProductID = p.ProductID;
END;


EXEC GetOrdersWithDetails;


-- Retrieve the top N customers with the highest total payments.
CREATE PROCEDURE GetTopCustomersByPayments
    @TopN INT
AS
BEGIN
    SELECT TOP (@TopN)
        c.CustomerID,
        c.FirstName,
        c.LastName,
        SUM(p.Amount) AS TotalPayments
    FROM Customer c
    INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
    INNER JOIN Payment p ON o.OrderID = p.OrderID
    GROUP BY c.CustomerID, c.FirstName, c.LastName
    ORDER BY TotalPayments DESC;
END;


EXEC GetTopCustomersByPayments @TopN = 3;
EXEC GetTopCustomersByPayments @TopN = 5;
EXEC GetTopCustomersByPayments @TopN = 10;


-- Retrieve all orders made by customers who have made payments within the last  N months.
CREATE PROCEDURE GetOrdersByRecentPayments
    @Months INT
AS
BEGIN
    SELECT DISTINCT o.*
    FROM [Order] o
    INNER JOIN Payment p ON o.OrderID = p.OrderID
    WHERE p.PaymentDate >= DATEADD(MONTH, -@Months, GETDATE());
END;


EXEC GetOrdersByRecentPayments @Months = 1;
EXEC GetOrdersByRecentPayments @Months = 3;
EXEC GetOrdersByRecentPayments @Months = 6;
EXEC GetOrdersByRecentPayments @Months = 12;

-- Calculate the total revenue for each product category.
CREATE PROCEDURE GetRevenueByProduct
AS
BEGIN
    SELECT 
        p.ProductID,
        p.Name AS ProductName,
        ISNULL(SUM(o.TotalAmount), 0) AS TotalRevenue
    FROM [Product] p
    LEFT JOIN [Order] o ON p.ProductID = o.ProductID
    GROUP BY p.ProductID, p.Name;
END;


EXEC GetRevenueByProduct;


-- .Retrieve the most profitable product (highest total revenue). 
CREATE PROCEDURE GetMostProfitableProduct
AS
BEGIN
    SELECT TOP 1
        p.ProductID,
        p.Name AS ProductName,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM [Product] p
    INNER JOIN [Order] o ON p.ProductID = o.ProductID
    GROUP BY p.ProductID, p.Name
    ORDER BY TotalRevenue DESC;
END;


EXEC GetMostProfitableProduct;


-- Retrieve customers who have made purchases of a specific product within a  given date range. 
CREATE PROCEDURE GetCustomersByProductAndDate
    @ProductID INT,
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT DISTINCT c.*
    FROM Customer c
    INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
    WHERE o.ProductID = @ProductID
    AND o.OrderDate BETWEEN @StartDate AND @EndDate;
END;


EXEC GetCustomersByProductAndDate @ProductID = 1, @StartDate = '2025-01-01', @EndDate = '2025-12-31';
EXEC GetCustomersByProductAndDate @ProductID = 5, @StartDate = '2025-01-01', @EndDate = '2025-12-31';
EXEC GetCustomersByProductAndDate @ProductID = 2, @StartDate = '2025-01-01', @EndDate = '2025-12-31';
EXEC GetCustomersByProductAndDate @ProductID = 3, @StartDate = '2025-01-01', @EndDate = '2025-12-31';

-- Calculate the average order value for each customer. 
CREATE PROCEDURE GetAverageOrderValueByCustomer
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        AVG(o.TotalAmount) AS AverageOrderValue
    FROM Customer c
    INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
    GROUP BY c.CustomerID, c.FirstName, c.LastName;
END;


EXEC GetAverageOrderValueByCustomer;

-- Retrieve orders with the highest total amounts for each customer. 
CREATE PROCEDURE GetHighestOrderByCustomer
AS
BEGIN
    SELECT o.*
    FROM [Order] o
    INNER JOIN (
        SELECT CustomerID, MAX(TotalAmount) AS MaxAmount
        FROM [Order]
        GROUP BY CustomerID
    ) AS MaxOrders ON o.CustomerID = MaxOrders.CustomerID 
    AND o.TotalAmount = MaxOrders.MaxAmount;
END;


EXEC GetHighestOrderByCustomer;


-- Calculate the total number of orders and the total revenue generated by each  customer for a specific year.
CREATE PROCEDURE GetCustomerStatsForYear
    @Year INT
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        COUNT(o.OrderID) AS TotalOrders,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM Customer c
    INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
    WHERE YEAR(o.OrderDate) = @Year
    GROUP BY c.CustomerID, c.FirstName, c.LastName;
END;


EXEC GetCustomerStatsForYear @Year = 2024;
EXEC GetCustomerStatsForYear @Year = 2025;


-- Retrieve orders that have not been paid within a certain period. 
CREATE PROCEDURE GetUnpaidOrdersByPeriod
    @Days INT
AS
BEGIN
    SELECT o.*
    FROM [Order] o
    LEFT JOIN Payment p ON o.OrderID = p.OrderID
    WHERE p.PaymentID IS NULL
    AND o.OrderDate <= DATEADD(DAY, -@Days, GETDATE());
END;


EXEC GetUnpaidOrdersByPeriod @Days = 1;
EXEC GetUnpaidOrdersByPeriod @Days = 7;
EXEC GetUnpaidOrdersByPeriod @Days = 30;
EXEC GetUnpaidOrdersByPeriod @Days = 60;


-- Identify customers who have made consecutive purchases within a given  timeframe. 
CREATE PROCEDURE GetCustomersWithConsecutivePurchases
    @Days INT
AS
BEGIN
    SELECT DISTINCT c.*
    FROM Customer c
    INNER JOIN [Order] o1 ON c.CustomerID = o1.CustomerID
    INNER JOIN [Order] o2 ON c.CustomerID = o2.CustomerID
    WHERE o1.OrderID <> o2.OrderID
    AND DATEDIFF(DAY, o1.OrderDate, o2.OrderDate) <= @Days
    AND DATEDIFF(DAY, o1.OrderDate, o2.OrderDate) > 0;
END;


EXEC GetCustomersWithConsecutivePurchases @Days = 5;
EXEC GetCustomersWithConsecutivePurchases @Days = 10;
EXEC GetCustomersWithConsecutivePurchases @Days = 15;
EXEC GetCustomersWithConsecutivePurchases @Days = 30;


-- Calculate the total revenue for each customer in the last N months. 
CREATE PROCEDURE GetCustomerRevenueLastMonths
    @Months INT
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM Customer c
    INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
    WHERE o.OrderDate >= DATEADD(MONTH, -@Months, GETDATE())
    GROUP BY c.CustomerID, c.FirstName, c.LastName;
END;


EXEC GetCustomerRevenueLastMonths @Months = 1;
EXEC GetCustomerRevenueLastMonths @Months = 3;
EXEC GetCustomerRevenueLastMonths @Months = 6;
EXEC GetCustomerRevenueLastMonths @Months = 12;


-- Retrieve orders where the product price is higher than the average price of all  products 
CREATE PROCEDURE GetOrdersAboveAvgPrice
AS
BEGIN
    SELECT o.*
    FROM [Order] o
    INNER JOIN [Product] p ON o.ProductID = p.ProductID
    WHERE p.Price > (SELECT AVG(Price) FROM [Product]);
END;


EXEC GetOrdersAboveAvgPrice;


-- Calculate the average time between consecutive orders for each customer. 
CREATE PROCEDURE GetAvgTimeBetweenOrders
AS
BEGIN 
    SELECT
        c.CustomerID,
        c.FirstName,
        c.LastName,
        AVG(CAST(DATEDIFF(DAY, o1.OrderDate, o2.OrderDate) AS DECIMAL(10,2))) AS AvgDaysBetweenOrders
    FROM Customer c
    INNER JOIN [Order] o1 ON c.CustomerID = o1.CustomerID
    INNER JOIN [Order] o2 ON c.CustomerID = o2.CustomerID
    WHERE o1.OrderID < o2.OrderID
    GROUP BY c.CustomerID, c.FirstName, c.LastName;
END;


EXEC GetAvgTimeBetweenOrders;


-- Create a store procedure create with pagination, sorting and searching with order table.
CREATE PROCEDURE GetOrdersWithPagination
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SortColumn VARCHAR(50) = 'OrderID',
    @SortOrder VARCHAR(4) = 'ASC',
    @SearchText VARCHAR(100) = NULL
AS
BEGIN
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT
        o.OrderID,
        o.CustomerID,
        c.FirstName,
        c.LastName,
        o.OrderDate,
        o.Qty,
        o.Rate,
        o.TotalAmount,
        o.ProductID,
        p.Name AS ProductName
    FROM [Order] o
    INNER JOIN Customer c ON o.CustomerID = c.CustomerID
    INNER JOIN [Product] p ON o.ProductID = p.ProductID
    WHERE (@SearchText IS NULL
        OR c.FirstName LIKE '%' + @SearchText + '%'
        OR c.LastName LIKE '%' + @SearchText + '%'
        OR p.Name LIKE '%' + @SearchText + '%')
    ORDER BY
        CASE WHEN @SortColumn = 'OrderID' AND @SortOrder = 'ASC' THEN o.OrderID END ASC,
        CASE WHEN @SortColumn = 'OrderID' AND @SortOrder = 'DESC' THEN o.OrderID END DESC,
        CASE WHEN @SortColumn = 'OrderDate' AND @SortOrder = 'ASC' THEN o.OrderDate END ASC,
        CASE WHEN @SortColumn = 'OrderDate' AND @SortOrder = 'DESC' THEN o.OrderDate END DESC,
        CASE WHEN @SortColumn = 'TotalAmount' AND @SortOrder = 'ASC' THEN o.TotalAmount END ASC,
        CASE WHEN @SortColumn = 'TotalAmount' AND @SortOrder = 'DESC' THEN o.TotalAmount END DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS [TotalRecords]
    FROM [Order] o
    INNER JOIN Customer c ON o.CustomerID = c.CustomerID
    INNER JOIN [Product] p ON o.ProductID = p.ProductID
    WHERE (@SearchText IS NULL 
        OR c.FirstName LIKE '%' + @SearchText + '%'
        OR c.LastName LIKE '%' + @SearchText + '%'
        OR p.Name LIKE '%' + @SearchText + '%');
END;


EXEC GetOrdersWithPagination;
EXEC GetOrdersWithPagination @PageNumber = 1, @PageSize = 5, @SortColumn = 'OrderDate', @SortOrder = 'DESC', @SearchText = NULL;
EXEC GetOrdersWithPagination @PageNumber = 1, @PageSize = 5, @SortColumn = 'OrderID', @SortOrder = 'ASC', @SearchText = 'Alice';
EXEC GetOrdersWithPagination @PageNumber = 1, @PageSize = 5, @SortColumn = 'TotalAmount', @SortOrder = 'DESC', @SearchText = NULL;
EXEC GetOrdersWithPagination @PageNumber = 2, @PageSize = 5, @SortColumn = 'OrderID', @SortOrder = 'ASC', @SearchText = NULL;
EXEC GetOrdersWithPagination @PageNumber = 1, @PageSize = 3, @SortColumn = 'OrderID', @SortOrder = 'ASC', @SearchText = 'Bob';
EXEC GetOrdersWithPagination @PageNumber = 1, @PageSize = 10, @SortColumn = 'OrderID', @SortOrder = 'ASC', @SearchText = 'Monitor';
EXEC GetOrdersWithPagination @PageNumber = 1, @PageSize = 10, @SortColumn = 'OrderID', @SortOrder = 'ASC', @SearchText = 'Laptop';