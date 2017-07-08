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
        // service.retrieveDeptDB = retrieveDeptDB;
        // service.retrieveDeptByID = retrieveDeptByID;
        // service.retrieveDeptManager = retrieveDeptManager;
        // service.updateDept = updateDept;

        // // REST API departments
        // // delete department manager
        // function deleteDept(dept_no, emp_no) {
        //     return $http({
        //         method: 'DELETE'
        //         , url: 'api/departments/' + dept_no + "/managers/" + emp_no
        //     });

        // }

        // create employee
        function insertEmp(employee) {
            return $http({
                method: 'POST',
                url: 'api/employees',
                data: {emp: employee}
            });
        }

        // retrieve employees
        function retrieveEmp() {
            return $http({
                method: 'GET',
                url: 'api/employees'
            });
        }

        // // read static departments
        // function retrieveDept() {
        //     return $http({
        //         method: 'GET'
        //         , url: 'api/static/departments'
        //     });
        // }

        // // read departments
        // function retrieveDeptDB(searchString) {
        //     return $http({
        //         method: 'GET'
        //         , url: 'api/departments'
        //         , params: {
        //             'searchString': searchString
        //         }
        //     });
        // }

        // // read a department via param
        // function retrieveDeptByID(dept_no) {
        //     return $http({
        //         method: 'GET'
        //         , url: "api/departments/" + dept_no
        //     });
        // }

        // // read department managers
        // function retrieveDeptManager(searchString) {
        //     return $http({
        //         method: 'GET'
        //         , url: 'api/departments/managers'
        //         , params: {
        //             'searchString': searchString
        //         }
        //     });
        // }
        
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