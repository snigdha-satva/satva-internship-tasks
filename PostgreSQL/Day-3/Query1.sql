-- CREATING SCHEMA FOR THE DATABASE

CREATE TABLE company (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT Current_TIMESTAMP
);

CREATE TABLE department (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	company_id UUID REFERENCES company(id) ON DELETE CASCADE,
	name VARCHAR(100) NOT NULL,
	budget NUMERIC(12, 2) NOT NULL
);

CREATE TABLE employee (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	company_id UUID REFERENCES company(id) ON DELETE CASCADE,
	department_id UUID REFERENCES department(id) ON DELETE SET NULL,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	salary NUMERIC(10, 2),
	joining_date DATE,
	is_active BOOLEAN DEFAULT TRUE
);


-- INSERT DATA INTO TABLES

INSERT INTO company (name)
VALUES 
('TechNova'),
('FinSphere');

/*
INSERT INTO department (company_id, name, budget)
VALUES
-- TechNova Departments
((SELECT id FROM company WHERE name = 'TechNova'), 'Engineering', 1000000),
((SELECT id FROM company WHERE name = 'TechNova'), 'HR', 250000),
((SELECT id FROM company WHERE name = 'TechNova'), 'Marketing', 400000),

-- FinSphere Departments
((SELECT id FROM company WHERE name = 'FinSphere'), 'Engineering', 900000),
((SELECT id FROM company WHERE name = 'FinSphere'), 'Finance', 600000),
((SELECT id FROM company WHERE name = 'FinSphere'), 'Operations', 500000);


INSERT INTO employee
(company_id, department_id, first_name, last_name, salary, joining_date, is_active)
VALUES
-- TechNova - Engineering
((SELECT id FROM company WHERE name='TechNova'),
 (SELECT id FROM department WHERE name='Engineering' 
    AND company_id = (SELECT id FROM company WHERE name='TechNova')),
 'Alice','Sharma',85000,'2021-01-15',TRUE),
((SELECT id FROM company WHERE name='TechNova'),
 (SELECT id FROM department WHERE name='Engineering' 
    AND company_id = (SELECT id FROM company WHERE name='TechNova')),
 'Bob','Verma',92000,'2020-03-10',TRUE),
((SELECT id FROM company WHERE name='TechNova'),
 (SELECT id FROM department WHERE name='Engineering' 
    AND company_id = (SELECT id FROM company WHERE name='TechNova')),
 'Hina','Das',78000,'2022-07-01',TRUE),

-- TechNova - HR
((SELECT id FROM company WHERE name='TechNova'),
 (SELECT id FROM department WHERE name='HR' 
    AND company_id = (SELECT id FROM company WHERE name='TechNova')),
 'Charlie','Rao',52000,'2023-02-20',TRUE),
((SELECT id FROM company WHERE name='TechNova'),
 (SELECT id FROM department WHERE name='HR' 
    AND company_id = (SELECT id FROM company WHERE name='TechNova')),
 'Jaya','Nair',54000,'2024-01-01',TRUE),

-- TechNova - Marketing
((SELECT id FROM company WHERE name='TechNova'),
 (SELECT id FROM department WHERE name='Marketing' 
    AND company_id = (SELECT id FROM company WHERE name='TechNova')),
 'Diana','Kapoor',60000,'2019-11-11',FALSE),

-- FinSphere - Engineering
((SELECT id FROM company WHERE name='FinSphere'),
 (SELECT id FROM department WHERE name='Engineering' 
    AND company_id = (SELECT id FROM company WHERE name='FinSphere')),
 'Ethan','Mehta',88000,'2021-09-09',TRUE),
((SELECT id FROM company WHERE name='FinSphere'),
 (SELECT id FROM department WHERE name='Engineering' 
    AND company_id = (SELECT id FROM company WHERE name='FinSphere')),
 'Rohit','Bansal',91000,'2022-05-05',TRUE),

-- FinSphere - Finance
((SELECT id FROM company WHERE name='FinSphere'),
 (SELECT id FROM department WHERE name='Finance' 
    AND company_id = (SELECT id FROM company WHERE name='FinSphere')),
 'Fiona','Iyer',98000,'2018-04-04',TRUE),
((SELECT id FROM company WHERE name='FinSphere'),
 (SELECT id FROM department WHERE name='Finance' 
    AND company_id = (SELECT id FROM company WHERE name='FinSphere')),
 'Ishaan','Roy',67000,'2020-10-10',FALSE),

-- FinSphere - Operations
((SELECT id FROM company WHERE name='FinSphere'),
 (SELECT id FROM department WHERE name='Operations' 
    AND company_id = (SELECT id FROM company WHERE name='FinSphere')),
 'Gaurav','Singh',72000,'2023-03-03',TRUE),
((SELECT id FROM company WHERE name='FinSphere'),
 (SELECT id FROM department WHERE name='Operations' 
    AND company_id = (SELECT id FROM company WHERE name='FinSphere')),
 'Neha','Kulkarni',75000,'2022-08-08',TRUE);
*/

-- Insert values in department table using CTE
INSERT INTO department (company_id, name, budget)
SELECT c.id, d.name, d.budget
FROM company c
JOIN (
	VALUES
	('TechNova', 'Engineering', 1000000),
	('TechNova', 'HR', 250000),
	('TechNova', 'Marketing', 400000),
	('FinSphere', 'Engineering', 900000),
	('FinSphere', 'Finance', 600000),
	('FinSphere', 'Operations', 500000)
) AS d(company_name, name, budget)
ON c.name = d.company_name;

-- Insert values into employee table
INSERT INTO employee
(company_id, department_id, first_name, last_name, salary, joining_date, is_active)
SELECT 
    c.id,
    d.id,
    e.first_name,
    e.last_name,
    e.salary,
    e.joining_date,
    e.is_active
FROM (
    VALUES
    ('TechNova', 'Engineering', 'Alice', 'Sharma', 85000, DATE '2021-01-15', TRUE),
    ('TechNova', 'Engineering', 'Bob', 'Verma', 92000, DATE '2020-03-10', TRUE),
    ('TechNova', 'HR', 'Charlie', 'Rao', 52000, DATE '2023-02-20', TRUE),
    ('TechNova', 'Engineering', 'Hina', 'Das', 78000, DATE '2022-07-01', TRUE),
    ('TechNova', 'HR', 'Jaya', 'Nair', 54000, DATE '2024-01-01', TRUE),
    ('TechNova', 'Marketing', 'Diana', 'Kapoor', 60000, DATE '2019-11-11', FALSE),
    ('FinSphere', 'Engineering', 'Ethan', 'Mehta', 88000, DATE '2021-09-09', TRUE),
    ('FinSphere', 'Engineering', 'Rohit', 'Bansal', 91000, DATE '2022-05-05', TRUE),
    ('FinSphere', 'Finance', 'Fiona', 'Iyer', 98000, DATE '2018-04-04', TRUE),
    ('FinSphere', 'Finance', 'Ishaan', 'Roy', 67000, DATE '2020-10-10', FALSE),
    ('FinSphere', 'Operations', 'Gaurav', 'Singh', 72000, DATE '2023-03-03', TRUE),
    ('FinSphere', 'Operations', 'Neha', 'Kulkarni', 75000, DATE '2022-08-08', TRUE)
) AS e(company_name, department_name, first_name, last_name, salary, joining_date, is_active)
JOIN company c ON c.name = e.company_name
JOIN department d ON d.name = e.department_name AND d.company_id = c.id;


 -- DISPLAY THE TABLES
 SELECT * FROM company;
 SELECT * FROM department;
 SELECT * FROM employee;


/*
Task-1: Department Salary Summary Function
Requirements: 
Create a PostgreSQL function that: 
	- Accepts department_id as input parameter. 
	- Returns total number of active employees in that department. 
	- Returns total salary of active employees. 
	- Returns average salary of active employees. 
	- If no employees exist, totals should return 0 instead of NULL. */

CREATE OR REPLACE FUNCTION department_salary_summary (dept_id UUID)
RETURNS TABLE (active_employees BIGINT, 
		active_total_salary NUMERIC(10, 2), 
		active_average_salary NUMERIC(10, 2)) AS $$
	BEGIN
		RETURN QUERY
			SELECT 
				COALESCE(COUNT(*), 0),
				ROUND(COALESCE(SUM(salary), 0), 2),
				ROUND(COALESCE(AVG(salary), 0), 2)
			FROM employee
			WHERE department_id = dept_id
			AND is_active = TRUE;
	END
$$ LANGUAGE plpgsql;

-- Active: 1, Total: 2
SELECT * FROM department_salary_summary('8fb6a988-b1af-48c0-a267-54f3fe764ba3');
-- Active: 0, Total: 1
SELECT * FROM department_salary_summary('df08f650-7fac-416a-9d00-969b44d29a61');




/*
Task 2: Employee Transfer Procedure 
Requirements: 
Create a PostgreSQL stored procedure that: 
	- Accepts employee_id and new_department_id as input parameters. 
	- Validates that both employee and department exist. 
	- Ensures the new department belongs to the same company as the employee. 
	- Transfers the employee to the new department. 
	- Raises an exception if validation fails. */

CREATE OR REPLACE PROCEDURE sp_employee_transfer(
	emp_id UUID,
	new_department_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
	employee_id_check UUID;
	new_department_check UUID;
BEGIN
	SELECT id INTO employee_id_check
		FROM employee WHERE id = emp_id;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Employee Not Found!';
	END IF;
	
	SELECT id INTO new_department_check
		FROM department WHERE id = new_department_id;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Department Not Found!';
	END IF;
	
	IF NOT EXISTS (SELECT *
			FROM employee e JOIN department d
			ON e.company_id = d.company_id
			WHERE e.id = employee_id_check AND d.id = new_department_check) THEN
		RAISE EXCEPTION 'New Department does not belong to same company!';
	END IF;
	
	UPDATE employee
	SET department_id = new_department_id
	WHERE id = emp_id;
END;
$$;


-- Normal Execution
CALL sp_employee_transfer('baa1cf02-f15c-45ac-95fa-c2cb864d7e2d', '47b1b7c8-7d9d-45aa-aaa6-9bc9a1489b9b');
SELECT * FROM employee WHERE id = 'baa1cf02-f15c-45ac-95fa-c2cb864d7e2d';
-- Wrong Employee-id
CALL sp_employee_transfer('a0ce9805-714d-4d31-988c-1b05fc7f72aa', 'edf048bc-838a-4d4c-b445-aec8017864c8');
-- Wrong Department-id
CALL sp_employee_transfer('baa1cf02-f15c-45ac-95fa-c2cb864d7e2d', '4ec91f0e-5e4c-4b61-a63e-a9e3da94317a');
-- Different companies
CALL sp_employee_transfer('baa1cf02-f15c-45ac-95fa-c2cb864d7e2d', 'ba3ec436-aaf9-41e6-97a4-33098989bfaf');


/*
Task 3: Increase Salary by Employee Function 
Requirement: 
Create a PostgreSQL function that: 
	- Accepts employee_id and percentage as input parameters. 
	- Increases the salary of the specified employee by the given percentage. 
	- Only allows update if employee is active. 
	- Prevents negative  or zero percentage values. 
	- Returns the updated salary. 
	- Raises an exception if employee does not exist or is inactive. */
 
CREATE OR REPLACE FUNCTION increase_salary_by_employee (
	employee_id UUID,
	percentage NUMERIC(10, 2)
) 
RETURNS NUMERIC(10, 2) 
AS $$
	DECLARE
		employee_salary NUMERIC(10, 2);
	BEGIN
		IF EXISTS (SELECT 1 FROM employee WHERE id = employee_id AND is_active = FALSE) THEN
			RAISE EXCEPTION 'Employee is Inactive!';
		END IF;
		
		IF NOT EXISTS (SELECT 1 FROM employee WHERE id = employee_id) THEN
			RAISE EXCEPTION 'Employee does not exist!';
		END IF;
		
		IF percentage <= 0 THEN
			RAISE NOTICE 'No change since percentage cannot be less than or equal to zero!';
			RETURN (SELECT salary FROM employee WHERE id = employee_id);
		END IF;
		
		UPDATE employee
		SET salary = salary + (percentage / 100) * salary
		WHERE id = employee_id
		RETURNING salary INTO employee_salary;

		RETURN employee_salary;
	END;
$$ LANGUAGE plpgsql;

-- Normal Execution
SELECT 
	salary AS Original_Salary, 
	increase_salary_by_employee(id, 5) AS Updated_Salary
	FROM employee
	WHERE id = 'eb1a7558-97e2-4580-bea7-0e1e10c8bcca';

-- Employee doesn't exist
SELECT * FROM increase_salary_by_employee('a0ce9805-714d-4d31-988c-1b65fc7f79aa', 5) AS Updated_Salary;

-- Inactive Employee
SELECT * FROM increase_salary_by_employee('baa1cf02-f15c-45ac-95fa-c2cb864d7e2d', 5) AS Updated_Salary;

-- Negative percentage
SELECT 
	salary AS Original_Salary, 
	increase_salary_by_employee(id, -5) AS Updated_Salary
	FROM employee
	WHERE id = 'eb1a7558-97e2-4580-bea7-0e1e10c8bcca';

-- Zero percentage
SELECT 
	salary AS Original_Salary, 
	increase_salary_by_employee(id, 0) AS Updated_Salary
	FROM employee
	WHERE id = 'eb1a7558-97e2-4580-bea7-0e1e10c8bcca';











-- Self task: Highest salary of employees in a company, take company name as the i/p parameter
CREATE OR REPLACE FUNCTION highest_salary_employee (company_name VARCHAR(100))
RETURNS TABLE (
	highest_salary NUMERIC(100)
)
AS $$
BEGIN
	RETURN QUERY
	SELECT MAX(e.salary) FROM employee e
		JOIN company c
		ON e.company_id = c.id
		WHERE c.name = company_name;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM highest_salary_employee('FinSphere');


/*
Self-Task: Department Budget Enforcement Function
Requirements:
Create a function that:
- Accepts department_id and new_salary.
- Calculates the total salary of active employees in that department.
- Ensures that increasing an employee’s salary does NOT exceed department budget.
- If budget would be exceeded → raise exception.
- If valid → return remaining budget after change.
*/

CREATE OR REPLACE FUNCTION department_budget_enforcement(
	d_id UUID,
	percentage NUMERIC(10, 2)
)
RETURNS NUMERIC(10, 2) AS $$
DECLARE
	initial_budget NUMERIC(10, 2);
	updated_salary NUMERIC(10, 2);
BEGIN
	IF percentage <= 0 THEN
		RAISE EXCEPTION 'No change since percentage cannot be less than or qual to zero!';
	END IF;
	
	UPDATE employee SET salary = salary + salary * (percentage / 100) WHERE department_id = d_id AND is_active = TRUE;
	SELECT COALESCE(SUM(salary), 0) INTO updated_salary FROM employee WHERE department_id = d_id;
	SELECT budget INTO initial_budget FROM department WHERE id = d_id;

	IF updated_salary > initial_budget THEN
		RAISE EXCEPTION 'Department Budget Exceeded';
	ELSE
		RETURN ROUND(initial_budget - updated_salary, 2);
	END IF;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM department_budget_enforcement('75c582ac-9335-4238-8f43-401fdd3d2880', 1);
SELECT SUM(salary) FROM employee WHERE department_id = '75c582ac-9335-4238-8f43-401fdd3d2880' AND is_active = TRUE;
SELECT * FROM department;
