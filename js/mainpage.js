var RSSD = RSSD || {};
RSSD.downloadChapters = {};

$(document).ready(()=>{
    var temp_arr = window.location.href.split("/");
    var url_title = temp_arr[temp_arr.length-2];
    var link = window.location.href.replace(window.location.pathname,"");
    var home_link = Global._convertPathForApp('/');

    Global.setLastReadBook(url_title);

    // 将信息注入主页html中
    Global.getArticles(function(articles){
        Global.getChapters(url_title, (chapters)=>{
            articles.forEach((item, index)=>{
                if(item.url_title == url_title) {
                    var article = item;
                    var title = article.title;
                    var author = article.author;
                    var author_link = article.author_link;
                    var summary = article.summary;
                    var number_of_characters = article.number_of_characters;
                    var number_of_chapters = chapters.length;
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
                        var tar_link = '';
                        var yhonlyf_links = [], yhonlym_links = [], lof_links = [], ao3_links = [], chongya_links = [], weibo_links = [], other_links = [];
                        for(var i = 0; i < a_links.length; i++){
                            var item2 = a_links[i];
                            var type = '', a_link = item2;
                            a_link.replace('https://archiveofourown.org','');
                            if(a_link.includes('lofter.com')) {type = 'LOFTER'; lof_links.push(a_link);}
                            else if(a_link.includes('works/')) {type = 'AO3';}
                            else if(a_link.includes('bbs.yuhuangonly.com') || a_link.includes('bbs3.yuhuangonly.cn')) {type = '喻黄ONLY论坛'; yhonlyf_links.push(a_link);}
                            else if(a_link.includes('yuhuangonly.com') || a_link.includes('yuhuangonly.cn')) {type = '喻黄个站'; yhonlym_links.push(a_link);}
                            else if(a_link.includes('chongya.com')) {type = '冲呀'; chongya_links.push(a_link);}
                            else if(a_link.includes('weibo')) {type = 'weibo'; weibo_links.push(a_link);}
                            else {type = '未知网站'; other_links.push(a_link);}
                            a_link =  a_link.includes('/works') ? a_link.substring(a_link.indexOf('/works')) : a_link;
                            var def_web = (Global.getPreference('mirror-ao3-link') && Global.getPreference('mirror-ao3-link').charAt(-1) == '/' ? Global.getPreference('mirror-ao3-link').substring(0, -2) : Global.getPreference('mirror-ao3-link')) || Global.initial_preferences['mirror-ao3-link'];
                            if(type == 'AO3') {a_link = Global.getPreference('use-mirror-website') === true || Global.initial_preferences['use-mirror-website'] ? def_web + a_link : 'https://archiveofourown.org' + a_link; ao3_links.push(a_link);}
                            var pref_web = Global.getPreference('preferred-reading-website') || Global.initial_preferences['preferred-reading-website'];
                            if(pref_web.toLowerCase() == type.toLowerCase()) {
                                tar_link = a_link;
                                break;
                            }
                        }
                        if(!tar_link) {
                            var temp_arr = [];
                            temp_arr = temp_arr.concat(yhonlyf_links, yhonlym_links, lof_links, ao3_links, chongya_links, weibo_links, other_links);
                            tar_link = temp_arr[0] || Global._convertPathForApp('/article/'+url_title+'/'+'whole'+'/index.html');
                        }
                        var temp_obj = {};   // 上下文菜单
                        yhonlyf_links.forEach((l, i)=>{
                            if(yhonlyf_links.length > 1) {
                                temp_obj['yhforum-' + (i+1)] = {name: '喻黄ONLY论坛-'+(i+1)};
                            } else {
                                temp_obj['yhforum-' + (i+1)] = {name: '喻黄ONLY论坛'};
                            }
                        })
                        if(yhonlyf_links.length) temp_obj['sep1'] = '---------'
                        yhonlym_links.forEach((l, i)=>{
                            if(yhonlym_links.length > 1) {
                                temp_obj['yhmain-' + (i+1)] = {name: '喻黄ONLY主站-'+(i+1)};
                            } else {
                                temp_obj['yhmain-' + (i+1)] = {name: '喻黄ONLY主站'};
                            }
                        })
                        if(yhonlym_links.length) temp_obj['sep2'] = '---------'
                        lof_links.forEach((l, i)=>{
                            if(lof_links.length > 1) {
                                temp_obj['lofter-' + (i+1)] = {name: 'LOFTER-'+(i+1)};
                            } else {
                                temp_obj['lofter-' + (i+1)] = {name: 'LOFTER'};
                            }
                        })
                        if(lof_links.length) temp_obj['sep3'] = '---------'
                        ao3_links.forEach((l, i)=>{
                            if(ao3_links.length > 1) {
                                temp_obj['ao3-' + (i+1)] = {name: 'AO3-'+(i+1)};
                            } else {
                                temp_obj['ao3-' + (i+1)] = {name: 'AO3'};
                            }
                        })
                        if(ao3_links.length) temp_obj['sep4'] = '---------'
                        chongya_links.forEach((l, i)=>{
                            if(chongya_links.length > 1) {
                                temp_obj['chongya-' + (i+1)] = {name: '冲呀-'+(i+1)};
                            } else {
                                temp_obj['chongya-' + (i+1)] = {name: '冲呀'};
                            }
                        })
                        if(chongya_links.length) temp_obj['sep5'] = '---------'
                        weibo_links.forEach((l, i)=>{
                            if(weibo_links.length > 1) {
                                temp_obj['weibo-' + (i+1)] = {name: '微博-'+(i+1)};
                            } else {
                                temp_obj['weibo-' + (i+1)] = {name: '微博'};
                            }
                        })
                        if(weibo_links.length) temp_obj['sep6'] = '---------'
                        other_links.forEach((l, i)=>{
                            if(other_links.length > 1) {
                                temp_obj['unknown-' + (i+1)] = {name: '未知网站-'+(i+1)};
                            } else {
                                temp_obj['unknown-' + (i+1)] = {name: '未知网站'};
                            }
                        })
                        $("a.whole-article").click(()=>{
                            if(!Global.isMobile()){
                                if(!Global.is_app) {
                                    window.open(tar_link);
                                } else {
                                    window.open(Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html'))
                                }
                            } else {
                                if(!Global.is_app) {
                                    var link_str = '';
                                    yhonlyf_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'喻黄ONLY论坛'+'</a><br>'})
                                    yhonlym_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'喻黄ONLY主站'+'</a><br>'})
                                    lof_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'LOFTER'+'</a><br>'})
                                    ao3_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'AO3'+'</a><br>'})
                                    chongya_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'冲呀'+'</a><br>'})
                                    weibo_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'微博'+'</a><br>'})
                                    other_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'未知网站'+'</a><br>'})
                                    link_str+='<br>如果以上链接全部失效，请联系站长邮箱 <a href="mailto:ilikepotatoes@163.com">ilikepotatoes@163.com</a> 以补档。'
                                    $.dialog({
                                        title: '转到...',
                                        content: '<div class="link-to">'+link_str+'</div>',
                                        useBootstrap: false,
                                        type: 'blue',
                                        theme: 'light',
                                        boxWidth: "80%",
                                        boxHeight: "50%",
                                    })
                                } else {
                                    window.open(Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html'))
                                }
                            }
                        });
                        $.contextMenu({
                            selector: 'a.whole-article',
                            build: function(ele, e){
                                return {
                                    callback: function(k, opts) {
                                        var curEle = opts.$target;
                                        var tar_url = '';
                                        if(k.includes('yhforum-')) {tar_url = yhonlyf_links[+k.replace('yhforum-','')-1]};
                                        if(k.includes('yhmain-')) {tar_url = yhonlym_links[+k.replace('yhmain-','')-1]};
                                        if(k.includes('lofter-')) {tar_url = lof_links[+k.replace('lofter-','')-1]};
                                        if(k.includes('ao3-')) {tar_url = ao3_links[+k.replace('ao3-','')-1]};
                                        if(k.includes('chongya-')) {tar_url = chongya_links[+k.replace('chongya-','')-1]};
                                        if(k.includes('weibo-')) {tar_url = weibo_links[+k.replace('weibo-','')-1]};
                                        if(k.includes('unknown-')) {tar_url = other_links[+k.replace('unknown-','')-1]};
                                        if(k == 'local') {tar_url = Global._convertPathForApp('/article/'+url_title+'/'+'whole'+'/index.html')};
                                        if(k == 'report') {
                                            $("body").append("<a id='report-handler' href='mailto:ilikepotatoes@163.com' style='display: none'><span id='report'></span></a>");
                                            $('#report').click();
                                            $("#report-handler").remove();
                                        }
                                        if(tar_url) window.open(tar_url);
                                        if(k == 'copy') {
                                            $('body').append('<input id="foo" value="'+tar_link+'"></input>')
                                            $("body").append('<a id="copy-handler" data-clipboard-target="#foo" style="display: none"><span id="copy"></span></a>');
                                            var clipboard = new ClipboardJS('#copy-handler');
                                            $('#copy').click();
                                            $("#foo").remove();
                                            $("#copy-handler").remove();
                                            clipboard.destroy();
                                        }
                                    },
                                    items: {
                                        "copy": {"name": '复制链接', "icon": 'fa-copy'},
                                        "assign": {
                                            "name": "转到...",
                                            "icon": "fa-share-square-o",
                                            "items": temp_obj
                                        },
                                        "sep1": "---------",
                                        "report": {"name": "求补档/报告失效链接", "icon": "fa-book"}
                                    }
                                }
                            }
                        })
                    } else {
                        $("a.whole-article").click(()=>{
                            Global.goToChapter(url_title, 'whole');
                        })
                        temp_obj = {'local': {name: '本站章节页面'}}
                        $.contextMenu({
                            selector: 'a.whole-article',
                            build: function(ele, e){
                                return {
                                    callback: function(k, opts) {
                                        var curEle = opts.$target;
                                        var tar_url = '';
                                        if(k == 'local') {tar_url = Global._convertPathForApp('/article/'+url_title+'/'+'whole'+'/index.html')};
                                        if(k == 'report') {
                                            $("body").append("<a id='report-handler' href='mailto:ilikepotatoes@163.com' style='display: none'><span id='report'></span></a>");
                                            $('#report').click();
                                            $("#report-handler").remove();
                                        }
                                        if(tar_url) window.open(tar_url);
                                        if(k == 'copy') {
                                            $('body').append('<input id="foo" value="'+tar_link+'"></input>')
                                            $("body").append('<a id="copy-handler" data-clipboard-target="#foo" style="display: none"><span id="copy"></span></a>');
                                            var clipboard = new ClipboardJS('#copy-handler');
                                            $('#copy').click();
                                            $("#foo").remove();
                                            $("#copy-handler").remove();
                                            clipboard.destroy();
                                        }
                                    },
                                    items: {
                                        "copy": {"name": '复制链接', "icon": 'fa-copy'},
                                        "assign": {
                                            "name": "转到...",
                                            "icon": "fa-share-square-o",
                                            "items": temp_obj
                                        },
                                        "sep1": "---------",
                                        "report": {"name": "求补档/报告失效链接", "icon": "fa-book"}
                                    }
                                }
                            }
                        })
                    }
                    chapters.forEach((item, i)=>{
                        $("div.chapter-list ul").append('<li><a id="ci-'+(i+1)+'" href="javascript:;">'+item.short_name+'</a></li>')
                    })

                    // 必要时隐藏下载按钮
                    if(!article.is_redistributable) {
                        $(".download").css('display','none')
                    }
                }

                // 注入索引目录
                var a_title = '';
                articles.forEach((a)=>{
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
                    cl.forEach((col)=>{
                        col.urls.split('&').forEach((u)=>{
                            if(u == url_title) {
                                co_url.push(col.url_title);
                                co_name.push(col.title);
                            }
                        })
                    })
                    var temp_str = '';
                    if(co_url.clearRepetition().length > 0) {
                        $(".from-collection").css('display','block');
                        co_url.forEach((urll, i)=>{
                            let title = co_name[i];
                            let prefix = i > 0 ? ', ' : '';
                            temp_str+='<span class="co-item"><a href="javascript:;" onclick="Global.goToCollection(\''+urll+'\')">'+prefix+'<i class="fa fa-folder-open"></i> '+title+'</a></span>';
                        })
                        $(".from-collection span.cl").html(temp_str)
                    }
                })
            })

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
            articles.forEach((item)=>{
                if(item.url_title == url_title) {
                    RSSD.downloadChapters.articleData[0] = item.title;
                    RSSD.downloadChapters.articleData[1] = item.author;
                    RSSD.downloadChapters.articleData[2] = item.author_link;
                }
            })
            
            // 下载缺失章节
            $("a.download").click(function(){
                var zip = new JSZip();
                var txt = zip.folder("txt");
                var curArticleName = RSSD.downloadChapters.articleData[0]
                var curArticleAuthor = RSSD.downloadChapters.articleData[1]
                var curArticleAuthorLink = RSSD.downloadChapters.articleData[2]
                chapters.forEach((item, index)=>{
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
                    list += chapters[chapter_index].name + "\r\n";
                });
                if(!RSSD.downloadChapters.downloadable_chapters_index_list) list += "(无)\r\n";
                list += "\r\n\r\n\r\n# 来自网站 "+link.replace("#","")+" 的非官方补档，仅供同好之间相互交流，切勿违反原文作者的条款。\r\n# 致作者：倘若侵犯了您的权益，请联系站长邮箱 ilikepotatoes@163.com 。"
                zip.file("Info.txt", list);
                zip.generateAsync({type:"blob"}).then(function(content) {
                    // see FileSaver.js
                    saveAs(content, "article-"+url_title+".zip");
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
            });

            $('.question').click(()=>{
                var q = '对于电脑端，如果点进章节后发现链接失效，可以右键单击/长按章节块弹出上下文菜单，在“转到...”选项中转到其他网站以继续阅读。<br>如果发现链接全部失效/不想让自己的文章被别人看到/不想让自己文章的补档被下载等等，同样可以通过上下文菜单向站长报告。';
                if(Global.isMobile() && !Global.is_app) {
                    q = '对于手机端，如果链接全部失效/不想让自己的文章被别人看到/不想让自己文章的补档被下载等等，请点击章节块，在弹出的对话框中联系站长邮箱。'
                }
                $.dialog({
                    title: '小贴士',
                    content: q,
                    useBootstrap: false,
                    type: 'blue',
                    theme: 'light',
                    boxWidth: "80%",
                    boxHeight: "50%",
                })
            })

            $(".chapter-list ul li a:not(.whole-article)").click(function() {
                var ele = $(this);
                var article = {}
                articles.forEach((item, index)=>{
                    if(item.url_title == url_title) {
                        article = item;
                    }
                })
                var chapter_index = +ele.attr('id').replace('ci-','') - 1;
                if (chapters[chapter_index].links) {
                    var c_links = chapters[chapter_index].links.split('$$');
                    var yhonlyf_links = [], yhonlym_links = [], lof_links = [], ao3_links = [], chongya_links = [], weibo_links = [], other_links = [];
                    for(var i = 0; i < c_links.length; i++){
                        var item2 = c_links[i];
                        var type = '', c_link = item2;
                        var tar_link = '';
                        if(c_link.includes('lofter.com')) {type = 'LOFTER'; lof_links.push(c_link);}
                        else if(c_link.includes('works/')) {type = 'AO3';}
                        else if(c_link.includes('bbs.yuhuangonly.com') || c_link.includes('bbs3.yuhuangonly.cn')) {type = '喻黄ONLY论坛'; yhonlyf_links.push(c_link);}
                        else if(c_link.includes('yuhuangonly.com') || c_link.includes('yuhuangonly.cn')) {type = '喻黄个站'; yhonlym_links.push(c_link);}
                        else if(c_link.includes('chongya.com')) {type = '冲呀'; chongya_links.push(c_link);}
                        else if(c_link.includes('weibo')) {type = 'weibo'; weibo_links.push(c_link);}
                        else {type = '未知网站'; other_links.push(c_link);}
                        c_link =  c_link.includes('/works') ? c_link.substring(c_link.indexOf('/works')) : c_link;
                        var def_web = (Global.getPreference('mirror-ao3-link') && Global.getPreference('mirror-ao3-link').charAt(-1) == '/' ? Global.getPreference('mirror-ao3-link').substring(0, -2) : Global.getPreference('mirror-ao3-link')) || Global.initial_preferences['mirror-ao3-link'];
                        if(type == 'AO3') {c_link = typeof Global.getPreference('use-mirror-website') || Global.initial_preferences['use-mirror-website'] === true ? def_web + c_link : 'https://archiveofourown.org' + c_link; ao3_links.push(c_link);}
                        var pref_web = Global.getPreference('preferred-reading-website') || Global.initial_preferences['preferred-reading-website'];
                        if(pref_web.toLowerCase() == type.toLowerCase()) {
                            tar_link = c_link;
                            break;
                        }
                    }
                    if(!tar_link) {
                        var temp_arr = [];
                        temp_arr = temp_arr.concat(yhonlyf_links, yhonlym_links, lof_links, ao3_links, chongya_links, weibo_links, other_links);
                        tar_link = temp_arr[0] || Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html');
                    }
                    if(!Global.isMobile()){
                        if(!Global.is_app) {
                            window.open(tar_link);
                        } else {
                            window.open(Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html'))
                        }
                    } else {
                        if(!Global.is_app) {
                            var link_str = '';
                            yhonlyf_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'喻黄ONLY论坛'+'</a><br>'})
                            yhonlym_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'喻黄ONLY主站'+'</a><br>'})
                            lof_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'LOFTER'+'</a><br>'})
                            ao3_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'AO3'+'</a><br>'})
                            chongya_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'冲呀'+'</a><br>'})
                            weibo_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'微博'+'</a><br>'})
                            other_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'未知网站'+'</a><br>'})
                            link_str+='<br>如果以上链接全部失效，请联系站长邮箱 <a href="mailto:ilikepotatoes@163.com">ilikepotatoes@163.com</a> 以补档。'
                            $.dialog({
                                title: '转到...',
                                content: '<div class="link-to">'+link_str+'</div>',
                                useBootstrap: false,
                                type: 'blue',
                                theme: 'light',
                                boxWidth: "80%",
                                boxHeight: "50%",
                            })
                        } else {
                            window.open(Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html'))
                        }
                    }
                } else if(article.accessable_links) {
                    var a_links = article.accessable_links.split('$$');
                    var tar_link = '';
                    var yhonlyf_links = [], yhonlym_links = [], lof_links = [], ao3_links = [], chongya_links = [], weibo_links = [], other_links = [];
                    for(var i = 0; i < a_links.length; i++){
                        var item2 = a_links[i];
                        var type = '', a_link = item2;
                        a_link.replace('https://archiveofourown.org','');
                        if(a_link.includes('lofter.com')) {type = 'LOFTER'; lof_links.push(a_link);}
                        else if(a_link.includes('works/')) {type = 'AO3';}
                        else if(a_link.includes('bbs.yuhuangonly.com') || a_link.includes('bbs3.yuhuangonly.cn')) {type = '喻黄ONLY论坛'; yhonlyf_links.push(a_link);}
                        else if(a_link.includes('yuhuangonly.com') || a_link.includes('yuhuangonly.cn')) {type = '喻黄个站'; yhonlym_links.push(a_link);}
                        else if(a_link.includes('chongya.com')) {type = '冲呀'; chongya_links.push(a_link);}
                        else if(a_link.includes('weibo')) {type = 'weibo'; weibo_links.push(a_link);}
                        else {type = '未知网站'; other_links.push(a_link);}
                        a_link =  a_link.includes('/works') ? a_link.substring(a_link.indexOf('/works')) : a_link;
                        var def_web = (Global.getPreference('mirror-ao3-link') && Global.getPreference('mirror-ao3-link').charAt(-1) == '/' ? Global.getPreference('mirror-ao3-link').substring(0, -2) : Global.getPreference('mirror-ao3-link')) || Global.initial_preferences['mirror-ao3-link'];
                        if(type == 'AO3') {a_link = Global.getPreference('use-mirror-website') === true || Global.initial_preferences['use-mirror-website'] ? def_web + a_link : 'https://archiveofourown.org' + a_link; ao3_links.push(a_link);}
                        var pref_web = Global.getPreference('preferred-reading-website') || Global.initial_preferences['preferred-reading-website'];
                        if(pref_web.toLowerCase() == type.toLowerCase()) {
                            tar_link = a_link;
                            break;
                        }
                    }
                    if(!tar_link) {
                        var temp_arr = [];
                        temp_arr = temp_arr.concat(yhonlyf_links, yhonlym_links, lof_links, ao3_links, chongya_links, weibo_links, other_links);
                        tar_link = temp_arr[0] || Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html');
                    }
                    if(!Global.isMobile()){
                        if(!Global.is_app) {
                            window.open(tar_link);
                        } else {
                            window.open(Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html'))
                        }
                    } else {
                        if(!Global.is_app) {
                            var link_str = '';
                            yhonlyf_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'喻黄ONLY论坛'+'</a><br>'})
                            yhonlym_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'喻黄ONLY主站'+'</a><br>'})
                            lof_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'LOFTER'+'</a><br>'})
                            ao3_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'AO3'+'</a><br>'})
                            chongya_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'冲呀'+'</a><br>'})
                            weibo_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'微博'+'</a><br>'})
                            other_links.forEach((item)=>{link_str+='<a href="'+item+'" target="_blank">'+'未知网站'+'</a><br>'})
                            link_str+='<br>如果以上链接全部失效，请联系站长邮箱 <a href="mailto:ilikepotatoes@163.com">ilikepotatoes@163.com</a> 以补档。'
                            $.dialog({
                                title: '转到...',
                                content: '<div class="link-to">'+link_str+'</div>',
                                useBootstrap: false,
                                type: 'blue',
                                theme: 'light',
                                boxWidth: "80%",
                                boxHeight: "50%",
                            })
                        } else {
                            window.open(Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html'))
                        }
                    }
                } else {
                    window.open(Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name)+'/index.html')
                }
            })

            // 上下文菜单
            $.contextMenu({
                selector: '.chapter-list ul li a:not(.whole-article)',
                build: function(ele, e){
                    var article = {}
                    articles.forEach((item, index)=>{
                        if(item.url_title == url_title) {
                            article = item;
                        }
                    })
                    var chapter_index = +ele.attr('id').replace('ci-','') - 1;
                    if (chapters[chapter_index].links) {
                        var c_links = chapters[chapter_index].links.split('$$');
                        var yhonlyf_links = [], yhonlym_links = [], lof_links = [], ao3_links = [], chongya_links = [], weibo_links = [], other_links = [];
                        for(var i = 0; i < c_links.length; i++){
                            var item2 = c_links[i];
                            var type = '', c_link = item2;
                            var tar_link = '';
                            c_link.replace('https://archiveofourown.org','');
                            if(c_link.includes('lofter.com')) {type = 'LOFTER'; lof_links.push(c_link);}
                            else if(c_link.includes('works/')) {type = 'AO3';}
                            else if(c_link.includes('bbs.yuhuangonly.com') || c_link.includes('bbs3.yuhuangonly.cn')) {type = '喻黄ONLY论坛'; yhonlyf_links.push(c_link);}
                            else if(c_link.includes('yuhuangonly.com') || c_link.includes('yuhuangonly.cn')) {type = '喻黄个站'; yhonlym_links.push(c_link);}
                            else if(c_link.includes('chongya.com')) {type = '冲呀'; chongya_links.push(c_link);}
                            else if(c_link.includes('weibo')) {type = 'weibo'; weibo_links.push(c_link);}
                            else {type = '未知网站'; other_links.push(c_link);}
                            var def_web = (Global.getPreference('mirror-ao3-link') && Global.getPreference('mirror-ao3-link').charAt(0) == '/' ? Global.getPreference('mirror-ao3-link').slice(0, -1) : Global.getPreference('mirror-ao3-link')) || 'https://1.ao3-cn.top';
                            if(type == 'AO3') {c_link = Global.getPreference('use-mirror-website') ? def_web + '/' + c_link : 'https://archiveofourown.org/' + c_link; ao3_links.push(c_link);}
                            var pref_web = Global.getPreference('preferred-reading-website') || Global.initial_preferences['preferred-reading-website'];
                            if(pref_web.toLowerCase() == type.toLowerCase()) {
                                tar_link = c_link;
                                break;
                            }
                        }
                        if(!tar_link) {
                            var temp_arr = [];
                            temp_arr = temp_arr.concat(yhonlyf_links, yhonlym_links, lof_links, ao3_links, chongya_links, weibo_links, other_links);
                            tar_link = temp_arr[0] || Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html');
                        }
                        var temp_obj = {};   // 上下文菜单
                        yhonlyf_links.forEach((l, i)=>{
                            if(yhonlyf_links.length > 1) {
                                temp_obj['yhforum-' + (i+1)] = {name: '喻黄ONLY论坛-'+(i+1)};
                            } else {
                                temp_obj['yhforum-' + (i+1)] = {name: '喻黄ONLY论坛'};
                            }
                        })
                        if(yhonlyf_links.length) temp_obj['sep1'] = '---------'
                        yhonlym_links.forEach((l, i)=>{
                            if(yhonlym_links.length > 1) {
                                temp_obj['yhmain-' + (i+1)] = {name: '喻黄ONLY主站-'+(i+1)};
                            } else {
                                temp_obj['yhmain-' + (i+1)] = {name: '喻黄ONLY主站'};
                            }
                        })
                        if(yhonlym_links.length) temp_obj['sep2'] = '---------'
                        lof_links.forEach((l, i)=>{
                            if(lof_links.length > 1) {
                                temp_obj['lofter-' + (i+1)] = {name: 'LOFTER-'+(i+1)};
                            } else {
                                temp_obj['lofter-' + (i+1)] = {name: 'LOFTER'};
                            }
                        })
                        if(lof_links.length) temp_obj['sep3'] = '---------'
                        ao3_links.forEach((l, i)=>{
                            if(ao3_links.length > 1) {
                                temp_obj['ao3-' + (i+1)] = {name: 'AO3-'+(i+1)};
                            } else {
                                temp_obj['ao3-' + (i+1)] = {name: 'AO3'};
                            }
                        })
                        if(ao3_links.length) temp_obj['sep4'] = '---------'
                        chongya_links.forEach((l, i)=>{
                            if(chongya_links.length > 1) {
                                temp_obj['chongya-' + (i+1)] = {name: '冲呀-'+(i+1)};
                            } else {
                                temp_obj['chongya-' + (i+1)] = {name: '冲呀'};
                            }
                        })
                        if(chongya_links.length) temp_obj['sep5'] = '---------'
                        weibo_links.forEach((l, i)=>{
                            if(weibo_links.length > 1) {
                                temp_obj['weibo-' + (i+1)] = {name: '微博-'+(i+1)};
                            } else {
                                temp_obj['weibo-' + (i+1)] = {name: '微博'};
                            }
                        })
                        if(weibo_links.length) temp_obj['sep6'] = '---------'
                        other_links.forEach((l, i)=>{
                            if(other_links.length > 1) {
                                temp_obj['unknown-' + (i+1)] = {name: '未知网站-'+(i+1)};
                            } else {
                                temp_obj['unknown-' + (i+1)] = {name: '未知网站'};
                            }
                        })
                    } else if(article.accessable_links) {
                        var a_links = article.accessable_links.split('$$');
                        var tar_link = '';
                        var yhonlyf_links = [], yhonlym_links = [], lof_links = [], ao3_links = [], chongya_links = [], weibo_links = [], other_links = [];
                        for(var i = 0; i < a_links.length; i++){
                            var item2 = a_links[i];
                            var type = '', a_link = item2;
                            a_link.replace('https://archiveofourown.org','');
                            if(a_link.includes('lofter.com')) {type = 'LOFTER'; lof_links.push(a_link);}
                            else if(a_link.includes('works/')) {type = 'AO3';}
                            else if(a_link.includes('bbs.yuhuangonly.com') || a_link.includes('bbs3.yuhuangonly.cn')) {type = '喻黄ONLY论坛'; yhonlyf_links.push(a_link);}
                            else if(a_link.includes('yuhuangonly.com') || a_link.includes('yuhuangonly.cn')) {type = '喻黄个站'; yhonlym_links.push(a_link);}
                            else if(a_link.includes('chongya.com')) {type = '冲呀'; chongya_links.push(a_link);}
                            else if(a_link.includes('weibo')) {type = 'weibo'; weibo_links.push(a_link);}
                            else {type = '未知网站'; other_links.push(a_link);}
                            a_link =  a_link.includes('/works') ? a_link.substring(a_link.indexOf('/works')) : a_link;
                            var def_web = (Global.getPreference('mirror-ao3-link') && Global.getPreference('mirror-ao3-link').charAt(-1) == '/' ? Global.getPreference('mirror-ao3-link').substring(0, -2) : Global.getPreference('mirror-ao3-link')) || Global.initial_preferences['mirror-ao3-link'];
                            if(type == 'AO3') {a_link = Global.getPreference('use-mirror-website') === true || Global.initial_preferences['use-mirror-website'] ? def_web + a_link : 'https://archiveofourown.org' + a_link; ao3_links.push(a_link);}
                            var pref_web = Global.getPreference('preferred-reading-website') || Global.initial_preferences['preferred-reading-website'];
                            if(pref_web.toLowerCase() == type.toLowerCase()) {
                                tar_link = a_link;
                                break;
                            }
                        }
                        if(!tar_link) {
                            var temp_arr = [];
                            temp_arr = temp_arr.concat(yhonlyf_links, yhonlym_links, lof_links, ao3_links, chongya_links, weibo_links, other_links);
                            tar_link = temp_arr[0] || Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html');
                        }
                        var temp_obj = {};   // 上下文菜单
                        yhonlyf_links.forEach((l, i)=>{
                            if(yhonlyf_links.length > 1) {
                                temp_obj['yhforum-' + (i+1)] = {name: '喻黄ONLY论坛-'+(i+1)};
                            } else {
                                temp_obj['yhforum-' + (i+1)] = {name: '喻黄ONLY论坛'};
                            }
                        })
                        if(yhonlyf_links.length) temp_obj['sep1'] = '---------'
                        yhonlym_links.forEach((l, i)=>{
                            if(yhonlym_links.length > 1) {
                                temp_obj['yhmain-' + (i+1)] = {name: '喻黄ONLY主站-'+(i+1)};
                            } else {
                                temp_obj['yhmain-' + (i+1)] = {name: '喻黄ONLY主站'};
                            }
                        })
                        if(yhonlym_links.length) temp_obj['sep2'] = '---------'
                        lof_links.forEach((l, i)=>{
                            if(lof_links.length > 1) {
                                temp_obj['lofter-' + (i+1)] = {name: 'LOFTER-'+(i+1)};
                            } else {
                                temp_obj['lofter-' + (i+1)] = {name: 'LOFTER'};
                            }
                        })
                        if(lof_links.length) temp_obj['sep3'] = '---------'
                        ao3_links.forEach((l, i)=>{
                            if(ao3_links.length > 1) {
                                temp_obj['ao3-' + (i+1)] = {name: 'AO3-'+(i+1)};
                            } else {
                                temp_obj['ao3-' + (i+1)] = {name: 'AO3'};
                            }
                        })
                        if(ao3_links.length) temp_obj['sep4'] = '---------'
                        chongya_links.forEach((l, i)=>{
                            if(chongya_links.length > 1) {
                                temp_obj['chongya-' + (i+1)] = {name: '冲呀-'+(i+1)};
                            } else {
                                temp_obj['chongya-' + (i+1)] = {name: '冲呀'};
                            }
                        })
                        if(chongya_links.length) temp_obj['sep5'] = '---------'
                        weibo_links.forEach((l, i)=>{
                            if(weibo_links.length > 1) {
                                temp_obj['weibo-' + (i+1)] = {name: '微博-'+(i+1)};
                            } else {
                                temp_obj['weibo-' + (i+1)] = {name: '微博'};
                            }
                        })
                        if(weibo_links.length) temp_obj['sep6'] = '---------'
                        other_links.forEach((l, i)=>{
                            if(other_links.length > 1) {
                                temp_obj['unknown-' + (i+1)] = {name: '未知网站-'+(i+1)};
                            } else {
                                temp_obj['unknown-' + (i+1)] = {name: '未知网站'};
                            }
                        })
                    } else {
                        var tar_link = Global._convertPathForApp('/article/'+url_title+'/'+chapters[chapter_index].url_name+'/index.html');
                        var temp_obj = {};
                        temp_obj['local'] = {name: '本站章节网页'};
                    }
                    return {
                        callback: function(k, opts) {
                            var curEle = opts.$target;
                            var tar_url = '';
                            var chapter_index = +ele.attr('id').replace('ci-','') - 1;
                            var url_name = chapters[chapter_index].url_name;
                            if(k.includes('yhforum-')) {tar_url = yhonlyf_links[+k.replace('yhforum-','')-1]};
                            if(k.includes('yhmain-')) {tar_url = yhonlym_links[+k.replace('yhmain-','')-1]};
                            if(k.includes('lofter-')) {tar_url = lof_links[+k.replace('lofter-','')-1]};
                            if(k.includes('ao3-')) {tar_url = ao3_links[+k.replace('ao3-','')-1]};
                            if(k.includes('chongya-')) {tar_url = chongya_links[+k.replace('chongya-','')-1]};
                            if(k.includes('weibo-')) {tar_url = weibo_links[+k.replace('weibo-','')-1]};
                            if(k.includes('unknown-')) {tar_url = other_links[+k.replace('unknown-','')-1]};
                            if(k == 'local') {tar_url = Global._convertPathForApp('/article/'+url_title+'/'+url_name+'/index.html');}
                            if(k == 'report') {
                                $("body").append("<a id='report-handler' href='mailto:ilikepotatoes@163.com' style='display: none'><span id='report'></span></a>");
                                $('#report').click();
                                $("#report-handler").remove();
                            }
                            if(tar_url) window.open(tar_url);
                            if(k == 'copy') {
                                $('body').append('<input id="foo" value="'+tar_link+'"></input>')
                                $("body").append('<a id="copy-handler" data-clipboard-target="#foo" style="display: none"><span id="copy"></span></a>');
                                var clipboard = new ClipboardJS('#copy-handler');
                                $('#copy').click();
                                $("#foo").remove();
                                $("#copy-handler").remove();
                                clipboard.destroy();
                            }
                        },
                        items: {
                            "copy": {'name': '复制链接', 'icon': 'fa-copy'},
                            "assign": {
                                "name": "转到...",
                                "icon": "fa-share-square-o",
                                "items": temp_obj
                            },
                            "sep1": "---------",
                            "report": {"name": "求补档/报告失效链接", "icon": "fa-book"}
                        }
                    }
                }
            })
        })
    })
})