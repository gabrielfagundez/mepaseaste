app.controller('HomeController', ['$scope', function($scope) {

  $scope.handleStartButton = function () {
    $('html, body').animate({
      scrollTop: $('#scroll-div').offset().top - 50
    }, 1000);
  }

}]);