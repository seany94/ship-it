document.addEventListener("DOMContentLoaded", () => {
    setActiveNavItem();
    if (document.querySelector('#login_new_user')){
        $(login_new_user).on('ajax:error', loginAjaxHandler)
    }

});

function loginAjaxHandler(response){
    $(login_new_user).prepend('<div class="alert alert-danger">' + response.detail[0].error + '</div>');
}

function getRouteString(windowInstance, urlString){
    return urlString.split(windowInstance.location.origin).join('').split('/')[1];
}

function setActiveNavItem(){
    let currentRouteString = getRouteString(window, window.location.href);
    document.querySelectorAll('li.nav-item').forEach(li => {
        if (currentRouteString === getRouteString(window, li.childNodes[1].href)){
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    })    
}
function addSlide(){
    document.querySelector('#job-list').classList = 'job-list-transition';
    document.querySelector('#map-wrapper').classList = 'map-wrapper-transition';
}