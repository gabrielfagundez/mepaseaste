app.controller('ResultsController', ['$scope', '$location', 'Query', 'TextResultsHelper', function($scope, $location, Query, TextResultsHelper) {

  $scope.queryId = getIdFromRoute();

  // Variable que determina si los resultados se deben traer de un txt o no.
  $scope.resultsReady = false;

  $scope.totalCost = '[calculando..]';
  $scope.rateType = '[esperando información]';
  $scope.markersCount = '[esperando información]';
  $scope.taxisCount = '[esperando información]';
  $scope.taxis = [];
  $scope.markers = [];


  Query.get({ id: $scope.queryId }, function(data) {
    handleResourceSuccess(data);
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
    });

    return pasajeros;
  };

  $scope.costoTaxi = function(taxi) {
    console.log('Calculando costo taxi...')
    console.log('Sumo de 0 a', taxi[0]);
    var costo = $scope.costos[0][taxi[0]];
    $.each(taxi, function(index, pasajero) {
      if(index > 0) {
        console.log('Sumo de', taxi[index-1], 'a', taxi[index])
        costo += $scope.costos[taxi[index-1]][taxi[index]];
      }
    });

    return costo;
  };

  $scope.$on('queryParsed', function(data) {
    Query.get({ id: $scope.queryId }, function(data) {
      handleResourceSuccess(data)
    });
  });

  $scope.showSpinner = function() {
    return $scope.taxis.length == 0
  };

  function findMarker(id, markers) {
    var marker;
    $.each(markers, function(index, m) {
      if((parseInt(m.location_query_pos) - 1) == parseInt(id))
        marker = m;
    });
    return marker;
  }

  function getIdFromRoute() {
    var arr = $location.path().split('/');
    return arr[arr.length - 1];
  }

  function handleResourceSuccess(data) {
    $scope.rateType     = data.tipo_tarifa;
    $scope.markersCount = data.cantidad_marcadores;
    $scope.markers      = data.marcadores;

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
    });

    if(data.resolved) {
      $scope.costos       = data.costos;
      $scope.totalCost    = '$' + data.costo_total;
      $scope.taxisCount   = data.solution.length;
      $scope.taxis        = data.solution;
    } else {
      TextResultsHelper.process(data.id)
    }
  }

}]);