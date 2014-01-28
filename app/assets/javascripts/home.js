$(function(){
  $('#agregar_marcador').click(function(){
    createMarkerGivenLatLng($('#agregar_marcador').data().latitude, $('#agregar_marcador').data().longitude);
  })
});