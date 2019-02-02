var SINGAPORE = {
    zoom: 13,
    center: {
        lat: 1.3,
        lng: 103.851959
    }
};

function initAutocomplete(){
    document.addEventListener('DOMContentLoaded', () => {
        var startLocationInput = document.getElementById('job_start_location');
        var endLocationInput = document.getElementById('job_end_location');
        var options = {
            componentRestrictions: {country: 'sg'}
        };
        autocompleteStart = new google.maps.places.Autocomplete(startLocationInput, options);
        autocompleteEnd = new google.maps.places.Autocomplete(endLocationInput, options);
        autocompleteStart.addListener('place_changed', fillInAddress);
        autocompleteEnd.addListener('place_changed', fillInAddress);
    })
}

function fillInAddress(){
    var place = autocompleteStart.getPlace();
}