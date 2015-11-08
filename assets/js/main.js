var angelJobs = angular.module('AngelJobs', []);

angelJobs.controller('JobList', ['$scope', '$http', function($scope, $http) {
	$scope.page = 1;
	$scope.job_count = 0;
	$scope.show_loader = false;
	
	$scope.getJobs = function() {
		$scope.show_loader = true;
		$http.get('http://angeljobs.nulalabs.com?page='+$scope.page).
		success(function(data, status, headers, config) {
			$scope.job_list=data.jobs;
			$scope.job_count=data.count;
			$scope.show_loader = false;
		}).
		error(function(data, status, headers, config) {
			$scope.show_loader = false;
		});
	}
	
	$scope.getJobs();
	
	$scope.hasLeft = function() {
		return $scope.page>1;
	}
	
	$scope.hasRight = function() {
		return $scope.page<$scope.getPages();
	}
	
	$scope.getPages = function() {
		return Math.ceil($scope.job_count/10);
	}
	
	$scope.getPage = function(p) {
		$scope.page=p;
		$scope.getJobs();
	}
	
	$scope.prevPage = function() {
		$scope.getPage($scope.page-1);
	}
	
	$scope.nextPage = function() {
		$scope.getPage($scope.page+1);
	}
}]);

angular.module('AngelJobs').filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  }
});