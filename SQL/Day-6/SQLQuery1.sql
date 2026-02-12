CREATE DATABASE taskDB;

USE taskDB;

CREATE TABLE Customers (
    Customer_id INT PRIMARY KEY,
    First_name VARCHAR(50),
    Last_name VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    Address VARCHAR(200),
    City VARCHAR(100),
    State_province VARCHAR(100),
    Country VARCHAR(100),
    Postal_code VARCHAR(20),
    Date_of_birth DATE,
    Gender VARCHAR(10)
);

CREATE TABLE Departments (
    Department_id INT PRIMARY KEY,
    Department_name VARCHAR(100)
);

CREATE TABLE Employees (
    Employee_id INT PRIMARY KEY,
    First_name VARCHAR(50),
    Last_name VARCHAR(50),
    Department_id INT,
    Salary DECIMAL(10,2),
    FOREIGN KEY (Department_id) REFERENCES Departments(Department_id)
);

CREATE TABLE Salary_History (
    Sync_History_id INT PRIMARY KEY,
    Employee_id INT,
    Salary DECIMAL(10,2),
    Effective_date DATE,
    FOREIGN KEY (Employee_id) REFERENCES Employees(Employee_id)
);

CREATE TABLE Products (
    Product_id INT PRIMARY KEY,
    Product_name VARCHAR(200),
    Category_name VARCHAR(100),
    Unit_price DECIMAL(10,2),
    Featured BIT
);

CREATE TABLE Promotions (
    Promotion_id INT PRIMARY KEY,
    Product_id INT,
    Promotion_name VARCHAR(200),
    Start_date DATE,
    End_date DATE,
    DiscountAmount DECIMAL(10,2),
    Active BIT,
    FOREIGN KEY (Product_id) REFERENCES Products(Product_id)
);

CREATE TABLE Orders (
    Order_id INT PRIMARY KEY,
    Promotion_id INT,
    Product_id INT,
    Quantity INT,
    Customer_id INT,
    Order_date DATE,
    Price DECIMAL(10,2),
    FOREIGN KEY (Promotion_id) REFERENCES Promotions(Promotion_id),
    FOREIGN KEY (Product_id) REFERENCES Products(Product_id),
    FOREIGN KEY (Customer_id) REFERENCES Customers(Customer_id)
);

CREATE TABLE Category_Summary (
    Category_summary_id INT PRIMARY KEY,
    Category_name VARCHAR(100),
    Revenue DECIMAL(15,2)
);

INSERT INTO Customers VALUES 
(1, 'John', 'Doe', 'john.doe@email.com', '555-0101', '123 Main St', 'New York', 'NY', 'USA', '10001', '1985-03-15', 'Male'),
(2, 'Jane', 'Smith', 'jane.smith@email.com', '555-0102', '456 Oak Ave', 'Los Angeles', 'CA', 'USA', '90001', '1990-07-22', 'Female'),
(3, 'Robert', 'Johnson', 'robert.j@email.com', '555-0103', '789 Pine Rd', 'Chicago', 'IL', 'USA', '60601', '1988-11-30', 'Male'),
(4, 'Emily', 'Davis', 'emily.d@email.com', '555-0104', '321 Elm St', 'Houston', 'TX', 'USA', '77001', '1992-05-18', 'Female'),
(5, 'Michael', 'Wilson', 'michael.w@email.com', '555-0105', '654 Maple Dr', 'Phoenix', 'AZ', 'USA', '85001', '1987-09-25', 'Male');

INSERT INTO Departments VALUES 
(1, 'Sales'),
(2, 'Marketing'),
(3, 'IT'),
(4, 'Finance'),
(5, 'HR');

INSERT INTO Employees VALUES 
(1, 'Michael', 'Johnson', 1, 55000.00),
(2, 'Sarah', 'Williams', 1, 62000.00),
(3, 'David', 'Brown', 1, 75000.00),
(4, 'Lisa', 'Anderson', 2, 48000.00),
(5, 'James', 'Taylor', 2, 58000.00),
(6, 'Patricia', 'Martinez', 2, 52000.00),
(7, 'Christopher', 'Garcia', 3, 85000.00),
(8, 'Jennifer', 'Rodriguez', 3, 78000.00),
(9, 'Daniel', 'Lee', 4, 68000.00),
(10, 'Nancy', 'Walker', 5, 45000.00);

INSERT INTO Salary_History VALUES 
(1, 1, 50000.00, '2023-01-01'),
(2, 1, 55000.00, '2024-01-01'),
(3, 2, 58000.00, '2023-01-01'),
(4, 2, 62000.00, '2024-01-01'),
(5, 3, 70000.00, '2023-01-01'),
(6, 3, 75000.00, '2024-06-01'),
(7, 4, 45000.00, '2023-01-01'),
(8, 4, 48000.00, '2024-01-01');

INSERT INTO Products VALUES 
(1, 'Laptop Pro 15', 'Electronics', 1200.00, 0),
(2, 'Wireless Mouse', 'Electronics', 45.00, 0),
(3, 'Office Chair Deluxe', 'Furniture', 350.00, 0),
(4, 'Standing Desk', 'Furniture', 550.00, 0),
(5, 'Notebook Set Premium', 'Stationery', 25.00, 0),
(6, 'Pen Collection', 'Stationery', 15.00, 0),
(7, 'Monitor 27 inch', 'Electronics', 400.00, 0),
(8, 'Desk Lamp LED', 'Furniture', 75.00, 0),
(9, 'Printer All-in-One', 'Electronics', 280.00, 0),
(10, 'File Cabinet', 'Furniture', 220.00, 0);

INSERT INTO Promotions VALUES 
(1, 1, 'New Year Sale', '2023-06-01', '2023-08-31', 150.00, 0),
(2, 3, 'Spring Clearance', '2024-09-01', '2024-10-31', 50.00, 1),
(3, 5, 'Back to School Special', '2025-12-01', '2026-01-31', 5.00, 1),
(4, 7, 'Holiday Deal', '2026-01-15', '2026-03-15', 60.00, 1),
(5, 2, 'Winter Promotion', '2026-01-20', '2026-02-28', 8.00, 1);

INSERT INTO Orders VALUES 
(1, 1, 1, 1, 1, '2025-11-15', 1050.00),
(2, 2, 3, 2, 2, '2025-11-20', 650.00),
(3, NULL, 2, 3, 1, '2025-12-10', 135.00),
(4, 3, 5, 4, 3, '2026-01-05', 80.00),
(5, 4, 7, 1, 4, '2026-01-10', 340.00),
(6, NULL, 4, 2, 5, '2026-01-15', 1100.00),
(7, 5, 2, 5, 1, '2026-01-18', 185.00),
(8, NULL, 6, 3, 2, '2026-01-22', 45.00),
(9, NULL, 8, 2, 3, '2026-02-01', 150.00),
(10, NULL, 1, 1, 4, '2026-02-03', 1200.00),
(11, NULL, 9, 1, 5, '2026-02-05', 280.00),
(12, NULL, 3, 1, 1, '2026-02-07', 350.00),
(13, NULL, 5, 6, 2, '2026-02-08', 150.00),
(14, NULL, 7, 2, 3, '2026-02-09', 800.00),
(15, NULL, 2, 2, 1, '2026-02-10', 90.00),
(16, NULL, 1, 1, 2, '2026-02-10', 1200.00),
(17, NULL, 1, 2, 3, '2026-02-10', 2400.00),
(18, NULL, 1, 1, 4, '2026-02-10', 1200.00),
(19, NULL, 2, 4, 2, '2026-02-10', 180.00),
(20, NULL, 5, 3, 3, '2026-02-10', 75.00);