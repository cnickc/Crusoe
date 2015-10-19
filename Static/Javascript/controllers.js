var bugtrackerControllers = angular.module('bugtrackerControllers', []);

bugtrackerControllers.controller('BugListCtrl', ['$scope', '$http', '$routeParams',
   function($scope, $http, $routeParams) {
      $scope.project = $routeParams.projectid;
      $http.get('/'+$routeParams.projectid+'/List/').success(function(data) {
         $scope.bugs = data.bugs;
         $scope.bugs.sort(function(a,b){
            if(a.status != b.status){
               return data.statuses.indexOf(a.status) - data.statuses.indexOf(b.status);
            }
            if(a.priority != b.priority){
               return data.priorities.indexOf(b.priority) - data.priorities.indexOf(a.priority);
            }
            if(a.id > b.priority) {
               return 1;
            }
            if(a.id < b.id) {
               return -1;
            }

            return 0;
         });
      });
   }]);

bugtrackerControllers.controller('ProjectListCtrl', ['$scope', '$http',
   function($scope, $http) {
      $http.get('/Projects').success(function(data) {
         $scope.projects = data;
      });

      $scope.DeleteProject = function(proj) {
         $http.delete('/'+proj).success(function(data) {
            $http.get('/Projects').success(function(data) {
               $scope.projects = data;
            });
         });
      };
   }]);

bugtrackerControllers.controller('BugDetailCtrl', ['$scope', '$http', '$routeParams', '$location', 
   function($scope, $http, $routeParams, $location) {
      var bugUrl = '/'+$routeParams.projectid+'/'+$routeParams.bugid;
      $scope.project = $routeParams.projectid;
      $http.get(bugUrl).success(function(data) {
         $scope.bug = data;
      });
      $http.get('/BugPriorities').success(function(data) {
         $scope.priorities = data;
      });
      $http.get('/BugStatuses').success(function(data) {
         $scope.statuses = data;
      });

      $scope.SubmitChanges = function() {
         payload = $scope.bug;
         payload.project = $routeParams.projectid;
         $http.post('/ModifyBug', payload).success(function(data) {
            $location.path('Projects/'+$routeParams.projectid);
         });
      };

   }]);

bugtrackerControllers.controller('CreateProjectCtrl', ['$scope', '$http', '$location',
   function($scope, $http, $location) {
      $scope.ProjectName = "";
      $scope.ErrorMsg = "";
      $scope.createProject = function() {
         $scope.ProjectName = $scope.ProjectName.trim();
         if($scope.ProjectName.length == 0) {
            $scope.ErrorMsg = "Invalid Name";
            return;
         }
         var payload = {};
         payload.project = $scope.ProjectName;
         $http.post('/NewProject', payload).success(function(data) {
            $location.path('/');
         });
      };
   }]);

bugtrackerControllers.controller('CreateBugCtrl', ['$scope', '$http', '$routeParams', '$location', 
   function($scope, $http, $routeParams, $location) {
      $scope.bugTitle = "";
      $scope.bugDescription = "";
      $scope.bugStatus = "";
      $scope.bugPriority = "";

      $scope.priorities = [];
      $scope.statuses = [];

      $http.get('/BugPriorities').success(function(data) {
         $scope.priorities = data;
      });
      $http.get('/BugStatuses').success(function(data) {
         $scope.statuses = data;
      });

      $scope.createBug = function() {
         $scope.bugTitle = $scope.bugTitle.trim();
         $scope.bugDescription = $scope.bugDescription.trim();
         if($scope.bugTitle.length == 0 || $scope.bugStatus.length == 0 || $scope.bugPriority.length == 0) {
            $scope.errorMsg = "Invalid Bug Form";
            return;
         } 

         var payload = {};
         payload.title = $scope.bugTitle;
         payload.description = $scope.bugDescription;
         payload.priority = $scope.bugPriority;
         payload.status = $scope.bugStatus;
         payload.project = $routeParams.projectid;
         $http.post('/NewBug', payload).success(function(data) {
            $location.path('Projects/'+ $routeParams.projectid);
         });
      }
   }]);
