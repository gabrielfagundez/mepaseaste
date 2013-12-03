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
    var costo = data.substr(11);

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

    html = formar_html(taxis)

    $('#formacion_taxis').append(html);

}

function formar_html(taxis){

    // Mostramos en pantalla cada taxi
    var html = ''
    for(var t=0; t<taxis.length; t++){
        var html = html +
            '<div id="formacion_taxis">' +
                '<div class="panel light-grey full-radius">' +
                    '<div class="taxi centered">' +
                        '<img src="/img/nsuparrow.png">' +
                            '<a>' +
                                '<div class="imagen-taxi" onclick="calcRoute(0)">' +
                                    '<img alt="Taxi" src="/img/taxi.png">' +
                                        '<br>' +
                                        '<br>' +
                                        '<h2>Taxi ' + t + '</h2>' +
                                '</div>' +
                            '</a><div class="texto-taxi">'

        var taxi = taxis[t]

        for(var i=0; i<taxis[t].length; i++){
            html = html +
                '<div class="taxi-interno-' + i + 1 + '">' +
                    '<img src="/img/place.png" width="30%">' +
                        '<div class="bold">' +
                            'Este lugar aun no tiene un nombre.' +
                        '</div>' +
                        '<p>' +
                            '' +
                        '</p>' +
                '</div>'

        }

        html = html + '</div></div></div></div>'

    }

    return html;
}