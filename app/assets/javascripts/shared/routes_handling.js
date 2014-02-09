var iter = 0;

function calcRoute(t) {

  iter = 0;

  var start, end;

  // Borramos las rutas viejas
  for(var ds=0; ds<4; ds++){
    directionsDisplays[ds].setMap(null);
  }

  // Nos movemos hacia el mapa
  $('html, body').animate({
    scrollTop: $("#map").offset().top - 50
  }, 800);

  // Taxi tiene la forma: [2, 3, 1, 7]
  taxi = taxis[t];

  // Iteramos en cada tramo y lo dibujamos en el mapa
  for (it = 0; it < 4; it++){

    // Si el taxi va desde el origen al primer marcador
    if(it == 0){
      start = new google.maps.LatLng(getMarkerByID(1).position.lat(), getMarkerByID(1).position.lng());
      end = new google.maps.LatLng(getMarkerByID(parseInt(taxi[0]) + 1).position.lat(), getMarkerByID(parseInt(taxi[0]) + 1).position.lng());
    }

    if (it > 0 && it < taxi.length ) {
      start = new google.maps.LatLng(getMarkerByID(parseInt(taxi[it-1])  + 1).position.lat(), getMarkerByID(parseInt(taxi[it-1]) + 1).position.lng());
      end = new google.maps.LatLng(getMarkerByID(parseInt(taxi[it]) + 1).position.lat(), getMarkerByID(parseInt(taxi[it]) + 1).position.lng());
    }

    if(it < taxi.length){
      // Obtenemos el inicio y el fin y la ruta
      var route = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(route, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplays[iter].setDirections(response);
          directionsDisplays[iter].setMap(map);

          iter = iter + 1;
        }
      });
    } else {
      directionsDisplays[it].setMap(null);
    }

  }
}

function centerMap(latitude, longitude){
  position = new google.maps.LatLng(latitude, longitude);
  map.panTo(position);
  map.setZoom(16);

  $('html, body').animate({
    scrollTop: $("#map").offset().top - 50
  }, 800);
}

function autoCenter(){
  var limits = new google.maps.LatLngBounds();
  $.each(markers, function (index, marker){
    limits.extend(marker.position);
  });
  map.fitBounds(limits);
}