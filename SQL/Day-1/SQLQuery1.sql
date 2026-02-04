CREATE DATABASE CompanyDB;

USE CompanyDB;

-- Create the 'Company' table
CREATE TABLE Company (
	CompanyID INT PRIMARY KEY,
	CompanyName VARCHAR(100) NOT NULL,
	Address VARCHAR(200),
	PhoneNumber VARCHAR(10),
	Email VARCHAR(100) UNIQUE);

-- Create table for users
CREATE TABLE Users (
	UserID INT PRIMARY KEY,
	CompanyID INT NOT NULL,
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(50) NOT NULL,
	Email VARCHAR(100) UNIQUE,
	PhoneNumber VARCHAR(20),
	FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
	);

-- Create 'Devices' table
CREATE TABLE Devices (
    DeviceID INT PRIMARY KEY,
    CompanyID INT NOT NULL,
    DeviceName VARCHAR(100) NOT NULL,
    DeviceType VARCHAR(50),
    SerialNumber VARCHAR(100),
    PurchaseDate DATE,
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
);

-- Create 'Applications' table
CREATE TABLE Applications (
    ApplicationID INT PRIMARY KEY,
    CompanyID INT NOT NULL,
    ApplicationName VARCHAR(100) NOT NULL,
    ApplicationVersion VARCHAR(20),
    LicenseKey VARCHAR(100),
    InstallDate DATE,
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
);

-- Create 'Marketing' table
CREATE TABLE Marketing (
    MarketingID INT PRIMARY KEY,
    UserID INT NOT NULL,
    Department VARCHAR(50),
    CampaignAccess VARCHAR(100),
    Budget DECIMAL(10, 2),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Create 'Personal' table
CREATE TABLE Personal (
    PersonalID INT PRIMARY KEY,
    UserID INT NOT NULL,
    PersonalEmail VARCHAR(100),
    DateOfBirth DATE,
    Address VARCHAR(200),
    EmergencyContact VARCHAR(100) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Inserting Data into tables
INSERT INTO Company (CompanyID, CompanyName, Address, PhoneNumber, Email) VALUES 
    (1, 'Tech Solutions Inc', '123 Business Street, New York', '5550100', 'info@techsolutions.com'),
    (2, 'Digital Innovators LLC', '456 Innovation Avenue, California', '5550200', 'contact@digitalinnovators.com'),
    (3, 'Global Systems Corp', '789 Enterprise Road, Texas', '5550300', 'hello@globalsystems.com'),
    (4, 'Smart Tech Ltd', '321 Technology Lane, Florida', '5550400', 'support@smarttech.com'),
    (5, 'Future Works Inc', '654 Future Drive, Washington', '5550500', 'info@futureworks.com');


INSERT INTO Users VALUES 
    (1, 1, 'John', 'Smith', 'john.smith@techsolutions.com', '555-0101'),
    (2, 1, 'Sarah', 'Johnson', 'sarah.johnson@techsolutions.com', '555-0102'),
    (3, 1, 'Mike', 'Williams', 'mike.williams@techsolutions.com', '555-0103'),
    (4, 2, 'Emily', 'Davis', 'emily.davis@digitalinnovators.com', '555-0201'),
    (5, 2, 'Robert', 'Brown', 'robert.brown@digitalinnovators.com', '555-0202'),
    (6, 3, 'Linda', 'Martinez', 'linda.martinez@globalsystems.com', '555-0301'),
    (7, 3, 'David', 'Garcia', 'david.garcia@globalsystems.com', '555-0302'),
    (8, 4, 'Jessica', 'Wilson', 'jessica.wilson@smarttech.com', '555-0401'),
    (9, 5, 'James', 'Anderson', 'james.anderson@futureworks.com', '555-0501'),
    (10, 5, 'Maria', 'Taylor', 'maria.taylor@futureworks.com', '555-0502');

INSERT INTO Devices VALUES 
    (1, 1, 'Laptop-001', 'Laptop', 'SN123456', '2024-01-15'),
    (2, 1, 'Desktop-001', 'Desktop', 'SN123457', '2024-02-20'),
    (3, 1, 'Tablet-001', 'Tablet', 'SN123458', '2024-03-10'),
    (4, 2, 'Laptop-002', 'Laptop', 'SN223456', '2024-01-25'),
    (5, 2, 'Server-001', 'Server', 'SN223457', '2024-02-15'),
    (6, 3, 'Desktop-002', 'Desktop', 'SN323456', '2024-03-05'),
    (7, 3, 'Printer-001', 'Printer', 'SN323457', '2024-04-12'),
    (8, 4, 'Laptop-003', 'Laptop', 'SN423456', '2024-02-28'),
    (9, 5, 'Desktop-003', 'Desktop', 'SN523456', '2024-03-20'),
    (10, 5, 'Tablet-002', 'Tablet', 'SN523457', '2024-04-05');

INSERT INTO Applications VALUES 
    (1, 1, 'Microsoft Office', '2024', 'XXXXX-XXXXX-11111', '2024-01-20'),
    (2, 1, 'Adobe Creative Suite', '2024', 'YYYYY-YYYYY-11111', '2024-02-15'),
    (3, 1, 'Salesforce CRM', '8.0', 'ZZZZZ-ZZZZZ-11111', '2024-03-01'),
    (4, 2, 'Microsoft Office', '2024', 'XXXXX-XXXXX-22222', '2024-01-28'),
    (5, 2, 'AutoCAD', '2024', 'AAAAA-AAAAA-22222', '2024-02-18'),
    (6, 3, 'SAP ERP', '9.0', 'BBBBB-BBBBB-33333', '2024-03-08'),
    (7, 3, 'Oracle Database', '19c', 'CCCCC-CCCCC-33333', '2024-04-15'),
    (8, 4, 'Adobe Creative Suite', '2024', 'YYYYY-YYYYY-44444', '2024-03-01'),
    (9, 5, 'Salesforce CRM', '8.0', 'ZZZZZ-ZZZZZ-55555', '2024-03-25'),
    (10, 5, 'Microsoft Office', '2024', 'XXXXX-XXXXX-55555', '2024-04-10');

INSERT INTO Marketing VALUES 
    (1, 1, 'Digital Marketing', 'Social Media Campaigns', 50000.00),
    (2, 2, 'Content Marketing', 'Email Campaigns', 30000.00),
    (3, 4, 'Digital Marketing', 'SEO and PPC', 75000.00),
    (4, 6, 'Brand Marketing', 'Traditional Media', 100000.00),
    (5, 8, 'Performance Marketing', 'Affiliate Programs', 45000.00);

INSERT INTO Personal VALUES 
    (1, 3, 'mike.personal@email.com', '1990-05-15', '456 Personal Ave, Brooklyn', 'Jane Williams 555-0200'),
    (2, 5, 'robert.personal@email.com', '1988-08-22', '789 Home Street, Los Angeles', 'Mary Brown 555-0300'),
    (3, 7, 'david.personal@email.com', '1992-11-30', '321 Residence Blvd, Houston', 'Lisa Garcia 555-0400'),
    (4, 9, 'james.personal@email.com', '1985-03-12', '654 Living Road, Seattle', 'Susan Anderson 555-0500'),
    (5, 10, 'maria.personal@email.com', '1993-07-25', '987 Family Lane, Portland', 'Carlos Taylor 555-0600');

-- Insert new data in the tables
INSERT INTO Company (CompanyID, CompanyName, Address, PhoneNumber, Email)
VALUES (6, 'New Ventures Inc', '111 Startup Street, Boston', '5550600', 'info@newventures.com');

INSERT INTO Company (CompanyID, CompanyName, Address, PhoneNumber, Email)
VALUES 
    (7, 'Tech Pioneers LLC', '222 Pioneer Road, Seattle', '5550700', 'contact@techpioneers.com'),
    (8, 'Innovation Hub Corp', '333 Hub Avenue, Austin', '5550800', 'hello@innovationhub.com');

INSERT INTO Company (CompanyID, CompanyName)
VALUES (9, 'Minimal Corp');

INSERT INTO Company (CompanyID, CompanyName, Address, PhoneNumber, Email)
VALUES (10, 'Complete Solutions Ltd', '444 Complete Blvd, Denver', '5550900', 'info@completesolutions.com');


-- Display the table
SELECT * FROM Company;
SELECT * FROM Users;
Select * FROM Marketing;
SELECT * FROM Personal;
SELECT * FROM Applications;
SELECT * FROM Devices;