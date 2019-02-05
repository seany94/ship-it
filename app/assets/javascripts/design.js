document.addEventListener("DOMContentLoaded", () => {
    setActiveNavItem();
});

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