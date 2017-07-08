(function () {
    angular
        .module("EMS")
        .service("EmpService", EmpService);

    EmpService.$inject = ['$http'];

    // EmpService
    function EmpService($http) {

        var service = this;

        // service.deleteDept = deleteDept;
        service.insertEmp = insertEmp;
        service.retrieveEmp = retrieveEmp;
        service.retrieveEmpDB = retrieveEmpDB;
        service.retrieveEmpByID = retrieveEmpByID;
        // service.updateDept = updateDept;

        // // REST API departments
        // // delete department manager
        // function deleteDept(dept_no, emp_no) {
        //     return $http({
        //         method: 'DELETE'
        //         , url: 'api/departments/' + dept_no + "/managers/" + emp_no
        //     });

        // }

        // done - create employee
        function insertEmp(employee) {
            return $http({
                method: 'POST',
                url: 'api/employees',
                data: {emp: employee}
            });
        }

        // done - read static employees
        function retrieveEmp() {
            return $http({
                method: 'GET',
                url: 'api/static/employees'
            });
        }

        // search employees
        function retrieveEmpDB(searchString) {
            return $http({
                method: 'GET',
                url: 'api/employees',
                params: {
                    'searchString': searchString
                }
            });
        }

        // read employee via param
        function retrieveEmpByID(emp_no) {
            return $http({
                method: 'GET'
                , url: "api/employees/" + emp_no
            });
        }
        
        // // edit a department
        // function updateDept(dept_no, dept_name) {
        //     return $http({
        //         method: 'PUT' // via route parameters & HTTP header body
        //         , url: 'api/departments/' + dept_no
        //         , data: {
        //             dept_no: dept_no,
        //             dept_name: dept_name
        //         }
        //     });
        // }
    }
})();