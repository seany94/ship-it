if (Cookies.get('nav') == undefined) {
    $('#mainNav').addClass('transs');
} else {
    $('#mainNav').css({
        'transition': '',
        '-webkit-transition': ''
    });
    $('#mainNav').removeClass('transs');
    $('#mainNav').addClass('navbar-shrink');
    $('#mainNav').addClass('noblocking');

}