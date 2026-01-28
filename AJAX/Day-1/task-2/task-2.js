$(document).ready(function () {
    function loadPage(page) {
        $('.loader').fadeIn(400); // For displaying the Loader
        $('#content').load(page, function () {
            $(".loader").fadeOut(300); // If page is changed, load the loader
        });
    }

    loadPage("home.html"); // Run the loader by default.

    // This is for handling the active nav-link and loading the page again
    $(".nav-link").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        loadPage($(this).data("page"));
    });
});