$(document).ready(()=>{
    // 实现下拉面板
    $("#lh1").click(()=>{
        $("#l1").slideToggle();
        $("#lh1 span.icon i").toggleClass("fa fa-plus-circle");
        $("#lh1 span.icon i").toggleClass("fa fa-minus-circle");
    });
    $("#lh2").click(()=>{
        $("#l2").slideToggle();
        $("#lh2 span.icon i").toggleClass("fa fa-plus-circle");
        $("#lh2 span.icon i").toggleClass("fa fa-minus-circle");
    });
    $("#lh3").click(()=>{
        $("#l3").slideToggle();
        $("#lh3 span.icon i").toggleClass("fa fa-plus-circle");
        $("#lh3 span.icon i").toggleClass("fa fa-minus-circle");
    });
    // $(".list").css("display","block");
});