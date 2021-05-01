var getScreenApi = 'https://mini.s-shot.ru/1024x673/328/?';
var user_sites;
var standart_sites;
var index_mas;
var plus_btn;
var popular_sites_div;
var current_searcher = 'google';
var suggestions;

function setTopWindowLocation(url) {
    var link = $('<a href=' + url + ' target="_top">link</a>');
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    link[0].dispatchEvent(event);
}

function trackOutboundLink(obj) {
    if ($(obj).parents('.hided').length)
    {
        return;
    }
    
    var url = obj.href;
    trackOutboundURL(url, function() {
        var target_attr = obj.getAttribute('target');
        switch (target_attr)
        {
            case '_blank':
                break;
            case '_top':
                setTopWindowLocation(url);
                break;
            default:
                document.location.href = url;
        }
    }, 'outbound_other');
    return obj.getAttribute('target') === '_blank';
}

function saveSites() {
    if (localStorage)
    {
        try
        {
            localStorage.setItem('user_sites', JSON.stringify(user_sites));
            localStorage.setItem('standart_sites_' + _current_lang, JSON.stringify(standart_sites));
            localStorage.setItem('index_mas_' + _current_lang, JSON.stringify(index_mas));
        }
        catch (e) {}
    }
}

function getSites() {
    if (localStorage)
    {
        user_sites = localStorage.getItem('user_sites');
        if (user_sites)
        {
            user_sites = JSON.parse(user_sites);
        }
        standart_sites = localStorage.getItem('standart_sites_' + _current_lang);
        if (standart_sites)
        {
            standart_sites = JSON.parse(standart_sites);
        }
        index_mas = localStorage.getItem('index_mas_' + _current_lang);
        if (index_mas)
        {
            index_mas = JSON.parse(index_mas);
        }
    }
    
    if (!user_sites)
    {
        user_sites = {};
    }
    
    if (!standart_sites)
    {
        standart_sites = {};
    }
    
    for(var site_url in standart_sites)
    {
        var site = standart_sites[site_url];
        if (!_standart_sites[_current_lang][site.site_name])
        {
            delete standart_sites[site_url];
        }
        else if (site.url != _standart_sites[_current_lang][site.site_name].url)
        {
            if (index_mas) 
            {
                var ind = index_mas.indexOf(site.url);
                if (ind > 0)
                {
                    index_mas[ind] = _standart_sites[_current_lang][site.site_name].url;
                }
            }
            delete standart_sites[site_url];
        }
    }
    for (var site_name in _standart_sites[_current_lang])
    {
        var site = _standart_sites[_current_lang][site_name];
        if (!standart_sites[site.url])
        {
            site["site_name"] = site_name;
            standart_sites[site.url] = site;
        }
    }
    
    if (!index_mas)
    {
        index_mas = [];
        for (var i in standart_sites)
        {
            index_mas.push(i);
        }
        for (var i in user_sites)
        {
            index_mas.push(i);
        }
    }
    else
    {
        for (var i = 0; i < index_mas.length; i++)
        {
            var key = index_mas[i];
            if (!standart_sites[key] && !user_sites[key])
            {
                index_mas.removeElement(key);
            }
        }
        for (var i in user_sites)
        {
            if (index_mas.indexOf(i) < 0)
            {
                index_mas.push(i);
            }
        }
        for (var i in standart_sites)
        {
            if (index_mas.indexOf(i) < 0)
            {
                index_mas.push(i);
            }
        }
    }
}

function openUrl(url, inNewTab) {
    if (url.length > 1)
    {
        if (url.substr(0, 7) != 'http://' && url.substr(0, 8) != 'https://')
        {
            url = "http://" + url;
        }
        window.open(url, inNewTab ? '_blank' : '_self');
    }
}

function setSearchEngine(name) {
    if (!name)
    {
        return;
    }

    var formAction,
        searchName = "q";
    
    var form = $('#search_form'),
        input = $('#search_form input');
    var add_options = form.find('.add_options');
    if (add_options.length)
    {
        add_options.empty();
    }

    switch (name)
    {
        case 'google':
            formAction = "https://www.google.com/search";
            break;
        case 'mail':
            formAction = "https://go.mail.ru/search?gp=813091&frc=813091";
            var add_nodes = $('<div class="add_options">' +
                              '<input type="hidden" name="gp" value="813091">' + 
                             '<input type="hidden" name="frc" value="813091">' + 
                             '</div>');
            form.append(add_nodes);
            break;
        case 'yandex':
            formAction = "https://yandex.ru/search";
            searchName = "text";
            break;
        case 'bing':
            formAction = "https://www.bing.com/search";
            break;
        case 'yahoo':
            formAction = "https://search.yahoo.com/yhs/search";
            var add_nodes = $('<div class="add_options">' +
                              '<input type="hidden" name="hspart" value="visicom">' + 
                             '<input type="hidden" name="hsimp" value="yhs-mystartdefault1">' + 
                             '<input type="hidden" name="type" value="systma__byd_ntc">' +
                             '</div>');
            form.append(add_nodes);
            searchName = "p";
            break;
        case 'rambler':
            formAction = "https://nova.rambler.ru/search";
            var add_nodes = $('<div class="add_options">' +
                              '<input type="hidden" name="_openstat" value="bWFya2V0YXRvcjA3Ozs7">' + 
                             '</div>');
            form.append(add_nodes);
            searchName = "query";
            break;
    }

    form.attr('action', formAction);
    input.attr('name', searchName);
    $('.search-dropdown__trigger span')[0].className = "search-dropdown__ico search-dropdown__ico_" + name;
    input.focus();

    current_searcher = name;
    if (localStorage) 
    {
        localStorage.setItem('searchEngine', name);
    }
}

function freeSearchField() {
//    $('#search_form input').val('');
    $("#autocomplete").addClass('hidden');
    $('#search_form input').focus();
}

function search(_this) {
    var search_str = $('#search_form input').val();
    search_str = search_str.trim();
    var result = false;
    
    if ($('#search_form').hasClass('is_url'))
    {
        trackOutboundURL($('#search_form').attr('data_url'), function() {
            window.top.location.href = $('#search_form').attr('data_url');
        }, 'outbound_search');
        return false;
    }
    
    if (search_str)
    {
        switch (current_searcher)
        {
        /*    case "google":
                var gcs_input = $('.gsc-input');
                var gcs_submit = $('.gsc-search-button input[type="image"]');
                if (gcs_input.length)
                {
                    gcs_input.val(search_str);
                    if (gcs_submit.length)
                    {
                        gcs_submit.click();
                        setTimeout(function() {
                            freeSearchField()
                        }, 0);
                        result = false;
                        break;
                    }
                }*/
            default:
                setTimeout(function() {
                    freeSearchField();
                    suggestions.stop();
                }, 0);
                if (search_str.length > 0)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
        }
    }
    else
    {
        result = false;
    }
    
    var query_string = $(_this).serialize();
    var searcher = _this.action;
    if (result && searcher && query_string)
    {
        var search_url_query = searcher + '?' + query_string;
        trackOutboundURL(search_url_query, function() {
            var target_attr = _this.getAttribute('target');
            switch (target_attr)
            {
                case '_blank':
                    break;
                case '_top':
                    setTopWindowLocation(search_url_query);
                    break;
                default:
                    document.location.href = search_url_query;
            }
        }, 'outbound_search');
        return _this.getAttribute('target') === '_blank';
    }
    
    return result;
}

function set_Data_URL_for_form_if_need(string) {
    var resultURL = '';
    switch (string)
    {
        case 'youtube':
            resultURL = 'https://www.youtube.com/';
            break;
        case 'ютуб':
            resultURL = 'https://www.youtube.com/';
            break;
        case 'google':
            resultURL = 'https://www.google.com/';
            break;
        case 'вк':
            resultURL = 'https://vk.com/';
            break;
        case 'facebook':
            resultURL = 'https://www.facebook.com/';
            break;
        case 'fb':
            resultURL = 'https://www.facebook.com/';
            break;
        case 'gmail':
            resultURL = 'https://mail.google.com';
            break;
        case 'browse':
            resultURL = 'https://cryptotabbrowser.com/22784574';
            break;
        default:
            if (/(https?|ftp):\/\//.test(string))
            {
                resultURL = string.replace(' ', '%20');
            }
            else if (/^([а-яa-z0-9-_]+)(\.[а-яa-z0-9-_]+)*\.(biz|com|edu|gov|info|net|org|de|uk|cn|ru|eu|travel|club|рф|sc|pro|ua|by|kz)(\/[а-яa-z0-9-_]+)*(?:\/?)$/i.test(string))
            {
                resultURL = 'http://' + string;
            }
            break;
    }
    
    if (resultURL)
    {
        $("#search_form").addClass('is_url');
        $("#search_form").attr('data_url', resultURL);
        return true;
    }
    else
    {
        $("#search_form").removeClass('is_url');
        $("#search_form").attr('data_url', '');
        return false;
    }
}

function toogleAddingTabPanel() {
    var plusTab = $(".preview-tab_new").toggleClass("preview-tab_new_active");
    $(".new-tab-adding").slideToggle();
    if (plusTab.hasClass("preview-tab_new_active"))
    {
        $('html, body').animate({
            scrollTop: $('.new-tab-adding').offset().top
        }, 400);
        $('.new-tab-adding__input-wrapper input').focus().val('');
        if (!$('.hided').length)
        {
            $('.popupar_heading').css('display', 'none');
        }
        else
        {
            $('.popupar_heading').css('display', '');
        }
    }
}

function init_suggestions() {
    var autocomplete_id = 0;
    var pause = false;
    
    // Search
    var search_input = $("#search_form input");
    var autocomplete = $("#autocomplete");
    
    search_input.on('focus', function() {
        pause = false;
    })
    
    var xmlhttp = getXMLHttpRequest();
    xmlhttp.onload = function(resp) {
        if (pause)
        {
            return;
        }
        var json;
        try
        {
            json = JSON.parse(resp.currentTarget.response);
            json = json.query.results.body;
            json = JSON.parse(json);
        }
        catch(e)
        {
            return;
        }
        var curr = json[0];
        autocomplete.empty();
        autocomplete.removeClass('hidden');
        var autothis = $('<div class="autocomplete_element">' + curr + '</div>');
        autocomplete.append(autothis);
        autothis.on("click", function() {
            search_input.val(this.innerText);
            search_input.parent().submit();
        });
        var h = 1;
        resp = json[1];
        if (resp && resp instanceof Array)
        {
            var suggests_array = [];
            for (var i = 0, l = resp.length; i < l; i++)
            {
                if (!(resp[i] instanceof Array))
                {
                    suggests_array.push(resp[i]);
                }
            }
            
            var length = suggests_array.length < 10 ? suggests_array.length : 10;
            for (var i = 0; i < length; i++)
            {
                var link_class = /^https?:\/\//.test(suggests_array[i]) ? "link" : "";
                var auto = $('<div class="autocomplete_element ' + link_class + '">' + suggests_array[i] + '</div>');
                autocomplete.append(auto);
                auto.on("click", function() {
                    if (!set_Data_URL_for_form_if_need(this.innerText))
                    {
                        search_input.val(this.innerText);
                    }
                    search_input.parent().submit();
                });
                h++;
            }
        }
        autocomplete.css('height', (h * 26) + 'px');
    };
    
    search_input.on("keyup", function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        switch (keyCode)
        {
            case 37:
                break;

            case 38:
                break;

            case 39:
                break;

            case 40:
                break;

            case 13:
                break;

            default:
                autocomplete.addClass('hidden');
                autocomplete.empty();
                autocomplete_id = 0;
                if (this.value !== '' && !pause)
                {
                    var term = encodeURIComponent(this.value);
                    term = term.replace(/%20/g, '%2520');
                    xmlhttp.open('GET', "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27https%3A%2F%2Fsuggest.yandex.ru%2Fsuggest-ya.cgi%3Fv%3D4%26n%3D10%26part%3D" + term + "%27&format=json");
                    xmlhttp.send();
                }
                else
                {
                    autocomplete.addClass('hidden');
                }
                break;
        }
    });

    search_input.on("keydown", function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        switch (keyCode)
        {
            case 40:
                e.preventDefault();
                var childs = autocomplete.find('div');
                if (autocomplete_id < childs.length)
                {
                    autocomplete_id++;
                    var selected = autocomplete.find(".selected");
                    if (selected)
                    {
                        selected.removeClass("selected");
                    }
                    childs[autocomplete_id - 1].classList.add("selected");
                }
                $(this).val(childs[autocomplete_id - 1].innerText);
                break;
            case 38:
                e.preventDefault();
                var childs = autocomplete.find('div');
                if (autocomplete_id > 1)
                {
                    autocomplete_id--;
                    var selected = autocomplete.find(".selected");
                    if (selected)
                    {
                        selected.removeClass("selected");
                    }
                    childs[autocomplete_id - 1].classList.add("selected");
                }
                $(this).val(childs[autocomplete_id - 1].innerText);
                break;
            default:
                break;
        }
    });
    
    return {
        stop: function() {
            pause = true;
        }
    }
}

function createGridItem(site) {
    var isBrowser = /^(chrome:\/\/|about:)/.test(site.url);
    if (!site.title)
    {
        var url = site.url.match("^https?://([^:/\\?#]+)(?::[^/\\?#]+)?.*$");
        if (url && url[1])
        {
            site.title = url[1];
        }
        else
        {
            site.title = site.url;
        }
        saveSites();
    }
    if (!isBrowser && !site.icon)
    {
        var img = new Image();
        img.onload = function() {
            var favimg = $('.grid__item[x_url="' + site.url + '"]').find('.preview-tab__name-ico img');
            favimg.attr('src', img.src);
            site.icon = img.src;
            saveSites();
        };
        img.onerror = function() {
            img.src = 'https://www.google.com/s2/favicons?domain=' + site.title;
            site.icon = img.src;
            saveSites();
        }
        img.src = 'https://' + site.title + '/favicon.ico';
    }
    if (!isBrowser && !site.screen)
    {
        if (window.FileReader)
        {
            var xhr = getXMLHttpRequest();
            xhr.onload = function() {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var dataUri = event.target.result;
                    var screenImg = $('.grid__item[x_url="' + site.url + '"] .preview-tab__picture-wrapper img');
                    screenImg.attr('src', dataUri);
                    site.screen = dataUri;
                    saveSites();
                };
                reader.onerror = function(event) {
                    var screenImg = $('.grid__item[x_url="' + site.url + '"] .preview-tab__picture-wrapper img');
                    screenImg.attr('src', getScreenApi + encodeURIComponent(site.url));
                };
                reader.readAsDataURL(this.response);
            }
            xhr.open('GET', getScreenApi + encodeURIComponent(site.url));
            xhr.responseType = 'blob';
            xhr.send();
        }
        else
        {
            site.screen = getScreenApi + encodeURIComponent(site.url);
        }
    }
    
    var addClass = '';
    if (site['class'])
    {
        addClass = site['class'];
    }
    return $('<div class="grid__item ' + addClass + '" x_url="' + site.url + '">\
                <div class="preview-tab">\
                  <div class="preview-tab__close">&times;</div>\
                  <a href="' + site.url + '" target="_top" onclick="return trackOutboundLink(this);" class="preview-tab__picture-wrapper">\
                    <div class="preview-tab__picture">\
                      <img src="' + site.screen + '" alt="">\
                    </div>\
                  </a>\
                  <div class="preview-tab__name">\
                    <div class="preview-tab__name-ico"><img src="' + site.icon + '" alt=""></div>\
                    <div class="preview-tab__name-text">' + site.title + '</div>\
                  </div>\
                </div>\
              </div>');
}

function getXMLHttpRequest() {
    if (window.XMLHttpRequest)
    {
        return new window.XMLHttpRequest;
    } 
    else
    {
        try
        {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0");
        }
        catch (ex)
        {
            return null;
        }
    }
}

function onGridItemClick(event) {
    var _this = $(this).closest('.grid__item');
    if (_this.hasClass("hided"))
    {
        event.preventDefault();
        var url = _this.attr('x_url');
        _this.removeClass("hided");
        _this.insertBefore(plus_btn);

        if (standart_sites[url])
        {
            var site = standart_sites[url];
            site.hided = false;
        }

        index_mas.addElement(url);
        saveSites();
        
        toogleAddingTabPanel();
    }
}

function onGridItemClose(event) {
    var _this = $(this).closest('.grid__item');
    var url = _this.attr('x_url');
    event.preventDefault();

    if (!_this.hasClass('user'))
    {
        _this.addClass("hided");
        _this.appendTo(popular_sites_div);
    }
    else
    {
        _this.remove();
    }
    
    if (standart_sites[url])
    {
        var site = standart_sites[url];
        site.hided = true;
        index_mas.addElement(url);
        saveSites();
    }
    else if (user_sites[url])
    {
        var site = user_sites[url];
        delete user_sites[url];
        index_mas.removeElement(url);
        saveSites();
    }
    
    
    
    if ($('.hided').length)
    {
        $('.popupar_heading').css('display', '');
    }
}

function updateSites() {
    $('#addedSites .grid__item:not(.addButton)').remove();
    
    for (var i = 0; i < index_mas.length; i++)
    {
        var key = index_mas[i];
        var site = user_sites[key] || standart_sites[key];
        if (!site)
        {
            continue;
        }
        
        var grid = createGridItem(site);
        
        if (!site.hided)
        {
            grid.insertBefore(plus_btn);
        }
        else
        {
            grid.addClass('hided');
            grid.appendTo(popular_sites_div);
        }
        grid.on("click", '.preview-tab__close', onGridItemClose);
        grid.on("click", '.preview-tab__picture', onGridItemClick);
    }
}

function updateTopSites() {
    var parent = $('.section-icon-tabs .grid-wrapper .grid');
    parent.empty();
    var section_parent;
    var lang = _current_lang;
    if (!_topSites[_current_lang])
    {
        lang = _default_lang;
    }
    for (var i = 0, l = _topSites[lang].length; i < l; i++)
    {
        if (i % 3 == 0)
        {
            section_parent = $('<div class="grid__item"><div class="icon-tabs-group"></div></div>');
            parent.append(section_parent);
            section_parent = section_parent.find('.icon-tabs-group');
        }
        var href = _topSites[lang][i].url;
        if (href.indexOf('http') < 0)
        {
            href = 'https://' + href;
        }
        $('<a class="icon-tab" onclick="return trackOutboundLink(this);" href="' + href + '" data-title="' + _topSites[lang][i].url + '" target="_blank">\
            <img src="' + _topSites[lang][i].icon + '" alt="">\
            </a>').appendTo(section_parent);
    }
}

function addNewSite(form) {
    var url = $(form).find('input').val().toLowerCase().trim();
    if (url)
    {
        if (!url.match(/^(http|https|chrome|about):.*/))
        {
            url = "http://" + url;
        }

        if (url[url.length - 1] == '/')
        {
            url = url.substr(0, url.length - 1);
        }

        var site = {};

        if (index_mas[url])
        {
            index_mas.removeElement(url);
        }
        if (user_sites[url])
        {
            site = user_sites[url];
            index_mas.addElement(url);
            var grid = $('.grid__item[x_url="' + site.url + '"]');
            grid.insertBefore(plus_btn);
        }
        else if (standart_sites[url])
        {
            site = standart_sites[url];
            site.hided = false;
            index_mas.addElement(url);
            var grid = $('.grid__item[x_url="' + site.url + '"]');
            grid.removeClass("hided");
            grid.insertBefore(plus_btn);
        }
        else
        {
            site.url = url;
            site.screen = '';
            site.icon = '';
            site['class'] = 'user';
            user_sites[url] = site;
            index_mas.addElement(url);
            var grid = createGridItem(site);
            grid.addClass('user');
            grid.insertBefore(plus_btn).on("click", '.preview-tab__close', onGridItemClose);
        }

        saveSites();
        toogleAddingTabPanel();
    }
    
    return false;
}

function init_sites() {
    getSites();
    updateSites();
    updateTopSites();
    freeSearchField();
}

$(document).ready(function() {
    
    $('.lang_selector').change(function() {
        var selected_lang = $(this).val();
        localize(selected_lang);
        init_sites();
    });
    
    $(".search-dropdown__trigger").click(function(event) {
        event.stopPropagation();
        $(".search-dropdown__list").toggleClass("search-dropdown__list_active");
        $("#autocomplete").addClass('hidden');
    });

    $(document).click(function(e) {
        if ($(".search-dropdown__list").hasClass('search-dropdown__list_active') && !$(e.target).is('.search-dropdown__list'))
        {
            $(".search-dropdown__list").removeClass("search-dropdown__list_active");
        }
        else if (!$("#autocomplete").hasClass('hidden') && !$(e.target).is('.autocomplete_element'))
        {
            $("#autocomplete").addClass('hidden');
            $('#search_form input').focus();
        }
    });

    $(".search-dropdown__item").click(function() {
        setSearchEngine(this.innerText.trim().toLowerCase());
        $(".search-dropdown__list").removeClass("search-dropdown__list_active");
    });

    $(".new-tab-adding").hide();
    $(".preview-tab_new").click(function() {
        toogleAddingTabPanel();
    });
    
    $("#search_form").submit(function() {
        return search(this);
    });

    $(".new-tab-adding__form form").submit(function() {
        return addNewSite(this);
    });
    
    $('#search_form input').keydown(function(e) {
        if (e.keyCode == 13)
        {
            set_Data_URL_for_form_if_need(this.value.trim());
        }
    });
    $('#search_form button').click(function() {
        set_Data_URL_for_form_if_need($('#search_form input').val().trim());
    });
    
    plus_btn = $(".grid__item.addButton");
    popular_sites_div = $("#popularSites");
    

    localize();
    
    if (localStorage)
    {
        var searcher = localStorage.getItem('searchEngine');
        if (searcher)
        {
            setSearchEngine(searcher);
        }
        else
        {
            setSearchEngine('google');
        }
    }
    
    suggestions = init_suggestions();
    init_sites();
});

Array.prototype.removeElement = function(elem) {
    var ind = this.indexOf(elem);
    if (ind >= 0)
    {
        this.splice(ind, 1);
    }
};
Array.prototype.addElement = function(elem) {
    var ind = this.removeElement(elem);
    this.push(elem);
};
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function (elt, from) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
        {
            from += len;
        }

        for (; from < len; from++)
        {
            if (from in this && this[from] === elt)
            {
                return from;
            }
        }
        return -1;
    };
}
if (!String.prototype.trim)
{
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, ''); 
    }
}