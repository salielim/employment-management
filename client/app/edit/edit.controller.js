(function () {
    'use strict';
    angular
        .module("EMS")
        .controller("EditCtrl", EditCtrl);

    EditCtrl.$inject = ["$filter", "DeptService", "$stateParams", "EmpService"];

    function EditCtrl($filter, DeptService, $stateParams, EmpService) {
        var vm = this;

        vm.emp_no = "";
        vm.result = {};
        vm.msg = "";

        vm.deleteEmp = deleteEmp;
        vm.initDetails = initDetails;
        vm.search = search;
        vm.toggleEditor = toggleEditor;
        vm.updateEmpName = updateEmpName;

        // Initialize emp data view
        initDetails();
        function initDetails() {
            console.log("-- show.controller.js > initDetails()");
            
            vm.result.emp_no = "";
            vm.result.first_name = "";
            vm.result.last_name = "";
            vm.result.gender = "";
            vm.result.birth_date = "";
            vm.result.hire_date = "";

            vm.showDetails = false;
            vm.isEditorOn = false;
        }

        // Click search() button
        function search() {
            console.log("-- show.controller.js > search()");
            initDetails();
            vm.showDetails = true;

            EmpService
                .retrieveEmpByID(vm.emp_no)
                .then(function (result) {
                    vm.showDetails = true;

                    console.log("-- show.controller.js > search() > results: \n" + JSON.stringify(result.data));

                    if (!result.data)
                        return;

                    vm.result.emp_no = result.data.emp_no;
                    vm.result.first_name = result.data.first_name;
                    vm.result.gender = result.data.gender;
                    vm.result.last_name = result.data.last_name;
                    vm.result.birth_date = result.data.birth_date;
                    vm.result.hire_date = result.data.hire_date;
                    console.log(result.data.first_name + result.data.last_name);
                    console.log(result.data.birth_date + result.data.hire_date);
                    console.log(result.data.gender);
                })
                .catch(function (err) {
                    console.log("--  show.controller.js > search() > error: \n" + JSON.stringify(err));
                });
        }

        // Click updateEmpName() button
        function updateEmpName() {
            console.log("in updateEmpName()");
            EmpService
                .updateEmpName(vm.emp_no, vm.result.first_name, vm.result.last_name)
                .then(function (result) {
                    console.log("-- show.controller.js > save() > results: \n" + JSON.stringify(result.data));
                })
                .catch(function (err) {
                    console.log("--  show.controller.js > save() > error: \n" + JSON.stringify(err));
                });
            vm.toggleEditor();
        }

        // Click edit toggleEditor() button
        function toggleEditor() {
            vm.isEditorOn = !(vm.isEditorOn);
        }

        // Click deleteEmp() button
        function deleteEmp() {
            EmpService
                .deleteEmp(vm.emp_no)
                .then(function (response) {
                    search();
                    alert("Employee no. " + JSON.stringify(vm.emp_no) + " have been deleted.");
                })
                .catch(function (err) {
                    console.log("error: \n" + JSON.stringify(err));
                });
        }

        // // Pass emp params
        // if ($stateParams.empNo) {
        //     console.log("passing info" + $stateParams.empNo)
        //     vm.emp_no = $stateParams.empNo;
        //     vm.search();
        // }
    }
})();