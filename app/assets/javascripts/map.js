var SINGAPORE_LOCATION_OBJECT = {
    zoom: 12,
    center: {
        lat: 1.355,
        lng: 103.838959
    }
};
var map, service, directionsRenderer, directionsService;

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
        // initMarkers();
        initJobCards();
    })
    // Empty function for now - but this reacts to when the map viewport is moved around
    // map.addListener('bounds_changed', function () {
    // });
}

function initMarkers() {
    gon.jobs.forEach(job => {
        let startLocationQueryParams = newQueryParams(job.start_location);
        let endLocationQueryParams = newQueryParams(job.end_location);
        service.findPlaceFromQuery(startLocationQueryParams, (sResults, sStatus) => {
            service.findPlaceFromQuery(endLocationQueryParams, (eResults, eStatus) => {
                if (sStatus === google.maps.places.PlacesServiceStatus.OK &&
                    eStatus === google.maps.places.PlacesServiceStatus.OK) {
                    let infoWindow = newInfoWindow(sResults[0], eResults[0].name);
                    let marker = newMarker(sResults[0]);
                    marker.addListener('click', () => {
                        showRoute(directionsRenderer, directionsService, sResults[0], eResults[0]);
                        infoWindow.open(map, marker);
                    })
                }
            })
        });
    })
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
    return new google.maps.InfoWindow({
        content: `
            <div class='info-window' end-location='${endLocationString}'>
                <img src=${result.photos[0].getUrl()} style="width:200px; display:block"/>
                <p>Name: ${result.name}</p>
                <p>Start address: ${result.formatted_address}</p>
                <p>End address: ${endLocationString}</p>
            </div>
        `
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