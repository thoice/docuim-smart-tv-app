Grid = function(id)
{
	this.elementId = id;
	this.COLS_PER_ROW = 5;
	this.ROWS_PER_PAGE = 2;
};

Grid.prototype.renderGenresList = function(rawGenresList)
{
	var genres = document.getElementById('menu_genres');
	var genresList = document.createElement('ul');
	var genreLi, genreLabel, genreItemText, genreCheckbox ;
	for (var g = 0; g < rawGenresList.length; g++) {
		genreLi = document.createElement('li');
		genreLabel = document.createElement('label');
		genreLabel.className = 'overlay-genre-item overlay-button';
		genreItemText = document.createTextNode(rawGenresList[g]['title']);
		genreCheckbox = document.createElement('input');
		genreCheckbox.type = 'checkbox';
		genreCheckbox.className = 'overlay-genre-checkbox';
		genreCheckbox.dataset.id = rawGenresList[g]['id'];

		genreLabel.appendChild(genreCheckbox);
		genreLabel.appendChild(genreItemText);
		genreLi.appendChild(genreLabel);
		genresList.appendChild(genreLi);
	}
	genres.innerHTML = '';
	genres.appendChild(genresList);
};

Grid.prototype.renderItemList = function(itemList)
{
    itemList.items = itemList.items.reverse();
	var grid, row, itemIndex, itemData, itemElement, className, itemPoster;
	grid = document.getElementById('grid');
	grid.innerHTML = '';
	var firstToFocus = false;
	for (var r = 0; r < Main.grid.ROWS_PER_PAGE; r++) {
		row = document.createElement('div');
		row.className = 'grid-row';
		for (var c = 0; c < Main.grid.COLS_PER_ROW; c++) {
			itemIndex = c + r * Main.grid.COLS_PER_ROW;
            itemElement = document.createElement('div');
            itemElement.classList.add('grid-item');
			if (itemList.items[itemIndex] != undefined) {
                itemData = itemList.items[itemIndex];

                if (!firstToFocus) {
                    itemElement.classList.add('first-to-focus');
                }

                itemElement.tabIndex = '-1';
                itemElement.style.backgroundImage = 'url(' + itemData.posters.big + ')';
                itemElement.addEventListener('focus', Main.grid.focusHandler, false);
                itemElement.addEventListener('blur', Main.grid.blurHandler, false);

                itemElement.dataset.id = itemData.id;
                itemElement.dataset.year = itemData.year;
                itemElement.dataset.titleEn = itemData.title_en;
                itemElement.dataset.titleRu = itemData.title_ru;
                itemElement.dataset.x = c;
                itemElement.dataset.y = r;
            }
			row.appendChild(itemElement);
		}
		grid.appendChild(row);
	}

    Main.hideSpinner();

    if (grid.querySelector('.first-to-focus') != null) {
        grid.querySelector('.first-to-focus').focus();
    }
	console.dir(itemList);
};

Grid.prototype.focusHandler = function(e)
{
	var element = e.srcElement;
	element.classList.add('grid-item-focused');
	var title = '[' + element.dataset.year + '] ' + element.dataset.titleRu + ' / ' + element.dataset.titleEn;
	document.getElementById('title_placeholder').innerHTML = title;
}

Grid.prototype.blurHandler = function(e)
{
	e.srcElement.classList.remove('grid-item-focused');
	document.getElementById('title_placeholder').innerHTML = '';
}

Grid.prototype.leftHandler = function(e)
{
	var src = e.srcElement;
	if (src.id == 'pager_right') {
		document.getElementById('grid').firstElementChild.lastElementChild.focus();
	} else if (src.previousElementSibling) {
		src.previousElementSibling.focus();
	} else {
		document.getElementById('pager_left').focus();
	}
}

Grid.prototype.rightHandler = function(e)
{
	var src = e.srcElement;
	if (src.id == 'pager_left') {
		document.getElementById('grid').firstElementChild.firstElementChild.focus();
	} else if( src.nextElementSibling) {
		src.nextElementSibling.focus();
	} else {
		document.getElementById('pager_right').focus();
	}
};

Grid.prototype.downHandler = function(e)
{
	var rows = document.getElementById('grid').querySelectorAll('.grid-row');
	var src = e.srcElement;
	var currentX = Number.parseInt(src.dataset.x);
	var currentY = Number.parseInt(src.dataset.y);
	if (src.parentElement.nextElementSibling != null) {
		var targetY = currentY + 1;
	} else {
		var targetY = 0;
	} 

	var targetElement = document.getElementById('grid').querySelector('[data-x="' + currentX + '"][data-y="' + targetY + '"]');
	targetElement.focus();
};

Grid.prototype.upHandler = function(e)
{
	var rows = document.getElementById('grid').querySelectorAll('.grid-row');
	var src = e.srcElement;
	var currentX = Number.parseInt(src.dataset.x);
	var currentY = Number.parseInt(src.dataset.y);
	if (src.parentElement.previousElementSibling != null) {
		var targetY = currentY - 1;
	} else {
		var targetY = rows.length - 1;
	} 

	var targetElement = document.getElementById('grid').querySelector('[data-x="' + currentX + '"][data-y="' + targetY + '"]');
	targetElement.focus();
};

Grid.prototype.endHandler = function(e)
{
	Main.showScene('menu_scene');
};

Grid.prototype.enterHandler = function(e)
{
	if (e.srcElement.classList.contains('grid-item')) {
		Main.showSpinner();
		Main.resource.loadItemDetails(e.srcElement.dataset.id);
	} else if(e.srcElement.classList.contains('pager')){
		Main.showSpinner();
		Main.resource.loadPage();
	}
};

Grid.prototype.errorCB = function(msg)
{
	console.error(msg);
};

Grid.prototype.pageLeft = function(e)
{
    if (Main.resource.filters.page > 1) {
        Main.resource.filters.page--;
    }
    Main.resource.loadPage();
};

Grid.prototype.pageRight = function(e)
{
    Main.resource.filters.page++;
    Main.resource.loadPage();
};