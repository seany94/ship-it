document.addEventListener("DOMContentLoaded", () => {
    setActiveNavItem();
    if (document.querySelector('#login_new_user')) {
        $(login_new_user).on('ajax:error', loginAjaxHandler)
    }

});

function loginAjaxHandler(response) {
    if (!document.querySelector('#login-error')) {
        $(login_new_user).prepend('<div class="alert alert-danger" id="login-error">' + response.detail[0].error + '</div>');
    }
}

function getRouteString(windowInstance, urlString) {
    return urlString.split(windowInstance.location.origin).join('').split('/')[1];
}

function setActiveNavItem() {
    let currentRouteString = getRouteString(window, window.location.href);
    document.querySelectorAll('li.nav-item').forEach(li => {
        if (currentRouteString === getRouteString(window, li.childNodes[1].href)) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    })
}

function addSlide() {
    let cardImages = document.querySelectorAll('.card-body > div > img');
    let cardButtons = document.querySelectorAll('.card-body > div > .btn');
    for (i = 0; i < cardImages.length; i++) {
        cardImages[i].classList.add('imgtransit');
        cardImages[i].style.height = '80px';
        cardImages[i].style.width = '80px';

    }
    for (i = 0; i < cardButtons.length; i++) {
        cardButtons[i].classList.add('imgtransit');
        cardButtons[i].style.padding = '0.1rem 0.45rem';
        cardButtons[i].style.fontSize = '0.8rem';
    }

    document.querySelector('#job-list').classList = 'job-list-transition';
    document.querySelector('#map-wrapper').classList = 'map-wrapper-transition';
}