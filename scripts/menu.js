Menu = function(elementId) 
{};

Menu.prototype.downHandler = function(e)
{
    var srcElement = e.srcElement;
	if (srcElement.nextElementSibling != null) {
		srcElement.nextElementSibling.focus();
	} else {
		srcElement.parentElement.firstElementChild.focus();
	}
};

Menu.prototype.upHandler = function(e)
{
    var srcElement = e.srcElement;
	if (srcElement.previousElementSibling != null) {
		srcElement.previousElementSibling.focus();
	} else {
		srcElement.parentElement.lastElementChild.focus();
	}
};

Menu.prototype.saveSettings = function(e)
{
    var settings = {
        username: document.getElementById('settings_username_input').value,
        password: document.getElementById('settings_password_input').value
    };
    Main.settings.write(settings);
    Main.resource.login(settings.username, settings.password);
};