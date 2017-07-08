(function () {
    angular
        .module("DMS")
        .controller("RegCtrl", RegCtrl);
    
    RegCtrl.$inject = ['$filter', '$window', 'DeptService', 'EmpService']; // $filter for date formatting
   
    function RegCtrl($filter, $window, DeptService, EmpService) {

        var vm = this;

        vm.department = {
            id: ""
            , name: ""
            , manager: ""
        };
        
        vm.status = {
            message: ""
            , code: ""
        };

        vm.register = register;

        // Initialize employees/manager data
        initManagerBox();
        function initManagerBox() {
            EmpService
                .retrieveNonManagers()
                .then(function (results) {
                    console.log("--- EMPLOYEES ----");
                    console.log(results.data);
                    vm.employees = results.data;
                })
                .catch(function (err) {
                    console.log("error " + JSON.stringify(err));
                    vm.status.message = err.data.name;
                    vm.status.code = err.data.parent.errno;
                });
        }

        // Click register() button
        function register() {
            alert("The registration information you sent are \n" + JSON.stringify(vm.department));

            console.log("The registration information you sent were:");
            console.log("Department id: " + vm.department.id);
            console.log("Department name: " + vm.department.name);
            console.log("Department name: " + vm.department.manager);

            vm.department.from_date = $filter('date')(new Date(), 'yyyy-MM-dd');
            vm.department.to_date = new Date('9999-01-01');
            console.log("vm.dept" + JSON.stringify(vm.department));

            // DeptService / insertDept
            DeptService
                .insertDept(vm.department)
                .then(function (result) {
                    console.log("result " + JSON.stringify(result));
                    $window.location.assign('/app/registration/thanks.html');
                })
                .catch(function (err) {
                    console.log("error " + JSON.stringify(err));
                    vm.status.message = err.data.name;
                    vm.status.code = err.data.parent.errno;
                });
        }
    }

})();