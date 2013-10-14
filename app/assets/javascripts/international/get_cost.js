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
