function createMarker(event) {
    infoWindow.close();

    if(markerId == 1) {
        icon = 'icon/start_marker.png';
    } else {
        icon = 'icon/end_marker.png';
    }

    if(markerId == 1) {
        nombre = 'Desde dónde partimos?';
    } else {
        nombre = 'De quién es este hogar?';
    }

    if(markerId == 1) {
        start = true;
    } else {
        start = false;
    }

    marker = new google.maps.Marker({
        draggable: true,
        position: event.latLng,
        map: map,

        // App Variables
        markerId: markerId,
        nombre: nombre,
        icon: icon,
        start: start,
        distancias_anteriores_raw: new Array(),
        distancias_anteriores_string: new Array(),


        tiempos_anteriores_raw: new Array(),
        tiempos_anteriores_string: new Array()
    });

    google.maps.event.addListener(marker, 'click', function() {
        showBubble(event.latLng, marker['markerId']);
        map.panTo(event.latLng);
    });


    // Calculamos la distancia desde el punto a los demas marcadores
    addNewPoint(marker, markers.length);

    // Update marker ID
    markerId = markerId + 1;
    markers.push(marker);


    // Update table
    tabla = $('#tabla_de_datos');
    html =
        "<tr id='fila_" + marker.markerId + "'>" +
            "<a href='javascript:centerMarker(" + marker.markerId + ");'>" +
            "<th class='table-small'>" +
            "<img src='" + marker.icon + "'>" +
            "</th>" +
            "</a>" +
            "<th class='table-big' id='geocode_" + marker.markerId + "'><p>Obteniendo dirección.. </p></th>" +
            "<th class='table-big' id='nombre_" + marker.markerId + "' ><p>" + marker.nombre + "</p></th>" +
            "</tr>";
    tabla.append(html);


    // Delete Info Box
    $('#con-datos').show();
    $('#sin-datos').hide();

    if(markers.length == 1) {
        $('#outPopUp_origen').show();
        $('#inPopUp_origen').show();
    } else {
        $('#outPopUp').show();
        $('#inPopUp').show();
    }

    if(markers.length > 1){
        $('#boton_enviar_datos').show();
    }


    // Geocode the direction
    geocoder.geocode({'latLng': event.latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                $('#geocode_' + marker.markerId).html("<p>" + results[0].formatted_address + "</p>");

                // Redimensionamos el mapa si es necesario
                redimensionMap();
                google.maps.event.trigger(map, 'resize');
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });

    // Resize map
    redimensionMap();
    google.maps.event.trigger(map, 'resize');

    return marker;
}


function getMarkerByID(id) {
    for(var i=0; i < markers.length; i++) {
        var marker = markers[i];
        if(marker && marker.markerId == id) {
            return marker;
        }
    }
}

function addNewPoint(marker, cant_markers) {

    if(cant_markers != 0){

        // Calculamos la distancia a los demas marcadores ingresados
        url = 'http://maps.googleapis.com/maps/api/distancematrix/json?';
        url = url + 'origins=' + marker.position.lat() + ',' + marker.position.lng();
        url = url + '&destinations=';

        // Iteramos en los marcadores
        var dests = ''
        for(var actual_pos = 0; actual_pos < cant_markers; actual_pos++) {
            if(actual_pos == 0){
                dests = markers[actual_pos].position.lat() + ',' + markers[actual_pos].position.lng();
            } else {
                dests =  dests + '|' + markers[actual_pos].position.lat() + ',' + markers[actual_pos].position.lng();
            }
        }
        url = url + dests;
        url = url + '&mode=driving&language=es&sensor=false';

        console.log(url);

        getDistance(marker, url);
    }


}


// Importante:
// Cada marcador posee información relativa a todos los anteriores marcadores
// ingresados en el sistema. De esta forma, se alivia la carga a Google una vez que
// se envía la información final.
function getDistance(marker, url){

    // Consultamos la API de distancias
    return $.ajax({
        url: url,
        success: function(data){

            if(data['status'] == 'OK'){

                // Obtenemos la matriz de distancias
                distancias = data['rows'][0]['elements'];

                // Almacenamos las distancias de cada uno
                for(var iter_res = 0; iter_res < distancias.length; iter_res++){

                    // Verificamos que no haya error en la distancia puntual
                    if(distancias[iter_res]['status'] == 'OK') {

                        // Obtenemos los datos puntuales
                        distancia = distancias[iter_res]['distance'];
                        tiempo = distancias[iter_res]['duration'];

                        // Actualizamos el marker con los datos de Google
                        marker.distancias_anteriores_string.push(distancia['text']);
                        marker.distancias_anteriores_raw.push(distancia['value']);
                        marker.tiempos_anteriores_string.push(tiempo['text']);
                        marker.tiempos_anteriores_raw.push(tiempo['value']);

                    } else {
                        alert('Ocurrió un error en la funcion de obtener distacia - La llamada a Google dio error en un punto específico');
                    }
                }

            } else {
                alert('Ocurrió un error en la funcion de obtener distancia - La llamada a Google dio Success pero devolvio error interno');
            }
        },
        error: function(data){
            alert('Ocurrió un error en la funcion de obtener distancia - La llamada a Google NO dio Success');
        }
    });

}
