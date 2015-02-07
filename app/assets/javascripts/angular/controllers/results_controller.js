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
    $scope.totalCost    = '$' + data.costo_total;
    $scope.rateType     = data.tipo_tarifa;
    $scope.markersCount = data.cantidad_marcadores;
    $scope.taxisCount   = data.solution.length;
    $scope.markers      = data.marcadores;
    $scope.taxis        = data.solution;

    $.each(data.marcadores, function (index, marker) {
      marker = new google.maps.Marker({
        draggable: false,
        position: new google.maps.LatLng(marker.latitude, marker.longitude),
        map: map,

        // App Variables
        markerId: marker.id,
        icon: marker.icon,
        address: marker.address
      });
      markers.push(marker);
    })
  });

  $scope.staticMapImageUrl = function (taxi) {
    var width = $('#queries .container').width();
    if(width > 750)
      width = width / 2;
    var passengers = [$scope.markers[0]];

    $.each(taxi, function (index, taxiPassenger) {
      var marker = findMarker(taxiPassenger, $scope.markers);
      passengers.push(marker)
    });

    var latLng = '';
    $.each(passengers, function (index, passenger) {
      latLng += '|' + passenger.latitude + ',' + passenger.longitude;
    });
    var url = 'http://maps.googleapis.com/maps/api/staticmap?size=' + width + 'x300&path=color:0x0000ff|weight:5' + latLng;
    $.each(passengers, function (index, passenger) {
      if(index == 0)
        url += '&markers=color:green%7Clabel:O%7C' + passenger.latitude + ',' + passenger.longitude;
      else
        url += '&markers=color:blue%7Clabel:D%7C' + passenger.latitude + ',' + passenger.longitude;
    });

    return url;
  };

  $scope.pasajeros = function(taxi) {
    var pasajeros = '';
    $.each(taxi, function (index, pasajero) {
      pasajeros += pasajero + ', ';
    })

    return pasajeros;
  }

  function findMarker(id, markers) {
    var marker;
    $.each(markers, function(index, m) {
      if(parseInt(m.id) == parseInt(id))
        marker = m;
    });
    return marker;
  }

}]);