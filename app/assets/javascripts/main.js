// Global variables
var map;
var zoom = 10;
var infoWindow = new google.maps.InfoWindow();
var markerId = 1;
var taxis = new Array();

// This will handle every point on the map
var markers = new Array();
var distancias;
var tiempos;

// Variables para dibujar rutas
var directionsDisplays = new Array();
var directionsService;
var stepDisplay;
var markerArray = [];
var iter = 0;

// Variables para reverse geocoder
var geocoder;


function initialize(allow_markers) {
//    // Instantiate a directions service.
//    directionsService = new google.maps.DirectionsService();
//
//    // Instanciamos el geocoder
//    geocoder = new google.maps.Geocoder();

    var mapOptions = {
        zoom: zoom,
        center: new google.maps.LatLng(-34.7600432, -56.2019143),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Creamos el mapa
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    if(allow_markers){
        google.maps.event.addListener(map, 'click', function(event, i) {
            createMarker(event);
        })
    };

//    // Create a renderer for directions and bind it to the map.
//    var rendererOptions = {
//        map: map,
//        suppressMarkers: true
//    }
//
//    for(var ii=0; ii<4; ii++){
//        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
//        directionsDisplays.push(directionsDisplay);
//    }
//
//
//    // Instantiate an info window to hold step text.
//    stepDisplay = new google.maps.InfoWindow();

}

function createMarker(event) {
    infoWindow.close();

    if(markerId == 1) {
        icon = '/icon/start_marker.png';
    } else {
        icon = '/icon/ublip_parked.png';
    }

    if(markerId == 1) {
        nombre = 'Donde partimos?';
    } else {
        nombre = 'De quien es este hogar?';
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

        // Variables relativas a la aplicacion web
        markerId: markerId,
        nombre: nombre,
        icon: icon,
        start: start
    });

    google.maps.event.addListener(marker, 'click', function() {
        showBubble(event.latLng, marker['markerId']);
        map.panTo(event.latLng);
    });

    // Update marker id
    markerId = markerId + 1;

    markers.push(marker);

    // Actualizamos la tabla inferior
    tabla = $('#tabla_de_datos');
    if(marker.start) {
        tipo = 'Origen'
    } else {
        tipo = 'Destino'
    }

    html = "<tr id='fila_" + marker.markerId + "'>" +
        "<td class='datos_inside_table'>" + tipo + "</td>" +
        "<td class='datos_inside_table' id='nombre_" + marker.markerId + "' >" + marker.nombre + "</td>" +
        "<td class='datos_inside_table' id='latLng_" + marker.markerId + "' >" + event.latLng + "</td>" +
        "<td class='datos_inside_table' id='geocode_" + marker.markerId + "'>Obteniendo direccion.. </td>" +
        "<td class='datos_inside_table_peq'><a href='javascript:centerMarker(" + marker.markerId + ");'>(Ubicar)</a></td>" +
        "</tr>";
    tabla.append(html);
    $('#si_hay_datos').show();
    $('#no_hay_datos').hide();

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

    geocoder.geocode({'latLng': event.latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                $('#geocode_' + marker.markerId).html(results[0].formatted_address);
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });

    return marker;
}

function createMarkerFromData(id, nombre, position, icon, start){
    marker = new google.maps.Marker({
        draggable: false,
        position: position,
        map: map,

        // Variables relativas a la aplicacion web
        markerId: id,
        nombre: nombre,
        icon: icon,
        start: start
    });

    google.maps.event.addListener(marker, 'click', function() {
        showBubble(event.latLng, marker['markerId']);
        map.panTo(event.latLng);
    });

    markers.push(marker);
}

function centerMarker(id){
    marker = getMarkerByID(id);
    if(typeof marker != 'undefined'){
        map.panTo(marker.position);
        map.setZoom(15);
    }
}

function agregarNombre(){

    // En caso que el ultimo marcador sea un destino
    $('#outPopUp').hide();
    $('#inPopUp').hide();

    // En caso que el ultimo marcador sea origen
    $('#outPopUp_origen').hide();
    $('#inPopUp_origen').hide();

    // Obtenemos el marcador a modificar
    marker = getMarkerByID(markerId - 1);

    // Obtenemos el nombre del marcador
    if($('#nombre_marcador_origen').val() == ''){
        marker.nombre = $('#nombre_marcador').val();
    } else {
        marker.nombre = $('#nombre_marcador_origen').val();
    }

    if(marker.nombre == ''){
        if(marker.markerId == 1){
            marker.nombre = 'Origen';
        } else {
            marker.nombre = 'Destino ' + (marker.markerId - 1);
        }
        $('#nombre_' + marker.markerId).html(marker.nombre);
    } else {
        $('#nombre_' + marker.markerId).html(marker.nombre);
    };

    $('#nombre_marcador').val('');
    $('#nombre_marcador_origen').val('');
}

function eliminarUltimoMarcador(){

    // En caso que el ultimo marcador sea un destino
    $('#outPopUp').hide();
    $('#inPopUp').hide();

    // En caso que el ultimo marcador sea origen
    $('#outPopUp_origen').hide();
    $('#inPopUp_origen').hide();

    // Obtenemos el marcador a borrar
    marker = getMarkerByID(markerId - 1);

    // Quitamos de la tabla la ultima fila
    $('#tabla_de_datos tr:last').remove();

    markerId = markerId - 1;
    marker.setMap(null);

    markers.pop();

    if(markerId==1){
        $('#si_hay_datos').hide();
        $('#no_hay_datos').show();
        $('#boton_enviar_datos').hide();
    }

    if(markers.length > 1){
        $('#boton_enviar_datos').show();
    } else {
        $('#boton_enviar_datos').hide();
    }

}

function showBubble(point, id) {
    if(typeof map != "undefined" && map) {
        // Contenido de la burbuja emergente
        html = createBubble(point, id);

        // Mostramos la burbuja y recentramos el mapa
        infoWindow.setPosition(point);
        infoWindow.setContent(html);
        infoWindow.open(map);
    }
}

function createBubble(point, id) {
    infoWindow.close();

    marker = getMarkerByID(id);
    if(id == 1){
        nombre = 'Origen';
    } else {
        nombre = '<div id="bubble_' + id + '">' + marker.nombre + '</div>';
    }
    return nombre

}

function getMarkerByID(id) {
    for(var i=0; i < markers.length; i++) {
        var marker = markers[i];
        if(marker && marker.markerId == id) {
            return marker;
        }
    }
}

function clearOverlays() {
    for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers = [];
    markerId = 1;

    $('#tabla_de_datos').html('');

    $('#si_hay_datos').hide()
    $('#no_hay_datos').show()
    $('#boton_enviar_datos').hide();

}

// TODO: End this function
function update_name(id) {
    marker = getMarkerByID(id);
}

function sendData() {
    // Mostramos div de Waiting
    $('#waiting_big').show();

    if(markers.length > 14){
        $.get('/muchos_datos');
    } else {
        // Enviamos datos a la aplicacion rails
        var urls = new Array();

        // Enviamos los parametros dia/noche y rapido/preciso
        var url_datos = '/data?'
        url_datos = url_datos + 'tarifa_diurna=' + $('#select_dia_noche').val()
        url_datos = url_datos + '&algoritmo_rapido=' + $('#select_rapido_lento').val()
        urls.push(url_datos);

        // Enviamos los marcadores
        for(var iter_marker= 0; iter_marker<markers.length; iter_marker++) {

            // Formamos la url
            url_datos = '/marker?id=' + iter_marker;
            url_datos = url_datos + '&position=' + markers[iter_marker].position.lb + ',' + markers[iter_marker].position.mb;
            url_datos = url_datos + '&icon=' + markers[iter_marker].icon;
            url_datos = url_datos + '&nombre=' + markers[iter_marker].nombre;
            url_datos = url_datos + '&start=' + markers[iter_marker].start;

            // Mantenemos un arreglo de requests para sincronizarlas
            urls.push(url_datos);
        }

        // Array of requests
        var requests = new Array();
        for(var reqs=0; reqs<urls.length; reqs++){
            requests.push(sendMarkers(urls[reqs]))
        }

        var defer = $.when.apply($, requests);
        defer.done(function(){
            // Creamos la matriz de distancias
            distancias = new Array(markers.length);
            for(var l=0; l<markers.length; l++){
                distancias[l] = new Array(markers.length);
            };
            for(var l=0; l<markers.length; l++){
                distancias[l][l] = 0;
            }

            // Creamos la matriz de tiempos
            tiempos = new Array(markers.length);
            for(var l=0; l<markers.length; l++){
                tiempos[l] = new Array(markers.length);
            };
            for(var l=0; l<markers.length; l++){
                tiempos[l][l] = 0;
            }

            getDistances();
        });
    }
}

function getDistances(){
    var urls = new Array();

    // Iteramos en los marcador
    for(var iter=0; iter<markers.length - 1; iter++){
        url = 'http://maps.googleapis.com/maps/api/distancematrix/json?';
        url = url + 'origins=' + markers[iter].position.lb + ',' + markers[iter].position.mb;
        url = url + '&destinations=';
        var dests = ''
        for(var j=iter+1; j<markers.length; j++){
            if(j==iter+1){
                dests = markers[j].position.lb + ',' + markers[j].position.mb
            } else {
                dests =  dests + '|' + markers[j].position.lb + ',' + markers[j].position.mb
            }
        }
        url = url + dests;
        url = url + '&mode=driving&language=es&sensor=false';

        urls.push(url);
    };

    // Array of requests
    var requests = new Array();
    for(var reqs=0; reqs<markers.length-1; reqs++){
        requests.push(getDistance(urls[reqs]))
    }

    var defer = $.when.apply($, requests);
    defer.done(function(){
        // Enviamos los datos a la aplicacion Rails
        for(var row=0; row<markers.length; row++){
            url = '';
            url = url + '/send_distances?'
            url = url + 'cantidad=' + markers.length + '&origen=' + row + '&';
            for(var fil=0; fil<markers.length; fil++){
                indice = fil + '=';
                url = url + indice + distancias[row][fil] + '&';
            }
            $.get(url);
        }
    });
}

function getDistance(url){
    // Consultamos la API de distancias
    return $.ajax({
        url: url,
        success: function(data){
            var i = (markers.length) - (data.rows[0].elements.length) - 1;
            for(var j=i+1; j<markers.length; j++){

                status = data.rows[0].elements[j-i-1].status;
                if(status== 'ZERO_RESULTS'){
                    $.get('/consulta_invalida');
                }
                if(status == 'NOT_FOUND'){
                    $.get('/not_geo');
                }
                if(status == 'OK'){
                    // Realizamos la consulta a la API de distancias/tiempo y almacenamos los datos
                    distancias[i][j] = data.rows[0].elements[j-i-1].distance.value;
                    distancias[j][i] = data.rows[0].elements[j-i-1].distance.value;

                    tiempos[i][j] = data.rows[0].elements[j-i-1].duration.value;
                    tiempos[j][i] = data.rows[0].elements[j-i-1].duration.value;
                }
            }
        },
        error: function(data){
            // TODO: Handle that
            console.log('Hubo un error.');
        }
    });
}

function sendMarkers(url){
    $.ajax(url, function(data) {
        // Do nothing
    });
}

function showResultsOnLoad(){

    // Mostramos el div de Waiting
    $('#waiting_big').show();

    fileExists('raw_results.txt');
}

function fileExists(file_name){
    $.ajax({
        url: file_name,
        type:'HEAD',
        error: function() {
            setTimeout(function() {
                // Llamar a esta funcion nuevamente despues de 20 milisegundos
                fileExists(file_name);
            }, 20);
        },
        success: function() {
            $.ajax({
                url: file_name,
                success: function(data) {
                    if(data.match(/Solution/)){

                        // Ocultamos el div de Waiting
                        $('#waiting_big').hide();

                        llenar_con_datos(data);
                    } else {
                        setTimeout(function() {
                            // Llamar a esta funcion nuevamente despues de 20 milisegundos
                            fileExists(file_name);
                        }, 100);
                    }
                }
            })
        }
    });
}

function llenar_con_datos(data){
    string = data.substr(11);
    var arreglo_numeros = new Array();

    // Obtengo la posicion de la 'F'
    var pos_F = 0;
    for(var letra=0; letra<string.length; letra++){
        if(string.substr(letra, 1) == 'F'){
            pos_F = letra;
        }
    };

    // Obtenemos el string
    string = string.substr(0, pos_F);

    // Recorro el string y obtengo los numeros
    for(var letra=0; letra<string.length; letra++){
        if(string.substr(letra, 1) != ' '){
            if(string.substr(letra, 1) <= '9' && string.substr(letra, 1) >= '0'){
                if(string.substr(letra+1, 1) <= '9' && string.substr(letra+1, 1) >= '0'){
                    arreglo_numeros.push(string.substr(letra, 2));
                    letra = letra + 1;
                } else {
                    arreglo_numeros.push(string.substr(letra, 1));
                }
            }
        }
    }

    // ***************************
    // Armamos un arreglo de taxis
    var nuevo_taxi      = true;
    var taxi;

    for(var iterador=0; iterador<arreglo_numeros.length; iterador++){
        if(nuevo_taxi){
            taxi = new Array();
            nuevo_taxi = false;
        };

        if(arreglo_numeros[iterador] != ' ' && arreglo_numeros[iterador] != '0'){
            taxi.push(arreglo_numeros[iterador]);
            if(iterador == (arreglo_numeros.length - 1)){
                taxis.push(taxi);
            }
        };

        if(arreglo_numeros[iterador] == '0'){
            if(taxi.length > 0){
                taxis.push(taxi);
            }

            // Seteo esta variable el true para crear un nuevo taxi
            nuevo_taxi = true;
        }
    }

//    // Imprimo en consola formacion de taxis
//    console.log('Formacion de Taxis:');
//    console.log(taxis);


    // *********************
    // Parseo el costo total
    var costo = data.substr(11);

    // Obtengo la posicion de la 'F'
    var pos_F = 0;
    for(var letra=0; letra<costo.length; letra++){
        if(costo.substr(letra, 1) == 'F'){
            pos_F = letra;
        }
    };

    // Obtenemos el costo
    costo = costo.substr(pos_F + 9);

    // Mostramos el costo
    $('#costo_total').append(costo);
    $('#costo_total_calculando').hide();
    $('#costo_total').show();

    // Mostramos la cantidad de taxis
    $('#cantidad_taxis').append(taxis.length);
    $('#cantidad_taxis_calculando').hide();
    $('#cantidad_taxis').show();

    // Mostramos en pantalla cada taxi
    var html = ''
    for(var t=0; t<taxis.length; t++){

        html = "<div class='taxi'><div class='imagen_taxi'><a onclick='calcRoute("
            + t + ")'><img src='taxi.png' height='50px'></a></div><div class='taxi_interno'>[";

        // Iteramos en los pasajeros
        for(var p=0; p<taxis[t].length - 1;p++){
            m = getMarkerById(taxis[t][p]);
            html = html + "<a onclick='centerMarker(" + taxis[t][p] + ")' class='link_center_results'>" + m.nombre + "</a>" + ' => ';
        }

        // Agregamos el ultimo pasajero
        m = getMarkerById(taxis[t][(taxis[t].length-1)]);
        html = html + "<a onclick='centerMarker(" + taxis[t][(taxis[t].length-1)] + ")' class='link_center_results'>" + m.nombre + "</a>" + ']';

        // Cerramos las etiquetas
        html = html + "</div></div><br>";

        if(t == taxis.length - 1){
            html = html + "<br><div class='lineas_internas'></div>";
        }

        $('#calculando_taxis').hide();
        $('#formacion_taxis').append(html);
    }

}

// Get a marker object based on id
function getMarkerById(id) {
    for(var i=0; i < markers.length; i++) {
        var m = markers[i];
        if(m.markerId == id)
            return m;
    }
    return null;
}

function mostrarInstrucciones(){
    $('#instruccionesOut').show();
    $('#instruccionesIn').show();
}

function calcRoute(t) {

    taxi = taxis[t];
    iter = 0;

    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // Now, clear the array itself.
    markerArray = [];

    for(var it=0; it<taxi.length; it++){
        if(it == 0){
            start = new google.maps.LatLng(getMarkerByID(0).position.lb, getMarkerByID(0).position.mb);
            end = new google.maps.LatLng(getMarkerByID(taxi[0]).position.lb, getMarkerByID(taxi[0]).position.mb);
        } else {
            start = new google.maps.LatLng(getMarkerByID(taxi[it-1]).position.lb, getMarkerByID(taxi[it-1]).position.mb);
            end = new google.maps.LatLng(getMarkerByID(taxi[it]).position.lb, getMarkerByID(taxi[it]).position.mb);
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



// SHOW DETAILS
//function showSteps(directionResult) {
//    // For each step, place a marker, and add the text to the marker's
//    // info window. Also attach the marker to an array so we
//    // can keep track of it and remove it when calculating new
//    // routes.
//    var myRoute = directionResult.routes[0].legs[0];
//
//    for (var i = 0; i < myRoute.steps.length; i++) {
//        var marker = new google.maps.Marker({
//            position: myRoute.steps[i].start_point,
//            map: map
//        });
//        attachInstructionText(marker, myRoute.steps[i].instructions);
//        markerArray[i] = marker;
//    }
//}
//
//function attachInstructionText(marker, text) {
//    google.maps.event.addListener(marker, 'click', function() {
//        // Open an info window when the marker is clicked on,
//        // containing the text of the step.
//        stepDisplay.setContent(text);
//        stepDisplay.open(map, marker);
//    });
//}