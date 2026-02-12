USE taskDB;

-- 1. Rank employees within each department based on their salary.
SELECT
	Employee_id,
	First_Name,
	Salary,
	RANK() OVER (ORDER BY Salary DESC) AS SalaryRank
FROM Employees;

-- 2. Determine the top three performing customers based on orders placed in current month and assign a dense rank to them.
SELECT TOP 3
	c.Customer_id,
	c.First_Name,
	Count(o.Order_id) AS TotalOrders,
	DENSE_RANK() OVER (ORDER BY Count(o.Order_id) DESC) AS CustomerRank
FROM Customers c
JOIN Orders o
ON c.Customer_id = o.Customer_id
WHERE MONTH(o.Order_date) = MONTH(GETDATE())
    AND YEAR(o.Order_date) = YEAR(GETDATE())
GROUP BY c.Customer_id, c.First_name;

-- 3. Generate a query that includes the total number of orders for each customer, assigning a row number to each order within the customer's record
SELECT
	c.Customer_id,
	c.First_Name,
	Count(o.Order_id) AS TotalOrders,
	ROW_NUMBER() OVER (Order BY Count(o.Order_id) DESC) AS Row_Assigned
FROM Customers c
JOIN Orders o
ON c.Customer_id = o.Customer_id
GROUP BY c.Customer_id, c.First_name

-- 4. Subquery with Insert, Edit, Delete, Update:
-- a. Insert new records into a 'Promotions' table for any 5 products
INSERT INTO Promotions (Promotion_id, Product_id, Promotion_name, Start_date, End_date, DiscountAmount, Active)
SELECT 
	ROW_NUMBER() OVER (ORDER BY Product_id) + (SELECT MAX(Promotion_id) FROM Promotions),
	Product_id, 
	'Special Offer - ' + Product_name,
	'2026-02-15', 
	'2026-03-31', 
	Unit_price * 0.15, 
	1
FROM Products WHERE Product_id IN (4, 6, 8, 9, 10);

SELECT * FROM Promotions;

-- b. Update the 'Products' table where the product’s order is placed more than thrice in the current month to mark these product as 'Featured'.
CREATE OR ALTER TRIGGER UpdateFeaturedProducts
ON ORDERS
AFTER INSERT
AS
BEGIN
	UPDATE Products
	SET Featured = 1
	WHERE Product_id IN
	(SELECT
		Product_id
		FROM Orders
		WHERE MONTH(Order_Date) = MONTH(GETDATE())
		AND YEAR(Order_Date) = YEAR(GETDATE())
		GROUP BY Product_id
		HAVING COUNT(product_id) > 3
	);
END;

SELECT p.Product_id, p.Product_name, Featured, COUNT(*) AS Order_Count
FROM Products p
JOIN Orders o ON p.Product_id = o.Product_id
WHERE MONTH(o.Order_date) = MONTH(GETDATE()) AND YEAR(o.Order_date) = YEAR(GETDATE())
GROUP BY p.Product_id, p.Product_name, Featured;

INSERT INTO Orders VALUES 
(22, NULL, 1, 1, 1, '2026-02-10', 1200.00);

SELECT p.Product_id, p.Product_name, Featured, COUNT(*) AS Order_Count
FROM Products p
JOIN Orders o ON p.Product_id = o.Product_id
WHERE MONTH(o.Order_date) = MONTH(GETDATE()) AND YEAR(o.Order_date) = YEAR(GETDATE())
GROUP BY p.Product_id, p.Product_name, Featured;

-- c. Ensure to delete any promotions created (Start_date) before last 6 months.
DELETE FROM Orders
WHERE Promotion_id IN (
    SELECT Promotion_id 
    FROM Promotions 
    WHERE DATEDIFF(MONTH, Start_date, GETDATE()) > 6
);

DELETE FROM Promotions
WHERE DATEDIFF(MONTH, Start_date, GETDATE()) > 6;

-- 5. Create a view that joins the 'Orders' and 'Customers' tables to display order details along with customer information.
CREATE OR ALTER VIEW OrderCustomers 
AS
SELECT
	o.Order_id,
	o.Order_date,
	o.Quantity,
	o.Price,
	c.Customer_id,
	c.First_Name, 
	c.Last_Name,
	c.Email
FROM Orders o
JOIN Customers c
ON c.Customer_id = o.Customer_id;

UPDATE OrderCustomers
SET Price = 15000
WHERE Order_id = 3;


-- 6. Build a complex view that joins multiple tables such as ‘Orders’, 'Products' to display detailed order data along with product information for last 3 months
CREATE VIEW OrderProductDetails
AS
SELECT
	o.Order_id,
	o.Order_date,
	o.Quantity,
	o.Price,
	p.Product_id,
	p.Product_Name,
	p.Category_name, 
	p.Unit_price
FROM Orders o
JOIN Products p
ON o.Product_id = p.Product_id
WHERE o.Order_date >= DATEADD(MONTH, -3, GETDATE());

SELECT * FROM OrderProductDetails;

-- 7. View with WITH CHECK OPTION: Implement a view that shows employee salaries and allows for salary updates. Utilize the 'WITH CHECK OPTION' to ensure that salary must be > 10000.
CREATE OR ALTER VIEW EmployeeSalary AS
SELECT Employee_id, First_name, Last_name, Salary
FROM Employees
WHERE Salary > 10000
WITH CHECK OPTION;

SELECT * FROM EmployeeSalary;

-- 8. Develop a function that calculates the total cost of an order based on the quantity and unit price of each product
CREATE FUNCTION CalculateTotalOrder (
	@Quantity INT,
	@UnitPrice DECIMAL(10, 2)
)
RETURNS DECIMAL(10, 2)
AS
BEGIN
	RETURN @Quantity * @UnitPrice
END;

SELECT dbo.CalculateTotalOrder(5, 20.00) AS Total_Cost;

-- 9. While Loop with Continue and Break

-- a. Create a temp table to store numbers
CREATE TABLE #Numbers (Value INT);

-- b. Populate the "#Numbers" table with integers from 1 to 10.
DECLARE @i INT = 1;
WHILE @i <= 10
BEGIN
	INSERT INTO #Numbers VALUES (@i);
	SET @i = @i + 1;
END;

SELECT * FROM #Numbers;

-- c. Iterate a While loop through Numbers table
DECLARE @num INT;
DECLARE @counter INT = 1;
WHILE @counter <= 10
BEGIN
	SELECT @num = Value FROM #Numbers WHERE Value = @Counter
	IF @num = 5
		BREAK;
	IF @num % 2 = 0
	BEGIN
        SET @counter = @counter + 1;
        CONTINUE;
    END;
    PRINT @num;
    SET @counter = @counter + 1;
END;



-- Cursor Implementation for 9th Task
CREATE TABLE #Numbers111 (Value INT);

DECLARE @j INT = 1;
WHILE @j <= 10
BEGIN
	INSERT INTO #Numbers111 VALUES (@j);
	SET @j = @j + 1;
END;

CREATE TABLE Numbers1 (Value INT);
DECLARE NumberCursor CURSOR FOR
SELECT Value FROM #Numbers111;
OPEN NumberCursor;
DECLARE @num1 INT, @counter1 INT = 1;
FETCH NEXT FROM NumberCursor INTO @num1;

WHILE @@FETCH_STATUS = 0
BEGIN
	IF @num1 = 5
		BREAK;
	IF @num1 % 2 = 0
	BEGIN
        FETCH NEXT FROM NumberCursor INTO @num1;
		CONTINUE;
    END;
	IF @@ROWCOUNT = 0
	BEGIN
		INSERT INTO Numbers1(Value) VALUES(@num1);
	END;
	FETCH NEXT FROM NumberCursor INTO @num1;
END;

CLOSE NumberCursor;
DEALLOCATE NumberCursor;

SELECT * FROM Numbers1;

-- 10. Write a cursor to iterate through a ‘Order’ ’table and calculate the total revenue generated by each product category. Display the results and insert them in a separate summary table.
DECLARE @ProductID INT, @Category VARCHAR(100), @Revenue DECIMAL(15, 2);

-- Declare Cursor
DECLARE OrderCursor CURSOR FOR
SELECT p.Product_id, p.Category_name, SUM(o.Price)
FROM Orders o
JOIN Products p
ON p.Product_id = o.Product_id
GROUP BY p.Product_id, p.Category_name

-- Open Cursor
OPEN OrderCursor;

-- Fetch next from data through Cursor
FETCH NEXT FROM OrderCursor INTO @ProductID, @Category, @Revenue;

-- Process
WHILE @@FETCH_STATUS = 0
BEGIN
	UPDATE Category_Summary
	SET Revenue = Revenue + @Revenue
	WHERE Category_name = @Category;

	IF @@ROWCOUNT = 0
	BEGIN
		INSERT INTO Category_Summary (Category_summary_id, Category_name, Revenue)
		VALUES (
			(SELECT ISNULL(MAX(Category_summary_id), 0) + 1 FROM Category_Summary),
			@Category,
			@Revenue)
	END;
	FETCH NEXT FROM OrderCursor INTO @ProductID, @Category, @Revenue;
END;

-- Close
CLOSE OrderCursor;

--Deallocate
DEALLOCATE OrderCursor;

SELECT * FROM Category_Summary;