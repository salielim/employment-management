// Dependencies
var express = require("express");
var path = require("path"); // access helper functions
var bodyParser = require("body-parser"); // parse body of request object
var Sequelize = require("sequelize");

// Constants
const NODE_PORT = process.env.NODE_PORT || 3000; // define server port

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
// Create employee
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

// DeptService, SearchCtrl
// Retrieve department information from database via search findAll
app.get("/api/departments", function (req, res) {
    Department
        .findAll({
            where: {
                $or: [
                    {dept_name: {$like: "%" + req.query.searchString + "%"}},
                    {dept_no: {$like: "%" + req.query.searchString + "%"}}
                ]
            }
        })
        .then(function (departments) {
            res
                .status(200)
                .json(departments);
        })
        .catch(function (err) {
            res
                .status(500)
                .json(err);
        });
});

// DeptService, SearchDBCtrl
// Retrieve department & manager records that match against dept name or dept no.
app.get("/api/departments/managers", function (req, res) {
    Department
        .findAll({
            where: {
                $or: [
                    {dept_name: {$like: "%" + req.query.searchString + "%"}},
                    {dept_no: {$like: "%" + req.query.searchString + "%"}}
                    // match any of the condition
                ]
            }
            // include joins the tables
            , include: [{
                model: Manager
                , order: [["to_date", "DESC"]]
                , limit: 1
                // We include the Employee model to get the manager's name
                , include: [Employee]
            }]
        })
        .then(function (departments) {
            res
                .status(200)
                .json(departments);
        })
        // this .catch() handles erroneous findAll operation
        .catch(function (err) {
            res
                .status(500)
                .json(err);
        });
});

// DeptService, SearchDBCtrl
// Search specific department by dept_no
    // define before /api/departments/managers if not managers route would be treated as dept_no
app.get("/api/departments/:dept_no", function (req, res) {
    var where = {};
    if (req.params.dept_no) {
        where.dept_no = req.params.dept_no
    }

    console.log("where " + where);

    Department
        .findOne({
            // use findOne as dept_no is the primary key, cannot use findById as it doesn't support eager loading
            where: where
            , include: [{
                model: Manager
                , order: [["to_date", "DESC"]]
                , limit: 1
                , include: [Employee]
            }]
        })
        .then(function (departments) {
            console.log("-- GET /api/departments/:dept_no findOne then() result \n " + JSON.stringify(departments));
            res.json(departments);
        })
        .catch(function (err) {
            console.log("-- GET /api/departments/:dept_no findOne catch() \n " + JSON.stringify(departments));
            res
                .status(500)
                .json({error: true});
        });

});

// DeptService, EditCtrl
// Edit department info
app.put('/api/departments/:dept_no', function (req, res) {

    var where = {};
    where.dept_no = req.params.dept_no;
    var new_dept_name = req.body.dept_name;

    Department
        .update({
            dept_name: new_dept_name,
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

// DeptService, EditCtrl
// Delete manager of specific department via param
app.delete("/api/departments/:dept_no/managers/:emp_no", function (req, res) {

    var where = {};
    where.dept_no = req.params.dept_no;
    where.emp_no = req.params.emp_no;

    Manager
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

// DeptService
// Retrieve department data (static)
app.get("/api/static/departments", function (req, res) {

    var departments = [
        {
            deptNo: 1001,
            deptName: 'Admin'
        }
        , {
            deptNo: 1002,
            deptName: 'Finance'
        }
        , {
            deptNo: 1003,
            deptName: 'Sales'
        }
        , {
            deptNo: 1004,
            deptName: 'HR'
        }
        , {
            deptNo: 1005,
            deptName: 'Staff'
        }
        , {
            deptNo: 1006,
            deptName: 'Customer Care'
        }
        , {
            deptNo: 1007,
            deptName: 'Support'
        }
    ];

    res.status(200).json(departments);    // return as json object
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