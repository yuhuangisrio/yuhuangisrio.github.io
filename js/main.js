var Global = {};

Global.encoded_cur_password = "e286f1f186225ea42a23c35a8db0e230";

function closeWindow() {
    window.history.back();
};

/**操作Cookie (存放在主站上) */

/**
 * 创建/修改 Cookie
 * @param {string} cname cookie名
 * @param {string} cvalue cookie值
 * @param {number} exdays 有效期/天
 */
Global.setCookie = function(cname, cvalue, exdays) {
    var expires = "";
    if(exdays) {
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        expires = "expires="+d.toGMTString();
    }
    if(expires) expires = expires + "; ";
    document.cookie = cname + "=" + cvalue + "; " + expires + "path=/";
};

/**
 * 获取 Cookie 值
 * @param {string} cname cookie名
 * @returns 若存在cookie，则返回cookie值；不存在则返回空字符串。
 */
Global.getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
};

/**
 * 删除 Cookie
 * @param {string} cname cookie名
 */
Global.deleteCookie = function(cname) {
    document.cookie = cname + "=; " + "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

$(document).ready(()=>{
    // Global.deleteCookie("is-admitted")
    var isAdmitted = Global.getCookie("is-admitted");
    if(isAdmitted != Global.encoded_cur_password && window.location.pathname != "/others/password.html") {
        window.location.replace("/others/password.html");
    }
    
    var theme = Global.getCookie("theme");
    if(theme && theme == 'night') {
        $("body").attr("class","night");
        $("a.switch-theme i").attr("class", "fa fa-moon-o fw");
    }
    $("a.switch-theme").click(switchTheme);

    function switchTheme() {
        $("body").toggleClass("day");
        $("body").toggleClass("night");
        var curTheme = $("body").attr("class");
        Global.setCookie('theme',curTheme);
        if(curTheme == 'day') $("a.switch-theme i").attr("class", "fa fa-sun-o fw");
        if(curTheme == 'night') $("a.switch-theme i").attr("class", "fa fa-moon-o fw");
        window.history.go(0);
    };
});

Array.prototype.remove = function(val) {
    let index = this.indexOf(val);
    if(index > -1){
        this.splice(index, 1);
    }
};

Array.prototype.contains = function(val) {
    return this.indexOf(val) > -1;
};

String.prototype.contains = function(val) {
    return this.indexOf(val) > -1;
};