$(document).ready(()=>{
    $(".no-js-warning").css("display","none");
    var curLocation = window.location.href;   // 当前网址
    var temp_arr = curLocation.split("/");   // 将当前路径以/分割
    var curCollection = temp_arr[temp_arr.length-2].trim(); // 返回字符串 当前章节html文件的名称 即 url_name
    var home_link = Global._convertPathForApp('/');
    Global.getArticles((data)=>{
        Global.getCollections((cl)=>{
            var collection = {};
            cl.forEach((item) => {
                if(item.url_title == curCollection) collection = item;
            });
            var title = collection.title;
            var summary = collection.summary;
            var urls = collection.urls.split('&');
            $(".index-struct").html('<a href="'+home_link+'"><i class="fa fa-home"></i> 主页</a> &raquo; '+ '<i class="fa fa-folder-open"></i>' + collection.title)
            $(".article-name span.title").html(title);
            $(".summary p").html(summary);
            $(".article-number").html(urls.length)
            if(urls && urls != "[]") {
                for(var i = 0; i < urls.length; i++) {
                    var url_title = urls[i];
                    var book = {};
                    for (var j = 0; j < data.length; j++) {
                        if(data[j].url_title == url_title) {
                            book = data[j];
                            break;
                        }
                    }
                    $("ul.book-list").append("<li class=\"book-item\"><a href=\"javaScript:;\" onclick=\"Global.goToArticle(\'" + url_title + "\')\"><i class=\"fa fa-book\"></i> " + book.title + "</a>" + "<span>" + book.author + "</span></li>");
                }
            }
        })
    });
})