INSERT INTO departments (name) VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO roles (title, salary, department_id) 
VALUES ('Sales Lead', 100000, 1), 
        ('Lead Engineer', 150000, 2), 
        ('Accountant', 125000, 3), 
        ('Legal Team Lead', 250000, 4), 
        ('Lawyer', 190000, 4), 
        ('Software Engineer', 120000, 2), 
        ('Salesperson', 80000, 1), 
        ('Junior Accountant', 70000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager) 
VALUES ('John', 'Doe', 1, NULL), 
        ('Tom', 'Scott', 2, 1), 
        ('Jane', 'Doe', 3, NULL), 
        ('Larry', 'Smith', 4, 3), 
        ('Sally', 'Jones', 5, 3), 
        ('Bob', 'Smith', 6, 2), 
        ('Joe', 'Johnson', 7, 1), 
        ('Jill', 'Robinson', 8, 1);