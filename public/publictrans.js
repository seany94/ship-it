$(document).on('turbolinks:load', function () {

    if (Cookies.get('nav') == undefined) {
        $('#mainNav').addClass('transs');
    } else {
        $('#mainNav').removeClass('transs');
    }
})