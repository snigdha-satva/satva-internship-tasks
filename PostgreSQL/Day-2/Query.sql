-- Enum for payment type
CREATE TYPE payment_type AS ENUM ('cash', 'card', 'upi');

-- Customers Table
CREATE TABLE Customers (
    cid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(50),
    address TEXT,
    email VARCHAR(100) UNIQUE
);

-- Index implentation
CREATE INDEX email_index ON Customers(email);

-- Suppliers Table
CREATE TABLE Suppliers (
    sid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    email VARCHAR(100) UNIQUE,
    stocksto_be_sent INTEGER DEFAULT 0
);

-- Departments Table
CREATE TABLE Departments (
    did SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Employees Table
CREATE TABLE Employees (
    eid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    did INTEGER,
    salary NUMERIC(10, 2) CHECK (salary >= 0),
    contact VARCHAR(50),
    address TEXT,
    hiredate DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (did) REFERENCES Departments(did) ON DELETE SET NULL
);

-- Products Table
CREATE TABLE Products (
    pid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unitprice NUMERIC(10, 2) NOT NULL CHECK (unitprice >= 0),
    description TEXT,
    sid INTEGER,
    stockleft INTEGER DEFAULT 0 CHECK (stockleft >= 0),
    expiry_date DATE,
    is_available BOOLEAN GENERATED ALWAYS AS (stockleft > 0) STORED,
    FOREIGN KEY (sid) REFERENCES Suppliers(sid) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE Orders (
    oid SERIAL PRIMARY KEY,
    eid INTEGER,
    cid INTEGER NOT NULL,
    orderdate DATE DEFAULT CURRENT_DATE,
    prods INTEGER[],
    quantity INTEGER[],
    total NUMERIC(10, 2) DEFAULT 0 CHECK (total >= 0),
    FOREIGN KEY (eid) REFERENCES Employees(eid) ON DELETE SET NULL,
    FOREIGN KEY (cid) REFERENCES Customers(cid) ON DELETE CASCADE
);

SELECT * FROM Customers;
SELECT * FROM Orders WHERE cid = 3;
-- Refund Table
CREATE TABLE Refund (
    rid SERIAL PRIMARY KEY,
    oid INTEGER NOT NULL,
    prodid INTEGER,
    refundamount NUMERIC(10, 2) DEFAULT 0 CHECK (refundamount >= 0),
    refunddate DATE DEFAULT CURRENT_DATE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reason TEXT,
    doneby INTEGER,
    FOREIGN KEY (oid) REFERENCES Orders(oid) ON DELETE CASCADE,
    FOREIGN KEY (prodid) REFERENCES Products(pid) ON DELETE SET NULL,
    FOREIGN KEY (doneby) REFERENCES Employees(eid) ON DELETE SET NULL
);

-- Payments table
CREATE TABLE Payments (
    payid SERIAL PRIMARY KEY,
    ord INTEGER NOT NULL,
    rid INTEGER,
    cid INTEGER NOT NULL,
    total NUMERIC(10, 2) DEFAULT 0 CHECK (total >= 0),
    type payment_type NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (ord) REFERENCES Orders(oid) ON DELETE CASCADE,
    FOREIGN KEY (cid) REFERENCES Customers(cid) ON DELETE CASCADE,
    FOREIGN KEY (rid) REFERENCES Refund(rid) ON DELETE SET NULL
);

-- Sales Table
CREATE TABLE Sales (
    saleid SERIAL PRIMARY KEY,
    payid INTEGER NOT NULL,
    ord INTEGER NOT NULL,
    eid INTEGER NOT NULL,
    total_sales NUMERIC(10, 2) DEFAULT 0 CHECK (total_sales >= 0),
    sale_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (payid) REFERENCES Payments(payid) ON DELETE CASCADE,
    FOREIGN KEY (ord) REFERENCES Orders(oid) ON DELETE CASCADE,
    FOREIGN KEY (eid) REFERENCES Employees(eid) ON DELETE SET NULL
);


-- Function to calculate the order amount
CREATE OR REPLACE FUNCTION calculate_order_total(order_id INTEGER)
RETURNS NUMERIC AS $$
DECLARE
    total_amount NUMERIC(10, 2) := 0;
    idx INTEGER;
    product_ids INTEGER[];
    quantities INTEGER[];
    price NUMERIC(10, 2);
BEGIN
    SELECT prods, quantity INTO product_ids, quantities FROM Orders WHERE oid = order_id;
    
    FOR idx IN 1..array_length(product_ids, 1) LOOP
        SELECT unitprice INTO price FROM Products WHERE pid = product_ids[idx];
        total_amount := total_amount + (price * quantities[idx]);
    END LOOP;
    
    RETURN total_amount;
END;
$$ LANGUAGE plpgsql;


-- Calculates the total payment after refund, if there
CREATE OR REPLACE FUNCTION calculate_payment_amount(
    order_id INTEGER,
    refund_id INTEGER DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    order_total NUMERIC(10, 2);
    refund_total NUMERIC(10, 2) := 0;
BEGIN
    order_total := calculate_order_total(order_id);
    
    IF refund_id IS NOT NULL THEN
        SELECT refundamount INTO refund_total FROM Refund WHERE rid = refund_id;
    END IF;
    
    RETURN GREATEST(order_total - refund_total, 0);
END;
$$ LANGUAGE plpgsql;


-- Calculates the total refund amount
CREATE OR REPLACE FUNCTION calculate_refund_amount(
    order_id INTEGER,
    product_id INTEGER,
    refund_quantity INTEGER
)
RETURNS NUMERIC(10, 2) AS $$
DECLARE
    price NUMERIC(10, 2);
BEGIN
    SELECT unitprice INTO price FROM Products WHERE pid = product_id;
    RETURN price * refund_quantity;
END;
$$ LANGUAGE plpgsql;

-- This updates the stock as soon as we insert new value in the order
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
    idx INTEGER;
    product_ids INTEGER[];
    quantities INTEGER[];
BEGIN
    product_ids := NEW.prods;
    quantities := NEW.quantity;
    
    FOR idx IN 1..array_length(product_ids, 1) LOOP
        UPDATE Products 
        SET stockleft = stockleft - quantities[idx]
        WHERE pid = product_ids[idx] AND stockleft >= quantities[idx];
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- This updates the stock when we insert a new refund
CREATE OR REPLACE FUNCTION update_stock_on_refund()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Products 
    SET stockleft = stockleft + NEW.quantity
    WHERE pid = NEW.prodid;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating on order
CREATE TRIGGER trigger_update_stock_on_order
AFTER INSERT ON Orders
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_order();

-- Trigger for updating on refund
CREATE TRIGGER trigger_update_stock_on_refund
AFTER INSERT ON Refund
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_refund();


-- Views
CREATE VIEW EmployeesDepartmentMapping AS
SELECT
    e.*,
    d.name AS DepartmentName
FROM Employees e
JOIN Departments d ON e.did = d.did;

SELECT * FROM EmployeesDepartmentMapping;

CREATE VIEW SalesByEmployee AS
SELECT
    e.eid,
    e.name,
    d.name AS department,
    COUNT(s.saleid) AS total_sales_count,
    COALESCE(SUM(s.total_sales), 0) AS total_revenue
FROM Employees e
JOIN Departments d ON e.did = d.did
LEFT JOIN Sales s ON e.eid = s.eid
GROUP BY e.eid, e.name, d.name;

SELECT * FROM SalesByEmployee;

INSERT INTO Customers (name, contact, address, email) VALUES
('John Doe', '1234567890', '123 Main St', 'john@email.com'),
('Jane Smith', '0987654321', '456 Oak Ave', 'jane@email.com'),
('Bob Johnson', '5551234567', '789 Pine Rd', 'bob@email.com');

INSERT INTO Suppliers (name, address, email, stocksto_be_sent) VALUES
('ABC Suppliers', '100 Supply St', 'abc@supplier.com', 500),
('XYZ Distributors', '200 Dist Ave', 'xyz@distributor.com', 300);

INSERT INTO Departments (name, description) VALUES
('Sales', 'Sales Department'),
('Management', 'Management Department'),
('Customer Service', 'Customer Service Department');

INSERT INTO Employees (name, did, salary, contact, address) VALUES
('Alice Manager', 2, 75000.00, '1112223333', '111 Emp St'),
('Charlie Sales', 1, 45000.00, '4445556666', '222 Work Ave'),
('Diana Service', 3, 40000.00, '7778889999', '333 Service Blvd');

INSERT INTO Products (name, unitprice, description, sid, stockleft, expiry_date) VALUES
('Laptop', 999.99, 'High performance laptop', 1, 50, '2027-12-31'),
('Mouse', 25.99, 'Wireless mouse', 1, 200, NULL),
('Keyboard', 79.99, 'Mechanical keyboard', 2, 150, NULL),
('Monitor', 299.99, '27 inch monitor', 2, 75, '2028-06-30'),
('Headphones', 149.99, 'Noise cancelling', 1, 100, NULL);

INSERT INTO Orders (eid, cid, prods, quantity) VALUES
(2, 1, ARRAY[1, 2, 3], ARRAY[1, 2, 1]),
(2, 2, ARRAY[4, 5], ARRAY[1, 1]),
(3, 3, ARRAY[2, 3], ARRAY[3, 2]);

UPDATE Orders SET total = calculate_order_total(oid);

INSERT INTO Payments (ord, cid, type) VALUES 
(1, 1, 'card'),
(2, 2, 'cash'),
(3, 3, 'upi');

UPDATE Payments SET total = calculate_payment_amount(ord, rid);

INSERT INTO Refund (oid, prodid, quantity, reason, doneby)
VALUES (1, 2, 1, 'Defective product', 3);

UPDATE Refund SET refundamount = calculate_refund_amount(oid, prodid, quantity);

UPDATE Payments 
SET rid = 1, total = calculate_payment_amount(ord, rid)
WHERE ord = 1;

INSERT INTO Sales (payid, ord, eid, total_sales)
SELECT payid, ord, o.eid, p.total
FROM Payments p
JOIN Orders o ON p.ord = o.oid;

SELECT * FROM Customers;
SELECT * FROM Departments;
SELECT * FROM Employees;
SELECT * FROM Orders;
SELECT * FROM Payments;
SELECT * FROM Products;
SELECT * FROM Refund;
SELECT * FROM Sales;
SELECT * FROM Suppliers;


-- 1: All Products with Stock Status
SELECT name, unitprice, stockleft, is_available FROM Products;

-- 2: Employees with Department Names
SELECT * FROM EmployeesDepartmentMapping;

-- 3: Sales by Employee
SELECT * FROM SalesByEmployee;

-- 4: Orders by Payment Type
SELECT type, COUNT(*) AS total FROM Payments GROUP BY type;

-- 5: Customer Orders-
SELECT c.name, o.oid, o.total FROM Customers c JOIN Orders o ON c.cid = o.cid;

-- 6: Products with Suppliers
SELECT p.name, p.stockleft, s.name AS supplier FROM Products p JOIN Suppliers s ON p.sid = s.sid;

-- 7: Low Stock Products
SELECT name, stockleft FROM Products WHERE stockleft < 50;

-- 8: Total Sales per Employee
SELECT e.name, SUM(s.total_sales) AS total FROM Employees e JOIN Sales s ON e.eid = s.eid GROUP BY e.name;

-- 9: Payments with Customer Info
SELECT c.name, p.type, p.total FROM Customers c JOIN Payments p ON c.cid = p.cid;

-- 10: Refunds with Customer Names
SELECT c.name, r.refundamount, r.reason FROM Refund r JOIN Orders o ON r.oid = o.oid JOIN Customers c ON o.cid = c.cid;

-- 11. Find Customer by Email (INDEX)
SELECT * FROM Customers WHERE email = 'john@email.com';

SELECT c.name, SUM(o.total) AS Total FROM Orders o JOIN Customers c ON o.cid = c.cid 
	GROUP BY c.name ORDER BY Total DESC LIMIT 1;

SELECT * FROM Orders;

INSERT INTO Orders (eid, cid, prods, quantity) VALUES
(2, 1, ARRAY[1, 2, 5], ARRAY[1, 2, 1])