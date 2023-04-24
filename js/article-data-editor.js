$(document).ready(()=>{
    $("span.cross").click(function(){
        $("div.open-up-configure").show();
        $("div.configureing-area").hide();
    });
    $("div.open-up-configure").click(function(){
        $("div.open-up-configure").hide();
        $("div.configureing-area").show();
    });
    // $("table").on("click","tr",function(){
    //     $(this).css("background-color", "rgb(240,240,240)");
    // });
})