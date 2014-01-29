function initialize(allow_markers, show_loading) {

    // Si estamos en la página de mostrar resultados mostramos el div de loading
    if(show_loading){
//        $('.progress-indicator').show();
    }

    // Servicio de Direcciones
    directionsService = new google.maps.DirectionsService();

    // Geocoder
    geocoder = new google.maps.Geocoder();

    // Opciones del mapa
    var mapOptions = {
        zoom: zoom,
        center: new google.maps.LatLng(-34.7600432, -56.2019143),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Mapa
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Permitir marcadores
    if(allow_markers){
        google.maps.event.addListener(map, 'click', function(event, i) {
            createMarker(event);
        })
    };

    // Map routes renderer
    var rendererOptions = {
        map: map,
        suppressMarkers: true
    }
    for(var ii=0; ii<4; ii++){
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        directionsDisplays.push(directionsDisplay);
    }

    // Información del próximo paso
    stepDisplay = new google.maps.InfoWindow();

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
