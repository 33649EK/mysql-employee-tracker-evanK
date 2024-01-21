const inquirer = require('inquirer')
const mysql = require('mysql2')
const UserPrompts = require('./helperPrompts/inquirerPrompts')
const userPrompts = new UserPrompts()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roster_db'
});

connection.connect(err => {
    if (err) throw err;
    // console.log('connected as id ' + connection.threadId);
    // connection.end();
});

checkDepartment = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM department', (err, results) => {
            if (err) reject(err);
            let departmentArray = []
            for (let i = 0; i < results.length; i++) {
                departmentArray.push(results[i].name)
            }
            // console.log(departmentArray)
            resolve(departmentArray)
        })
    })
}

checkRole = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM role', (err, results) => {
            if (err) reject(err);
            let roleArray = [];
            for (let i = 0; i < results.length; i++) {
                console.log(results[i].title);
                roleArray.push(results[i].title);
            }
            // console.log(roleArray);
            resolve(roleArray);
        });
    });
};

checkEmployee = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employee', (err, results) => {
            if (err) reject(err);
            let employeeArray = [];
            for (let i = 0; i < results.length; i++) {
                console.log(results[i].first_name + ' ' + results[i].last_name);
                employeeArray.push(results[i].first_name + ' ' + results[i].last_name);
            }
            // console.log(employeeArray);
            resolve(employeeArray);
        });
    });
};

async function startPrompt() {

    let departments = await checkDepartment()
    let roles = await checkRole()
    let employee = await checkEmployee()

    console.log(departments, roles, employee)
    inquirer.prompt(userPrompts.initialPrompt)
        .then((answers) => {
            // console.log(answers)

            // switch statement to handle the different choices
            switch (answers.initialPrompt) {
                case 'View all departments':
                    console.log('View all departments')
                    connection.query('SELECT * FROM department', (err, results) => {
                        if (err) throw err;
                        console.table(results.map(({ id, name }) => ({ id, name })))
                    })
                    // connection.end()
                    break;
                case 'View all roles':
                    console.log('View all roles')
                    connection.query('SELECT * FROM role', (err, results) => {
                        if (err) throw err;
                        console.table(results.map(({ id, title, salary, department_id }) => ({ id, title, salary, department_id })))
                    })
                    break;
                case 'View all employees':
                    console.log('View all employees')
                    connection.query('SELECT * FROM employee', (err, results) => {
                        if (err) throw err;
                        console.table(results.map(({ id, first_name, last_name, role_id, manager_id }) => ({ id, first_name, last_name, role_id, manager_id })))
                    })
                    break;
                case 'Add a department':
                    // console.log('Add a department')
                    inquirer.prompt(userPrompts.addDepartment)
                        .then((answers) => {
                            console.log(answers)
                            connection.query(
                                'INSERT INTO department SET ?',
                                {
                                    name: answers.departmentName
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res.affectedRows + ' department inserted!\n');
                                }
                            );
                            // startPrompt()
                        })
                    break;
                case 'Add a role':
                    // console.log('Add a role')
                    let rolePrompt = new UserPrompts('', departments, '')
                    inquirer.prompt(rolePrompt.addRole)
                        .then((answers) => {
                            console.log(answers)
                            // connection.query(
                            //     'INSERT INTO role SET ?',
                            //     {
                            //         title: answers.roleName,
                            //         salary: answers.roleSalary,
                            //         department_id: answers.roleDepartment
                            //     },
                            //     function (err, res) {
                            //         if (err) throw err;
                            //         console.log(res.affectedRows + ' role inserted!\n');
                            //     }
                            // );
                            // startPrompt()
                        })
                    break;
                case 'Add an employee':
                    // console.log('Add an employee')
                    let employeePrompt = new UserPrompts(roles, departments, '')
                    inquirer.prompt(employeePrompt.addEmployee)
                        .then((answers) => {
                            console.log(answers)
                            // connection.query(
                            //     'INSERT INTO employee SET ?',
                            //     {
                            //         first_name: answers.employeeFirstName,
                            //         last_name: answers.employeeLastName,
                            //         role_id: answers.employeeRole,
                            //         manager_id: answers.employeeManager
                            //     },
                            //     function (err, res) {
                            //         if (err) throw err;
                            //         console.log(res.affectedRows + ' employee inserted!\n');
                            //     }
                            // );
                            // startPrompt()
                        })
                    break;
                case 'Update an employee role':
                    // console.log('Update employee role')
                    inquirer.prompt(userPrompts.updateEmployeeRole)
                        .then((answers) => {
                            console.log(answers)
                            connection.query(
                                'UPDATE employee SET ? WHERE ?',
                                [
                                    {
                                        role_id: answers.employeeRole
                                    },
                                    {
                                        first_name: answers.employeeName
                                    }
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res.affectedRows + ' employee updated!\n');
                                }
                            );
                            // startPrompt()
                        })
                    break;
            }
        });
}

startPrompt()


