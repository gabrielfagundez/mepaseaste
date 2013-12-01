var current_marker;

function addNewPoint(marker, cant_markers) {

    if(cant_markers != 0){

        // Seteamos la variable global de marcadores
        current_marker = marker;

        // Variables de consulta
        origin = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        destinations = new Array()

        for(var actual_pos = 0; actual_pos < cant_markers; actual_pos++) {
            destinations.push(new google.maps.LatLng(markers[actual_pos].position.lat(), markers[actual_pos].position.lng()));
        }

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: destinations,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidHighways: false,
                avoidTolls: false
            },
            processDistances
        );
    }
}


// Importante:
// Cada marcador posee información relativa a todos los anteriores marcadores
// ingresados en el sistema. De esta forma, se alivia la carga a Google una vez que
// se envía la información final.
function processDistances(response, status){

    console.log(response);

    if (status == google.maps.DistanceMatrixStatus.OK) {

        // Obtenemos el origen
        var origins = response.originAddresses;

        // Obtenemos los destinos
        var destinations = response.destinationAddresses;

        // Obtenemos la matriz de distancias
        var distancias = response.rows[0]['elements'];

        // Almacenamos las distancias de cada uno
        for(var iter_res = 0; iter_res < distancias.length; iter_res++){

            console.log(distancias[iter_res]);

            // Verificamos que no haya error en la distancia puntual
            if(distancias[iter_res]['status'] == google.maps.DistanceMatrixStatus.OK) {

                // Obtenemos los datos puntuales
                distancia = distancias[iter_res]['distance'];
                tiempo = distancias[iter_res]['duration'];

                // Actualizamos el marker con los datos de Google
                current_marker.distancias_anteriores_string.push(distancia['text']);
                current_marker.distancias_anteriores_raw.push(distancia['value']);
                current_marker.tiempos_anteriores_string.push(tiempo['text']);
                current_marker.tiempos_anteriores_raw.push(tiempo['value']);

            } else {
                alert('Ocurrió un error en la funcion de obtener distacia - La llamada a Google dio error en un punto específico');
            }
        }
    } else {
        alert('Ocurrió un error en la funcion de obtener distancia - La llamada a Google dio Success pero devolvio error interno');
    }

}
