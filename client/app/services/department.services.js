(function () {
    angular
        .module("EMS")
        .service("DeptService", DeptService);

    DeptService.$inject = ['$http'];

    // DeptService from EditCtrl, deleteManager() button
    function DeptService($http) {

        var service = this;

        service.deleteDept = deleteDept;
        service.insertDept = insertDept;
        service.retrieveDept = retrieveDept;
        service.retrieveDeptDB = retrieveDeptDB;
        service.retrieveDeptByID = retrieveDeptByID;
        service.retrieveDeptManager = retrieveDeptManager;
        service.updateDept = updateDept;

        // REST API departments
        // delete department manager
        function deleteDept(dept_no, emp_no) {
            return $http({
                method: 'DELETE'
                , url: 'api/departments/' + dept_no + "/managers/" + emp_no
            });

        }

        // create department
        function insertDept(department) {
            return $http({
                method: 'POST'
                , url: 'api/departments'
                , data: {dept: department}
            });
        }

        // read static departments
        function retrieveDept() {
            return $http({
                method: 'GET'
                , url: 'api/static/departments'
            });
        }

        // read departments
        function retrieveDeptDB(searchString) {
            return $http({
                method: 'GET'
                , url: 'api/departments'
                , params: {
                    'searchString': searchString
                }
            });
        }

        // read a department via param
        function retrieveDeptByID(dept_no) {
            return $http({
                method: 'GET'
                , url: "api/departments/" + dept_no
            });
        }

        // read department managers
        function retrieveDeptManager(searchString) {
            return $http({
                method: 'GET'
                , url: 'api/departments/managers'
                , params: {
                    'searchString': searchString
                }
            });
        }
        
        // edit a department
        function updateDept(dept_no, dept_name) {
            return $http({
                method: 'PUT' // via route parameters & HTTP header body
                , url: 'api/departments/' + dept_no
                , data: {
                    dept_no: dept_no,
                    dept_name: dept_name
                }
            });
        }
    }
})();