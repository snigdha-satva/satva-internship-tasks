CREATE DATABASE dataDB;

USE dataDB;

CREATE TABLE Customers (
    CustomerID INT IDENTITY(1, 1) PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    City VARCHAR(50),
    Phone VARCHAR(20),
    CreatedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Products (
    ProductID INT IDENTITY(1, 1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL CHECK (Price > 0),
    Stock INT DEFAULT 0
);

CREATE TABLE Orders (
    OrderID INT IDENTITY(1, 1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2),
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerID) 
        REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    CONSTRAINT FK_Orders_Products FOREIGN KEY (ProductID) 
        REFERENCES Products(ProductID) ON DELETE CASCADE
);

CREATE TABLE Payment (
    PaymentID INT IDENTITY(1, 1) PRIMARY KEY,
    OrderID INT NOT NULL,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentStatus VARCHAR(20) DEFAULT 'Pending',
    CONSTRAINT FK_Payment_Orders FOREIGN KEY (OrderID) 
        REFERENCES Orders(OrderID) ON DELETE CASCADE
);


INSERT INTO Customers (CustomerName, Email, City, Phone) VALUES
('John Smith', 'john.smith@email.com', 'New York', '555-0101'),
('Sarah Johnson', 'sarah.j@email.com', 'Los Angeles', '555-0102'),
('Mike Wilson', 'mike.w@email.com', 'Chicago', '555-0103'),
('Emily Davis', 'emily.d@email.com', 'New York', '555-0104'),
('Robert Brown', 'robert.b@email.com', 'Houston', '555-0105'),
('Lisa Anderson', 'lisa.a@email.com', 'Phoenix', '555-0106'),
('David Miller', 'david.m@email.com', 'Chicago', '555-0107'),
('Jennifer Taylor', 'jennifer.t@email.com', 'New York', '555-0108'),
('James Moore', 'james.m@email.com', 'Los Angeles', '555-0109'),
('Amanda White', 'amanda.w@email.com', 'Seattle', '555-0110'),
('Chris Martin', 'chris.m@email.com', 'Boston', '555-0111'),
('Nicole Garcia', 'nicole.g@email.com', 'Miami', '555-0112');


INSERT INTO Products (ProductName, Price, Stock) VALUES
('Laptop Pro', 999.99, 50),
('Wireless Mouse', 29.99, 200),
('USB Keyboard', 49.99, 150),
('Monitor 24inch', 249.99, 75),
('Webcam HD', 79.99, 100),
('Headphones', 149.99, 120),
('USB Hub', 24.99, 180),
('External SSD', 119.99, 90),
('Tablet Stand', 34.99, 160),
('Phone Charger', 19.99, 250);

INSERT INTO Orders (CustomerID, ProductID, Quantity, OrderDate, TotalAmount) VALUES
(1, 1, 1, DATEADD(MONTH, -1, GETDATE()), 999.99),
(1, 2, 2, DATEADD(MONTH, -2, GETDATE()), 59.98),
(1, 3, 1, DATEADD(MONTH, -2, GETDATE()), 49.99),
(1, 4, 1, DATEADD(MONTH, -3, GETDATE()), 249.99),
(1, 5, 2, DATEADD(MONTH, -4, GETDATE()), 159.98),
(1, 6, 1, DATEADD(MONTH, -5, GETDATE()), 149.99),
(1, 7, 3, DATEADD(MONTH, -5, GETDATE()), 74.97),
(2, 1, 1, DATEADD(MONTH, -1, GETDATE()), 999.99),
(2, 8, 1, DATEADD(MONTH, -2, GETDATE()), 119.99),
(2, 3, 2, DATEADD(MONTH, -3, GETDATE()), 99.98),
(2, 4, 1, DATEADD(MONTH, -4, GETDATE()), 249.99),
(2, 6, 1, DATEADD(MONTH, -5, GETDATE()), 149.99),
(2, 9, 2, DATEADD(MONTH, -6, GETDATE()), 69.98),
(3, 2, 5, DATEADD(MONTH, -1, GETDATE()), 149.95),
(3, 5, 1, DATEADD(MONTH, -2, GETDATE()), 79.99),
(3, 7, 2, DATEADD(MONTH, -3, GETDATE()), 49.98),
(3, 10, 3, DATEADD(MONTH, -4, GETDATE()), 59.97),
(3, 1, 1, DATEADD(MONTH, -5, GETDATE()), 999.99),
(3, 6, 1, DATEADD(MONTH, -6, GETDATE()), 149.99),
(4, 1, 1, DATEADD(MONTH, -1, GETDATE()), 999.99),
(4, 2, 1, DATEADD(MONTH, -3, GETDATE()), 29.99),
(5, 3, 2, DATEADD(MONTH, -2, GETDATE()), 99.98),
(5, 4, 1, DATEADD(MONTH, -4, GETDATE()), 249.99),
(6, 5, 1, DATEADD(MONTH, -1, GETDATE()), 79.99),
(7, 6, 2, DATEADD(MONTH, -2, GETDATE()), 299.98),
(8, 7, 1, DATEADD(MONTH, -3, GETDATE()), 24.99),
(9, 8, 1, DATEADD(MONTH, -1, GETDATE()), 119.99),
(10, 9, 2, DATEADD(MONTH, -2, GETDATE()), 69.98),
(11, 10, 5, DATEADD(MONTH, -1, GETDATE()), 99.95),
(12, 1, 1, DATEADD(MONTH, -3, GETDATE()), 999.99);

INSERT INTO Payment (OrderID, AmountPaid, PaymentStatus) VALUES
(1, 999.99, 'Completed'),
(2, 59.98, 'Completed'),
(3, 49.99, 'Completed'),
(4, 200.00, 'Partial'),
(5, 159.98, 'Completed'),
(6, 149.99, 'Completed'),
(7, 50.00, 'Partial'),    
(8, 999.99, 'Completed'),
(9, 119.99, 'Completed'),
(10, 99.98, 'Completed'),
(11, 249.99, 'Completed'),
(12, 100.00, 'Partial'),  
(13, 69.98, 'Completed'),
(14, 149.95, 'Completed'),
(15, 79.99, 'Completed'),
(16, 49.98, 'Completed'),
(17, 59.97, 'Completed'),
(18, 999.99, 'Completed'),
(19, 149.99, 'Completed'),
(20, 999.99, 'Completed'),
(21, 29.99, 'Completed'),
(22, 99.98, 'Completed'),
(23, 249.99, 'Completed'),
(24, 79.99, 'Completed'),
(25, 299.98, 'Completed'),
(26, 24.99, 'Completed'),
(27, 119.99, 'Completed'),
(28, 69.98, 'Completed'),
(29, 99.95, 'Completed'),
(30, 500.00, 'Partial'); 

SELECT * FROM Payment;
SELECT * FROM Orders;
SELECT * FROM Customers;
SELECT * FROM Products;