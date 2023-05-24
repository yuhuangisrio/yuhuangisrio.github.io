var Global = {};

Global.encoded_cur_password = "e286f1f186225ea42a23c35a8db0e230";
Global.articles_default_settings = {
    title: "文章标题",
    url_title: "template-title",
    summary: "(无)",
    type: "短篇",
    number_of_characters: "-",
    is_redistributable: true,
    is_yuhuang_only: true,
    is_yuhuangyu: false
}
Global.chapters_default_settings = {
    name: "章节的主标题",
    url_name: "短标题"
}

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
        "theme": "day",
        "font-size": 16,
        "banned-tags": ["tag1","tag2"]
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
 * @returns 偏好设置内容。
 */
Global.getPreference = function(name) {
    var obj = {};
    var temp_str = window.localStorage.getItem("settings");
    if(temp_str) var obj = JSON.parse(temp_str);
    return obj[name] || "";
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

/**
 * 加载CSV文件
 * @param {string} name CSV名称
 * @param {string} path CSV所在路径
 * @param {function} callback 回调函数。参数为返回的CSV字符串 
 */
Global.loadCSV = function(name, path='/', callback) {
    // csv必须是utf-8格式
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            var csv = xhr.responseText;
            if(callback) callback(csv);
        }
    };
    xhr.open('GET',path+name+'.csv',true);
    xhr.send();
}

/**
 * 解析一行CSV字符串并返回数据数组 (允许英文逗号)
 * @param {string} str 一行CSV字符串
 * @returns {array} 数据数组
 */
Global.parseCSVString = function(str) {
  var arr = str.split(',');
  for(var i = 0; i < arr.length; i++){
    var s = arr[i];
    if(s.charAt(0) == '"') {
      var temp_arr = [];
      for(var j = i; j < arr.length; j++){
        var s2 = arr[j];
        var l = s2.length;
        temp_arr.push(s2);
        if (s2.charAt(l-1) == '"') break;
      }
      var new_str = temp_arr.join(',').replace(/"/gi,'');
      arr.splice(i,temp_arr.length,new_str);
    }
  }
  return arr;
}

/**
 * 加载文章数据
 * @param {function} callback 回调函数。参数是文章数组。
 */
Global.getArticles = function(callback) {
    Global.loadCSV('articles','/data/',function(csv){
        var temp_arr = csv.split(/\r/);
        var articles = [];
        for(var i = 1; i < temp_arr.length; i++) {   //从表格第二行开始
            if(!temp_arr[i]) continue;
            var article = Global.parseCSVString(temp_arr[i]);
            // if(article.length < 16) continue;
            if(!article[0].replace(/\n/,'')) continue;
            var ds = Global.articles_default_settings;
            articles.push({
                title: article[0].replace(/\n/,'') || ds.title,
                url_title: article[1] || ds.url_title,
                author: article[2].includes('/') ? (article[2].split('/')[0] || ds.author || '') : (article[2] || ds.author || ''),
                author_link: article[3] || ds.author_link || './',
                summary: article[4] || ds.summary,
                type: article[5] || ds.type || '-',
                number_of_characters: (function(){
                    switch(article[5] || ds.type || '-') {
                        case '长篇': 
                            return '6w+';
                        case '中篇':
                            return '2w~6w';
                        case '短篇':
                            return '2w以下';
                        default: 
                            return ds.number_of_characters;
                    }
                })(),
                tags: article[6].replace('&',',') || ds.tags,
                subject: article[7] || ds.subject,
                roles: article[8] || ds.roles,
                status: article[9] || ds.status || '-',
                ending: article[10] || ds.ending || '-',
                is_yuhuang_only: !article[11] ? ds.is_yuhuang_only : (article[12] == 'T' ? true : false),
                is_yuhuangyu: !article[12] ? ds.is_yuhuangyu : (article[13] == 'T' ? true : false),
                accessable_links: article[13] || ds.accessable_links || '',
                is_redistributable: !article[14] ? ds.is_redistributable : (article[15] == 'T' ? true : false)
            })
        }
        if(callback) callback(articles);
    });
}

/**
 * 加载章节数据
 * @param {string} url_title 文章url标题
 * @param {function} callback 回调函数。参数是章节数组。
 */
Global.getChapters = function(url_title, callback) {
    Global.loadCSV('chapters','/data/contents/'+url_title+'/',function(csv){
        var temp_arr = csv.split(/\r/);
        var chapters = [];
        for(var i = 1; i < temp_arr.length; i++) {   //从表格第二行开始
            if(!temp_arr[i]) continue;
            var chapter = Global.parseCSVString(temp_arr[i]);
            // if(chapter.length < 16) continue;
            if(!chapter[0].replace(/\n/,'')) continue;
            var ds = Global.chapters_default_settings;
            chapters.push({
                name: chapter[0].replace(/\n/,'') || ds.name,
                short_name: chapter[1] || ds.short_name,
                url_name: chapter[2] || ds.url_name || i, // 如果不写则默认是1,2,3,4...按照顺序排列。
                links: chapter[3] || ds.links || '',
                is_original_post_invalid: !chapter[4] ? ds.is_original_post_invalid : (chapter[4] == 'T' ? true : false),
                level: chapter[5] || ds.level || '0+',
                warning: chapter[6] || ds.warning || ''
            })
        }
        if(callback) callback(chapters);
    });
};

/**
 * 加载TAG原始数据
 * @param {function} callback 回调函数。参数是获取到的原始未转换的tag对象。
 */
Global.getTags = function(callback){
    $.getJSON('/data/tags.json', (data)=>{
        if(callback) callback(data);
    })
}

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
    });

    $("div.no-js-warning").css('display','none');
});

Array.prototype.remove = function(val) {
    let index = this.indexOf(val);
    if(index > -1){
        this.splice(index, 1);
    }
};

Array.prototype.clearRepetition = function() {
    var temp_arr = [];
    for(var i = 0; i < this.length; i++) {
        if(temp_arr.indexOf(this[i]) == -1) {
            temp_arr.push(this[i]);
        }
    };
    return temp_arr;
};

Array.prototype.getDuplication = function() {
    var arr = this;
    var temp_arr1 = [], temp_arr2 = [];
    for(var i = 0; i < arr.length; i++){
        var item = arr[i];
        if(temp_arr1.indexOf(item) == -1) {
            temp_arr1.push(item);
        } else {
            if(temp_arr2.indexOf(item) == -1) {
                temp_arr2.push(item);
            }
        }
    }
    return temp_arr2;
}

Array.prototype.contains = function(val) {
    return this.indexOf(val) > -1;
};

String.prototype.contains = function(val) {
    return this.indexOf(val) > -1;
};
