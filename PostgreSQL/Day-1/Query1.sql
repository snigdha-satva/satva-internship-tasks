-- TASK - 1: 
CREATE TABLE students (
	"Name" VARCHAR(255),
	"Marks" INT
);
DROP TABLE students;
-- Insert three student
INSERT INTO students ("Name", "Marks") VALUES('AAA', 50);
INSERT INTO students ("Name", "Marks") VALUES('BBB', 30);
INSERT INTO students ("Name", "Marks") VALUES('CCC', 40);

SELECT * FROM students;

-- Update marks for AAA
UPDATE students SET "Marks" = 80 WHERE "Name" = 'AAA';

-- Delete students for Marks < 40
DELETE FROM students WHERE "Marks" < 40;

-- Fetch remaining students
SELECT * FROM students;



-- TASK-2:
CREATE TABLE balance (
	"Name" VARCHAR(25),
	"Amount" DECIMAL(10, 2)
);

-- Insert Transactions
INSERT INTO balance VALUES
	('A', 10000),
	('B', 20000);


SELECT * FROM balance;

-- Perform Transaction
DO $$
	BEGIN
    -- Check sufficient funds
    IF EXISTS (SELECT 1 FROM balance WHERE "Name" = 'A' AND "Amount" >= 1000) THEN
        UPDATE balance SET "Amount" = "Amount" - 1000 WHERE "Name" = 'A';
        UPDATE balance SET "Amount" = "Amount" + 1000 WHERE "Name" = 'B';
        COMMIT;
    --ELSE
        --ROLLBACK;
    END IF;
END $$;

UPDATE balance SET "Amount" = 1000 WHERE "Name" = 'A';

SELECT * FROM balance;


-- TABLE FOR TASKS 3, 4, 5
CREATE TABLE employees (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(20),
	"department" VARCHAR(50),
	"salary" DECIMAL(10, 2)
);

INSERT INTO employees("name", "department", "salary") VALUES
	('Alice', 'HR', 50000),
	('Bob', 'IT', 70000),
	('Charlie', 'IT', 60000),
	('Diana', 'HR', 55000),
	('Ethan', 'Sales', 45000);

SELECT * FROM employees;

-- TASK: 3 Return employees having above average salary
SELECT * FROM employees WHERE "salary" >(SELECT AVG("salary") FROM employees); -- Avg = 56000

-- TASK-4: Return count of employees in each department
SELECT "department", COUNT(*) AS employee_count FROM employees GROUP BY "department"
	ORDER BY "department" ASC;

-- TASK-5: Return Rank according to salary
SELECT 
	"name",
	"salary",
	RANK() OVER (ORDER BY "salary" DESC) AS salary_rank
	FROM employees
	ORDER BY salary_rank DESC
	LIMIT 3; 



