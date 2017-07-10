// Dependencies
var express = require("express");
var path = require("path"); // access helper functions
var bodyParser = require("body-parser"); // parse body of request object
var Sequelize = require("sequelize");

// Constants
const NODE_PORT = process.env.PORT || 3000; // define server port

const CLIENT_FOLDER = path.join(__dirname, '/../client');
const MSG_FOLDER = path.join(CLIENT_FOLDER, '/assets/messages'); // define paths

// MySQL configuration
const MYSQL_USERNAME = 'root';
const MYSQL_PASSWORD = 'root';

// Express instance
var app = express();

// MySQL connection
var sequelize = new Sequelize(
    'employees',
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    {
        host: 'localhost',         // default port    : 3306
        logging: console.log,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

// Models
var Department = require('./models/department')(sequelize, Sequelize);
var Employee = require('./models/employee')(sequelize, Sequelize);
var Manager = require('./models/deptmanager')(sequelize, Sequelize);

// Associations
Department.hasMany(Manager, {foreignKey: 'dept_no'});
Manager.hasOne(Employee, {foreignKey: 'emp_no'}); // manager is also an employee

// Middlewares
app.use(express.static(CLIENT_FOLDER)); // serve files from client folder and look for index.html
app.use(bodyParser.json());

// ROUTE HANDLERS

// EmpService, RegCtrl
// done - Create employee
app.post("/api/employees", function (req, res) {
    // post to req.body
    console.log('\nData Submitted');
    console.log('Emp No: ' + req.body.emp.emp_no);
    console.log('Emp First Name: ' + req.body.emp.first_name);

    Employee
        .create(
            {
                emp_no: req.body.emp.id,
                first_name: req.body.emp.first_name,
                last_name: req.body.emp.last_name,
                gender: req.body.emp.gender,
                birth_date: req.body.emp.birth_date,
                hire_date: req.body.emp.hire_date,
            }
        )
        .then(function (results) {
            res
                .status(200)
                .json(results);
        })
        .catch(function (err) {
            console.log("outer error: " + JSON.stringify(err));
            res
                .status(500)
                .json(err);
        });
    });

// EmpService, SearchDBCtrl
// *** done - retrieve employee information from database via search findAll
app.get("/api/employees", function (req, res) {
    console.log(JSON.stringify(req.query));
    Employee
        .findAll({
            where: {
                $or: [
                    {emp_no: {$like: "%" + req.query.searchString + "%"}},
                    {first_name: {$like: "%" + req.query.searchString + "%"}},
                    {last_name: {$like: "%" + req.query.searchString + "%"}}
                ]
            }
        })
        .then(function (employees) {
            res
                .status(200)
                .json(employees);
                console.log("finish findall");
        })
        .catch(function (err) {
            res
                .status(500)
                .json(err);
        });
});

// EmpService, SearchDBCtrl
// done - Search specific employee by emp_no
app.get("/api/employees/:emp_no", function (req, res) {
    var where = {};
    if (req.params.emp_no) {
        where.emp_no = req.params.emp_no
    }

    console.log("where " + where);

    Employee
        .findOne({
            where: where,
            // , include: [{
            //     model: Manager
            //     , order: [["to_date", "DESC"]]
            //     , limit: 1
            //     , include: [Employee]
            // }]
        })
        .then(function (employees) {
            console.log("-- GET /api/employees/:emp_no findOne then() result \n " + JSON.stringify(employees));
            res.json(employees);
        })
        .catch(function (err) {
            console.log("-- GET /api/employees/:emp_no findOne catch() \n " + JSON.stringify(employees));
            res
                .status(500)
                .json({error: true});
        });

});

// EmpService, EditCtrl
// done - Edit employees info
app.put('/api/employees/:emp_no', function (req, res) {

    var where = {};
    where.emp_no = req.params.emp_no;
    var new_first_name = req.body.first_name;
    var new_last_name = req.body.last_name;

    Employee
        .update({
            first_name: new_first_name,
            last_name: new_last_name,
        },{
            where: where,
        })
        .then(function(result) {
            res.json({ success: result });
        })
        .catch(function(err) {
            res.status(500).json({ success: false });
            console.log(err);
        })
});

// EmpService, EditCtrl
// Delete employee via param
app.delete("/api/employees/:emp_no", function (req, res) {

    var where = {};
    where.emp_no = req.params.emp_no;

    Employee
    .destroy({
        where: where
    })
    .then(function(result) {
        console.log("records delete: " + result);
        if (result == 1) {
            res.json({ success: true });
        } else {
            res.json({ success: false});
        }
    })
    .catch(function(err) {
        res.status(500).json({ success: false });
        console.log(err);
    })
});

// EmpService
// Retrieve employee data (non-managers)
app.get("/api/employees", function (req, res) {
    sequelize
        .query("SELECT emp_no, first_name, last_name " +
            "FROM employees e " +
            "WHERE NOT EXISTS " +
            "(SELECT * " +
            "FROM dept_manager dm " +
            "WHERE dm.emp_no = e.emp_no )" +
            "LIMIT 100; " // SQL statement
        )
        .spread(function (employees) {
            // .spread() instead of .then to separate metadata
            res
                .status(200)
                .json(employees);
        })
        .catch(function (err) {
            res
                .status(500)
                .json(err);
        });
});

// Error handling
    // bottom of the stack below all other path handlers
app.use(function (req, res) {
    res.status(404).sendFile(path.join(MSG_FOLDER + "/404.html"));
});

app.use(function (err, req, res, next) {
    res.status(501).sendFile(path.join(MSG_FOLDER + '/501.html'));
});

// Server / Port
app.listen(NODE_PORT, function () {
    console.log("Server running at http://localhost:" + NODE_PORT);
});