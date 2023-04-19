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
 * @param {number} exdays 有效期/天 (已弃用)
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

/*
 * localStorage:
  {
    settings:{
        theme: "day",
        "font-size": 16,
        ...
    },
    starred_book_list: [
        "url_title_1", "url_title_2", ...
    ],
    last_read_book: "url_title"
  }
 */
/**
 * 设置偏好设置。
 * @param {string} name 偏好设置名称，如theme, fontSize等
 * @param {*} value 偏好设置内容
 */
Global.setPreference = function(name, value) {
    var obj = {};
    var temp_str = window.localStorage.getItem("settings");
    if(temp_str) obj = JSON.parse(temp_str);
    obj[name] = value;
    window.localStorage.setItem("settings", JSON.stringify(obj));
}

/**
 * 获取偏好设置内容
 * @param {string} name 偏好设置名称，如theme, fontSize等
 * @returns 偏好设置内容
 */
Global.getPreference = function(name) {
    var obj = {};
    var temp_str = window.localStorage.getItem("settings");
    if(temp_str) var obj = JSON.parse(temp_str);
    return obj[name] || null;
}

/**
 * 设置书签 (已弃用)
 * @param {string} url_title 文章的url标题
 * @param {string} url_name 章节的url名称
 * @param {number} p_id 书签所在的段落id
 */
Global.setBookmark = function(url_title, url_name, p_id){
    var obj = {};
    var temp_str = window.localStorage.getItem("bookmark_list");
    if(temp_str) obj = JSON.parse(temp_str);
    obj[url_title] = obj[url_title] || {};
    obj[url_title][url_name] = p_id;
    window.localStorage.setItem("bookmark_list", JSON.stringify(obj));
};

/**
 * 获取书签所在的段落id (已弃用)
 * @param {string} url_title 文章的url标题
 * @param {string} url_name 章节的url名称
 * @returns 书签所在的段落id。如果没有书签，则返回-1。
 */
Global.getBookmark = function(url_title, url_name) {
    var obj = {};
    var temp_str = window.localStorage.getItem("bookmark_list") || "";
    if(!temp_str) return -1;
    temp_str = window.localStorage.getItem("bookmark_list");
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
    var temp_str = window.localStorage.getItem("starred_book_list");
    if(temp_str) arr = JSON.parse(temp_str);
    arr.push(url_title);
    window.localStorage.setItem("starred_book_list", JSON.stringify(arr));
};

/**
 * 取消收藏文章
 * @param {string} url_title 当前文章的url标题
 */
Global.removeStar = function(url_title){
    if(Global.isStarred(url_title)) {
        var temp_str = window.localStorage.getItem("starred_book_list");
        var temp_arr = JSON.parse(temp_str);
        var index = temp_arr.indexOf(url_title);
        temp_arr.splice(index, 1);
        window.localStorage.setItem("starred_book_list", JSON.stringify(temp_arr));
    }
};

/**
 * 获取包含所有收藏文章的数组
 * @returns {array} 包含所有收藏文章的数组 (["url_title_1", "url_title_2", ...])
 */
Global.getAllStarredBooks = function() {
    var temp_str = window.localStorage.getItem("starred_book_list");
    if(temp_str) var arr = JSON.parse(temp_str);
    return arr || [];
};

/**
 * 检查当前文章是否已被收藏
 * @param {string} url_title 当前文章的url标题
 * @returns true 或 false
 */
Global.isStarred = function(url_title) {
    var temp_str = window.localStorage.getItem("starred_book_list");
    if(!temp_str) return false;
    var arr = JSON.parse(temp_str);
    for(var i = 0; i < arr.length; i++) {
        if (arr[i] == url_title) return true;
    };
    return false;
};

/**
 * 清空已收藏文章
 */
Global.clearAllStarredBooks = function() {
    window.localStorage.setItem("starred_book_list", "");
};

/**
 * 设置最后一次阅读的文章
 * @param {string} url_title 当前文章的url标题
 */
Global.setLastReadBook = function(url_title) {
    window.localStorage.setItem("last_read_book", url_title);
};

/**
 * 获取最后一次阅读的文章url标题
 * @returns 最后一次阅读的文章url标题。没有则返回空字符串。
 */
Global.getLastReadBook = function() {
    var temp_str = window.localStorage.getItem("last_read_book");
    return temp_str || '';
};

$(document).ready(()=>{
    // Global.deleteCookie("is-admitted")
    var isAdmitted = Global.getCookie("is-admitted");
    // if(isAdmitted != Global.encoded_cur_password && window.location.pathname != "/others/password.html") {
    //     window.location.replace("/others/password.html");
    // }
    
    // 头部菜单栏
    $("div.menu-icon").click(function() {
        $("ul.menu-columns").slideToggle();
        $("div.menu-icon i").toggleClass("fa-bars")
        $("div.menu-icon i").toggleClass("fa-close")
    })
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