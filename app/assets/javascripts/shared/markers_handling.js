function createMarker(event) {
  infoWindow.close();

  if(markerId == 1) {
    icon = '/icon/start_marker.png';
  } else {
    icon = '/icon/end_marker.png';
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
    draggable: false,
    position: event.latLng,
    map: map,

    // App Variables
    markerId: markerId,
    nombre: nombre,
    icon: icon,
    start: start,

    address: '',

    // Esta sección se usa para la parte estándar
    distancias_anteriores_raw: new Array(),
    distancias_anteriores_string: new Array(),

    tiempos_anteriores_raw: new Array(),
    tiempos_anteriores_string: new Array(),

    // Esta sección se usa para la parte internacional
    costos_anteriores: new Array()
  });

  google.maps.event.addListener(marker, 'click', function() {
    showBubble(event.latLng, marker['markerId']);
    map.panTo(event.latLng);
  });


  // Calculamos la distancia desde el punto a los demas marcadores o el costo en caso de la sección internacional
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
        getMarkerByID(marker.markerId).address = results[0].formatted_address;
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
  });

  return marker;
}

function createMarkerGivenLatLng(latitude, longitude) {
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

  var position = new google.maps.LatLng(latitude, longitude),

      marker = new google.maps.Marker({
        draggable: false,
        position: position,
        map: map,

        // App Variables
        markerId: markerId,
        nombre: nombre,
        icon: icon,
        start: start,

        address: '',

        // Esta sección se usa para la parte estándar
        distancias_anteriores_raw: new Array(),
        distancias_anteriores_string: new Array(),

        tiempos_anteriores_raw: new Array(),
        tiempos_anteriores_string: new Array(),

        // Esta sección se usa para la parte internacional
        costos_anteriores: new Array()
      });

  google.maps.event.addListener(marker, 'click', function() {
    showBubble(position, marker['markerId']);
    map.panTo(position);
  });


  // Calculamos la distancia desde el punto a los demas marcadores o el costo en caso de la sección internacional
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
  geocoder.geocode({'latLng': position}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        $('#geocode_' + marker.markerId).html("<p>" + results[0].formatted_address + "</p>");
        getMarkerByID(marker.markerId).address = results[0].formatted_address;
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

function addMarkerToResultPage(latitude, longitude, icon, address, location_query_pos){
  position = new google.maps.LatLng(latitude, longitude)

  marker = new google.maps.Marker({
    draggable: false,
    position: position,
    map: map,
    icon: icon,
    address: address,
    markerId: location_query_pos
  });

  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    showBubble(event.latLng, marker['markerId']);
    map.panTo(event.latLng);
  });
};