// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngResource', 'starter.controllers', 'starter.services','starter.directives'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {

        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(false);

        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
            var key, result = [];
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                }
            }
            return result.join("&");
        });

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.index', {
                url: "/index",
                views: {
                    'menuContent': {
                        templateUrl: "templates/index.html",
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('app.location', {
                url: "/location",
                views: {
                    'menuContent': {
                        templateUrl: "templates/location.html",
                        controller: 'LocationCtrl'
                    }
                }
            })

            .state('app.my', {
                url: "/my",
                views: {
                    'menuContent': {
                        templateUrl: "templates/my.html",
                        controller: 'MyCtrl'
                    }
                }
            })

            .state('app.my_order_payed', {
                url: "/my_order_payed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/my_order_payed.html",
                        controller: 'MyOrderPayedCtrl'
                    }
                }
            })

            .state('app.my_order_unpay', {
                url: "/my_order_unpay",
                views: {
                    'menuContent': {
                        templateUrl: "templates/my_order_unpay.html",
                        controller: 'MyOrderUnpayCtrl'
                    }
                }
            })
            .state('app.my_address', {
                url: "/my_address",
                views: {
                    'menuContent': {
                        templateUrl: "templates/my_address.html",
                        controller: 'MyAddressCtrl'
                    }
                }
            })
            .state('app.my_password', {
                url: "/my_password",
                views: {
                    'menuContent': {
                        templateUrl: "templates/my_password.html",
                        controller: 'MyPasswordCtrl'
                    }
                }
            })

            .state('app.ticket', {
                url: "/ticket/:cid",
                views: {
                    'menuContent': {
                        templateUrl: "templates/ticket.html",
                        controller: 'TicketCtrl'
                    }
                }
            })
            .state('app.select_address', {
                url: "/address/:ticketid/:ticketnum",
                views: {
                    'menuContent': {
                        templateUrl: "templates/select_address.html",
                        controller: 'SelectAddressCtrl'
                    }
                }
            })

            .state('app.order', {
                url: "/order/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/order.html",
                        controller: 'OrderCtrl'
                    }
                }
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html",
                        controller: 'SearchCtrl'
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                }
            })
            .state('app.playlists', {
                url: "/playlists/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            })

            .state('app.single', {
                url: "/playlist/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/index');
    });
