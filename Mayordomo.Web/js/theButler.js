(function () {
    var theButler = function () {

        var says = function (header, message) {
            $.jGrowl(message, {
                header: header,
                sticky: false,
                life: 5000,
                speed: 500,
                theme: 'with-icon',
                position: 'top-right', //this is default position
                easing: 'easeOutBack',
                animateOpen: {
                    height: "show"
                },
                animateClose: {
                    opacity: 'hide'
                }
            });
        };

        return {
            says: says
        };
    };

    var app = angular.module("Mayordomo.Web");
    app.factory('theButler', theButler);
}());