class MysqlQueries {
    constructor() {
        this.showDepartments = 'SELECT * FROM departments';
        this.showRoles = `SELECT title AS 'Job Title', roles.id AS 'Role Id', name AS 'Department', salary AS Salary FROM roles JOIN departments ON roles.department_id = departments.id`;
        this.showEmployees =
            `SELECT CONCAT(emp.last_name, ' ', emp.first_name) AS 'Name', 
                emp.id AS 'Employee Id', title AS 'Job Title', name AS 'Department', 
                salary AS 'Salary', CONCAT(man.first_name, ' ', man.last_name) AS 'Manager' 
            FROM employees emp 
            LEFT JOIN employees man ON emp.manager = man.id 
            JOIN roles ON emp.role_id = roles.id 
            JOIN departments ON roles.department_id = departments.id 
            ORDER BY emp.last_name`;
    }
}

module.exports = MysqlQueries;