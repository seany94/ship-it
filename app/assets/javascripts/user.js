$(document).ready(function() {
    $('ul.nav li a').click(function() {
        if($(this).hasClass('active')){
            // Remove tab class if click the same tab again
            $(this).removeClass('active');
        }
        else{
            // Remove previous clicked tab class
            $('ul.nav li a').removeClass('active');
            // Add class to the tab that triggered the click event
            $(this).addClass('active');
        }

    });
});