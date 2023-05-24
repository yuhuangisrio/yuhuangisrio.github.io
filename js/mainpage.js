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
    Global.getChapters(url_title,(chapters)=>{
        window.number_of_chapters = chapters.length;
    });

    // 将信息注入主页html中
    Global.getArticles(function(data){
        data.forEach((item, index)=>{
            if(item.url_title == url_title) {
                var article = item;
                var title = article.title;
                var author = article.author;
                var author_link = article.author_link;
                var summary = article.summary;
                var number_of_characters = article.number_of_characters;
                var number_of_chapters = window.number_of_chapters;
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
                if(article.accessable_links){
                    var a_links = article.accessable_links.split('$$');
                    var temp_str = '';
                    a_links.forEach((item2)=>{
                        var type = '', a_link = item2;
                        a_link.replace('https://archiveofourown.org/','');
                        if(a_link.includes('lofter.com')) type = 'LOFTER';
                        else if(a_link.includes('works/')) type = 'AO3';
                        else if(a_link.includes('bbs.yuhuangonly.com') || a_link.includes('bbs3.yuhuangonly.cn')) type = '喻黄ONLY论坛';
                        else if(a_link.includes('yuhuangonly.com') || a_link.includes('yuhuangonly.cn')) type = '喻黄个站';
                        else if(a_link.includes('weibo')) type = 'weibo';
                        else {type = '未知网站';}
                        var def_web = (Global.getPreference('mirror-ao3-link') && Global.getPreference('mirror-ao3-link').substr(-1) == '/' ? Global.getPreference('mirror-ao3-link').slice(0, -1) : Global.getPreference('mirror-ao3-link')) || 'https://1.ao3-cn.top';
                        if(type == 'AO3') a_link = Global.getPreference('use-mirror-website') ? def_web + '/' + a_link : 'https://archiveofourown.org/' + a_link;
                        temp_str += '<a class="accessable-link" href="'+a_link+'">'+type+'</a>'+'<br>';
                    })
                    $("a.whole-article").click(()=>{
                        $.confirm({
                            title: '全文链接',
                            content: temp_str+"若以上链接全部失效，请联系站长邮箱 ilikepotatoes@163.com 以补档。",
                            boxWidth: '80%',
                            type: 'blue',
                            theme: 'light',
                            useBootstrap: false,
                            buttons: {
                                submit: {
                                    'text': '确定'
                                },
                                cancel: {
                                    'text': '取消'
                                }
                            }
                        })
                    })
                } else {
                    $("a.whole-article").click(()=>{
                        window.location.assign('./whole')
                    })
                }
                Global.getChapters(url_title, (chapters)=>{
                    chapters.forEach((item)=>{
                        $("div.chapter-list ul").append('<li><a href="./'+item.url_name+'/">'+item.short_name+'</a></li>')
                    })
                })
            }
        })
    });

    // 从缓存中获取该文章是否已被收藏
    if(Global.isStarred(url_title)) {
        $("a.star i").removeClass("fa-star-o");
        $("a.star i").addClass("fa-star");
        $("a.star").css("color", "#f5df15");
        $("a.star:hover").css("color", "#f5df15");
        $("a.star span.tooltip-down").html("取消收藏该作品");
    };

    // 禁用右键菜单
    $(window).on("contextmenu",function(e){
        e.preventDefault();
    });

    // 获取当前文章信息
    RSSD.downloadChapters.downloadable_chapters_index_list = [];
    RSSD.downloadChapters.articleData = []
    Global.getArticles((data)=>{
        data.forEach((item)=>{
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
        Global.getChapters(url_title, (data)=>{
            var curArticleName = RSSD.downloadChapters.articleData[0]
            var curArticleAuthor = RSSD.downloadChapters.articleData[1]
            var curArticleAuthorLink = RSSD.downloadChapters.articleData[2]
            data.forEach((item, index)=>{
                if(item.is_original_post_invalid) {
                    RSSD.downloadChapters.downloadable_chapters_index_list.push(index);
                    var temp_str = RSSD.downloadChapters.getTxt($.md5(item.url_name),"/data/contents/"+url_title+"/");
                    var texts = Base64.decode(temp_str);
                    texts = item.name + "\r\n《" + curArticleName + "》 by " + curArticleAuthor + "\r\n\r\n" + texts;
                    txt.file(item.short_name+".txt", texts);
                }
            });
            var list = "[标题]："+curArticleName +"\r\n[作者]："+curArticleAuthor+" ("+curArticleAuthorLink+")\r\n\r\n原文缺失章节列表：\r\n";
            RSSD.downloadChapters.downloadable_chapters_index_list.forEach((chapter_index, index)=>{
                list += data[chapter_index].name + "\r\n";
            });
            if(!RSSD.downloadChapters.downloadable_chapters_index_list) list += "(无)\r\n";
            list += "\r\n\r\n\r\n# 来自网站 "+link.replace("#","")+" 的非官方补档，仅供同好之间相互交流，切勿违反原文作者的条款。\r\n# 致作者：倘若侵犯了您的权益，请联系站长邮箱 ilikepotatoes@163.com 。"
            zip.file("Info.txt", list);
            zip.generateAsync({type:"blob"}).then(function(content) {
                // see FileSaver.js
                saveAs(content, "article-"+url_title+".zip");
            });
        });
    });

    // 收藏/取消收藏该文章
    $("a.star").click(function() {
        if(!Global.isStarred(url_title)) {
            Global.setStar(url_title);
            $("a.star i").removeClass("fa-star-o");
            $("a.star i").addClass("fa-star");
            $("a.star").css("color", "#f5df15");
            $("a.star:hover").css("color", "#f5df15");
            $("a.star span.tooltip-down").html("取消收藏该作品");
        } else {
            Global.removeStar(url_title);
            $("a.star i").removeClass("fa-star");
            $("a.star i").addClass("fa-star-o");
            $("a.star").css("color", "rgb(132, 132, 132)");
            $("a.star:hover").css("color", "#05c0f8");
            $("a.star span.tooltip-down").html("收藏该作品");
        }
    });
})