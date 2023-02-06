var RSSD = RSSD || {};
RSSD.downloadChapters = {};

RSSD.downloadChapters.getTxt = function(filename, src="./", code='utf-8') {
    let xhr = new XMLHttpRequest();
    xhr.open('GET',src+filename+'.txt', false);
    xhr.overrideMimeType("text/html;charset="+code);
    xhr.send(null);
    // 获取文件信息 (String)
    // console.log(xhr.responseText);
    return xhr.responseText;
};

$(document).ready(()=>{
    var temp_arr = window.location.href.split("/");
    var url_title = temp_arr[temp_arr.length-2];
    var link = window.location.href.replace(window.location.pathname,"");

    // 将信息注入主页html中
    $.getJSON("../../../data/articles.json", function(data){
        data.forEach((item, index)=>{
            if(item.url_title == url_title) {
                var article = item;
                var title = article.title;
                var author = article.author;
                var author_link = article.author_link;
                var summary = article.summary;
                var number_of_characters = article.number_of_characters;
                var number_of_chapters = article.number_of_chapters;
                var tags_list = article.tags.split(",").map((item, index)=>{return item.trim()});

                $("title").html(title + " by " + author);
                $(".title").html(title);
                $(".author").html(author);
                $(".button-list a.author-page").attr({"href": author_link, "target": "_blank"});
                $(".summary p").html(summary);
                $(".statistics .chapter-number").html(number_of_chapters);
                $(".statistics .character-number").html(number_of_characters);
                tags_list.forEach((item)=>{
                    $(".tags-list").append('<a href="#"><i class="fa fa-tag"></i>'+item+'</a>');
                })
            }
        })
    });

    // 禁用右键菜单
    $(window).on("contextmenu",function(e){
        e.preventDefault();
    });

    // 获取当前文章信息
    RSSD.downloadChapters.downloadable_chapters_index_list = [];
    RSSD.downloadChapters.articleData = []
    $.getJSON("/data/articles.json", function(data){
        data.forEach((item, index)=>{
            if(item.url_title == url_title) {
                RSSD.downloadChapters.articleData[0] = item.title;
                RSSD.downloadChapters.articleData[1] = item.author;
                RSSD.downloadChapters.articleData[2] = item.author_link;
            }
        })
    });
    
    // 下载缺失章节
    $("a.download").click(function(){
        var zip = new JSZip();
        var txt = zip.folder("txt");
        $.getJSON("/data/contents/"+url_title+"/chapters.json", function(data){
            var curArticleName = RSSD.downloadChapters.articleData[0]
            var curArticleAuthor = RSSD.downloadChapters.articleData[1]
            var curArticleAuthorLink = RSSD.downloadChapters.articleData[2]
            data.forEach((item, index)=>{
                if(item.is_original_post_invalid) {
                    RSSD.downloadChapters.downloadable_chapters_index_list.push(index);
                    var temp_str = RSSD.downloadChapters.getTxt($.md5(item.url_name),"/data/contents/"+url_title+"/");
                    var texts = Base64.decode(temp_str);
                    texts = item.name + "\n《" + curArticleName + "》 by " + curArticleAuthor + "\n\n" + texts;
                    txt.file(item.short_name+".txt", texts);
                }
            });
            var list = "[标题]："+curArticleName +"\n[作者]："+curArticleAuthor+" ("+curArticleAuthorLink+")\n\n原文缺失章节列表：\n";
            RSSD.downloadChapters.downloadable_chapters_index_list.forEach((chapter_index, index)=>{
                list += data[chapter_index].name + "\n";
            });
            if(!RSSD.downloadChapters.downloadable_chapters_index_list) list += "(无)\n";
            list += "\n\n\n# 来自网站 "+link.replace("#","")+" 的非官方补档，仅供同好之间相互交流，切勿违反原文作者的条款。\n# 致作者：倘若侵犯了您的权益，请联系站长邮箱 ilikepotatoes@163.com 。"
            zip.file("Info.txt", list);
            zip.generateAsync({type:"blob"}).then(function(content) {
                // see FileSaver.js
                saveAs(content, "article-"+url_title+".zip");
            });
        });
    })
})