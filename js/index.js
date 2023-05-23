$(document).ready(()=> {
    $("div.advanced-settings div.row").click(function() {
        $("ul.settings-columns").slideToggle();
        $("div.advanced-settings div.row i.arrow-down").toggleClass("fa-caret-down");
        $("div.advanced-settings div.row i.arrow-down").toggleClass("fa-caret-up");
    });
    $("span.clear-text").click(()=>{
        $("div.search-input input.search-area").val("");
        $("span.clear-text").css("visibility",'hidden');
    });
    $("div.search-input input.search-area").on('input',function(){
        var value = $("div.search-input input.search-area").val();
        if(value) {
            $("span.clear-text").css("visibility",'visible');
        } else {
            $("span.clear-text").css("visibility",'hidden');
        }
    });
    $('span.tags-list-btn').click(()=>{
        Global.getTags((tags)=>{
            tags = Global.convertTagStruct(tags);
            var tag_list = Global.getTagsForSelection(['*'], tags);
            tag_list.shift(); // 去掉数组开头的*字符
            var temp_str = '';
            tag_list.forEach((item)=>{
                var s_a = '', i_a = '';
                if(Global._search_tags && JSON.stringify(Global._search_tags) != '[]' && Global._search_tags.contains(item)){
                    s_a = ' selected';
                    i_a = '-dot';
                }
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
                            if(Global.__temp_tags && JSON.stringify(Global.__temp_tags) != '[]') {
                                Global._search_tags = Global._search_tags || [];
                                Global._search_tags = Global._search_tags.concat(Global.__temp_tags).clearRepetition();
                                $('span.tags-input-area').html('');
                                Global._search_tags.forEach((item)=>{
                                    $('span.tags-input-area').append('<span class="shown-tag"><i class="fa fa-tag"></i><span>'+item+'</span></span>')
                                });
                                Global.__temp_tags = [];
                            }
                        }
                    },
                    cancel: {
                        text: '关闭',
                        action: function () {
                            Global.__temp_tags = [];
                        }
                    }
                },
                onOpen: function(){
                    // 绑定事件
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
    });
})
