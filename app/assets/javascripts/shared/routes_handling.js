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
            start = new google.maps.LatLng(getMarkerByID(0).position.jb, getMarkerByID(0).position.kb);
            end = new google.maps.LatLng(getMarkerByID(taxi[0]).position.jb, getMarkerByID(taxi[0]).position.kb);
        } else {
            start = new google.maps.LatLng(getMarkerByID(taxi[it-1]).position.jb, getMarkerByID(taxi[it-1]).position.kb);
            end = new google.maps.LatLng(getMarkerByID(taxi[it]).position.jb, getMarkerByID(taxi[it]).position.kb);
        }

        // Retrieve the start and end locations and create
        // a DirectionsRequest using WALKING directions.
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        // Route the directions and pass the response to a
        // function to create markers for each step.
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplays[iter].setDirections(response);
                iter = iter + 1;
                // showSteps(response);
            }
        });
    }
}