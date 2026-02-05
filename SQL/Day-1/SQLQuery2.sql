CREATE DATABASE EmployeeManagement;

USE EmployeeManagement;

CREATE TABLE departments (
    department_id INT PRIMARY KEY IDENTITY(1, 1),
    department_name VARCHAR(50) NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    budget DECIMAL(12, 2) CHECK (budget > 0),
    created_date DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY IDENTITY(1, 1),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    hire_date DATE NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL CHECK (salary >= 20000),
    department_id INT,
    CONSTRAINT fk_department FOREIGN KEY (department_id) 
        REFERENCES departments(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE projects (
    project_id INT PRIMARY KEY IDENTITY(1, 1),
    project_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(12, 2) CHECK (budget > 0),
    status VARCHAR(20) DEFAULT 'Planning',
    CONSTRAINT fk_project_dept FOREIGN KEY (department_id) 
        REFERENCES departments(department_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- ALTER TABLE projects ALTER COLUMN end_date DATE NOT NULL

-- Insert Operations
INSERT INTO departments (department_name, location, budget) VALUES
('Human Resources', 'Building A - Floor 2', 500000.00),
('Engineering', 'Building B - Floor 3', 2000000.00),
('Marketing', 'Building A - Floor 1', 750000.00),
('Sales', 'Building C - Floor 1', 1200000.00),
('Finance', 'Building A - Floor 3', 600000.00);

INSERT INTO employees VALUES
('John', 'Smith', 'john.smith@company.com', '555-0101', '2023-01-15', 'HR Manager', 75000.00, 1),
('Sarah', 'Johnson', 'sarah.j@company.com', '555-0102', '2023-02-20', 'Senior Developer', 95000.00, 2),
('Michael', 'Williams', 'michael.w@company.com', '555-0103', '2023-03-10', 'Marketing Specialist', 65000.00, 3),
('Emily', 'Brown', 'emily.b@company.com', '555-0104', '2023-04-05', 'Sales Executive', 70000.00, 4),
('David', 'Jones', 'david.j@company.com', '555-0105', '2023-05-12', 'Accountant', 68000.00, 5),
('Anna', 'Thomas', 'anna.t@company.com', '555-0112', '2024-02-15', 'Financial Analyst', 71000.00, 5);

INSERT INTO projects (project_name, department_id, start_date, end_date, budget, status) VALUES
('Website Redesign', 2, '2024-01-01', '2024-06-30', 250000.00, 'In Progress'),
('Marketing Campaign Q1', 3, '2024-01-15', '2024-03-31', 150000.00, 'Completed'),
('CRM Implementation', 4, '2024-02-01', NULL, 400000.00, 'Planning'),
('Payroll System Upgrade', 5, '2023-11-01', '2024-02-28', 180000.00, 'In Progress'),
('Mobile App Development', 2, '2024-03-01', '2024-12-31', 500000.00, 'In Progress'),
('Employee Wellness Program', 1, '2024-01-01', '2024-12-31', 100000.00, 'In Progress');


-- Read Queries
SELECT * FROM employees;

-- Reading first name, last name, email and job title of the employees
SELECT first_name, last_name, email, job_title FROM employees;

-- Display details for dept_id '2'
SELECT first_name, last_name, job_title, salary 
FROM employees 
WHERE department_id = 2;

-- Display details if salary > 70000
SELECT first_name, last_name, salary, job_title
FROM employees
WHERE salary > 70000;

-- Display details if hire year is 2023
SELECT first_name, last_name, hire_date, job_title
FROM employees
WHERE hire_date BETWEEN '2023-01-01' AND '2023-12-31';

-- If dept-id in (2, 3, 4)
SELECT first_name, last_name, department_id, job_title
FROM employees
WHERE department_id IN (2, 3, 4);

-- If name starts from 'J'
SELECT first_name, last_name, email
FROM employees
WHERE first_name LIKE 'J%';

-- If Job title has 'Manager' in it
SELECT first_name, last_name, job_title, salary
FROM employees
WHERE salary > 80000 AND job_title LIKE '%Manager%';

-- If dept_id is 1 or 5
SELECT first_name, last_name, job_title, department_id
FROM employees
WHERE department_id = 1 OR department_id = 5;

-- Display details if dept-id is not 4
SELECT first_name, last_name, job_title
FROM employees
WHERE department_id != 4;

-- Descending order of salary
SELECT first_name, last_name, salary, job_title
FROM employees
ORDER BY salary DESC;

-- Order by dept_id in ascending order first and if multiple data for same dept_id, then display in Descending order
SELECT first_name, last_name, department_id, salary
FROM employees
ORDER BY department_id ASC, salary DESC;

-- Display unique job titles
SELECT DISTINCT job_title FROM employees;

-- Unique dept-id
SELECT DISTINCT department_id FROM employees;

SELECT COUNT(*) AS total_employees FROM employees;

SELECT SUM(salary) AS total_salary_cost FROM employees;

SELECT AVG(salary) AS average_salary FROM employees;

SELECT 
    MIN(salary) AS lowest_salary, 
    MAX(salary) AS highest_salary 
FROM employees;

SELECT department_id, COUNT(*) AS employee_count
FROM employees
GROUP BY department_id;

SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
ORDER BY avg_salary DESC;

SELECT department_id, SUM(salary) AS total_dept_salary
FROM employees
GROUP BY department_id;

SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 70000;

SELECT job_title, COUNT(*) AS count
FROM employees
GROUP BY job_title
ORDER BY count DESC;

SELECT
    department_id,
    COUNT(*) AS total_employees,
    AVG(salary) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM employees
GROUP BY department_id
ORDER BY total_employees DESC;

SELECT status, COUNT(*) AS project_count
FROM projects
GROUP BY status;

-- Update Queries
UPDATE employees
SET salary = 98000.00
WHERE employee_id = 2;

UPDATE departments
SET location = 'Building B - Floor 1'
WHERE department_id = 3;

UPDATE employees
SET salary = salary * 1.05
WHERE department_id = 2;

UPDATE projects
SET status = 'Completed', end_date = '2024-02-28'
WHERE project_id = 4;

UPDATE employees
SET job_title = 'Senior HR Manager'
WHERE employee_id = 1;

-- Delete Queries
INSERT INTO projects (project_name, department_id, start_date, budget, status)
VALUES ('Test Project', 3, '2024-01-01', 50000.00, 'Cancelled');

SELECT * FROM projects;

DELETE FROM projects;

SELECT * FROM projects;

-- WHERE AND GROUPING Queries
SELECT first_name, last_name, email
FROM employees
WHERE email LIKE '%@company.com';

SELECT first_name, last_name, salary
FROM employees
WHERE salary BETWEEN 60000 AND 80000
ORDER BY salary;

SELECT department_id, COUNT(*) AS project_count
FROM projects
GROUP BY department_id;

SELECT department_name, budget, location
FROM departments
WHERE budget > 500000
ORDER BY budget DESC;