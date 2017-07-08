(function () {
    angular
        .module("DMS")
        .controller("SearchCtrl", SearchCtrl);

    SearchCtrl.$inject = ['DeptService'];

    function SearchCtrl(DeptService) {

        var vm = this;
        vm.departments = [];
        
        // Initialize & show departments data
        init();
        function init() {
            DeptService
                .retrieveDept()
                .then(function(results){
                    vm.departments = results.data;
                })
                .catch(function(err){
                    console.log("error " + err);
                });
        }

    }
})();