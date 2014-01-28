$(function(){
  $('#agregar_marcador').click(function(){
    createMarkerGivenLatLng($('#agregar_marcador').data().latitude, $('#agregar_marcador').data().longitude);
    $('#modalDestinosUsuales').foundation('reveal', 'close');

    // Zoom al punto ingresado
    var position = new google.maps.LatLng($('#agregar_marcador').data().latitude, $('#agregar_marcador').data().longitude);
    map.panTo(position);
    map.setZoom(15);
  })
});