CREATE DATABASE DepartmentDB;
USE DepartmentDB;

CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    CONSTRAINT UK_Departments_Name UNIQUE (DepartmentName)
);

CREATE TABLE Customers (
    CustomerId INT PRIMARY KEY IDENTITY(1,1),
    CustomerName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    DepartmentId INT NULL,
    CONSTRAINT UK_Customers_Email UNIQUE (Email),
    CONSTRAINT FK_Customers_Departments FOREIGN KEY (DepartmentId) 
        REFERENCES Departments(DepartmentId) ON DELETE SET NULL,
    CONSTRAINT CK_Email_Format CHECK (Email LIKE '%@%')
);

CREATE TABLE Orders (
    OrderId INT PRIMARY KEY IDENTITY(101,1),
    CustomerId INT NULL,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerId) 
        REFERENCES Customers(CustomerId) ON DELETE SET NULL,
    CONSTRAINT CK_TotalAmount_Positive CHECK (TotalAmount >= 0),
    CONSTRAINT CK_OrderDate_Valid CHECK (OrderDate <= GETDATE())
);

INSERT INTO Departments (DepartmentName, Location) VALUES
('Sales', 'New York'),
('Marketing', 'Los Angeles'),
('Finance', 'Chicago'),
('IT', 'San Francisco'),
('HR', 'Boston');

INSERT INTO Customers (CustomerName, Email, Phone, DepartmentId) VALUES
('John Doe', 'john@example.com', '1234567890', 1),
('Jane Smith', 'jane@example.com', '0987654321', 2),
('Michael Johnson', 'michael@example.com', '1122334455', 3),
('Bob Brown', 'bob@example.com', '5555555555', 1),
('Alice Green', 'alice@example.com', '6666666666', 2),
('Charlie White', 'charlie@example.com', '7777777777', 3),
('David Lee', 'david@example.com', '8888888888', 4),
('Emma Wilson', 'emma@example.com', '9999999999', 5);

ALTER TABLE Orders NOCHECK CONSTRAINT FK_Orders_Customers;

INSERT INTO Orders (CustomerId, OrderDate, TotalAmount) VALUES
(1, '2024-02-15', 100.00),
(2, '2024-02-16', 150.00),
(NULL, '2024-02-17', 200.00),
(1, '2024-03-01', 150.00),
(2, '2024-03-05', 100.00),
(2, '2024-03-10', 150.00),
(3, '2024-04-01', 150.00),
(1, '2023-12-15', 100.00),
(2, '2023-11-20', 100.00),
(3, '2023-11-25', 100.00),
(5, '2024-05-10', 200.00),
(5, '2024-06-15', 150.00),
(6, '2024-07-01', 180.00),
(7, '2024-08-01', 220.00),
(8, '2024-09-01', 160.00);

ALTER TABLE Orders CHECK CONSTRAINT FK_Orders_Customers;

SELECT * FROM Orders;
SELECT * FROM Departments;
SELECT * FROM Customers;