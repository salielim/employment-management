(function () {
    angular
        .module("EMS")
        .controller("SearchDBCtrl", SearchDBCtrl);

    SearchDBCtrl.$inject = ['DeptService', '$state'];

    function SearchDBCtrl(DeptService, $state) {
        var vm = this;

        vm.searchString = '';
        vm.result = null;
        vm.showManager = false;

        vm.search = search;
        vm.searchForManager = searchForManager;
        vm.goEdit = goEdit;

        // Initialize data
        init();
        function init() {
            DeptService
                .retrieveDeptDB('')
                .then(function (results) {
                    vm.departments = results.data;
                })
                .catch(function (err) {
                    console.log("error " + err);
                });
        }

        // Click goEdit() params link
        function goEdit(clickedDeptNo) {
            console.log("editing");
            $state.go("editWithParam", { deptNo: clickedDeptNo });
        };

        // Click search() button
        function search() {
            vm.showManager = false;
            DeptService
                // we pass contents of vm.searchString to service so that we can search the DB for this string
                .retrieveDeptDB(vm.searchString)
                .then(function (results) {
                    // The result returned by the DB contains a data object, which in turn contains the records read
                    // from the database
                    vm.departments = results.data;
                })
                .catch(function (err) {
                    // We console.log the error. For a more graceful way of handling the error, see
                    // register.controller.js
                    console.log("error " + err);
                });
        }

        // Click searchForManager() button
        function searchForManager() {
            vm.showManager = true;
            DeptService
                .retrieveDeptManager(vm.searchString)
                .then(function (results) {
                    console.log("results: " + JSON.stringify(results.data));
                    vm.departments = results.data;
                })
                .catch(function (err) {
                    console.info("error " + JSON.stringify(err));
                });
        }
    }
})();