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
  });

  var tour = new Tour({
    steps: [
      {
        element: '#map',
        title: 'Mapa',
        content: 'Este es el mapa principal. Primero ingresa el origen del viaje, y luego, uno a uno, los destinos del mismo.',
        placement: 'top'
      },
      {
        element: '#step3',
        title: 'Selecciona Tarifa y Calcula',
        content: 'Como sabes, en nuestro país existen diferentes tarifas, dependiendo del día y de la hora. Selecciona aquí si quieres tarifa diurna o nocturna y luego, presiona en calcular.',
        placement: 'top'
      },
      {
        path: '/queries/1',
        element: '#step4',
        title: 'Costo total del viaje',
        content: 'En este recuadro, verás el costo total del viaje. Esto incluye el costo de cada uno de los taxis que forman la solución.',
        placement: 'bottom'
      },
      {
        element: '#step5',
        title: 'Taxis',
        content: 'Aquí verás la distribución de pasajeros y taxis, junto con la ruta que deberá seguir el mismo y el costo de cada taxi en particular.',
        placement: 'top'
      }
    ],
    container: "body",
    keyboard: true,
    backdrop: true,
    onEnd: function (tour) {
      window.location.href = '/'
    }
  });

  tour.init();
  tour.start();

  $('#tour').click(function () {
    tour.restart();
  })

});
