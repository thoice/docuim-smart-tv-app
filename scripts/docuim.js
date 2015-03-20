Docuim = {
    baseUrl: 'http://docu.im/api/0.1/',
    filters: {
        page: 1,
        type: null,
        genres: null,
        genresLogic: null,
        years: null,
        title: null,
        limit: 50
    }
};

Docuim.filtersMap = function(callback)
{
    var filter;
    for (var f in this.filters) {
        filter = this.filters[f];
        if (!this.filters.hasOwnProperty(f)) {
            continue;
        }

        if (filter == null) {
            continue;
        }
        callback(f, filter);
    }
};

Docuim.generateUrl = function()
{
    // TODO make it correctly parse genres and years
    var url = '';
    Main.resource.filtersMap(function(f,filter){
        url += '/' + f + '/' + filter;
    });
    url = url == '' ? '/' : url;

    return url;
};

Docuim.generateCacheKey = function()
{
    // TODO make it correctly parse genres and years
    var key = 'cache-';
    Main.resource.filtersMap(function(f,filter){
        key += filter;
    });

    return key;
};

Docuim.ajax = function(url, successCB, params)
{
    dbg('Docuim.ajax');
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.successCB = successCB;
    xhr.errorCB = Main.grid.errorCB;
    xhr.onreadystatechange = Docuim.ajaxDone;
    params = params || {};

    if (params.username && params.password) {
        xhr.open('post', url);
        var formData = new FormData();
        formData.append('username', params.username);
        formData.append('password', params.password);
        xhr.send(formData);
    } else {
        xhr.open('get', url);
        xhr.send();
    }
};

Docuim.ajaxDone = function(event)
{
    var xhr = event.srcElement;
    dbg('Docuim.ajaxDone with state ' + xhr.readyState);
    if (xhr.readyState != 4) { return; }

    try {
        var parsedResponse = JSON.parse(xhr.responseText);
        xhr.successCB(parsedResponse);
    } catch (e) {
        xhr.errorCB(e.message);
    }
};

Docuim.login = function(username, password)
{
    dbg('Docuim.login');
    var params = {
        username: username,
        password: password
    };
    Docuim.ajax(Docuim.baseUrl + 'auth', Docuim.loginSuccess, params);
};

Docuim.loginSuccess = function(response)
{
    dbg('Docuim.loginSuccess');
    if (response.status != 'success' && response.status != 'already') {
        Main.grid.errorCB(response.status);
    } else {
        Docuim.loadGenres();
        Docuim.loadPage();
    }
};

Docuim.loadGenres = function()
{
    dbg('Docuim.loadGenres');
    var url = Docuim.baseUrl + 'genre/list/';
    Docuim.ajax(url, Main.grid.renderGenresList);
};

Docuim.loadPage = function()
{
    dbg('Docuim.loadPage');
    var url = Main.resource.baseUrl + 'movie/list/' + Main.resource.generateUrl();
    Docuim.ajax(url, Main.grid.renderItemList);
};

Docuim.loadItemDetails = function(id)
{
    dbg('Docuim.loadItemDetails for id ' + id);
    var url = Docuim.baseUrl + 'movie/show/' + id;
    Docuim.ajax(url, Docuim.loadItemDetailsSuccess);
}

Docuim.loadItemDetailsSuccess = function(itemDetails)
{
    var scene = Main.showScene(Main.SCENE_ID_INFO, true);
    scene.scene.renderItemInfo(itemDetails);
}