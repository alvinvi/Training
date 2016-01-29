(function () {

    var DashboardController = function ($scope, $http, $timeout, $interval, $q, uiGridConstants, uiGridGroupingConstants, theButler) {

        $scope.message = "Good day, sir!";

        $scope.myData = [];
        $scope.gridOptions = {};
        $scope.gridOptions.data = 'myData';
        $scope.gridOptions.enableColumnResizing = true;
        $scope.gridOptions.enableFiltering = true;
        $scope.gridOptions.enableGridMenu = true;
        $scope.gridOptions.showGridFooter = true;
        $scope.gridOptions.showColumnFooter = true;
        $scope.gridOptions.fastWatch = true;
        $scope.gridOptions.columnDefs = [
            { name: 'PartNumber', width: 100 },
            { name: 'PartDescription', width: 100 },
            { name: 'Category', width: 100 },
            { name: 'Price', width: 100 },
            { name: 'id', width: 100, enableCellEdit: false }
        ];
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };
        $scope.gridOptions.rowIdentity = function (row) {
            return row.id;
        };
        $scope.gridOptions.getRowIdentity = function (row) {
            return row.id;
        };
        $scope.gridOptions.importerDataAddCallback = function (grid, newObjects) {
            $scope.myData = $scope.myData.concat(newObjects);
        };

        $scope.callsPending = 0;

        var productsWebApi = "http://localhost:5500/products/";


        // === Methods ===

        $scope.refreshData = function () {
            $scope.myData = [];

            var start = new Date();
            var sec = $interval(function () {
                $scope.callsPending++;

                $http.get(productsWebApi)
                  .success(function (data) {
                      $scope.callsPending--;

                      data.forEach(function (row) {
                          row.registered = new Date(row.registered);
                          $scope.myData.push(row);
                      });
                  })
                  .error(function () {
                      $scope.callsPending--;
                  });
            }, 200, 1);

            var timeout = $timeout(function () {
                $interval.cancel(sec);
                $scope.left = '';
            }, 2000);

            $scope.$on('$destroy', function () {
                $timeout.cancel(timeout);
                $interval.cancel(sec);
            });

            theButler.says('Lookout!', 'Data is refreshed.');
        };

        $scope.newRow = function () {
            $scope.myData.push({
                "PartNumber": "{PartNumber...}",
                "PartDescription": "{PartDescription...}",
                "Category": "{Category...}",
                "Price": "0",
                "id": "-"
            });
        };

        $scope.saveChanges = function () {
            var selectedRows = $scope.gridApi.selection.getSelectedRows();
            var selectedRowsCount = selectedRows.length;
            var isOk = false;
            if (selectedRowsCount > 0)
                isOk = confirm("Selected row(s) will be deleted. Continue?");
            else
                isOk = true;
            if (isOk != true)
            {
                theButler.says('Save changes discontinued.', '');
                return;
            }

            theButler.says('Processing now.', 'Warping in some pylons...');

            var ops = [];
            angular.forEach(selectedRows, function (data, index) {
                ops.push($http.delete(productsWebApi + data.id)
                        .then(function () {
                            $scope.myData.splice(index, 1);
                        })
                        .then(function () {
                            theButler.says('Delete successful!', 'Deleted product id ' + data.id);
                        },
                        function () {
                            theButler.says('Oh, dear.', "Something has gone terribly wrong along the way.");
                        })
                );
            });

            angular.forEach($scope.myData, function (data) {
                if (data.id == '-') {
                    data.id = '';

                    ops.push($http.post(productsWebApi, data)
                        .then(function () {
                            theButler.says('En taro Artanis!', 'Changes successfully saved.');
                        },
                        function () {
                            theButler.says('Oh, dear.', "Something has gone terribly wrong along the way.");
                        })
                    );
                }
                else {
                    ops.push($http.put(productsWebApi, data)
                        .then(function () {
                            theButler.says('En taro Artanis!', 'Changes successfully saved.');
                        },
                        function () {
                            theButler.says('Oh, dear.', "Something has gone terribly wrong along the way.");
                        })
                    );
                }

            });

            $q.all(ops).then(function () {
                theButler.says('Hooray!', "My life for Aiur.");
            });
        };

        // === Constructor lines ===
        theButler.says('Welcome!', 'I am your Mayordomo. Enjoy your stay!');
    };

    var app = angular.module("Mayordomo.Web");
    app.controller("DashboardController", ['$scope', '$http', '$timeout', '$interval', '$q', 'uiGridConstants', 'uiGridGroupingConstants', 'theButler', DashboardController]);

}());