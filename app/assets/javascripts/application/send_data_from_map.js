function sendData() {
    var obj = new Object();

    // Seteamos variables generales
    obj.tipo_tarifa = 'diurna';
    obj.marcadores = new Array();

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
        url: '/sending_data'
    });

}