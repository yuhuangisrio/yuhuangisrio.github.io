var Global = Global || {};
/**
 * 解析TAG的JSON结构
 * @param {object} obj TAG原始对象 (JSON数据文件中的对象)
 * @returns 解析好的一个对象。
 */
Global.convertTagStruct = function(obj) {
    var temp_obj = {};
    var keys1 = Object.keys(obj);
    temp_obj['*'] = keys1;
    for(var i = 0; i < keys1.length; i++){
        var k1 = keys1[i];
        var item1 = obj[k1];
        if(typeof item1 == 'object') {
            var keys2 = Object.keys(item1);
            temp_obj[k1] = keys2;
            for(var j = 0; j < keys2.length; j++) {
                var k2 = keys2[j];
                var item2 = item1[k2];
                if(typeof item2 == 'object') {
                    var keys3 = Object.keys(item2);
                    temp_obj[k2] = keys3;
                }
            }
        }
    };
    /*
        example:
        obj = {
            "modern":{
                "school/collage":"",
                "business":{
                    "it":"",
                    "finance":""
                },
                "killer":""
            },
            "original":""
        }
        returns:
        temp_obj = {
            '*':['modern','original'],
            'modern':['scholl/collage','business','killer'],
            'business':['it','finance']
        }
        Note that the max depth of each branch is 3.
    */
    return temp_obj;
}

/**
 * 获取用于搜索的TAG数组。
 * @param {array} s 用户端输入的TAG数组
 * @param {object} obj 用 convertTagStruct 方法转换过的对象
 * @returns 按照树状结构生成的用于搜索文章的TAG数组。
 */
Global.getTagsForSearch = function(s, obj) {
    var temp_arr = s || [];
    var temp_arr2 = [];
    var t_tags = temp_arr;
    var keys = Object.keys(obj);
    while(temp_arr && JSON.stringify(temp_arr) != '[]') {
        temp_arr2 = [];
        for(var i = 0; i < temp_arr.length; i++) {
            keys.forEach((item)=>{
                if(item == temp_arr[i]) {
                    temp_arr2 = temp_arr2.concat(obj[item]);
                    t_tags = t_tags.concat(obj[item]);
                }
            });
        }
        if(JSON.stringify(temp_arr2) != '[]'){
            temp_arr = temp_arr2;
        } else {
            temp_arr = [];
        }
    };
    var target_tags = t_tags.clearRepetition();
    target_tags = this._seperateMultiNamedTags(target_tags);
    target_tags = this._removeBannedTags(target_tags);
    var parent_tags = this._getAllParentsOfTag(target_tags, obj, true);
    var dup_tags = target_tags.concat(parent_tags).getDuplication();
    // 若数组不为空，则说明用户的搜索TAG中有TAG存在父TAG和子TAG的关系，此时必须去除父TAG以达到精准搜索的目的
    if(dup_tags.length > 0) {
        dup_tags.forEach((tag)=>{
            target_tags.remove(tag);
        })
    };
    return target_tags;
}

/**
 * 获取用于用户端选择的TAG数组。
 * @param {array} s 用户端输入的TAG数组
 * @param {object} obj 用 convertTagStruct 方法转换过的对象
 * @param {boolean} is_banned_tags_selection 是否用于选择屏蔽TAG
 * @returns 列在TAG数据文件中用于用户端选择的所有TAG的数组
 */
Global.getTagsForSelection = function(s, obj, is_banned_tags_selection) {
    var temp_arr = s || null;
    var temp_arr2 = [];
    var t_tags = temp_arr;
    var keys = Object.keys(obj);
    while(temp_arr && JSON.stringify(temp_arr) != '[]') {
        temp_arr2 = [];
        for(var i = 0; i < temp_arr.length; i++) {
            keys.forEach((item)=>{
                if(item == temp_arr[i]) {
                    temp_arr2 = temp_arr2.concat(obj[item]);
                    t_tags = t_tags.concat(obj[item]);
                }
            });
        }
        if(JSON.stringify(temp_arr2) != '[]'){
            temp_arr = temp_arr2;
        } else {
            temp_arr = [];
        }
    };
    var target_tags = t_tags.clearRepetition();
    target_tags = this._convertMultiNamedTagsToSingle(target_tags);
    if(!is_banned_tags_selection) target_tags = this._removeBannedTags(target_tags);
    target_tags = target_tags.clearRepetition();
    return target_tags;
}

Global._removeBannedTags = function(dirt_list){
    var banned_tags = Global.getPreference('banned-tags') || [];
    var clean_list = [];
    for(var i = 0; i < dirt_list.length; i++){
        var tag = dirt_list[i];
        if(!banned_tags.contains(tag)) {
            clean_list.push(tag);
        }
    };
    return clean_list;
}

Global._seperateMultiNamedTags = function(arr) {
    for(var i = 0; i < arr.length; i++){
        var e = arr[i];
        if(e.indexOf('/') != -1) {
            var temp_arr = e.split('/');
            temp_arr.forEach((item,index)=>{
                arr.splice(i+index,0,item);
            });
            arr.splice(i+temp_arr.length,1);
            i += temp_arr.length - 1;
        }
    }
    return arr;
};

/**
 * 将TAG数组中所有拥有别名的TAG转换为单个TAG名 (第一个TAG名)。主要用于用户端TAG选择功能。
 * @param {array} arr 用 getTagsForSelection 获取到的TAG数组
 * @returns 
 */
Global._convertMultiNamedTagsToSingle = function(arr) {
    var temp_arr = [];
    arr.forEach((item)=>{
        temp_arr.push(item.includes('/') ? item.split('/')[0] : item);
    });
    return temp_arr;
}

/**
 * 将所有为别名的TAG转换成正名 (包含 _convertMultiNamedTagsToSingle 的功能)
 * @param {array} arr 待转换的TAG数组
 * @param {object} obj TAG原始对象 (JSON数据文件中的对象)
 * @returns 将所有别名转换为正名的TAG数组
 */
Global._convertAllAliasesToMain = function(arr, obj) {
    var mn_tags = this.getMultiNamedTags(obj);
    var temp_arr = [];
    arr.forEach((item)=>{
        var parent_key = this._getKeyOfAlias(item);
        if(item.includes('/')) {
            temp_arr.push(item.split('/')[0]);
        } else if(parent_key) {
            temp_arr.push(mn_tags[parent_key][0]);
        } else {
            temp_arr.push(item);
        }
    });
    return temp_arr;
}

Global._getKeyOfAlias = function(alias, obj) {
    var mn_tags = this.getMultiNamedTags(obj);
    var keys = Object.keys(mn_tags);
    var target_key = '';
    keys.forEach((item)=>{
        var key = item;
        var temp_arr = mn_tags[key];
        if(temp_arr.contains(alias)) target_key = key;
    });
    return target_key;
}

/**
 * 获取TAG或TAG数组中所有TAG的全部父TAG
 * @param {string|array} tags 一个TAG字符串或TAG数组
 * @param {object} obj 用 convertTagStruct 方法转换过的TAG对象
 * @param {boolean} is_to_single 是否将所有有别名的TAG转换为单个TAG (首个TAG)
 * @returns {array} TAG的所有父TAG数组
 */
Global._getAllParentsOfTag = function(tags, obj, is_to_single){
    var arr = typeof tags == 'array' ? tags : [tags];
    var temp_arr = [];
    var parents = [];
    var keys = Object.keys(obj);
    while(arr && arr.length > 0) {
        temp_arr = [];
        for(var i = 0; i < arr.length; i++) {
            var t = arr[i];
            keys.forEach((k)=>{
                var item = obj[k];
                item.forEach((tag)=>{
                    if(tag.includes(t)) {
                        temp_arr.push(k);
                        parents.push(k);
                    };
                })
            });
        }
        arr = temp_arr;
    }
    if(is_to_single) parents = this._convertMultiNamedTagsToSingle(parents);
    return parents;
};

/**
 * 获取所有有别名的TAG的对象。
 * @param {object} obj TAG原始对象 (JSON数据文件中的对象)
 * @returns 解析好的一个对象。
 */
Global.getMultiNamedTags = function(obj) {
    var temp_obj = {};
    var split_char = '/';
    var keys1 = Object.keys(obj);
    for(var i = 0; i < keys1.length; i++){
        var k1 = keys1[i];
        var item1 = obj[k1];
        if(k1.includes(split_char)) temp_obj[k1] = k1.split(split_char);
        if(typeof item1 == 'object') {
            var keys2 = Object.keys(item1);
            for(var j = 0; j < keys2.length; j++) {
                var k2 = keys2[j];
                var item2 = item1[k2];
                if(k2.includes(split_char)) temp_obj[k2] = k2.split(split_char);
                if(typeof item2 == 'object') {
                    var keys3 = Object.keys(item2);
                    keys3.forEach((k3)=>{
                        if(k3.includes(split_char)) temp_obj[k3] = k3.split(split_char);
                    })
                }
            }
        }
    };
    /*
        example:
        obj = {
            "modern/contemporary":{
                "school/collage":"",
                "business":{
                    "it":"",
                    "finance":""
                },
                "killer":""
            },
            "original":""
        }
        returns:
        temp_obj = {
            'modern/contemporary':['modern','contemporary']
            'school/collage':['scholl','collage']
        }
        Note that the max depth of each branch is 3.
    */
    return temp_obj;
}
