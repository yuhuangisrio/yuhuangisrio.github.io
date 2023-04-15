$(document).ready(()=> {
    $("div.menu-icon").click(function() {
        $("ul.menu-columns").slideToggle();
        $("div.menu-icon i").toggleClass("fa-bars")
        $("div.menu-icon i").toggleClass("fa-close")
    })
    $("div.advanced-settings div.row").click(function() {
        $("ul.settings-columns").slideToggle();
        $("div.advanced-settings div.row i.arrow-down").toggleClass("fa-caret-down");
        $("div.advanced-settings div.row i.arrow-down").toggleClass("fa-caret-up");
    })
})