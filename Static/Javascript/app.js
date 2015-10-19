var bugtrackerApp = angular.module('bugtrackerApp', [
   'ngRoute',
   'bugtrackerControllers'
]);

bugtrackerApp.config(['$routeProvider',
   function($routeProvider) {
      $routeProvider.
         when('/Projects', {
            templateUrl: '/Static/Views/projectlistPartial.html',
            controller: 'ProjectListCtrl'
         }).
         when('/Projects/:projectid', {
            templateUrl: '/Static/Views/buglistPartial.html',
            controller: 'BugListCtrl'
         }).
         when('/Projects/:projectid/Bug/:bugid', {
            templateUrl: '/Static/Views/bugdetailPartial.html',
            controller: 'BugDetailCtrl'
         }).
         when('/Projects/:projectid/CreateBug', {
            templateUrl: '/Static/Views/createbugPartial.html',
            controller: 'CreateBugCtrl'
         }).
         when('/CreateProject', {
            templateUrl: 'Static/Views/createprojectPartial.html',
            controller: 'CreateProjectCtrl'
         }).
         otherwise({
            redirectTo: '/Projects'
         });
   }]);
