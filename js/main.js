var Global = {};

Global.encoded_cur_password = "e286f1f186225ea42a23c35a8db0e230";
Global.fonts = {
    "霞鹜文楷":"font-xiawuwenkai",   // 默认
    "霞鹜新晰黑":"font-xiawuxinxihei",
    "昭源宋体":"font-zhaoyuansongti",
    "极影毁片和圆体":"font-jiyinghuipianheyuanti"
}

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
    document.cookie = cname + "=" + cvalue + "; " + expires + "path=/; SameSite=None; Secure";
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

/**
 * 设置书签
 * @param {string} url_title 文章的url标题
 * @param {string} url_name 章节的url名称
 * @param {number} p_id 书签所在的段落id
 */
Global.setBookmark = function(url_title, url_name, p_id){
    var obj = {};
    var temp_str = window.localStorage.getItem("bookmark-list");
    if(temp_str) obj = JSON.parse(temp_str);
    obj[url_title] = obj[url_title] || {};
    obj[url_title][url_name] = p_id;
    window.localStorage.setItem("bookmark-list", JSON.stringify(obj));
};

/**
 * 获取书签所在的段落id
 * @param {string} url_title 文章的url标题
 * @param {string} url_name 章节的url名称
 * @returns 书签所在的段落id。如果没有书签，则返回-1。
 */
Global.getBookmark = function(url_title, url_name) {
    var obj = {};
    var temp_str = window.localStorage.getItem("bookmark-list") || "";
    if(!temp_str) return -1;
    temp_str = window.localStorage.getItem("bookmark-list");
    obj = JSON.parse(temp_str);
    if(!JSON.stringify(obj[url_title])) return -1;
    var id = obj[url_title][url_name];
    return id!==undefined ? +id : -1;
};

/**
 * 收藏文章
 * @param {string} url_title 当前文章的url标题
 */
Global.setStar = function(url_title){
    var arr = [];
    var temp_str = window.localStorage.getItem("starred-book-list");
    if(temp_str) arr = JSON.parse(temp_str);
    arr.push(url_title);
    window.localStorage.setItem("starred-book-list", JSON.stringify(arr));
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