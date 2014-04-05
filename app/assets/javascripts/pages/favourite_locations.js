FavouriteLocations = (function(){
  var marker;
  var geocoder;

  var addMaker = function(event){

    if(typeof marker != 'undefined')
      marker.setMap(null);

    marker = new google.maps.Marker({
      draggable: false,
      position: event.latLng,
      map: map,
      icon: '/icon/start_marker.png',
      address: ''
    });

    $('#latitude').val(event.latLng.lat());
    $('#longitude').val(event.latLng.lng());

    // Geocode the direction
    geocoder.geocode({'latLng': event.latLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          marker.address = results[0].formatted_address;
          $('#address').val(results[0].formatted_address);
        }
      }
    });
  };

  var addMarkerViaLatLng = function(latitude, longitude){

    var position = new google.maps.LatLng(latitude, longitude)
    marker = new google.maps.Marker({
      draggable: false,
      position: position,
      map: map,
      icon: '/icon/start_marker.png',
      address: ''
    });
  }

  var initMap = function(allow_markers){

    // Geocoder
    geocoder = new google.maps.Geocoder();

    // Opciones del mapa
    var mapOptions = {
      zoom: zoom,
      center: new google.maps.LatLng(-34.7600432, -56.2019143),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Mapa
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Click
    if(allow_markers){
      google.maps.event.addListener(map, 'click', function(event, i) {
        addMaker(event);
      })
    }
  }


  return {
    init: function(allow_markers){
      initMap(allow_markers);
    },
    addMarker: function(latitude, longitude){
      addMarkerViaLatLng(latitude, longitude);
    }
  }
})();