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

    // Armamos un arreglo de taxis
    var nuevo_taxi = true;
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


    // Mostramos en pantalla cada taxi
    var html = ''
    for(var t=0; t<taxis.length; t++){

//        html = "<div class='taxi'><div class='imagen_taxi'><a onclick='calcRoute("
//            + t + ")'><img src='taxi.png' height='50px'></a></div><div class='taxi_interno'>[";
//
//        // Iteramos en los pasajeros
//        for(var p=0; p<taxis[t].length - 1;p++){
//            m = getMarkerById(taxis[t][p]);
//            html = html + "<a onclick='centerMarker(" + taxis[t][p] + ")' class='link_center_results'>" + m.nombre + "</a>" + ' => ';
//        }
//
//        // Agregamos el ultimo pasajero
//        m = getMarkerById(taxis[t][(taxis[t].length-1)]);
//        html = html + "<a onclick='centerMarker(" + taxis[t][(taxis[t].length-1)] + ")' class='link_center_results'>" + m.nombre + "</a>" + ']';

        html = "<div class='panel yellow-background'>\
            <div class='taxi'>\
                <div class='imagen-taxi'></div>\
                <div class='texto-taxi'>Este taxi es dinámico, falta rellenar con datos.</div>\
            </div>\
        </div>"

        $('#formacion_taxis').append(html);

    }

}