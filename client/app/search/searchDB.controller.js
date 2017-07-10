(function () {
    angular
        .module("EMS")
        .controller("SearchDBCtrl", SearchDBCtrl);

    SearchDBCtrl.$inject = ['$state', 'EmpService'];

    function SearchDBCtrl($state, EmpService) {
        var vm = this;

        vm.searchString = '';
        vm.result = null;

        vm.search = search;
        // vm.goEdit = goEdit;

        // Initialize data
        init();
        function init() {
            EmpService
                .retrieveEmpDB('')
                .then(function (results) {
                    vm.employees = results.data;
                })
                .catch(function (err) {
                    console.log("error " + err);
                });
        }

        // Click goEdit() params link
        // function goEdit(clickedEmpNo) {
        //     console.log("edit employee");
        //     $state.go("editWithParam", { empNo: clickedEmpNo });
        // };

        // Click search() button
        function search() {
            EmpService
                .retrieveEmpDB(vm.searchString)
                .then(function (results) {
                    vm.employees = results.data;
                })
                .catch(function (err) {
                    console.log("error " + err);
                });
        }
    }
})();