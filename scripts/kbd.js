Kbd = function(kbdWrapperId)
{
	var kwi = document.getElementById(kbdWrapperId);
	if (!kwi) { throw 'No wrapper element.'; }
	
	this.wrapper = kwi;
	this.init();
	return this;
};

Kbd.prototype.state = {};

Kbd.prototype.showFor = function(element)
{
	var top = element.offsetParent.offsetTop + element.offsetTop + element.offsetHeight;
	var left = element.offsetParent.offsetLeft;
	Main.kbd.wrapper.style.top = top + 'px';
	Main.kbd.wrapper.style.left = left + 'px';
	Main.kbd.echoTarget = element;
}

Kbd.prototype.init = function(){
	this.layouts = {ru:[]};//, en:[], symb:[]};
	this.state.layout = Object.keys(this.layouts)[0]
	this.layouts.ru.push([
		{label:'й'},
		{label:'ц'},
		{label:'у'},
		{label:'к'},
		{label:'е'},
		{label:'н'},
		{label:'г'},
		{label:'ш'},
		{label:'щ'},
		{label:'з'},
		{label:'х'},
		{label:'ъ'}
	]);
	this.layouts.ru.push([
		{label:'ф'},
		{label:'ы'},
		{label:'в'},
		{label:'а'},
		{label:'п'},
		{label:'р'},
		{label:'о'},
		{label:'л'},
		{label:'д'},
		{label:'ж'},
		{label:'э'}
	]);
	this.layouts.ru.push([
		{label:'я'},
		{label:'ч'},
		{label:'с'},
		{label:'м'},
		{label:'и'},
		{label:'т'},
		{label:'ь'},
		{label:'б'},
		{label:'ю'},
		{label:'.'},		
	]);
	this.layouts.ru.push([
        {label:'en', echoValue:'', specialSize:2},
		{label:'', echoValue:' ', specialSize:'8'},
        {label:'ОК', handler:'submitHandler', specialSize:2}
	]);

	for (var l in this.layouts) {
		if (!this.layouts.hasOwnProperty(l)) {
			continue;
		}
		var layout = this.buildLayout(this.layouts[l]);
		this.wrapper.appendChild(layout);
	}
};

Kbd.prototype.buildLayout = function(layoutData)
{
	var kbdRowElement, kbdKeyData, kbdKeyElement, className, label, kbdKeyLabel, offsetClass,
		focusAttached = false,
		kbdLayoutElement = document.createElement('div');
	for (var r = 0; r < layoutData.length; r++) {
		kbdRowElement = document.createElement('div');
		for (var c = 0; c < layoutData[r].length; c++) {
			kbdKeyData = layoutData[r][c];
			kbdKeyElement = document.createElement('span');
            label = kbdKeyData.label != '' ? kbdKeyData.label : String.fromCharCode(160);
			kbdKeyLabel = document.createTextNode(label);
			kbdKeyElement.appendChild(kbdKeyLabel);
			kbdRowElement.appendChild(kbdKeyElement);

			// Column-Row X-Y
			offsetClass = 'pos-' + c + '-' + r;

			className = 'kbd-key widget ' + offsetClass;
			if (kbdKeyData.specialSize) {
				className += ' size-' + kbdKeyData.specialSize;
			}
			if (!focusAttached) {
				className += ' first-to-focus';
				focusAttached = true;
			}
			kbdKeyElement.className = className;
			kbdKeyElement.tabIndex = '-1';
			kbdKeyElement.dataset.echoValue = kbdKeyData.echoValue || kbdKeyData.label;
			kbdKeyElement.dataset.positionX = c;
			kbdKeyElement.dataset.positionY = r;
            if (kbdKeyData.handler != undefined) {
                kbdKeyElement.dataset.handler = kbdKeyData.handler;
            }
		}
		kbdLayoutElement.appendChild(kbdRowElement);
	}
	return kbdLayoutElement;
};

Kbd.prototype.leftHandler = function(e)
{
	var src = e.srcElement;
	if (src.previousElementSibling) {
		src.previousElementSibling.focus();
	} else {
		src.parentElement.lastElementChild.focus();
	}
};

Kbd.prototype.rightHandler = function(e)
{
	var src = e.srcElement;
	if (src.nextElementSibling) {
		src.nextElementSibling.focus();
	} else {
		src.parentElement.firstElementChild.focus();
	}
};

Kbd.prototype.downHandler = function(e)
{
	var src = e.srcElement;
	var layout = Main.kbd.layouts[Main.kbd.state.layout];

	var x;
	var y = Number.parseInt(src.dataset.positionY);
	var x = Number.parseInt(src.dataset.positionX);

	y = (y >= layout.length - 1) ? 0 : y + 1;

	x = (x > layout[y].length - 1) ? layout[y].length - 1 : x;
	
	var newClass = 'pos-' + x + '-' + y;
	targetKey = Main.kbd.wrapper.querySelector('.' + newClass);
	if (targetKey != undefined) {
		targetKey.focus();
	}
};

Kbd.prototype.upHandler = function(e)
{
	var src = e.srcElement,
	layout = Main.kbd.layouts[Main.kbd.state.layout],
	y = parseInt(src.dataset.positionY),
	x = parseInt(src.dataset.positionX);
	y = (y <= 0) ? layout.length - 1 : y - 1;
	x = (x > layout[y].length - 1) ? layout[y].length - 1 : x;

	var newClass = 'pos-' + x + '-' + y,
	targetKey = Main.kbd.wrapper.querySelector('.' + newClass);
	if (targetKey != undefined) {
		targetKey.focus();
	}
};

Kbd.prototype.enterHandler = function(e)
{
	var src = e.srcElement;
    if (src.dataset.handler != undefined && Main.kbd.__proto__.hasOwnProperty(src.dataset.handler)) {
        return Main.kbd[src.dataset.handler](e);
    }

	if (src.dataset.echoValue) {
		Main.kbd.echoTarget.value += src.dataset.echoValue;
	}
};

Kbd.prototype.clickHandler = function(e)
{
    Kbd.enterHandler(e);
};

Kbd.prototype.submitHandler = function(e)
{
    if (Main.kbd.echoTarget.dataset['handler'] != undefined) {
        var handler = Main.kbd.echoTarget.dataset['handler'];
        if (Main.hasOwnProperty(handler)) {
            Main[handler](e);
        }
    }
};