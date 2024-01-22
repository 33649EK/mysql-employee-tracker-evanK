const inquirer = require('inquirer')
const mysql = require('mysql2')
const UserPrompts = require('./classes/inquirerPrompts')
const userPrompts = new UserPrompts()
const MysqlQueries = require('./classes/queries')
const query = new MysqlQueries()


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roster_db'
});

connection.connect(err => {
    if (err) throw err;
});

checkTable = (table) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, results) => {
            if (err) reject(err);
            switch (table) {
                case 'departments':
                    let departmentArray = results.map(({ name }) => name);
                    resolve(departmentArray);
                    break;
                case 'roles':
                    let roleArray = results.map(({ title }) => title);
                    resolve(roleArray);
                    break;
                case 'employees':
                    let employeeArray = results.map(({ first_name, last_name }) => first_name + ' ' + last_name);
                    resolve(employeeArray);
                    break;
            }
        })
    })
}

async function startPrompt() {

    let departments = await checkTable('departments')
    let roles = await checkTable('roles')
    let employee = await checkTable('employees')

    // console.log(departments, roles, employee)


    inquirer.prompt(userPrompts.initialPrompt)
        .then((answer) => {
            // console.log(answers)

            // switch statement to handle the different choices
            switch (answer.initialPrompt) {

                case 'View all departments':
                    connection.query(query.showDepartments, (err, results) => {
                        if (err) throw err;
                        console.table(results)
                        startPrompt()
                    })
                    break;

                case 'View all roles':
                    connection.query(query.showRoles, (err, results) => {
                        if (err) throw err;
                        console.table(results)
                        startPrompt()
                    })
                    break;

                case 'View all employees':
                    connection.query(query.showEmployees, (err, results) => {
                        if (err) throw err;
                        console.table(results)
                        startPrompt()
                    })
                    break;

                case 'Add a department':
                    inquirer.prompt(userPrompts.addDepartment)
                        .then((answers) => {
                            // console.log(answers)
                            connection.query(
                                'INSERT INTO departments SET ?',
                                {
                                    name: answers.departmentName
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res.affectedRows + ' department inserted!\n');
                                }
                            );
                            startPrompt()
                        })
                    break;

                case 'Add a role':
                    // console.log('Add a role')
                    let rolePrompt = new UserPrompts('', departments, '')
                    inquirer.prompt(rolePrompt.addRole)
                        .then((answers) => {
                            // console.log(answers)
                            insertRole(answers)
                        })
                    break;

                case 'Add an employee':
                    let employeePrompt = new UserPrompts(roles, '', ['N/A', ...employee])
                    inquirer.prompt(employeePrompt.addEmployee)
                        .then((answers) => {
                            // console.log(answers)
                            insertEmployee(answers);
                        })
                    break;

                case 'Update an employee role':
                    // console.log('Update employee role')
                    let updatePrompt = new UserPrompts(roles, '', '')
                    inquirer.prompt(updatePrompt.updateEmployeeRole)
                        .then((answers) => {
                            // console.log(answers)
                            updateEmployeeRole(answers)
                        })
                    break;
            }
        });
}

// Starts the application
startPrompt()


async function insertRole(answers) {

    let departmentId = await getDepartmentId(answers.roleDepartment)

    connection.query(
        'INSERT INTO roles SET ?',
        {
            title: answers.roleName,
            salary: answers.roleSalary,
            department_id: departmentId
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' role inserted!\n');
        }
    );
    startPrompt()
}

function getDepartmentId(departmentName) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM departments', (err, results) => {
            if (err) reject(err);
            // Sort through (results) to find correct department id
            for (let i = 0; i < results.length; i++) {
                if (results[i].name === departmentName) {
                    resolve(results[i].id)
                }
            }
        })
    })
}

function getRoleId(roleName) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM roles', (err, results) => {
            if (err) reject(err);
            for (let i = 0; i < results.length; i++) {
                if (results[i].title === roleName) {
                    resolve(results[i].id)
                }
            }
        })
    })
}

async function insertEmployee(answers) {

    let roleId = await getRoleId(answers.employeeRole)
    let managerId = await getEmployeeId(answers.employeeManager)

    connection.query(
        'INSERT INTO employees SET ?',
        {
            first_name: answers.employeeFirstName,
            last_name: answers.employeeLastName,
            role_id: roleId,
            manager: managerId
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' employee inserted!\n');
        }
    );
    startPrompt()
}

function getEmployeeId(employeeName) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employees', (err, results) => {
            if (err) reject(err);
            // Creates a flag to check if the employee id is found
            let idFound = false;
            for (let i = 0; i < results.length; i++) {
                if (results[i].first_name + ' ' + results[i].last_name === employeeName) {
                    resolve(results[i].id)
                    idFound = true;
                    break;
                }
            }
            // If the user chooses 'N/A' for manager, then the manager id is set to null
            if (!idFound) {
                resolve(null)
            }
        })
    })
}


async function updateEmployeeRole(answers) {

    let roleId = await getRoleId(answers.employeeRole)
    let employeeId = await getEmployeeId(answers.employeeName)

    connection.query(
        'UPDATE employees SET ? WHERE ?',
        [
            {
                role_id: roleId
            },
            {
                id: employeeId
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(answers.employeeName + ' has had their role updated to ' + answers.employeeRole + '!');
            startPrompt()
        }
    )
}