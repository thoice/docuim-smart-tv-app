ItemInfo = function(id){
    this.id = id;
};

ItemInfo.prototype.renderItemInfo = function(info){
	Main.hideSpinner();
	console.log('ItemInfo.renderItemInfo');
    var scene = Main.getScene(this.id),
    	sceneElement = scene.element,
    	posterElement = document.createElement('img'),
    	videoList = document.createElement('ul'),
    	focusAttached = false,
    	videoItem, videos, videoItemText, qualities, title;

    sceneElement.querySelector('#info_info').innerHTML = info.about;
	posterElement.src = info.posters.big;
    sceneElement.querySelector('#info_scene_left').innerHTML = '';
    sceneElement.querySelector('#info_scene_left').appendChild(posterElement);

	for (var v = 0; v < info.videos.length; v++) {
		videoItem = document.createElement('li');
		if (!focusAttached) {
			videoItem.classList.add('first-to-focus');
			focusAttached = true;
		}
		videoItem.tabIndex = -1;
		videoItem.classList.add('video-item');
		videoItem.dataset.enterHandler = 'play';
		videos = info.videos[v];
		if (videos.streams != undefined && videos.streams.http != undefined) {
			qualities = videos.streams.http;
			for (q in qualities) {
				if (!qualities.hasOwnProperty(q)) {
					continue;
				}
				videoItem.dataset[q] = qualities[q];
			}
		}

		title = info.videos[v]['title'] || info.title_ru + ' / ' + info.title_en;
		videoItemText = document.createTextNode(title);
		videoItem.appendChild(videoItemText);
		videoItem.addEventListener('click', scene.scene.play);
		videoList.appendChild(videoItem);
	}
    sceneElement.querySelector('#info_video').innerHTML = '';
    sceneElement.querySelector('#info_video').appendChild(videoList);

	/*
info.imdb;
info.kinopoisk;
info.title_en;
info.title_ru;
info.year;
info.videos;
info.videos.title;
info.videos.streams;
info.videos.streams.http;
info.videos.streams.http.720p;
	*/
	// info_video
};

ItemInfo.prototype.leftHandler = function(e)
{
	var src = e.srcElement;
	var tabs = src.parentElement.querySelectorAll('dt');
	var tab;
	for (var t = 0; t < tabs.length; t++) {
		if (src == tabs[t]) {
			src.classList.remove('tab-selected');
			if (tabs[t - 1] != undefined) {
				tab = tabs[t - 1];
			} else {
				tab = tabs[tabs.length - 1];
			}
			tab.focus();
			tab.classList.add('tab-selected');
			break;
		}
	}
};

ItemInfo.prototype.rightHandler = function(e)
{
	var src = e.srcElement;
	var tabs = src.parentElement.querySelectorAll('dt');
	var tab;
	for (var t = 0; t < tabs.length; t++) {
		if (src == tabs[t]) {
			src.classList.remove('tab-selected');
			if (tabs[t + 1] != undefined) {
				tab = tabs[t + 1];	
			} else {
				tab = tabs[0];
			}
			tab.focus();
			tab.classList.add('tab-selected');
			break;
		}
	}
};

ItemInfo.prototype.switchToVideos = function(e)
{
	var srcElement = e.srcElement;
	var tabPanel = srcElement.nextElementSibling;
	var elementToFocus = tabPanel.querySelector('.first-to-focus');
	if (elementToFocus != undefined) {
		elementToFocus.focus();
	}
}

/*ItemInfo.prototype.downHandler = function(e)
{
    var src = e.srcElement;
    var tabs = src.parentElement.querySelectorAll('dt');
    var tab;
    for (var t = 0; t < tabs.length; t++) {
        if (src == tabs[t]) {
            src.classList.remove('tab-selected');
            if (tabs[t + 1] != undefined) {
                tab = tabs[t + 1];
            } else {
                tab = tabs[0];
            }
            tab.focus();
            tab.classList.add('tab-selected');
            break;
        }
    }
};*/

ItemInfo.prototype.play = function(e)
{
	var v = document.createElement('video');
	v.id = 'player';
	v.width = '320';
	v.height = '240';
	v.controls = true;
	var s = document.createElement('source');
	s.src = e.srcElement.dataset['720p'];
	v.appendChild(s);
	document.getElementById('player_wrapper').innerHTML = '';
	document.getElementById('player_wrapper').appendChild(v);
	document.getElementById('player_wrapper').style.display = 'block';
	v.load();
	v.play();
}