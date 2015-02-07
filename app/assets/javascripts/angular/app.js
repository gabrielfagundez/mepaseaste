var app = angular.module('MePaseaste', ['ngRoute', 'ngResource']);

app.config(['$locationProvider', function($locationProvider){
  $locationProvider.html5Mode(true)
}]);