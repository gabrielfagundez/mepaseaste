function createMarker(event) {
  infoWindow.close();
  var origen = false;
  if(markerId == 1)
    origen = true;

  if(markerId == 1) {
    icon = '/icon/start_marker.png';
  } else {
    icon = '/icon/end_marker.png';
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
  var tabla = $('#markers-list');
  var html, name, color;
  if(origen) {
    html = '<div class="col-xs-4 col-xs-offset-4">';
    name = 'Origen';
    color = 'green';
  }
  else {
    html = '<div class="col-xs-4">';
    name = 'Pasajero #' + (marker.markerId  - 1);
    color = 'red';
  }

  html += '<div class="marker">' +
    '<a href="javascript:centerMarker(' + marker.markerId + ');">' +
      '<div class="name">' + name + '</div>' +
    '</a>' +
    "<div class='address-box' id='geocode_" + marker.markerId + "'>Obteniendo dirección..</div>" +
    '<div class="map"></div>';

  if(!origen) {
    html += '<div class="options">' +
      '<hr>' +
      '<div class="row">' +
        '<div class="delay">' +
          'Está el pasajero apresurado?' +
        '</div>' +
      '<div class="col-lg-4">' +
        '<div class="radio radio-danger">' +
          '<input checked="true" id="radio_ap_1_1" name="pasajero_1" type="radio" value="1">' +
          '<label for="radio_ap_1_1">No</label>' +
        '</div>' +
      '</div>' +
    '<div class="col-lg-4">' +
      '<div class="radio radio-danger">' +
        '<input id="radio_ap_2_1" name="pasajero_1" type="radio" value="2">' +
        '<label for="radio_ap_2_1">Poco</label>' +
      '</div>' +
    '</div>' +
    '<div class="col-lg-4">' +
      '<div class="radio radio-danger">' +
        '<input id="radio_ap_3_1" name="pasajero_1" type="radio" value="3">' +
        '<label for="radio_ap_3_1">Muy</label>' +
      '</div>' +
    '</div>' +
    '</div>';
  }
    html += '<hr>' +
    '<img src="http://maps.googleapis.com/maps/api/staticmap?center=' + event.latLng.lat() + ',' + event.latLng.lng() + '&zoom=15&markers=color:' + color + '%7Clabel:%7C' + event.latLng.lat() + ',' + event.latLng.lng() + '&size=200x100&sensor=false' + '">' +
    '</div>' +
    '</div>' +
  '</div>';

  if(origen)
    html += '<div class="clearfix"></div>';

  tabla.append(html);


  // Delete Info Box
  $('#con-datos').removeClass('hide');
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
        $('#geocode_' + marker.markerId).html(results[0].formatted_address);
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