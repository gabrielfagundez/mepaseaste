function calcRoute(t) {

    taxi = taxis[t];
    iter = 0;

    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // TODO: Eliminar rutas viejas

    // Now, clear the array itself.
    markerArray = [];

    for(var it=0; it<taxi.length; it++){
        if(it == 0){
            start = new google.maps.LatLng(getMarkerByID(1).position.lat(), getMarkerByID(1).position.lng());
            end = new google.maps.LatLng(getMarkerByID(taxi[0]).position.lat(), getMarkerByID(taxi[0]).position.lng());
        } else {
            start = new google.maps.LatLng(getMarkerByID(taxi[it-1]).position.lat(), getMarkerByID(taxi[it-1]).position.lng());
            end = new google.maps.LatLng(getMarkerByID(taxi[it]).position.lat(), getMarkerByID(taxi[it]).position.lng());
        }

        // Obtenemos el inicio y el fin y la ruta.
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        // Dibujamos las rutas y las mostramos en el mapa
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplays[iter].setDirections(response);
                iter = iter + 1;
                // showSteps(response);
            }
        });
    }
}