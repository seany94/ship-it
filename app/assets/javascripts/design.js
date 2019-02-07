document.addEventListener("DOMContentLoaded", () => {
    setActiveNavItem();
    $(login_new_user).on('ajax:error', responseHandler)
});

function responseHandler(response){
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