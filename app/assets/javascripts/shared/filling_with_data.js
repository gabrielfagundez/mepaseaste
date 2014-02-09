function fileExists(file_name, query_id){
  $.ajax({
    url: file_name,
    type:'HEAD',
    error: function() {
      setTimeout(function() {
        // Llamar a esta funcion nuevamente despues de 20 milisegundos
        fileExists(file_name, query_id);
      }, 20);
    },
    success: function() {
      $.ajax({
        url: file_name,
        success: function(data) {
          if(data.match(/Solution/)){

            console.log('JS Debug - Solution of the AE :');
            console.log(data);
            console.log('JS Debug - END :');

            // Quitamos el div de cargando una vez tenemos datos
            $('.progress-indicator').hide();

            llenar_con_datos(data, query_id);
          } else {
            setTimeout(function() {
              // Llamar a esta funcion nuevamente despues de 20 milisegundos
              fileExists(file_name, query_id);
            }, 100);
          }
        }
      })
    }
  });
}


function llenar_con_datos(data, query_id){

  // Quitamos el inicio
  //  Ej:
  //    data = "Solution:  0 1 3 2 0 Fitness: 518.76"
  //    string = data.substr(11);
  //    string = "0 1 3 2 0 Fitness: 518.76"
  string = data.substr(11);

  // Obtengo la posicion de la 'F'
  //  En este caso la respuesta sera 10
  var pos_F = 0;
  for(var letra=0; letra<string.length; letra++){
    if(string.substr(letra, 1) == 'F'){
      pos_F = letra;
    }
  };

  // Obtenemos el string
  //  Ej:
  //    string = string.substr(0, pos_F);
  //    string = "0 1 3 2 0 "
  string = string.substr(0, pos_F);

  // Inicializamos el arreglo de numeros
  var arreglo_numeros = new Array();

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

  // Armamos un arreglo de taxis
  var nuevo_taxi = true;
  var taxi;

  var obj = new Object();
  obj.query_id = query_id;
  obj.solution = new Array();


  for(var iterador=0; iterador<arreglo_numeros.length; iterador++){
    if(nuevo_taxi){
      taxi = new Array();
      nuevo_taxi = false;
    };

    if(arreglo_numeros[iterador] != ' ' && arreglo_numeros[iterador] != '0'){
      taxi.push(arreglo_numeros[iterador]);
      if(iterador == (arreglo_numeros.length - 1)){
        taxis.push(taxi);
        obj.solution.push(taxi);
      }
    };

    if(arreglo_numeros[iterador] == '0'){
      if(taxi.length > 0){
        taxis.push(taxi);
        obj.solution.push(taxi);
      }

      // Seteo esta variable el true para crear un nuevo taxi
      nuevo_taxi = true;
    }
  }

  // Parseo el costo total
  //  Ej:
  //    data = "Solution:  0 1 3 2 0 Fitness: 518.76"
  //    costo = data.substr(11).substr(pos_F + 9);
  //    costo = "518.76"
  var costo = data.substr(11).substr(pos_F + 9);

  // Convertimos a JSON
  obj.costo = costo;
  var json = JSON.stringify(obj);

  // Guardo los taxis
  $.ajax({
    contentType: 'application/json',
    data: json,
    type: 'POST',
    url: '/save_query'
  });

  // Mostramos el costo
  $('#costo_total').append(costo);
  $('#costo_total_calculando').hide();
  $('#costo_total').show();

  html = formar_html(taxis)

  $('#formacion_taxis').append(html);

}

function formar_html(taxis){

  console.log(taxis);

  // Mostramos en pantalla cada taxi
  var html = ''
  for(var t=0; t<taxis.length; t++){
    var html = html +
        '<div class="without_bottom_space panel light-grey full-radius">' +
          '<div class="row">' +
            '<div class="small-4 columns">' +
              '<a></a>' +
              '<div class="panel full-radius center"><a></a>' +
                '<a class="has-tip" data-tooltip="" href="#" title="Has click dibujar la ruta de este taxi en el mapa" onclick="calcRoute(' + t+1 + ')" >' +
                  '<img height="130px" src="/img/taxi-icon.png" width="130px">' +
                '</a>' +
              '</div>' +
              '<div class="taxi_cost">' +
                'TBD' +
                '<br>' +
              '</div>' +
            '</div>'

    var taxi = taxis[t]

    console.log(taxi);

    for(var i=0; i<taxis[t].length; i++){
      html = html +
          '<div class="small-2 columns">' +
            '<div class="panel radius center">' +
              'Pasajero ' + i + '<br><br>' +
              '<div class="panel full-radius">' +
                '<a class="has-tip tip-bottom" data-tooltip="" href="#" title="Ubicar este pasajero en el mapa" onclick="centerMap(' + getMarkerByID(parseInt(taxis[t][i]) + 1).position.lat() + ',' + getMarkerByID(parseInt(taxis[t][i]) + 1).position.lng() + ')" >' +
                  '<img height="40px" src="/img/passenger.png" width="40px">' +
                '</a>' +
              '</div>' +
              '<div class="taxi_address">' +
                getMarkerByID(parseInt(taxis[t][i]) + 1).address +
              '</div>' +
            '</div>' +
          '</div>'
    }

    if (taxi.length == 1) {
      html = html + '<div class="small-2 columns hide">Empty</div><div class="small-2 columns hide">Empty</div><div class="small-2 columns hide">Empty</div>';
    } else if (taxi.length == 2) {
      html = html + '<div class="small-2 columns hide">Empty</div><div class="small-2 columns hide">Empty</div>';
    } else if (taxi.length == 3) {
      html = html + '<div class="small-2 columns hide">Empty</div>';
    }

    html = html + '</div></div>';
  }

  return html;
}