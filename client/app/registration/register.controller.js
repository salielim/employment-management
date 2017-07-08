(function () {
    angular
        .module("DMS")
        .controller("RegCtrl", RegCtrl);
    
    RegCtrl.$inject = ['$filter', '$window', 'DeptService', 'EmpService']; // $filter for date formatting
   
    function RegCtrl($filter, $window, DeptService, EmpService) {

        var vm = this;

        vm.employee = {
            id: "",
            birth_date: "",
            first_name: "",
            last_name: "",
            gender: "",
            hire_date: "",
        };
        
        vm.status = {
            message: ""
            , code: ""
        };

        vm.register = register;

        // Click register() button
        function register() {
            alert("The registration information you sent are \n" + JSON.stringify(vm.employee));

            console.log("The registration information you sent were:");
            console.log("Emp no.: " + vm.employee.emp_no);
            console.log("Emp name: " + vm.employee.first_name);

            // EmpService / insertEmp
            EmpService
                .insertEmp(vm.employee)
                .then(function (result) {
                    console.log("result " + JSON.stringify(result));
                    $window.location.assign('/app/registration/thanks.html');
                })
                .catch(function (err) {
                    console.log("error " + JSON.stringify(err));
                    vm.status.message = err.data.name;
                    // vm.status.code = err.data.parent.err;
                });
        }
    }

})();