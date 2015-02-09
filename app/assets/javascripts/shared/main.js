// Global variables
var map;
var zoom = 11;
var infoWindow = new google.maps.InfoWindow();
var markerId = 1;
var taxis = new Array();

// This will handle every point on the map
var markers = new Array();
var distancias;
var tiempos;

// Variables para dibujar rutas
var directionsDisplays = new Array();
var directionsService;
var stepDisplay;
var markerArray = [];
var iter = 0;

// Variables para reverse geocoder
var geocoder;

// Esta variable hace referencia a la API KEY para usar la API de taxis internacional
var apikey = 'd6apr3UDROuv';

$(function () {
  $('.tarifa').bootstrapSwitch({
    onText: 'Tarifa Diurna',
    offText: 'Tarifa Nocturna',
    onColor: 'warning',
    offColor: 'danger'
  })
});
