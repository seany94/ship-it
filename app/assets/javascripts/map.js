var SINGAPORE_LOCATION_OBJECT = {
  zoom: 13,
  center: {
    lat: 1.3,
    lng: 103.851959
  }
};
var map, service;

function initAutocomplete() {
  document.addEventListener("DOMContentLoaded", () => {
    var startLocationInput = document.getElementById("job_start_location");
    var endLocationInput = document.getElementById("job_end_location");

    var options = {
      componentRestrictions: { country: "sg" }
    };
    autocompleteStart = new google.maps.places.Autocomplete(
      startLocationInput,
      options
    );
    autocompleteEnd = new google.maps.places.Autocomplete(
      endLocationInput,
      options
    );
    autocompleteStart.addListener("place_changed", fillInAddress);
    autocompleteEnd.addListener("place_changed", fillInAddress);
  });
}

function initMap() {
  document.addEventListener("DOMContentLoaded", () => {
    map = new google.maps.Map(
      document.getElementById("map"),
      SINGAPORE_LOCATION_OBJECT
    );
    initMarkers();
  });

  // Empty function for now - but this reacts to when the map viewport is moved around
  // map.addListener('bounds_changed', function () {
  // });
}

function initMarkers() {
  service = new google.maps.places.PlacesService(map);
  gon.jobs.forEach(job => {
    var placeQueryParams = {
      query: job.start_location,
      fields: ["name", "geometry"]
    };
    service.findPlaceFromQuery(placeQueryParams, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        marker = newMarker(results[0]);
      }
    });
  });
}

function newMarker(result) {
  let iconOptions = {
    url: "https://image.flaticon.com/icons/svg/46/46046.svg",
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(30, 30)
  };
  return new google.maps.Marker({
    map: map,
    title: result.name,
    icon: iconOptions,
    position: result.geometry.location
  });
}

function fillInAddress() {
  var place = autocompleteStart.getPlace();
}
