USE DepartmentDB;

-- Retrieve a list of orders along with the names of customers who placed those orders.  Include only orders placed by existing customers.
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
INNER JOIN Customers c ON o.CustomerId = c.CustomerId;

-- Retrieve a list of all orders along with the names of customers who placed those orders.  Include orders placed by customers who are not registered in the system.
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
LEFT JOIN Customers c ON o.CustomerId = c.CustomerId;

-- Retrieve a list of all customers who placed orders, even those without any orders. Include  the details of orders they placed, if any. 
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
RIGHT JOIN Customers c ON o.CustomerId = c.CustomerId;

-- Retrieve a comprehensive list of all orders and customers, including those without any  orders and customers who haven't placed any orders. 
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
FULL OUTER JOIN Customers c ON o.CustomerId = c.CustomerId;

-- Generate a list of all possible combinations of orders and customers
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
CROSS JOIN Customers c
ORDER BY o.OrderId, c.CustomerName;

-- Retrieve the top 3 customers who have spent the highest total amount. 
SELECT TOP 3
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    COUNT(o.OrderId) AS [Total Orders],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY c.CustomerId, c.CustomerName
ORDER BY [Total Amount Spent] DESC;

-- Retrieve the details of customers who have not placed any orders. 
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    c.Email,
    c.Phone
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE o.OrderId IS NULL;

-- Retrieve the total number of orders and total amount spent by each customer for orders  placed in 2024. 
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    COUNT(o.OrderId) AS [Total Orders],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId 
    AND YEAR(o.OrderDate) = 2024
GROUP BY c.CustomerId, c.CustomerName
ORDER BY c.CustomerId;

-- Retrieve the top 5 departments with the highest average total amount spent by customers in  orders.
SELECT TOP 5
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    AVG(o.TotalAmount) AS [Average Total Amount Spent]
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY [Average Total Amount Spent] DESC;

-- Retrieve the department with the highest total number of orders. 
SELECT TOP 1
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    COUNT(o.OrderId) AS [Total Orders]
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY [Total Orders] DESC;

-- Retrieve the top 3 customers who have the highest total amount spent on orders in 
SELECT TOP 3
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) = 2024
GROUP BY c.CustomerId, c.CustomerName
ORDER BY [Total Amount Spent] DESC;

-- Retrieve the details of departments with at least 2 employees and the total number of orders  placed by those employees.
SELECT 
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    COUNT(DISTINCT o.OrderId) AS [Total Orders]
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
HAVING COUNT(DISTINCT c.CustomerId) >= 2
ORDER BY [Total Orders] DESC;

-- Retrieve the customers who have placed orders both in 2023 and 2024. 
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    c.Email,
    c.Phone
FROM Customers c
WHERE EXISTS (
    SELECT * FROM Orders o 
    WHERE o.CustomerId = c.CustomerId AND YEAR(o.OrderDate) = 2023
)
AND EXISTS (
    SELECT * FROM Orders o 
    WHERE o.CustomerId = c.CustomerId AND YEAR(o.OrderDate) = 2024
);
