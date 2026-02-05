CREATE DATABASE PaymentDB;

USE PaymentDB;

CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(20)
);

CREATE TABLE [Product] (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Description TEXT
);

CREATE TABLE [Order] (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE(),
    Qty INT NOT NULL CHECK (Qty > 0),
    Rate DECIMAL(10,2) NOT NULL CHECK (Rate >= 0),
    TotalAmount DECIMAL(10,2) NOT NULL CHECK (TotalAmount >= 0),
    ProductID INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES [Product](ProductID)
);

CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount >= 0),
    PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (OrderID) REFERENCES [Order](OrderID)
);
DELETE FROM Payment;
DELETE FROM [Order];
DELETE FROM Customer;
DELETE FROM [Product];


-- Reset IDENTITY seeds back to 1
DBCC CHECKIDENT ('Payment', RESEED, 0);
DBCC CHECKIDENT ('[Order]', RESEED, 0);
DBCC CHECKIDENT ('Customer', RESEED, 0);
DBCC CHECKIDENT ('[Product]', RESEED, 0);

SELECT * FROM [Order];
SELECT * FROM [Product];
SELECT * FROM Customer;
SELECT * FROM Payment;