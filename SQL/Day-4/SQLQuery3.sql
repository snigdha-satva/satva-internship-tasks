USE dataDB;

CREATE TABLE Customer (
    CustomerId INT PRIMARY KEY,
    Name VARCHAR(100),
    Address VARCHAR(100)
);

CREATE TABLE CustomerProducts (
    ProductId INT PRIMARY KEY,
    ProductName VARCHAR(100),
    CustomerIDs VARCHAR(100)
);

INSERT INTO Customer (CustomerId, Name, Address) VALUES
(1, 'Jeshal', 'Amreli'),
(2, 'Jigna', 'Ahmedabad'),
(3, 'Rajesh', 'Baroda');

INSERT INTO CustomerProducts (ProductId, ProductName, CustomerIDs) VALUES
(1, 'Nokia', '1,2,3'),
(2, 'Iphone', '2,3'),
(3, 'Samsung', '1');

SELECT c.CustomerId, c.Name, c.Address,
       STRING_AGG(cp.ProductName, ',') AS Products
FROM Customer c
CROSS APPLY (
    SELECT ProductName FROM CustomerProducts
    WHERE ',' + CustomerIDs + ',' LIKE '%,' + CAST(c.CustomerId AS VARCHAR) + ',%'
) cp
GROUP BY c.CustomerId, c.Name, c.Address;