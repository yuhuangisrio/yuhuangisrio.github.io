var Global = Global || {};

Global.search = function(){
    this._onSearchStart();
    this._processSearch();
    this._onSearchEnd();
}

Global._onSearchStart = function() {
    this._searching = true;
    this._hideSearchNotice();
    this._clearPrevResult();
    this._showVisualSearchSymbol();
    this._initializeDataForSearch();
    this._loadClientSearchConditions();
};

Global._processSearch = function() {

};

Global._onSearchEnd = function() {
    this._searching = false;
    this._hideVisualSearchSymbol();
    this._appendResult();
};

Global._initializeDataForSearch = function() {
    this._search_keywords = [];
    this._search_author = '';
    this._search_tags = JSON.stringify(this._search_tags) != '[]' ? this._search_tags : [];
    // this._search_subject = '';   // type
    this._search_role = [];
    this._search_type = '';    // length
    this._search_status = '';
    this._search_ending = '';
    this._search_is_yuhuang_only = '';
    this._search_is_yuhuangyu = '';
    
    this._search_target_url = [];
};

Global._loadClientSearchConditions = function(){
    var search_text = $('input.search-area').val();
    this._search_keywords = search_text.split(' ');
    this._search_author = $('li.author input').val();
    // this._search_subject = $('li.type input').val();
    this._search_role = [$('li.role input.role-yu').val(),$('li.role input.role-huang').val()];
    this._search_type = $('#settings-length').find("option:selected").val();
    var status = $('#settings-status').find("option:selected").val();
    this._search_status = (function(){
        switch(status) {
            case 'completed':
                return '完结';
            case 'incompleted':
                return '未完结';
            default:
                return '*';
        }
    })();
    this._search_ending = $('#settings-ending').find("option:selected").val().toUpperCase() || '*';
    var iyo = $('#settings-is-yuhuang-only').find("option:selected").val() || 'no';
    this._search_is_yuhuang_only = iyo == 'unlimited' ? '*' : (iyo == 'yes' ? true : false);
    var iyhy = $('#settings-is-yuhuangyu').find("option:selected").val() || 'no';
    this._search_is_yuhuangyu = iyhy == 'yes' ? true : false;
};

Global._hideSearchNotice = function() {
    $('div.initial-result').css('display','none');
    $('div.no-result').css('display','none');
};

Global._clearPrevResult = function() {
    $('div.result-pages').html('');
    $('ul.pagination').html('');
};

Global._showVisualSearchSymbol = function() {
    $('div.searching-symbol').css('display','block');
};

Global._hideVisualSearchSymbol = function() {
    $('div.searching-symbol').css('display','none');
};

Global._appendResult = function() {
    if(this._existsSearchResult()) {
        var columns_in_one_page = 10;
        var page_num = Math.floor(this._search_target_url / columns_in_one_page);
        for(var i = 0; i < page_num; i++) {
            var p = i + 1;
            $('div.result-pages').append('<div id="pg'+p+'"></div>');
        }
        this._search_target_url.forEach((item, index)=>{
            var p = Math.floor(index / columns_in_one_page) + 1;
            $('div#pg'+p).append('<div class="article-item"></div>')
        })
        this._generatePagination(page_num);
    } else {
        $('div.no-result').css('display','block');
    }
};

Global._generatePagination = function(page_num) {
    this._curPage = 1;
    $('ul.pagination').append('<li><a href="javascript:Global.__prevPage('+page_num+')">«</a></li>');
    for(var i = 0; i < page_num; i++) {
        var page = i + 1;
        $('ul.pagination').append('<li><a href="javascript:Global.__pageTo('+page+')">'+page+'</a></li>');
    }
    $('ul.pagination').append('<li><a href="javascript:Global.__nextPage('+page_num+')">»</a></li>');
};

Global.__pageTo = function(page) {
    $('div.pages div').css('display','none');
    $('div.pages div#pg'+page).css('display','block');
    $('ul li').removeClass('active');
    $('ul li').eq(page).addClass('active');
    this._curPage = page;
};

Global.__prevPage = function(page_num) {
    var newPage = this._curPage - 1;
    if(newPage < 1) newPage = page_num;
    this.__pageTo(newPage);
};

Global.__nextPage = function(page_num) {
    var newPage = this._curPage + 1;
    if(newPage > page_num) newPage = 1;
    this.__pageTo(newPage);
};

Global._existsSearchResult = function(){
    return JSON.stringify(this._search_target_url) != '[]';
};

Global.isSearching = function() {
    return this._searching;
};
