USE taskDB;

/*
Spreadsheet:
	Student ID
	Name
	Age
	Gender
	Address
	Email
	Phone Number

	Course ID
	Course Name
	Credit Hours
	Instructor

	Grade


   Entities: Students, Courses, Instructors,Enrollments

   Attributes:
	1. Student: StudentID, Name, Age, Gender, Address, Email, Phone Number
	2. Courses: CourseID, Course Name, Credit Hours
	3. Instructor: Instructor
	4. Enrollment: Grade
*/

-- FIRST NORMAL FORM (1NF)
    -- 1NF requires: atomic values, unique column names, unique rows, no repeating groups
    -- This table has all data in a single denormalized structure with composite primary key (Student_ID, Course_ID)
    -- Issues: massive data redundancy, student info repeats for each course, course info repeats for each student
CREATE TABLE Student_Course_Data_1NF (
    Student_ID VARCHAR(20),                    -- Part of composite primary key
    Name VARCHAR(100),                         -- Student name - repeats for each course enrollment
    Age INT,                                   -- Student age - repeats for each course enrollment
    Gender VARCHAR(10),                        -- Student gender - repeats for each course enrollment
    Address VARCHAR(255),                      -- Student address - repeats for each course enrollment
    Email VARCHAR(100),                        -- Student email - repeats for each course enrollment
    Phone_Number VARCHAR(20),                  -- Student phone - repeats for each course enrollment
    Course_ID VARCHAR(20),                     -- Part of composite primary key
    Course_Name VARCHAR(150),                  -- Course name - repeats for each student
    Instructor VARCHAR(100),                   -- Instructor name - repeats for each student
    Credit_Hours INT,                          -- Credit hours - repeats for each student
    Grade VARCHAR(2),                          -- Grade - only attribute truly dependent on both keys
    PRIMARY KEY (Student_ID, Course_ID)       -- Composite primary key ensures unique student-course combination
);

-- SECOND NORMAL FORM (2NF)
    -- 2NF requires: must be in 1NF, no partial dependencies (all non-key attributes must depend on entire primary key)
    -- Solution: separate tables for attributes dependent on only part of the composite key

-- Students table contains attributes dependent only on Student_ID
CREATE TABLE Students_2NF (
    Student_ID VARCHAR(20) PRIMARY KEY,        -- Primary key - unique student identifier
    Name VARCHAR(100) NOT NULL,                -- Student full name (required)
    Age INT,                                   -- Student age (optional)
    Gender VARCHAR(10),                        -- Student gender (optional)
    Address VARCHAR(255),                      -- Student residential address (optional)
    Email VARCHAR(100),                        -- Student email address (optional)
    Phone_Number VARCHAR(20)                   -- Student contact number (optional)
);

-- Courses table contains attributes dependent only on Course_ID
CREATE TABLE Courses_2NF (
    Course_ID VARCHAR(20) PRIMARY KEY,         -- Primary key - unique course code
    Course_Name VARCHAR(150) NOT NULL,         -- Full course name (required)
    Instructor VARCHAR(100),                   -- Instructor name - still has transitive dependency (will fix in 3NF)
    Credit_Hours INT                           -- Number of credit hours
);

-- Enrollments table contains attributes dependent on both Student_ID AND Course_ID
CREATE TABLE Enrollments_2NF (
    Student_ID VARCHAR(20),                    -- Foreign key to Students_2NF
    Course_ID VARCHAR(20),                     -- Foreign key to Courses_2NF
    Grade VARCHAR(2),                          -- Letter grade - depends on both Student_ID and Course_ID
    PRIMARY KEY (Student_ID, Course_ID),       -- Composite primary key
    FOREIGN KEY (Student_ID) REFERENCES Students_2NF(Student_ID),  -- Links to Students table
    FOREIGN KEY (Course_ID) REFERENCES Courses_2NF(Course_ID)      -- Links to Courses table
);



-- THIRD NORMAL FORM (3NF)
    -- 3NF requires: must be in 2NF, no transitive dependencies (non-key attributes cannot depend on other non-key attributes)
    -- Solution: create separate Instructors table to eliminate transitive dependency from Courses table

-- Students table - no changes needed from 2NF, already satisfies 3NF
CREATE TABLE Students (
    Student_ID VARCHAR(20) PRIMARY KEY,                    -- Unique student identifier
    Name VARCHAR(100) NOT NULL,                            -- Student full name (required)
    Age INT CHECK (Age > 0 AND Age < 120),                 -- Student age with validation (1-119 years)
    Gender VARCHAR(10),                                    -- Student gender (optional)
    Address VARCHAR(255),                                  -- Full residential address (optional)
    Email VARCHAR(100) UNIQUE NOT NULL,                    -- Student email - must be unique and required
    Phone_Number VARCHAR(20),                              -- Contact phone number (optional)
    CONSTRAINT chk_student_email CHECK (Email LIKE '%@%')  -- Validates email contains @ symbol
);

-- Instructors table - eliminates transitive dependency (Course_ID -> Instructor -> Instructor_Details)
CREATE TABLE Instructors (
    Instructor_ID INT PRIMARY KEY AUTO_INCREMENT,          -- Auto-incrementing surrogate primary key
    Instructor_Name VARCHAR(100) NOT NULL,                 -- Full name of instructor (required)
    Email VARCHAR(100) UNIQUE,                             -- Instructor email - must be unique if provided
    Department VARCHAR(100),                               -- Academic department (optional)
    Phone_Number VARCHAR(20)                               -- Contact phone number (optional)
);

-- Courses table - now references Instructor_ID instead of storing instructor name directly
CREATE TABLE Courses (
    Course_ID VARCHAR(20) PRIMARY KEY,                     -- Unique course code
    Course_Name VARCHAR(150) NOT NULL,                     -- Full course name (required)
    Instructor_ID INT NOT NULL,                            -- Foreign key to Instructors table (required)
    Credit_Hours INT CHECK (Credit_Hours > 0 AND Credit_Hours <= 6),  -- Credit hours validation (1-6)
    CONSTRAINT fk_instructor FOREIGN KEY (Instructor_ID)   -- Links to Instructors table
        REFERENCES Instructors(Instructor_ID)
        ON UPDATE CASCADE                                  -- If Instructor_ID changes, update course references
        ON DELETE RESTRICT                                 -- Cannot delete instructor if teaching courses
);

-- Enrollments table - junction table linking Students to Courses with enrollment details
CREATE TABLE Enrollments (
    Enrollment_ID INT PRIMARY KEY AUTO_INCREMENT,          -- Auto-incrementing surrogate primary key
    Student_ID VARCHAR(20) NOT NULL,                       -- Foreign key to Students table (required)
    Course_ID VARCHAR(20) NOT NULL,                        -- Foreign key to Courses table (required)
    Grade VARCHAR(2),                                      -- Letter grade (NULL for in-progress courses)
    Enrollment_Date DATE DEFAULT (CURRENT_DATE),           -- Date student enrolled (defaults to today)
    Semester VARCHAR(20),                                  -- Academic semester (Fall, Spring, Summer)
    Year INT,                                              -- Academic year
    CONSTRAINT fk_student FOREIGN KEY (Student_ID)         -- Links to Students table
        REFERENCES Students(Student_ID)
        ON UPDATE CASCADE                                  -- If Student_ID changes, update enrollments
        ON DELETE CASCADE,                                 -- If student deleted, remove their enrollments
    CONSTRAINT fk_course FOREIGN KEY (Course_ID)           -- Links to Courses table
        REFERENCES Courses(Course_ID)
        ON UPDATE CASCADE                                  -- If Course_ID changes, update enrollments
        ON DELETE RESTRICT,                                -- Cannot delete course if students are enrolled
    CONSTRAINT unique_enrollment UNIQUE (Student_ID, Course_ID, Semester, Year),  -- Prevents duplicate enrollments
    CONSTRAINT chk_grade CHECK (Grade IN ('A', 'B', 'C', 'D', 'F', NULL))  -- Valid grade values only
);