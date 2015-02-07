app.controller('ResultsController', ['$scope', 'Query', function($scope, Query) {

  // Variable que determina si los resultados se deben traer de un txt o no.
  $scope.resultsReady = false;

  $scope.totalCost = '[calculando..]';
  $scope.rateType = '[esperando información]';
  $scope.markersCount = '[esperando información]';
  $scope.taxisCount = '[esperando información]';
  $scope.taxis = [];
  $scope.markers = [];


  Query.get({ id: 1 }, function(data) {
    console.log(data)

    $scope.totalCost    = '$' + data.costo_total;
    $scope.rateType     = data.tipo_tarifa;
    $scope.markersCount = data.cantidad_marcadores;
    $scope.taxisCount   = data.solution.length;
    $scope.markers      = data.marcadores;
    $scope.taxis        = data.solution;
  });

  $scope.staticMapImageUrl = function (taxi) {
    var width = $('#queries .container').width();
    var passengers = [];

    $.each(taxi, function (index, taxiPassenger) {
      var marker = findMarker(taxiPassenger, $scope.markers);
      passengers.push(marker)
    });

    var latLng = '';
    $.each(passengers, function (index, passenger) {
      console.log(passenger.latitude, passenger.longitude, index)
      latLng += '|' + passenger.latitude + ',' + passenger.longitude;
    });
    return 'http://maps.googleapis.com/maps/api/staticmap?size=' + width + 'x300&path=color:0x0000ff|weight:5' + latLng;
  };

  function findMarker(id, markers) {
    var marker;
    $.each(markers, function(index, m) {
      if(parseInt(m.id) == parseInt(id))
        marker = m;
    });
    return marker;
  }

}]);