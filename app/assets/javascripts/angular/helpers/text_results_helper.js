app.factory('TextResultsHelper', ['$rootScope', function($rootScope) {

  var AEResults;
  var greedyResults;

  var fileExists = function(file_name, query_id) {
    console.log('JS Debug - Retrieving', file_name);
    console.log('JS Debug - Query ID:', query_id);

    $.ajax({
      url: file_name,
      type:'HEAD',
      error: function() {
        setTimeout(function() {
          console.log('JS Debug - AE file retrieving failed');
          fileExists(file_name, query_id);
        }, 20);
      },
      success: function() {
        $.ajax({
          url: file_name,
          success: function(data) {
            if(data.match(/Solution/)) {

              console.log('JS Debug - Solution of the AE :');
              console.log(data);
              console.log('JS Debug - END :');

              AEResults = data;

              $.ajax({
                url: '/' + query_id + '/raw_greedy_results.txt',
                success: function(data) {
                  greedyResults = data;
                  processData(query_id);
                }
              })
            } else {
              setTimeout(function() {
                console.log('JS Debug - AE file retrieving failed');
                fileExists(file_name, query_id);
              }, 100);
            }
          }
        })
      }
    });
  };

  var processAEResult = function(data, query_id) {

    // Quitamos el inicio
    //  Ej:
    //    data = "Solution:  0 1 3 2 0 Fitness: 518.76"
    //    string = data.substr(11);
    //    string = "0 1 3 2 0 Fitness: 518.76"
    string = data.substr(11);

    // Obtengo la posicion de la 'F'
    //  En este caso la respuesta sera 10
    var pos_F = 0;
    for(var letra=0; letra<string.length; letra++) {
      if(string.substr(letra, 1) == 'F') {
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
    for(var letra=0; letra<string.length; letra++) {
      if(string.substr(letra, 1) != ' ') {
        if(string.substr(letra, 1) <= '9' && string.substr(letra, 1) >= '0') {
          if(string.substr(letra+1, 1) <= '9' && string.substr(letra+1, 1) >= '0') {
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


    for(var iterador=0; iterador<arreglo_numeros.length; iterador++) {
      if(nuevo_taxi) {
        taxi = new Array();
        nuevo_taxi = false;
      };

      if(arreglo_numeros[iterador] != ' ' && arreglo_numeros[iterador] != '0') {
        taxi.push(arreglo_numeros[iterador]);
        if(iterador == (arreglo_numeros.length - 1)) {
          taxis.push(taxi);
          obj.solution.push(taxi);
        }
      };

      if(arreglo_numeros[iterador] == '0') {
        if(taxi.length > 0) {
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
      type: 'PATCH',
      url: '/api/queries/' + query_id,
      success: function() {
        $rootScope.$broadcast('queryParsed', { query_id: query_id })
      }
    });
  };

  var processGreedyResult = function(data, query_id) {

    // Quitamos el inicio
    //  Ej:
    //    data = "Solution: 0 1 3 2 0 Fitness: 518.76"
    //    string = data.substr(11);
    //    string = "0 1 3 2 0 Fitness: 518.76"
    string = data.substr(10);

    // Obtengo la posicion de la 'F'
    //  En este caso la respuesta sera 10
    var pos_F = 0;
    for(var letra=0; letra<string.length; letra++) {
      if(string.substr(letra, 1) == 'F') {
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
    for(var letra=0; letra<string.length; letra++) {
      if(string.substr(letra, 1) != ' ') {
        if(string.substr(letra, 1) <= '9' && string.substr(letra, 1) >= '0') {
          if(string.substr(letra+1, 1) <= '9' && string.substr(letra+1, 1) >= '0') {
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


    for(var iterador=0; iterador<arreglo_numeros.length; iterador++) {
      if(nuevo_taxi) {
        taxi = new Array();
        nuevo_taxi = false;
      };

      if(arreglo_numeros[iterador] != ' ' && arreglo_numeros[iterador] != '0') {
        taxi.push(arreglo_numeros[iterador]);
        if(iterador == (arreglo_numeros.length - 1)) {
          taxis.push(taxi);
          obj.solution.push(taxi);
        }
      };

      if(arreglo_numeros[iterador] == '0') {
        if(taxi.length > 0) {
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
    var costo = data.substr(10).substr(pos_F + 9);

    // Convertimos a JSON
    obj.costo = costo;
    var json = JSON.stringify(obj);

    // Guardo los taxis
    $.ajax({
      contentType: 'application/json',
      data: json,
      type: 'PATCH',
      url: '/api/queries/' + query_id,
      success: function() {
        $rootScope.$broadcast('queryParsed', { query_id: query_id })
      }
    });
  };

  var processData = function(query_id) {
    var AECost     = tripCost(AEResults);
    var greedyCost = tripCost(greedyResults);

    if(parseInt(AECost) < parseInt(greedyCost))
      processAEResult(AEResults, query_id);
    else
      processGreedyResult(greedyResults, query_id);
  };

  var tripCost = function(data) {

    // Quitamos el inicio
    //  Ej:
    //    data = "Solution: 0 1 3 2 0 Fitness: 518.76"
    //    string = data.substr(11);
    //    string = "0 1 3 2 0 Fitness: 518.76"
    string = data.substr(10);

    // Obtengo la posicion de la 'F'
    //  En este caso la respuesta sera 10
    var pos_F = 0;
    for(var letra=0; letra<string.length; letra++) {
      if(string.substr(letra, 1) == 'F') {
        pos_F = letra;
      }
    }

    // Parseo el costo total
    //  Ej:
    //    data = "Solution:  0 1 3 2 0 Fitness: 518.76"
    //    costo = data.substr(11).substr(pos_F + 9);
    //    costo = "518.76"
    var costo = data.substr(10).substr(pos_F + 9);

    console.log('El costo del viaje es de: ')
    console.log(costo);

    return costo;
  };

  var service = {
    process: function(query_id) {
      fileExists('/' + query_id + '/raw_results.txt', query_id)
    }
  };

  return service;
}]);