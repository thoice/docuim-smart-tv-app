Settings = {
    bInited: false,
    fs: {},
    write: function(settings) {},
    read: function(settings) {},
    username: null,
    password: null
};

Settings.init = function()
{
    if (Main.settings.bInited != true) {
        if (typeof(FileSystem) == 'function') {
            Main.settings.fs = new FileSystem();
            /*
             if (Settings.fs && Settings.fs.isValidCommonPath(curWidget.id) == 0){Settings.fs.createCommonDir(curWidget.id);}
            */
        } else if (typeof(localStorage) == 'object') {
            Main.settings.fs = localStorage;
            Main.settings.write = function(data) {
                Main.settings.fs.setItem('settings', JSON.stringify(data));
            };
            Main.settings.read = function() {
                var data = JSON.parse(Main.settings.fs.getItem('settings'));
                return data;
            };
        }
    }

    var settings = Main.settings.read();
    if (settings == null || typeof(settings) != 'object') {
        return false;
    }

    if (settings.username != undefined) {
        document.getElementById('settings_username_input').value = settings.username;
        Main.settings.username = settings.username;
    }

    if (settings.password != undefined) {
        document.getElementById('settings_password_input').value = settings.password;
        Main.settings.password = settings.password;
    }

    return true;
};