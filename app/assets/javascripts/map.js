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
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();

    // Instanciamos el geocoder
    geocoder = new google.maps.Geocoder();

    // Opciones del mapa
    var mapOptions = {
        zoom: zoom,
        center: new google.maps.LatLng(-34.7600432, -56.2019143),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Creamos el mapa
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Permitimos agregar marcadores
    if(allow_markers){
        google.maps.event.addListener(map, 'click', function(event, i) {
            createMarker(event);
        })
    };

    // Renderizador de direcciones bindeado al mapa
    var rendererOptions = {
        map: map,
        suppressMarkers: true
    }
    for(var ii=0; ii<4; ii++){
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        directionsDisplays.push(directionsDisplay);
    }

    // InfoWindow para el proximo paso
    stepDisplay = new google.maps.InfoWindow();

}


function createMarker(event) {
    infoWindow.close();

    if(markerId == 1) {
        icon = '/icon/start_marker.png';
    } else {
        icon = '/icon/end_marker.png';
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
    html =
        "<tr id='fila_" + marker.markerId + "'>" +
            "<a href='javascript:centerMarker(" + marker.markerId + ");'>" +
                "<th class='table-small'>" +
                    "<img src='/assets" + marker.icon + "'>" +
                "</th>" +
            "</a>" +
            "<th class='table-big' id='geocode_" + marker.markerId + "'><p>Obteniendo direccion.. </p></th>" +
            "<th class='table-big' id='nombre_" + marker.markerId + "' ><p>" + marker.nombre + "</p></th>" +
        "</tr>";
    tabla.append(html);

    // Borramos la indicacion superior
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


    // Realizamos el Geocode de las direcciones
    geocoder.geocode({'latLng': event.latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                $('#geocode_' + marker.markerId).html("<p>" + results[0].formatted_address + "</p>");
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });

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
    if(markerId > 2){
        marker.nombre = $('#nombre_marcador').val();
    } else {
        marker.nombre = $('#nombre_marcador_origen').val();
    }

    if(marker.nombre == ''){
        if(marker.markerId == 1){
            marker.nombre = 'Origen';
        } else {
            marker.nombre = 'Destino #' + (marker.markerId - 1);
        }
        $('#nombre_' + marker.markerId).html("<p>" + marker.nombre + "</p>");
    } else {
        $('#nombre_' + marker.markerId).html("<p>" + marker.nombre + "</p>");
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
        $('#con-datos').hide();
        $('#sin-datos').show();
        $('#boton_enviar_datos').hide();
    }

    if(markers.length > 1){
        $('#boton_enviar_datos').show();
    } else {
        $('#boton_enviar_datos').hide();
    }

}
