$(document).ready(() => {
    var banned_tags_list = Global.getPreference("banned-tags") ? JSON.parse(Global.getPreference("banned-tags")) : [];
    var preferred_reading_website = Global.getPreference("preferred-reading-website") || "lofter";
    var use_mirror_ao3_website = Global.getPreference("use-mirror-website") ? !!Global.getPreference("use-mirror-website") : true;
    var mirror_ao3_link = Global.getPreference("mirror-ao3-link") || "https://1.ao3-cn.top";
    if(banned_tags_list && JSON.stringify(banned_tags_list) != "[]") {
        // 将数组注入 span.banned-tags-input-area
    }
    $("#preferences-website").find("option[value="+preferred_reading_website+"]").attr("selected","selected");
    $("#preferences-use-ao3-mirror").attr("checked", use_mirror_ao3_website);
    $("#preferences-ao3-link").val(mirror_ao3_link);
    $("div.submit").click(function(){
        // var target_banned_tags_list = []; //待注入
        var target_preferred_reading_website = $("#preferences-website").find("option:selected").val();
        var target_use_mirror_ao3_website = $("#preferences-use-ao3-mirror").attr("checked");
        var target_mirror_ao3_link = $("#preferences-ao3-link").val();
        Global.setPreference("preferred-reading-website", target_preferred_reading_website);
        Global.setPreference("use-mirror-website", target_use_mirror_ao3_website);
        Global.setPreference("mirror-ao3-link", target_mirror_ao3_link);
        $.toast({
            text: '偏好设置已保存。',
            loader: false,        // Change it to false to disable loader
            showHideTransition: 'slide',
            stack: false
        })
    })
})