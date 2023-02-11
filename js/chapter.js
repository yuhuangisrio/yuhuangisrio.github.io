var RSSD = RSSD || {};
RSSD.txtActs = {};

/** 获取txt文本
 * @param filename 文件名，后缀txt
 * @param src 图片路径。默认为./，即当前目录。
 * @param code 文本编码。默认是utf-8
 */
RSSD.txtActs.getTxt = function(filename, src="./", code='utf-8') {
    let xhr = new XMLHttpRequest();
    xhr.open('GET',src+filename+'.txt', false);
    xhr.overrideMimeType("text/html;charset="+code);
    xhr.send(null);
    // 获取文件信息 (String)
    // console.log(xhr.responseText);
    return xhr.responseText;
};

$(document).ready(()=>{

    var t = $("#txt");   // 包括段落的div元素节点
    var link = window.location.href.replace(window.location.pathname,""); // 主站网址
    var curLocation = window.location.href;   // 当前网址
    var temp_arr = curLocation.split("/");   // 将当前路径以/分割
    var curChapter = temp_arr[temp_arr.length-1].trim().replace(".html",""); // 返回字符串 当前章节html文件的名称 即 url_name
    var encodedName = $.md5(curChapter);
    var curArticle = temp_arr[temp_arr.length-3];   // 返回当前文章名称
    var temp_str = RSSD.txtActs.getTxt(encodedName, "../../../../data/contents/"+curArticle+"/");   // 获取文本 (当前章节html文件的名称.txt)
    var data = Base64.decode(temp_str);

    // 将文本输入div并格式化文本
    var paragraph_list = [];
    paragraph_list = data.split(/[(\r\n)\r\n]+/);
    for(var i = 0; i < paragraph_list.length; i++) {
        if(paragraph_list[i] == ''){
            paragraph_list.remove(paragraph_list[i]);
            i -= 1;
        } else {
            $("#txt").append("<p id=\"p"+i+"\">"+paragraph_list[i]+"</p>");
        }
    };

    // 获取当前文章名与作者
    RSSD.articleData = [];
    $.getJSON("/data/articles.json", function(data){
        data.forEach((item, index)=>{
            if(item.url_title = curArticle) {
                RSSD.articleData[0] = item.title;
                RSSD.articleData[1] = item.author;
            }
        })
    });

    // 获取并使用章节信息数据 (章节名、作者、级别)
    var curArticleRealName, curArticleAuthor, curChapterRealName, curChapterShortName;
    var curLevel;
    $.getJSON("/data/contents/"+curArticle+"/"+"chapters.json", function(data){
        curArticleRealName = RSSD.articleData[0];
        curArticleAuthor = RSSD.articleData[1];
        data.forEach((item, index)=>{
            if(item.url_name == curChapter) {
                curChapterRealName = item.name;
                curChapterShortName = item.short_name;
                curLevel = item.level;
            }
        })
        var title_and_author = "《"+curArticleRealName+"》 by "+curArticleAuthor;
        var web_title = curChapterShortName + " - " + "《" + curArticleRealName + "》";
        $("title").html(web_title);
        $("div.header p.title-and-author").html(title_and_author);
        $("div.header p.chapter").html(curChapterRealName);
        if(curLevel == "18+") $(".mature-warning").show();
        else $(".mature-warning").hide();
    });

    // 从缓存中读取字号
    var data_font_size = +Global.getCookie("chapter-fontsize") || 18;
    var offset = data_font_size - +$("#txt").css("font-size").replace("px","");
    var oriFontSize = +$("#txt").css("font-size").replace("px","");
    var oriMarginBottom = +$("#txt").css("margin-bottom").replace("px","");
    var oriLineHeight = +$("#txt").css("line-height").replace("px","");
    $("#txt").css("font-size", "" + (oriFontSize + offset) + "px");
    $("#txt").css("margin-bottom", "" + (oriMarginBottom + 2*offset) + "px");
    $("#txt").css("line-height", "" + (oriLineHeight + 2*offset) + "px");

    // 从缓存中读取字体
    var data_font_style = Global.getCookie("chapter-fontstyle") || "font-xiawuwenkai";
    data_font_style = data_font_style.contains("font-") ? data_font_style : "\'" + data_font_style + "\'";
    $("body").attr("style","font-family: " + data_font_style + ",'Times New Roman', Times, serif");

    // 从缓存中读取语言
    var data_font_language = Global.getCookie("chapter-language");
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

    // 从本地存储中读取标签
    var temp_bookmark_data = Global.getBookmark(curArticle, curChapter);
    if(temp_bookmark_data > -1) {
        var str = "p#p"+temp_bookmark_data;
        var p_obj = $(str);
        p_obj.prepend("<span id=\"bookmark\"></span>");
        p_obj.append("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>");
    };

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
        var curFontSize = $("#txt").css("font-size").replace("px","");
        var helpText = "请输入正文字号。\n默认为18(像素)。最小值为16(像素)。"
        var targetSize = prompt(helpText, curFontSize);
        if(!targetSize) return;
        if(targetSize < 16) targetSize = 16;
        var offset = +targetSize - +$("#txt").css("font-size").replace("px","");
        var oriFontSize = +$("#txt").css("font-size").replace("px","");
        var oriMarginBottom = +$("#txt").css("margin-bottom").replace("px","");
        var oriLineHeight = +$("#txt").css("line-height").replace("px","");
        $("#txt").css("font-size", "" + (oriFontSize + offset) + "px");
        $("#txt").css("margin-bottom", "" + (oriMarginBottom + 2*offset) + "px");
        $("#txt").css("line-height", "" + (oriLineHeight + 2*offset) + "px");
        Global.setCookie("chapter-fontsize", targetSize);
    });

    // 更换字体
    $("a.font-style").click(()=>{
        // var curStyle = $("#txt").css("font-family").split(",")[0].replace(/\'\"/,"").trim();
        var style = prompt("可选字体：\n霞鹜文楷，霞鹜新晰黑，昭源宋体，极影毁片和圆体。\n注意，手机端不适用。\n对于电脑端，安装过的所有字体都可以使用，如宋体(默认)，黑体，楷体，微软雅黑等。如果不知道自己电脑上安装了什么字体，可以打开Word查看。");
        if(!style) return;
        style = Global.fonts[style] || style;
        style = style.contains("font-") ? style : "\'" + style + "\'";
        var targetStyle = style + ",'Times New Roman', Times, serif";
        $("body").attr("style", "font-family:" + targetStyle + ";");
        Global.setCookie("chapter-fontstyle", style.replace(/\'/gi,""));
    });

    // 简繁互换
    $("a.simplified-and-traditional").click(()=>{
        var bookmark_p_id = Global.getBookmark(curArticle, curChapter);
        var lang = prompt("请输入目的语言。可选值：\n初始化，简体(簡體)，繁體(繁体)，台灣繁體(台湾繁体)\n(台湾繁体和繁体的区别：台湾繁体会将一些用语本地化，而繁体只是直接将简体转换成繁体字。)");
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
            Global.deleteCookie("chapter-language");
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
        Global.setCookie("chapter-language", lang);
    });

    // 返回至文章主页
    $("a.return-mainpage").click(()=>{
        window.location.href = curLocation.split("&/")[0].trim()+"mainpage.html";
    });

    // 双击段落，实现标签功能。再次双击注册有标签的段落时，标签会取消。
    // 焯，这里不能用ES6语法(箭头函数)，否则会报错(花了6个小时才找出来的坑)，否则$(this)会报错，而且必须老老实实用$(this)
    $("#txt").on("dblclick","p",function(){
        var id = $(this).attr("id").replace("p","");
        if($("p#p"+id).html().contains("<span id=\"bookmark\"></span>")) {
            $("p#p"+id).html($("p#p"+id).html().replace("<span id=\"bookmark\"></span>","").replace("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>",""));
            Global.setBookmark(curArticle, curChapter, -1);
            return;
        };
        t.html(t.html().replace("<span id=\"bookmark\"></span>","").replace("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>",""));
        $("p#p"+id).prepend("<span id=\"bookmark\"></span>");
        $("p#p"+id).append("<i class=\"fa fa-bookmark\" style=\"transform:translateX(-32px);\"></i>");
        Global.setBookmark(curArticle, curChapter, id);
    });

    // 跳转至标签
    $("a.jump-to-bookmark").click(()=>{
        if(Global.getBookmark(curArticle, curChapter) > -1) {
            document.querySelector("#bookmark").scrollIntoView({behavior:"smooth"});
        } else {
            var theme = Global.getCookie("theme");
            if(theme && theme == 'night') {
                $.dialog({
                    icon: "fa fa-info-circle",
                    title: "提示",
                    theme: "dark",
                    type: "orange",
                    boxWidth: "80%",
                    useBootstrap: false,
                    content: "您还未设置标签。"+"<br>"+"若想设置标签，可<strong>双击</strong>想要定位的段落，当段落的末尾出现一个<strong>标签标记</strong><i class=\"fa fa-bookmark\"></i>时，标签即设置成功。"+"<br>"+"注意，每一章只能设置一个标签。当再次双击已添加标签的段落时，标签将被撤销。"
                });
            } else {
                $.dialog({
                    icon: "fa fa-info-circle",
                    title: "提示",
                    theme: "light",
                    type: "blue",
                    boxWidth: "80%",
                    useBootstrap: false,
                    content: "您还未设置标签。"+"<br>"+"若想设置标签，可<strong>双击</strong>想要定位的段落，当段落的末尾出现一个<strong>标签标记</strong><i class=\"fa fa-bookmark\"></i>时，标签即设置成功。"+"<br>"+"注意，每一章只能设置一个标签。当再次双击已添加标签的段落时，标签将被撤销。"
                });
            }
        }
    });

    // 成人内容检查
    $(".accessible").click(function(){
        $(".mature-warning").hide();
    });

    $(".unaccessible").click(function(){
        var next_chapter_url_name;
        $.getJSON("/data/contents/"+curArticle+"/chapters.json", function(data){
            data.forEach((item, index)=>{
                if(item.url_name == curChapter) {
                    next_chapter_url_name = data[index+1].url_name || "";
                }
                if(next_chapter_url_name) window.location.href = curLocation.replace(curChapter+".html","")+next_chapter_url_name+".html";
                else window.location.href = curLocation.replace(curChapter+".html","")+"mainpage.html";
            })
        })
    })
});
