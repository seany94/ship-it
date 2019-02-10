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
        service = new google.maps.places.PlacesService(document.createElement('div'));
        var startLocationInput = document.getElementById('job_start_location');
        startLocationInput.addEventListener('keydown', e => {
            if (e.keyCode == 13){
                e.preventDefault();
            }
        })
        var endLocationInput = document.getElementById('job_end_location');
        endLocationInput.addEventListener('keydown', e => {
            if (e.keyCode == 13){
                e.preventDefault();
            }
        })
        var options = {
            componentRestrictions: {
                country: 'sg'
            }
        };
        let autocompleteStart = new google.maps.places.Autocomplete(startLocationInput, options);
        let autocompleteEnd = new google.maps.places.Autocomplete(endLocationInput, options);
        autocompleteStart.addListener('place_changed', () => {
            if (document.getElementById('job_start_lat')){
                let place = autocompleteStart.getPlace();
                document.getElementById('job_start_lat').value = place.geometry.location.lat();
                document.getElementById('job_start_long').value = place.geometry.location.lng();
            }
        });
        autocompleteEnd.addListener('place_changed', () => {
            if (document.getElementById('job_end_lat')){
                let place = autocompleteEnd.getPlace();
                document.getElementById('job_end_lat').value = place.geometry.location.lat();
                document.getElementById('job_end_long').value = place.geometry.location.lng();
            }
        });

        document.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();

            let query = (queryParams, queryParamsTwo) => {
                return new Promise((resolve, reject) => {
                    service.findPlaceFromQuery(queryParams, (results, status) => {
                        service.findPlaceFromQuery(queryParamsTwo, (resultsTwo, statusTwo) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK && statusTwo === google.maps.places.PlacesServiceStatus.OK) {
                                resolve([results, resultsTwo]);
                            } else {
                                reject([status, statusTwo]);
                            }
                        });
                    });
                })
            };
            
            query(newQueryParams(document.getElementById('job_start_location').value),
                newQueryParams(document.getElementById('job_end_location').value))
            .then(results => {
                console.log(results)
                document.getElementById('job_start_lat').value = results[0][0].geometry.location.lat();
                document.getElementById('job_start_long').value = results[0][0].geometry.location.lng();
                document.getElementById('job_end_lat').value = results[1][0].geometry.location.lat();
                document.getElementById('job_end_long').value = results[1][0].geometry.location.lng();
                document.querySelector('form').submit();
            }, () => {
                let div = document.createElement('div')
                div.id = 'location-error'
                div.style.color = 'red';
                div.textContent = "Error with your location provided!"
                if (!document.getElementById('location-error')){
                    document.querySelector('form').prepend(div)
                }
                setTimeout(() => {
                    document.querySelector('#submit-button-wrapper').childNodes[1].disabled = false;
                }, 100)
            });
        });
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
    clearMarkers();
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
            markers.push(marker)
        }
    });
}

function clearMarkers(){
    markers.forEach(marker =>{
        marker.setMap(null);
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
    let imgSrc = 'NA'
    if (result.photos){
        imgSrc = result.photos[0].getUrl();
    }
    return new google.maps.InfoWindow({
        content: `
            <div class='info-window' end-location='${endLocationString}'>place.geometry.location.lat() + ", " + place.geometry.location.lng()
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
        icon: {
            size: new google.maps.Size(100, 36),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
        },
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
