CREATE TABLE student (
    username VARCHAR(32),
    school VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    PRIMARY KEY (username, school)
);

CREATE TABLE course (
    username VARCHAR(32) NOT NULL,
    school VARCHAR(255) NOT NULL,
    course_sym VARCHAR(255),
    course_num INT,
    course_name VARCHAR(255) NOT NULL,
    grade FLOAT,
    FOREIGN KEY (username, school) REFERENCES student(username, school)
);

-- Tuples of (username, school, course_name) and (username, school, course_sym, course_num) are unique
ALTER TABLE course 
    ADD UNIQUE student_school_info (username, school, course_name);
ALTER TABLE course 
    ADD UNIQUE student_school_info_2 (username, school, course_sym, course_num);

-- Course grades must be within 0 and 100 inclusive
ALTER TABLE course
    ADD CONSTRAINT grade CHECK (grade BETWEEN 0 and 100);

-- Automatically capitalizes course symbols on inserts and updates
CREATE TRIGGER upper_insert
    BEFORE INSERT ON course
    FOR EACH ROW
        SET NEW.course_sym = UPPER(NEW.course_sym);

CREATE TRIGGER upper_update
    BEFORE UPDATE ON course
    FOR EACH ROW
        SET NEW.course_sym = UPPER(NEW.course_sym);

-- Course numbers must be non-negative
ALTER TABLE course
    ADD CONSTRAINT course_num CHECK (course_num >= 0);

-- Currently there is no checking for no special characters on attribute values