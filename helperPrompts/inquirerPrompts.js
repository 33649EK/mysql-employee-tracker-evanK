class UserPrompts {
    constructor(roles, departments, employee) {
        this.initialPrompt = {
            type: 'list',
            name: 'initialPrompt',
            message: 'What would you like to do?',
            choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role']
        };
        this.addDepartment = {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department you would like to add?'
        };
        this.addRole = [
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role you would like to add?'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the role you would like to add?'
            },
            {
                type: 'list',
                name: 'roleDepartment',
                message: 'What department does this role belong to?',
                choices: departments
            }
        ];
        this.addEmployee = [
            {
                type: 'input',
                name: 'employeeFirstName',
                message: 'Employee first name:'
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'Employee last name:'
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'Employee role:',
                choices: roles
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: 'Employee manager:',
                choices: employee
            }
        ]

        this.updateEmployeeRole = [
            {
                type: 'input',
                name: 'employeeName',
                message: 'What is the name of the employee you would like to update?'
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'What is the new role of the employee?',
                choices: roles
            }
        ];
    }
};

module.exports = UserPrompts;