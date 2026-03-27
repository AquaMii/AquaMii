var pjax;
var xhttp;

document.addEventListener('DOMContentLoaded', function () {
    pjax = Pjax.init({
        elements: "a[data-pjax]",
        selectors: ["title", "#body"]
    });

    initAll();
});

function initAll() {
    if (document.getElementById('disableSidebar')) cave.toolbar_setVisible(0);
    else cave.toolbar_setVisible(1);

    onContentLoad();
}

function onContentLoad() {
    if (history.length > 1 && !document.getElementById('disableBackButton')) cave.toolbar_setButtonType(1);
    else if (history.length <= 1 || document.getElementById('disableBackButton')) cave.toolbar_setButtonType(0);

    cave.snd_playBgm('BGM_CAVE_MAIN');

    createToolBar(2, '/');
    createToolBar(3, '/communities');
    createToolBar(4, '/news/my_news');
    createToolBar(5, '/users/me');

    cave.toolbar_setCallback(99, goBack);
    cave.toolbar_setCallback(1, goBack);

    cave.boss_registEx(1, 336);
}

function createToolBar(id, url) {
    cave.toolbar_setCallback(id, function() {
        cave.toolbar_setActiveButton(id);
        pjax.loadUrl(url);
    });
}

function goBack() {
    if(!pjax.canGoBack()) cave.toolbar_setButtonType(0); 
    else pjax.back();
}

function checkUpdates() {
    GET('https://api.innoverse.club/v1/notifications', function updates(data) {
        var notificationObj = JSON.parse(data.responseText);
        var count = notificationObj.message_count + notificationObj.notification_count;
        cave.toolbar_setNotificationCount(count);
    });
}

function bannedMsg() {
    cave.error_callFreeErrorViewer(20102, "GOODBYE");
    cave.exitApp();
}

function POST(url, data, callback) {
    cave.transition_begin()
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4) {
            cave.transition_end();
            return callback(this);
        }
    }
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(data);
}

function GET(url, callback) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4) {
            return callback(this);
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}

setInterval(checkUpdates, 6000);