/*
+ Make keyboard respond to enter, not to focus
+ Make keyboard switch between rows
+ Make simple grid
+ Attach resource that logs in, fetches grid 
+ Make simple details with two tabs
+ Fetch genres

TODO make pages + caching work
TODO decorate genres and make them navigateable
TODO Make switcher between tabs (Maybe rewrite with use of recursion whole "window" model. So there will be no sections and subsections but only windows)
TODO Make player
TODO make pager understand that there is no new page so no need to increase a page in filters
TODO Create history menu item
TODO Make player keep track of history
*/
// PC <-> TV
// END = GUIDE
// HOME = RETURN
// ENTER = ENTER?
Main = {
    CLASS_ACTIVE: 'active',
    SCENE_ID_CATALOG_GRID: 'catalog_grid_scene',
    SCENE_ID_MENU: 'menu_scene',
    SCENE_ID_INFO: 'info_scene',
    resource: {},
    kbd: {},
    grid: {},
	scenes: {},
    childrenStack: []
};

Main.bodyLoadHandler = function() 
{
	Main.resource = Docuim;
	Main.kbd = new Kbd('keyboard_wrapper');
    Main.settings = Settings;

	Main.grid = new Grid(Main.SCENE_ID_CATALOG_GRID);

	Main.scenes[Main.SCENE_ID_CATALOG_GRID] = {
		scene: Main.grid,
		element: document.getElementById(Main.SCENE_ID_CATALOG_GRID),
        active: false
	};

	Main.scenes[Main.SCENE_ID_MENU] = {
		scene: new Menu(Main.SCENE_ID_MENU),
		element: document.getElementById(Main.SCENE_ID_MENU),
        active: false
	};

	Main.scenes[Main.SCENE_ID_INFO] = {
		scene: new ItemInfo(Main.SCENE_ID_INFO),
		element: document.getElementById(Main.SCENE_ID_INFO),
        active: false
	};
    //TODO if username or password is not entered or invalid then show error.
    if (!Main.settings.init()) {
        Main.showScene(Main.SCENE_ID_MENU);
    } else {
        Main.showScene(Main.SCENE_ID_CATALOG_GRID);
        Main.resource.login(Main.settings.username, Main.settings.password);
    }

    document.body.addEventListener('keydown', Main.keyDownHandler, false);
};

Main.showScene = function(sceneName, returnScene)
{
    returnScene = returnScene || false;
    for (var s in Main.scenes) {
        if (!Main.scenes.hasOwnProperty(s)) {
            continue;
        }
        Main.scenes[s].element.style.display = 'none';
        Main.scenes[s].active = false;
    }

    Main.scenes[sceneName].element.style.display = 'block';
    Main.scenes[sceneName].active = true;
    var elementToFocus = Main.scenes[sceneName].element.querySelector('.first-to-focus');
    if (elementToFocus != null) {
        elementToFocus.focus();
    }

    if (returnScene) {
        return Main.scenes[sceneName];
    }
};

Main.getScene = function(sceneName)
{
    if (!sceneName) {
        for (var s in Main.scenes) {
            if (!Main.scenes.hasOwnProperty(s)) {
                continue;
            }

            if (Main.scenes[s].active == true) {
                return Main.scenes[s];
            }
        }
    } else {
        return Main.scenes[sceneName];
    }
};

Main.showChildFor = function(e, childId, activeObject)
{
    var element = e.srcElement;
    var childToShow = childId || element.dataset.child;
    var child = document.getElementById(childToShow);

    if (child) {
        Main.childrenStack.push(
            {
                srcElement: element,
                child: child,
                activeObject: activeObject
            }
        );
        child.style.display = 'block';
        var elementToFocus = child.querySelector('.first-to-focus');
        if (elementToFocus != null) {
            element.classList.add(Main.CLASS_ACTIVE);
            elementToFocus.focus();
        }
    }
};

Main.popChild = function()
{
    var child = Main.childrenStack.pop();
    if (child != undefined) {
        child.child.style.display = 'none';
        child.srcElement.classList.remove(Main.CLASS_ACTIVE);
        child.srcElement.focus();
    }
};

Main.popAllChildren = function()
{
    for (var c = 0; c < Main.childrenStack.length; c++) {
        Main.popChild();
    }
};

Main.getActiveChildObject = function()
{
    var child = Main.childrenStack[Main.childrenStack.length - 1];
    return (child != undefined) ? child.activeObject : child;
};

Main.keyDownHandler = function(e) {
    if (e.metaKey == true) {
        return true;
    }
    var keyCode = e.keyCode,
    handlerName = Keys[keyCode] || 'default';
    handlerName += 'Handler';
    var handler = e.srcElement.dataset[handlerName] || handlerName,
    activeScene = Main.getScene().scene,
    activeChildObject = Main.getActiveChildObject();

    if (activeChildObject != undefined && typeof activeChildObject[handler] == 'function') {
        activeChildObject[handler](e);
    } else if (typeof activeScene[handler] == 'function') {
        activeScene[handler](e);
    } else if (typeof Main[handler] == 'function') {
        Main[handler](e);
    }

    e.preventDefault();
    e.stopPropagation();
};

Main.enterHandler = function(e)
{
    var srcElement = e.srcElement;
    if (srcElement.classList.contains('keyboarded')) {
        Main.showChildFor(e, 'keyboard_wrapper', Main.kbd);
        Main.kbd.showFor(srcElement);
    }
};

Main.homeHandler = function(e)
{
    if (Main.childrenStack.length > 0) {
        Main.popChild();
    } else {
        Main.showScene(Main.SCENE_ID_CATALOG_GRID);
    }
};

Main.search = function(e)
{
    Main.resource.filters.title = document.getElementById('search_input').value;
    Main.popAllChildren();
    Main.showScene(Main.SCENE_ID_CATALOG_GRID);
    Main.showSpinner();
    Main.resource.loadPage();
};

Main.showSpinner = function()
{
	document.getElementById('spinner').style.display = 'block';
};

Main.hideSpinner = function()
{
	document.getElementById('spinner').style.display = 'none';
};

Main.clickHandler = function(e)
{
	Main.getScene().clickHandler(e);
};