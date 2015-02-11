/**
 * Created by admin on 2014/12/22.
 */

angular.module('starter.directives', [])
    .directive('city', ['$rootScope', function ($rootScope) {

        return function (scope, element, attrs) {
            $rootScope.$on('header.city.change', function (event, data) {
//                $rootScope.city = data.city;
                document.querySelector('#city').innerHTML = data.city;
            });

        }

    }])