$(document).ready(() => {
    var banned_tags_list = Global.getPreference("banned-tags") || [];
    var preferred_reading_website = Global.getPreference("preferred-reading-website") || "lofter";
    var use_mirror_ao3_website = Global.getPreference("use-mirror-website") ? JSON.parse(Global.getPreference("use-mirror-website")) : true;
    var mirror_ao3_link = Global.getPreference("mirror-ao3-link") || "https://1.ao3-cn.top";
    if(banned_tags_list && JSON.stringify(banned_tags_list) != "[]") {
        banned_tags_list.forEach((item)=>{
            $("span.banned-tags-input-area").append('<span class="shown-tag"><i class="fa fa-tag"></i><span>'+item+'</span>');
        })
    }
    $("#preferences-website").find("option[value="+preferred_reading_website+"]").attr("selected","selected");
    $("#preferences-use-ao3-mirror").prop("checked", use_mirror_ao3_website);
    $("#preferences-ao3-link").val(mirror_ao3_link);

    $('#preferences-website').on('change',()=>{
        var target_preferred_reading_website = $("#preferences-website").find("option:selected").val();
        Global.setPreference("preferred-reading-website", target_preferred_reading_website);
    })
    $('.use-mirror-ao3-link input').on('change',()=>{
        var target_use_mirror_ao3_website = $("#preferences-use-ao3-mirror").prop("checked") || false;
        Global.setPreference("use-mirror-website", JSON.stringify(target_use_mirror_ao3_website));
    })
    $('#preferences-ao3-link').on('change',()=>{
        var target_mirror_ao3_link = $("#preferences-ao3-link").val();
        Global.setPreference("mirror-ao3-link", target_mirror_ao3_link);
    })
    $("span.banned-tags-list-btn").click(()=>{
        Global.getTags((tags)=>{
            tags = Global.convertTagStruct(tags);
            var tag_list = Global.getTagsForSelection(['*'], tags, true);
            tag_list.shift(); // 去掉数组开头的*字符
            var temp_str = '';
            var bt = Global.getPreference('banned-tags');
            tag_list.forEach((item)=>{
                var s_a = '', i_a = '';
                if(bt && bt.contains(item)){
                    s_a = ' selected';
                    i_a = '-dot';
                };
                temp_str += '<span class="selectable-tag'+s_a+'"><i class="fa fa'+i_a+'-circle-o"></i><span>'+item+'</span></span>';
            });
            $.confirm({
                title: 'TAG列表',
                content: '<div id="tags-selection">'+temp_str+'</div>',
                boxWidth: "80%",
                useBootstrap: false,
                theme: 'light',
                type: 'blue',
                buttons: {
                    submit: {
                        text: '确认',
                        action: function () {
                            if(Global.__temp_tags) {
                                Global.setPreference('banned-tags', Global.__temp_tags.clearRepetition());
                                $('span.banned-tags-input-area').html('');
                                Global.getPreference('banned-tags').forEach((item)=>{
                                    $('span.banned-tags-input-area').append('<span class="shown-tag"><i class="fa fa-tag"></i><span>'+item+'</span></span>')
                                });
                                Global.__temp_tags = Global.getPreference('banned-tags') || [];
                            }
                        }
                    },
                    cancel: {
                        text: '关闭',
                        action: function () {
                            Global.__temp_tags = Global.getPreference('banned-tags') || [];
                        }
                    }
                },
                onOpen: function(){
                    // 绑定事件
                    Global.__temp_tags = Global.getPreference('banned-tags') || [];
                    this.$content.find("span.selectable-tag").click(function(){
                        var tag = $(this).find('span').text();
                        if(!Global.__temp_tags || JSON.stringify(Global.__temp_tags) == '[]' || !Global.__temp_tags.contains(tag)) {
                            Global.__temp_tags = Global.__temp_tags || [];
                            Global.__temp_tags.push(tag);
                            $(this).addClass('selected');
                            $(this).find('i').removeClass('fa-circle-o');
                            $(this).find('i').addClass('fa-dot-circle-o');
                        } else if(Global.__temp_tags.contains(tag)) {
                            Global.__temp_tags.remove(tag);
                            $(this).removeClass('selected');
                            $(this).find('i').removeClass('fa-dot-circle-o');
                            $(this).find('i').addClass('fa-circle-o');
                        }
                    })
                }
            });
        })
    })
})