(function () {
    'use strict';
    angular
        .module("EMS")
        .controller("EditCtrl", EditCtrl);

    EditCtrl.$inject = ["$filter", "DeptService", "$stateParams"];

    function EditCtrl($filter, DeptService, $stateParams) {
        var vm = this;

        vm.dept_no = "";
        vm.result = {};

        vm.deleteManager = deleteManager;
        vm.initDetails = initDetails;
        vm.search = search;
        vm.toggleEditor = toggleEditor;
        vm.updateDeptName = updateDeptName;

        // Initialize department data view
        initDetails();
        function initDetails() {
            console.log("-- show.controller.js > initDetails()");
            vm.result.dept_no = "";
            vm.result.dept_name = "";
            vm.result.manager_id = "";
            vm.result.manager_name = "";
            vm.result.manager_from = "";
            vm.result.manager_to = "";
            vm.result.manager_id = "";
            vm.showDetails = false;
            vm.isEditorOn = false;
        }

        // Pass department params
        if ($stateParams.deptNo) {
            console.log("passing info" + $stateParams.deptNo)
            vm.dept_no = $stateParams.deptNo;
            vm.search();
        }

        // Click deleteManager() button
        function deleteManager() {
            DeptService
                .deleteDept(vm.dept_no, vm.result.manager_id)
                .then(function (response) {
                    search();
                })
                .catch(function (err) {
                    console.log("error: \n" + JSON.stringify(err));
                });
        }

        // Click updateDeptName() button
        function updateDeptName() {
            console.log("-- show.controller.js > save()");
            DeptService
                .updateDept(vm.dept_no, vm.result.dept_name)
                .then(function (result) {
                    console.log("-- show.controller.js > save() > results: \n" + JSON.stringify(result.data));
                })
                .catch(function (err) {
                    console.log("--  show.controller.js > save() > error: \n" + JSON.stringify(err));
                });
            vm.toggleEditor();
        }

        // Click search() button
        function search() {
            console.log("-- show.controller.js > search()");
            initDetails();
            vm.showDetails = true;

            DeptService
                .retrieveDeptByID(vm.dept_no)
                .then(function (result) {
                    vm.showDetails = true;

                    console.log("-- show.controller.js > search() > results: \n" + JSON.stringify(result.data));

                    if (!result.data)
                        return;

                    vm.result.dept_no = result.data.dept_no;
                    vm.result.dept_name = result.data.dept_name;
                    if (result.data.managers[0]) {
                        vm.result.manager_id = result.data.managers[0].emp_no;
                        vm.result.manager_name = result.data.managers[0].employee.first_name
                            + " "
                            + result.data.managers[0].employee.last_name;
                        vm.result.manager_from = $filter('date')
                            (result.data.managers[0].from_date, 'MMM dd, yyyy');
                        vm.result.manager_to = $filter('date')
                            (result.data.managers[0].to_date, 'MMM dd, yyyy');
                    }
                })
                .catch(function (err) {
                    console.log("--  show.controller.js > search() > error: \n" + JSON.stringify(err));
                });
        }

        // Click toggleEditor() button
        function toggleEditor() {
            vm.isEditorOn = !(vm.isEditorOn);
        }
    }
})();