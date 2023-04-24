$(document).ready(() => {
    var link = window.location.href.replace(window.location.pathname,""); // 主站网址
    $.getJSON("/data/articles.json", function(data){
        var starred_book_list = Global.getAllStarredBooks();
        if(starred_book_list && starred_book_list != "[]") {
            for(var i = 0; i < starred_book_list.length; i++) {
                var url_title = starred_book_list[i];
                var book = {};
                for (var j = 0; j < data.length; j++) {
                    if(data[j].url_title == url_title) {
                        book = data[j];
                        break;
                    }
                }
                $("ul.starred-book-list").append("<li class=\"starred-book-item\"><a href=\"" + link + "/article/=/" + url_title + "/" +"\">" + book.title + "</a>" + "<span>" + book.author + "</span></li>");
            }
        }
    });
})