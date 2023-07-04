var RSSD = RSSD || {};
$(document).ready(()=>{

    var t = $("#txt");   // 包括段落的div元素节点
    var link = window.location.href.replace(window.location.pathname,""); // 主站网址 - Web
    var home_link = Global._convertPathForApp('/');   // 主站路径 - APP & Web
    var curLocation = window.location.href;   // 当前网址
    var temp_arr = curLocation.split("/");   // 将当前路径以/分割
    var curChapter = temp_arr[temp_arr.length-2].trim(); // 返回字符串 当前章节html文件的名称 即 url_name
    var encodedName = $.md5(curChapter);
    var curArticle = temp_arr[temp_arr.length-3];   // 返回当前文章名称

    Global.getArticles((articles)=>{
        Global.getChapters(curArticle, (chapters)=>{
            var a = {};
            articles.forEach((item)=>{
                if(item.url_title == curArticle) a = item;
            })
            var temp_str = '';
            var data = '';
            if(curChapter != 'whole') {
                temp_str = Global.getTxt(encodedName, "/data/contents/"+curArticle+"/");
                data = Base64.decode(temp_str);
            } else {
                if(chapters.length > 0) {
                    var contents = '';
                    chapters.forEach((c, i)=>{
                        contents += '<div class="subtitle">'+c.name+'</div>\r\n' + Base64.decode(Global.getTxt($.md5(c.url_name), '/data/contents/'+curArticle+'/'));
                    })
                    temp_str = contents;
                    data = temp_str;
                } else {
                    temp_str = Global.getTxt($.md5('whole'), "/data/contents/"+curArticle+"/");
                    data = Base64.decode(temp_str);
                }
            }
            var c = {};
            chapters.forEach((item)=>{
                if(item.url_name == curChapter) c = item;
            })
            if(((JSON.stringify(c) != '{}' && c.links) || a.accessable_links) && !Global.is_app) {
                data = '检测到本章节暂时无需补档，您可以返回主页，右键或长按章节块弹出上下文菜单，选择“转到...”选项继续阅读。\n如果所有可达链接全部失效，请向站长 <a href="mailto:ilikepotatoes@163.com">ilikepotatoes@163.com</a> 报告。'
            }
            data = data.replace(/\n\n/g,'\n<br>\n').replace(/\n\s\n/g,'\n<br>\n')
            // 将文本输入div并格式化文本
            var paragraph_list = [];
            paragraph_list = data.split(/[(\r\n)\r\n]+/);
            for(var i = 0; i < paragraph_list.length; i++) {
                if(paragraph_list[i] == ''){
                    paragraph_list.remove(paragraph_list[i]);
                    i -= 1;
                } else {
                    $("#txt").append("<p id=\"p"+i+"\">"+paragraph_list[i].trim()+"</p>");
                }
            };

            // 获取当前文章名与作者
            RSSD.articleData = [];
            articles.forEach((item, index)=>{
                if(item.url_title == curArticle) {
                    RSSD.articleData[0] = item.title;
                    RSSD.articleData[1] = item.author;
                }
            })

            // 获取并使用章节信息数据 (章节名、作者、级别)
            var curArticleRealName, curArticleAuthor, curChapterRealName, curChapterShortName;
            var curLevel;
            curArticleRealName = RSSD.articleData[0];
            curArticleAuthor = RSSD.articleData[1];
            chapters.forEach((item, index)=>{
                if(item.url_name == curChapter) {
                    curChapterRealName = item.name;
                    curChapterShortName = item.short_name;
                    curLevel = item.level;
                }
            })
            var title_and_author = "《"+curArticleRealName+"》 by "+curArticleAuthor;
            var web_title = curChapter != 'whole' ? curChapterShortName + " - " + "《" + curArticleRealName + "》" : '全文' + " - " + "《" + curArticleRealName + "》";
            $("title").html(web_title);
            $("div.header-title p.title-and-author").html(title_and_author);
            $("div.header-title p.chapter").html(curChapter != 'whole' ? curChapterRealName : '全文');
            if(curLevel == "18+") $(".mature-warning").show();
            else $(".mature-warning").hide();
            
            // 检测主题
            var theme = Global.getPreference("theme");
            if(theme && theme == 'night') {
                $("body").attr("class","night");
                $("a.switch-theme i").attr("class", "fa fa-moon-o fw");
            }
            $("a.switch-theme").click(switchTheme);

            function switchTheme() {
                $("body").toggleClass("day");
                $("body").toggleClass("night");
                var curTheme = $("body").attr("class");
                Global.setPreference('theme',curTheme);
                if(curTheme == 'day') $("a.switch-theme i").attr("class", "fa fa-sun-o fw");
                if(curTheme == 'night') $("a.switch-theme i").attr("class", "fa fa-moon-o fw");
                window.history.go(0);
            };

            // 从缓存中读取字号
            var data_font_size = +Global.getPreference("chapter-fontsize") || 18;
            var offset = data_font_size - +$("#txt").css("font-size").replace("px","");
            var oriFontSize = +$("#txt").css("font-size").replace("px","");
            var oriMarginBottom = +$("#txt").css("margin-bottom").replace("px","");
            var oriLineHeight = +$("#txt").css("line-height").replace("px","");
            $("#txt").css("font-size", "" + (oriFontSize + offset) + "px");
            $("#txt").css("margin-bottom", "" + (oriMarginBottom + 2*offset) + "px");
            $("#txt").css("line-height", "" + (oriLineHeight + 2*offset) + "px");

            // 从缓存中读取字体
            var data_font_style = Global.getPreference("chapter-fontstyle") || "宋体";
            data_font_style = "\'" + data_font_style + "\'";
            $("body").attr("style","font-family: " + data_font_style + ",'Times New Roman', Times, serif");

            // 从缓存中读取语言
            var data_font_language = Global.getPreference("chapter-language");
            if(data_font_language) {
                var type = "", locale = "";
                if(data_font_language == '简体' || data_font_language == '簡體') {type = 'simplified';}
                else if (data_font_language == '繁体' || data_font_language == '繁體') {type = 'traditional';}
                else if (data_font_language == '台灣繁體' || data_font_language == '台湾繁体') {type = "traditional"; locale = "zh_TW";}
                var temp_paragraph_list = [], transtr = '';
                paragraph_list.forEach((item, index)=>{
                    transtr = transverter({
                        type:type,
                        str:item,
                        language:locale
                    });
                    temp_paragraph_list.push(transtr);
                });
                temp_paragraph_list.forEach((item, index)=>{
                    $("p#p"+index).html(item);
                });
            };

            // (已弃用)从本地存储中读取标签
            // var temp_bookmark_data = Global.getBookmark(curArticle, curChapter);
            // if(temp_bookmark_data > -1) {
            //     var str = "p#p"+temp_bookmark_data;
            //     var p_obj = $(str);
            //     p_obj.prepend("<span id=\"bookmark\"></span>");
            //     p_obj.append("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>");
            // };

            // 禁止右键菜单
            $(window).on("contextmenu",(e)=>{
                e.preventDefault();
            });

            // 工具箱功能
            // 白
            Global.isToolcaseListVisible = false;
            $("body.day a.toolcase").click(()=>{
                var isToolcaseListVisible = Global.isToolcaseListVisible;
                if(!isToolcaseListVisible) $("ul.toolcase-list").slideDown();
                if(isToolcaseListVisible) $("ul.toolcase-list").slideUp();
                if(!isToolcaseListVisible) Global.isToolcaseListVisible = true;
                else Global.isToolcaseListVisible = false;
                isToolcaseListVisible = Global.isToolcaseListVisible;
                if(isToolcaseListVisible) {
                    $("body.day a.toolcase").css({
                        "opacity":"1",
                        "background-color":"white",
                        "color":"#686868"
                    });
                } else {
                    $("body.day a.toolcase").css({
                        "opacity":"0.4",
                        "background-color":"white",
                        "color":"rgb(90, 90, 90)"
                    });
                }
            });
            // 黑
            $("body.night a.toolcase").click(()=>{
                var isToolcaseListVisible = Global.isToolcaseListVisible;
                if(!isToolcaseListVisible) $("body.night ul.toolcase-list").slideDown();
                if(isToolcaseListVisible) $("body.night ul.toolcase-list").slideUp();
                if(!isToolcaseListVisible) Global.isToolcaseListVisible = true;
                else Global.isToolcaseListVisible = false;
                isToolcaseListVisible = Global.isToolcaseListVisible;
                if(isToolcaseListVisible) {
                    $("body.night a.toolcase").css({
                        "opacity":"1",
                        "background-color":"rgba(41, 41, 56, 0.5)",
                        "color":"rgb(165, 165, 165)"
                    });
                } else {
                    $("body.night a.toolcase").css({
                        "opacity":"0.4",
                        "background-color":"rgba(170, 170, 170, 0.2)",
                        "color":"rgb(165, 165, 165)"
                    });
                }
            });

            // 滚动至顶部
            $("a.to-top").click(()=>{
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            });

            // 字号调整
            $("a.font-resizer").click(()=>{
                var theme = Global.getPreference("theme");
                var confirmTheme, confirmType;
                if(theme && theme == 'night') {
                    confirmTheme = "dark";
                    confirmType = 'orange';
                } else {
                    confirmTheme = "light";
                    confirmType = 'blue';
                }
                $.confirm({
                    title: '字号调整',
                    content: '' +
                    '<form action="" class="formName">' +
                    '<div class="form-group">' +
                    '<input type="text" placeholder="请输入正文字号... 默认：18 (px)，最小为 16 (px)" class="confirm-box confirm-fontSize form-control" required />' +
                    '</div>' +
                    '</form>' + 
                    '<div>当前字号：' + /*当前字号*/$("#txt").css("font-size").replace("px","") + ' px</div>',
                    boxWidth: "80%",
                    useBootstrap: false,
                    theme: confirmTheme,
                    type: confirmType,
                    buttons: {
                        formSubmit: {
                            text: '确认',
                            action: function () {
                                var curFontSize = $("#txt").css("font-size").replace("px","");
                                var helpText = "请输入正文字号。\n默认为18(像素)。最小值为16(像素)。"
                                var targetSize = this.$content.find('.confirm-fontSize').val();
                                if(!targetSize) return;
                                targetSize = Math.max(16, targetSize);
                                var offset = +targetSize - (+$("#txt").css("font-size").replace("px",""));
                                var oriFontSize = +$("#txt").css("font-size").replace("px","");
                                var oriMarginBottom = +$("#txt").css("margin-bottom").replace("px","");
                                var oriLineHeight = +$("#txt").css("line-height").replace("px","");
                                $("#txt").css("font-size", "" + (oriFontSize + offset) + "px");
                                $("#txt").css("margin-bottom", "" + (oriMarginBottom + 2*offset) + "px");
                                $("#txt").css("line-height", "" + (oriLineHeight + 2*offset) + "px");
                                Global.setPreference("chapter-fontsize", targetSize);
                            }
                        },
                        formCancel: {
                            text: '取消'
                        }
                    },
                    onContentReady: function () {
                        // bind to events
                        var jc = this;
                        this.$content.find('form').on('submit', function (e) {
                            // if the user submits the form by pressing enter in the field.
                            e.preventDefault();
                            jc.$$formSubmit.trigger('click'); // reference the button and click it
                        });
                    }
                });
            });

            // 更换字体
            $("a.font-style").click(()=>{
                var theme = Global.getPreference("theme");
                var confirmTheme, confirmType;
                if(theme && theme == 'night') {
                    confirmTheme = "dark";
                    confirmType = 'orange';
                } else {
                    confirmTheme = "light";
                    confirmType = 'blue';
                }
                $.confirm({
                    title: '更换字体',
                    content: '' +
                    '<form action="" class="formName">' +
                    '<div class="form-group">' +
                    '<input type="text" placeholder="请输入字体名称..." class="confirm-box confirm-fontFamily form-control" required />' +
                    '</div>' +
                    '</form>' + 
                    '<div>仅适用于电脑端。电脑端安装过的所有字体都可以使用，如宋体(默认)，黑体，楷体，微软雅黑等。如果不知道自己电脑上安装了什么字体，可以打开Word查看。</div>',
                    boxWidth: "80%",
                    useBootstrap: false,
                    theme: confirmTheme,
                    type: confirmType,
                    buttons: {
                        formSubmit: {
                            text: '确认',
                            action: function () {
                                var style = this.$content.find('.confirm-fontFamily').val();
                                if(!style) return;
                                style = "\'" + style + "\'";
                                var targetStyle = style + ",'Times New Roman', Times, serif";
                                $("body").attr("style", "font-family:" + targetStyle + ";");
                                Global.setPreference("chapter-fontstyle", style.replace(/\'/gi,""));
                            }
                        },
                        formCancel: {
                            text: '取消'
                        }
                    },
                    onContentReady: function () {
                        // bind to events
                        var jc = this;
                        this.$content.find('form').on('submit', function (e) {
                            // if the user submits the form by pressing enter in the field.
                            e.preventDefault();
                            jc.$$formSubmit.trigger('click'); // reference the button and click it
                        });
                    }
                });
            });

            // 简繁互换
            $("a.simplified-and-traditional").click(()=>{
                var theme = Global.getPreference("theme");
                var confirmTheme, confirmType;
                if(theme && theme == 'night') {
                    confirmTheme = "dark";
                    confirmType = 'orange';
                } else {
                    confirmTheme = "light";
                    confirmType = 'blue';
                }
                $.confirm({
                    title: '简繁互换',
                    content: '' +
                    '<form action="" class="formName">' +
                    '<div class="form-group">' +
                    '<input type="text" placeholder="请输入目的语..." class="confirm-box confirm-language form-control" required />' +
                    '</div>' +
                    '</form>' + 
                    '<div>可选值：\n初始化，简体(簡體)，繁體(繁体)，台灣繁體(台湾繁体)\n(台湾繁体和繁体的区别：台湾繁体会将一些用语本地化，而繁体只是直接将简体转换成繁体字。)</div>',
                    boxWidth: "80%",
                    useBootstrap: false,
                    theme: confirmTheme,
                    type: confirmType,
                    buttons: {
                        formSubmit: {
                            text: '确认',
                            action: function () {
                                var bookmark_p_id = Global.getBookmark(curArticle, curChapter);
                                var lang = this.$content.find('.confirm-language').val();
                                var type = "", locale = "";
                                if(!lang) return;
                                if(lang == '简体' || lang == '簡體') {type = 'simplified';}
                                else if (lang == '繁体' || lang == '繁體') {type = 'traditional';}
                                else if (lang == '台灣繁體' || lang == '台湾繁体') {type = "traditional"; locale = "zh_TW";}
                                else if (lang == '初始化') {
                                    for(var i = 0; i < paragraph_list.length; i++) {
                                        $("p#p"+i).html(paragraph_list[i]);
                                    };
                                    if(bookmark_p_id > -1) {
                                        var str = "p#p"+bookmark_p_id;
                                        var p_obj = $(str);
                                        p_obj.prepend("<span id=\"bookmark\"></span>");
                                        p_obj.append("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>");
                                    };
                                    Global.setPreference("chapter-language", "");
                                    return;
                                }
                                else {return;}
                                var temp_paragraph_list = [], transtr = '';
                                paragraph_list.forEach((item, index)=>{
                                    transtr = transverter({
                                        type:type,
                                        str:item,
                                        language:locale
                                    });
                                    temp_paragraph_list.push(transtr);
                                });
                                temp_paragraph_list.forEach((item, index)=>{
                                    $("p#p"+index).html(item);
                                });
                                if(bookmark_p_id > -1) {
                                    var str = "p#p"+bookmark_p_id;
                                    var p_obj = $(str);
                                    p_obj.prepend("<span id=\"bookmark\"></span>");
                                    p_obj.append("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>");
                                };
                                Global.setPreference("chapter-language", lang);
                            }
                        },
                        formCancel: {
                            text: '取消'
                        }
                    },
                    onContentReady: function () {
                        // bind to events
                        var jc = this;
                        this.$content.find('form').on('submit', function (e) {
                            // if the user submits the form by pressing enter in the field.
                            e.preventDefault();
                            jc.$$formSubmit.trigger('click'); // reference the button and click it
                        });
                    }
                });
            });

            // 不分章节（只有一章）时隐藏章节选择
            var number_of_chapters = chapters.length;
            if(!number_of_chapters) {
                $('.jump-to-chapter').css('display','none');
            }

            //章节选择
            $("a.jump-to-chapter").click(()=>{
                if($('div.chapter-list').css('width') == '0px') {
                    $("div.chapter-list-area").css("display",'block');
                    $('div.chapter-list').animate({
                        'width': '50%'
                        });
                    $('div.dark-back').animate({
                        'opacity':'0.15'
                    })
                } else {
                    $('div.chapter-list').css({
                        'width':'0px'
                    })
                    $('div.dark-back').css({
                        'opacity':'0'
                    })
                    $("div.chapter-list-area").css("display",'none');
                }
            });

            $('div.dark-back').click(()=>{
                $('div.chapter-list').css({
                    'width':'0px'
                })
                $('div.dark-back').css({
                    'opacity':'0'
                })
                $("div.chapter-list-area").css("display",'none');
            })
            chapters.forEach((chapter, index)=>{
                var url = chapter.url_name;
                var name = chapter.name;
                var converted_url_prefix = Global._convertPathForApp('/article/')
                $("div.chapter-list ul.list").append('<li><a href="'+converted_url_prefix+curArticle+'/'+url+'/index.html">'+name+'</a></li>');
                if(url == curChapter) $("div.chapter-list ul.list li").eq(-1).addClass('current-chapter');
            })

            // 返回至文章主页
            $("a.return-mainpage").click(()=>{
                Global.goToArticle(curArticle);
            });

            // (已弃用)双击段落，实现标签功能。再次双击注册有标签的段落时，标签会取消。
            // 焯，这里不能用ES6语法(箭头函数)，否则会报错(花了6个小时才找出来的坑)，否则$(this)会报错，而且必须老老实实用$(this)
            // $("#txt").on("dblclick","p",function(){
            //     var id = $(this).attr("id").replace("p","");
            //     if($("p#p"+id).html().contains("<span id=\"bookmark\"></span>")) {
            //         $("p#p"+id).html($("p#p"+id).html().replace("<span id=\"bookmark\"></span>","").replace("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>",""));
            //         Global.setBookmark(curArticle, curChapter, -1);
            //         return;
            //     };
            //     t.html(t.html().replace("<span id=\"bookmark\"></span>","").replace("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>",""));
            //     $("p#p"+id).prepend("<span id=\"bookmark\"></span>");
            //     $("p#p"+id).append("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>");
            //     Global.setBookmark(curArticle, curChapter, id);
            // });

            // (已弃用)跳转至标签
            // $("a.jump-to-bookmark").click(()=>{
            //     if(Global.getBookmark(curArticle, curChapter) > -1) {
            //         document.querySelector("#bookmark").scrollIntoView({behavior:"smooth"});
            //     } else {
            //         var theme = Global.getPreference("theme");
            //         if(theme && theme == 'night') {
            //             $.dialog({
            //                 icon: "fa fa-info-circle",
            //                 title: "提示",
            //                 theme: "dark",
            //                 type: "orange",
            //                 boxWidth: "80%",
            //                 useBootstrap: false,
            //                 content: "您还未设置标签。"+"<br>"+"若想设置标签，可<strong>双击</strong>想要定位的段落，当段落的末尾出现一个<strong>标签标记</strong><i class=\"fa fa-bookmark\"></i>时，标签即设置成功。"+"<br>"+"注意，每一章只能设置一个标签。当再次双击已添加标签的段落时，标签将被撤销。"
            //             });
            //         } else {
            //             $.dialog({
            //                 icon: "fa fa-info-circle",
            //                 title: "提示",
            //                 theme: "light",
            //                 type: "blue",
            //                 boxWidth: "80%",
            //                 useBootstrap: false,
            //                 content: "您还未设置标签。"+"<br>"+"若想设置标签，可<strong>双击</strong>想要定位的段落，当段落的末尾出现一个<strong>标签标记</strong><i class=\"fa fa-bookmark\"></i>时，标签即设置成功。"+"<br>"+"注意，每一章只能设置一个标签。当再次双击已添加标签的段落时，标签将被撤销。"
            //             });
            //         }
            //     }
            // });

            // 成人内容检查
            $(".accessible").click(function(){
                $(".mature-warning").hide();
            });

            $(".unaccessible").click(function(){
                var next_chapter_url_name;
                chapters.forEach((item, index)=>{
                    if(item.url_name == curChapter) {
                        next_chapter_url_name = data[index+1].url_name || "";
                    }
                    if(next_chapter_url_name) Global.goToChapter(curArticle, next_chapter_url_name);
                    else Global.goToArticle(curChapter);
                })
            });
    
            // 上下章
            var index = 0;
            chapters.forEach((item, i)=>{
                if(item.url_name == curChapter) index = i;
            })
            if(index == 0) {
                $('div.prev-chapter span').html('返回主页');
                $('div.prev-chapter').click(()=>{
                    Global.goToArticle(curArticle);
                });
            } else {
                $('div.prev-chapter').click(()=>{
                    Global.goToChapter(curArticle, chapters[index-1].url_name);
                });
            }
            if(index == chapters.length - 1) {
                $('div.next-chapter span').html('返回主页');
                $('div.next-chapter').click(()=>{
                    Global.goToArticle(curArticle);
                });
            } else {
                $('div.next-chapter').click(()=>{
                    Global.goToChapter(curArticle, chapters[index+1].url_name);
                });
            }

            // 注入索引目录
            var a_title = '';
            articles.forEach((a)=>{
                if(a.url_title == curArticle) a_title = a.title;
            })
            var c_name = '';
            if(curChapter != 'whole') {
                chapters.forEach((c)=>{
                    if(c.url_name == curChapter) c_name = c.name;
                })
                $("div.index-struct").html('<a href="'+home_link+'"><i class="fa fa-home"></i> 首页</a> &raquo; <a href="javascript:;" onclick="'+'Global.goToArticle(\''+curArticle+'\')'+'"><i class="fa fa-book"></i> '+a_title+'</a> &raquo; '+c_name)
            } else {
                $("div.index-struct").html('<a href="'+home_link+'"><i class="fa fa-home"></i> 首页</a> &raquo; <a href="javascript:;" onclick="'+'Global.goToArticle(\''+curArticle+'\')'+'"><i class="fa fa-book"></i> '+a_title+'</a> &raquo; '+'全文')
            }
        })
}   )
});
