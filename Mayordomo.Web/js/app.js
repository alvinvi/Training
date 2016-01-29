(function () {

    var app = angular.module("Mayordomo.Web", ['ngTouch', 'ngRoute', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);
    app.config(function ($routeProvider) {
        $routeProvider
            .when("/main", {
                templateUrl: "_dashboardView.html",
                controller: "DashboardController"
            })
            .otherwise({ redirectTo: "/main" });
    });

}());