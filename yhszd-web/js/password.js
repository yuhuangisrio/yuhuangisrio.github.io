$(document).ready(()=>{
    $("#password").val("");
    var link = window.location.href.replace(window.location.pathname,"");
    var user_password = Global.getCookie("is-admitted") || "";
    if(user_password == Global.encoded_cur_password) {
        window.location.replace("/");
    } else {
        $("button").click(function(){
            var value = $("#password").val();
            if($.md5(value) == Global.encoded_cur_password){
                Global.setCookie("is-admitted",$.md5(value),30);
                $("#password").css("color","lightgreen");
                window.location.pathname = "";
            } else {
                alert("密码错误。");
            }
        })
    }
})