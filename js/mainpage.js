var RSSD = RSSD || {};
RSSD.downloadChapters = {};

$(document).ready(()=>{
    var temp_arr = window.location.href.split("/");
    var url_title = temp_arr[temp_arr.length-2];
    var link = window.location.href.replace(window.location.pathname,"");
    var home_link = Global._convertPathForApp('/');
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
                var roles = article.roles;
                var status = article.status;
                var ending = article.ending;
                var is_yuhuangyu = article.is_yuhuangyu ? '是' : '否';
                var extra_cp = article.extra_cp || '-无-';
                var warning = article.warning || '';
                var tags_list = article.tags.split(",").map((item, index)=>{return item.trim()});

                $("title").html(title + " by " + author);
                $(".title").html(title);
                $(".author").html(author);
                $(".button-list a.author-page").attr({"href": author_link, "target": "_blank"});
                $(".summary p").html(summary);
                $(".statistics .chapter-number").html(number_of_chapters);
                $(".statistics .character-number").html(number_of_characters);
                $(".is-yuhuangyu").html(is_yuhuangyu);
                $(".extra-cp").html(extra_cp);
                $(".article-role").html(roles);
                $(".statistics .article-status").html(status);
                $(".statistics .article-ending").html(ending);
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
                        temp_str += '<a class="accessable-link" href="'+a_link+'" target="_blank">'+type+'</a>'+'<br>';
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
                        Global.goToWholeChapter(url_title);
                    })
                }
                Global.getChapters(url_title, (chapters)=>{
                    chapters.forEach((item)=>{
                        $("div.chapter-list ul").append('<li><a href="javascript:;" onclick="Global.goToArticle(\''+url_title + '/' + item.url_name+'\')">'+item.short_name+'</a></li>')
                    })
                })
            }

            // 注入索引目录
            var a_title = '';
            data.forEach((a)=>{
                if(a.url_title == url_title) a_title = a.title;
            })
            $("div.index-struct").html('<a href="'+home_link+'"><i class="fa fa-home"></i> 首页</a> &raquo; <i class="fa fa-book"></i> '+a_title)

            // 注入预警
            if(warning) {
                $(".article-warning").css('display','block')
                $(".article-warning p").html(warning);
            }
            // 注入合集
            Global.getCollections((cl)=>{
                var co_url = [];
                var co_name = [];
                cl.forEach((c)=>{
                    if(c.urls.includes(url_title)) {
                        co_url.push(c.url_title);
                        co_name.push(c.title);
                    }
                })
                if(co_url.length > 0) {
                    $(".from-collection").css('display','block');
                    co_url.forEach((url, i)=>{
                        let title = co_name[i];
                        let prefix = i > 0 ? ', ' : '';
                        $(".from-collection span.cl").append('<span class="co-item"><a href="javascript:;" onclick="Global.goToCollection(\''+url+'\')">'+prefix+'<i class="fa fa-folder-open"></i> '+title+'</a></span>')
                    })
                }
            })
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
                    var temp_str = Global.getTxt($.md5(item.url_name),"/data/contents/"+url_title+"/");
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
            $("a.star i").toggleClass("fa-star-o");
            $("a.star i").toggleClass("fa-star");
            $("a.star").addClass("starred")
            // $("a.star").css("color", "#f5df15");
            // $("a.star:hover").css("color", "#f5df15");
            $("a.star span.tooltip-down").html("取消收藏该作品");
        } else {
            Global.removeStar(url_title);
            $("a.star i").toggleClass("fa-star-o");
            $("a.star i").toggleClass("fa-star");
            $("a.star").removeClass("starred")
            // $("a.star").css("color", "rgb(132, 132, 132)");
            // $("a.star:hover").css("color", "#05c0f8");
            $("a.star span.tooltip-down").html("收藏该作品");
        }
    });

    // 分享
    $('a.share').click(()=>{
        Global.getArticles((articles)=>{
            var a = {};
            articles.forEach((article)=>{
                if(article.url_title == url_title) a = article;
            })
            $.dialog({
                title: '分享该文章',
                content: '<div>标题：' + a.title + '</div>' +
                        '<div style="margin-bottom: 30px;">作者：'+ a.author +'</div>' +
                        '<div class="social-media-share social-share"></div>',
                boxWidth: "80%",
                boxHeight: "50%",
                useBootstrap: false,
                type: 'blue',
                theme: 'light',
                onOpen: function() {
                    this.$content.find('.social-media-share').share({
                        sites: ['weibo','qq','tencent','douban','qzone','linkedin','diandian','facebook','twitter','google']
                    });
                }
            })
        })
    })
})