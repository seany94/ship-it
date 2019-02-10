var SINGAPORE_LOCATION_OBJECT = {
    zoom: 12,
    center: {
        lat: 1.355,
        lng: 103.838959
    }
};
var AUTOCOMPLETE_OPTIONS = {
    componentRestrictions: {
        country: 'sg'
    }
};
var map, service, directionsRenderer, directionsService;
var startLatLong, endLatLong, markers = [];

function overrideFormSubmit() {
    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        let promise = createLocationPromise(document.getElementById('job_start_location').value, document.getElementById('job_end_location').value);
        promise.then(results => {
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
            if (!document.getElementById('location-error')) {
                document.querySelector('form').prepend(div)
            }
            setTimeout(() => {
                document.querySelector('#submit-button-wrapper').childNodes[1].disabled = false;
            }, 100)
        });
    });
}

function initJobForm(){
    document.addEventListener('DOMContentLoaded', () => {
        map = new google.maps.Map(document.createElement('div'), SINGAPORE_LOCATION_OBJECT);
        initMapServices(map);
        initAutocomplete();
        overrideFormSubmit();
    })
}

function initMap() {
    document.addEventListener('DOMContentLoaded', () => {
        map = new google.maps.Map(document.getElementById('map'), SINGAPORE_LOCATION_OBJECT);
        initMapServices(map);
        initJobCards();
        initAutocomplete();
        $(maptrigger).on('click', addSlide);
        $(maptrigger).on('click', initMarkersAndRoute);
    })
}

function initMapServices(map){
    service = new google.maps.places.PlacesService(map);
    directionsService = new google.maps.DirectionsService;
    directionsRenderer = new google.maps.DirectionsRenderer;
    directionsRenderer.setMap(map);
}

function initAutocomplete() {
    document.querySelectorAll('.autocomplete').forEach(form => {
        form.addEventListener('keydown', e => {
            e.keyCode === 13 ? e.preventDefault() : null;
        })
        let autocomplete = new google.maps.places.Autocomplete(form, AUTOCOMPLETE_OPTIONS);
        autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
        });
    })
}

function initMarkersAndRoute() {
    clearMarkers();
    startLatLong = [];
    endLatLong = [];
    markers = [];
    let promise = createLocationPromise(document.getElementById('job_start_location').value, document.getElementById('job_end_location').value);
    promise.then(results => {
        startLatLong.push(results[0][0].geometry.location.lat());
        startLatLong.push(results[0][0].geometry.location.lng());
        endLatLong.push(results[1][0].geometry.location.lat());
        endLatLong.push(results[1][0].geometry.location.lng());

        createMarker(results[0][0], 'Start');
        createMarker(results[1][0], 'End');

        return [startLatLong, endLatLong];
    }, errors => {
        errors.forEach(error => {
            console.log(error);
        })
    }).then(array => {
        document.querySelectorAll('.job-card').forEach(card => {
            let distance = getDistance(array[0][0], array[0][1], card.getAttribute('startlat'), card.getAttribute('startlong'))
            distance < 2.0 ? card.hidden = false : card.hidden = true;
        })
    })
}

function createMarker(place, label){
    let marker = newMarker(place, label);
    let infoWindow = newInfoWindow(place, place.name);
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    })
    markers.push(marker);
}

function getDistance(lat1, long1, lat2, long2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(long2 - long1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function initJobCards() {
    document.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', () => {
            clearCardColors();
            card.style.backgroundColor = "#fffff0";
            placeQueries(card.getAttribute('startloc'), card.getAttribute('endloc'), showRoute);
        })
    })
}

function clearCardColors(){
    document.querySelectorAll('.job-card').forEach(card => {
        card.style.backgroundColor = "white";
    })
}

function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    })
}

function createLocationPromise(firstPlace, secondPlace) {
    return new Promise((resolve, reject) => {
        service.findPlaceFromQuery(newQueryParams(firstPlace), (results, status) => {
            service.findPlaceFromQuery(newQueryParams(secondPlace), (resultsTwo, statusTwo) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && statusTwo === google.maps.places.PlacesServiceStatus.OK) {
                    resolve([results, resultsTwo]);
                } else {
                    reject([status, statusTwo]);
                }
            });
        });
    })
}

function newInfoWindow(result, endLocationString) {
    let imgSrc = '#'
    if (result.photos) {
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
        position: result.geometry.location
    });
}

function newQueryParams(locationString) {
    return {
        query: locationString,
        fields: ['formatted_address', 'geometry', 'id', 'name', 'photos', 'place_id', 'plus_code', 'types']
    }
}

function placeQuery(place, callback){
    service.findPlaceFromQuery(newQueryParams(place), (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK){
            callback(result);
        }
    });
}

function placeQueries(firstPlace, secondPlace, callback){
    service.findPlaceFromQuery(newQueryParams(firstPlace), (result, status) => {
        service.findPlaceFromQuery(newQueryParams(secondPlace), (resultTwo, statusTwo) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && statusTwo === google.maps.places.PlacesServiceStatus.OK){
                callback(result, resultTwo);
            }
        })
    });
}

function showRoute(startPlace, endPlace) {
    let travelMode = 'DRIVING' //WALKING, BICYCLING, TRANSIT
    let options = {
        origin: {
            placeId: startPlace[0].place_id
        },
        destination: {
            placeId: endPlace[0].place_id
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