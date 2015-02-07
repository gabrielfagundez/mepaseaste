function sendData() {

  // Mostramos en div de cargando cuando se presiona el botón
  $('.progress-indicator').show();

  var obj = new Object();

  // Seteamos el tipo de la tarifa
  var tarifa;
  if($('#tarifa_diurna').prop('checked')){
    tarifa = 'diurna'
  } else {
    tarifa = 'nocturna'
  }


  // Seteamos variables generales
  obj.tipo_tarifa = tarifa;
  obj.marcadores = new Array();

  obj.data_marcadores = new Array();

  // Agregamos la informacion de cada marcador para ser guardada
  for(var i = 0; i < markers.length; i++){
    var marcador_temporal = new Object();

    marcador_temporal.location_query_pos    = markers[i].markerId;
    marcador_temporal.latitude              = markers[i].position.lat();
    marcador_temporal.longitude             = markers[i].position.lng();
    marcador_temporal.address               = markers[i].address;
    marcador_temporal.icon                  = markers[i].icon

    obj.data_marcadores.push(marcador_temporal);
  }

  // Agregamos la informacion de distancias
  for(var i = 0; i < markers.length; i++){
    obj.marcadores.push(markers[i].distancias_anteriores_raw);
  }

  // Convertimos a JSON
  var json = JSON.stringify(obj);

  $.ajax({
    contentType: 'application/json',
    data: json,
    type: 'POST',
    url: '/api/queries/'
  });

}