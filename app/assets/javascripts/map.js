var SINGAPORE_LOCATION_OBJECT = {
    zoom: 12,
    center: {
        lat: 1.355,
        lng: 103.838959
    }
};
var map, service, directionsRenderer, directionsService;
var markers =[];

function initAutocomplete() {
    document.addEventListener('DOMContentLoaded', () => {
        var startLocationInput = document.getElementById('job_start_location');
        var endLocationInput = document.getElementById('job_end_location');
        var options = {
            componentRestrictions: {
                country: 'sg'
            }
        };
        autocompleteStart = new google.maps.places.Autocomplete(startLocationInput, options);
        autocompleteEnd = new google.maps.places.Autocomplete(endLocationInput, options);
        autocompleteStart.addListener('place_changed', fillInAddress);
        autocompleteEnd.addListener('place_changed', fillInAddress);
    })
}

function initMap() {
    document.addEventListener('DOMContentLoaded', () => {
        map = new google.maps.Map(document.getElementById('map'), SINGAPORE_LOCATION_OBJECT);
        service = new google.maps.places.PlacesService(map);
        directionsService = new google.maps.DirectionsService;
        directionsRenderer = new google.maps.DirectionsRenderer;
        directionsRenderer.setMap(map);
        initJobCards();
    })
}

function initMarkersAndRoute(){
    markers = [];
    let startLocationQueryParams = newQueryParams(document.getElementById('job_start_location').value);
    let endLocationQueryParams = newQueryParams(document.getElementById('job_end_location').value)
    pushMarker(startLocationQueryParams, 'Start');
    pushMarker(endLocationQueryParams, 'End');
}

function pushMarker(queryParams, markerLabel){
    service.findPlaceFromQuery(queryParams, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            let infoWindow = newInfoWindow(results[0], results[0].name);
            let marker = newMarker(results[0], markerLabel);
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            })
        }
    });
}

function initJobCards(){
    document.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.job-card').forEach(otherCard => {
                otherCard.style.backgroundColor = "white";
            })
            card.style.backgroundColor = "#fffff0";
            let startLocationQueryParams = newQueryParams(card.getAttribute('startloc'));
            let endLocationQueryParams = newQueryParams(card.getAttribute('endloc'));
            service.findPlaceFromQuery(startLocationQueryParams, (sResults, sStatus) => {
                service.findPlaceFromQuery(endLocationQueryParams, (eResults, eStatus) => {
                    if (sStatus === google.maps.places.PlacesServiceStatus.OK &&
                        eStatus === google.maps.places.PlacesServiceStatus.OK) {
                            showRoute(directionsRenderer, directionsService, sResults[0], eResults[0]);
                    }
                })
            });
        })
    })
}

function newQueryParams(locationString) {
    return {
        query: locationString,
        fields: ['formatted_address', 'geometry', 'id', 'name', 'photos', 'place_id', 'plus_code', 'types']
    }
}

function newInfoWindow(result, endLocationString) {
    let imgSrc = 'NA'
    if (result.photos){
        imgSrc = result.photos[0].getUrl();
    }
    return new google.maps.InfoWindow({
        content: `
            <div class='info-window' end-location='${endLocationString}'>
                <img src=${imgSrc} style="width:200px; display:block" alt="No image found"/>
                <p>Name: ${result.name}</p>
                <p>Start address: ${result.formatted_address}</p>
                <p>End address: ${endLocationString}</p>
            </div>
        `
    });
}

function newMarker(result, markerLabel) {
    return new google.maps.Marker({
        map: map,
        title: result.name,
        label: markerLabel,
        // icon: iconOptions,
        position: result.geometry.location
    });
}

function showRoute(directionsRenderer, directionsService, startPlace, endPlace) {
    let travelMode = 'DRIVING' //WALKING, BICYCLING, TRANSIT
    let options = {
        origin: {
            placeId: startPlace.place_id
        },
        destination: {
            placeId: endPlace.place_id
        },
        travelMode: travelMode
    }
    directionsService.route(options, (response, status) => {
        if (status == 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            alert('Directions failed because ' + status);
        }
    });
}

function fillInAddress() {
    var place = autocompleteStart.getPlace();
}