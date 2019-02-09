$(document).ready(function() {
    $('ul.nav li a').click(function() {
        // Remove previous clicked tab class
        $('ul.nav li a').removeClass('active');
        // Add class to the tab that triggered the click event
        $(this).addClass('active');
    });
});