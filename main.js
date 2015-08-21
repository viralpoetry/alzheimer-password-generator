// for backward compatibility
if (!chrome.runtime) {
    // Chrome 20-21
    chrome.runtime = chrome.extension;
} else if (!chrome.runtime.onMessage) {
    // Chrome 22-25
    chrome.runtime.onMessage = chrome.extension.onMessage;
    chrome.runtime.sendMessage = chrome.extension.sendMessage;
    chrome.runtime.onConnect = chrome.extension.onConnect;
    chrome.runtime.connect = chrome.extension.connect;
}

// after install
// generate random salt for the first time?
chrome.runtime.onInstalled.addListener(function(details) {
    //chrome.tabs.create({ url: chrome.extension.getURL("options.html") });
    // create context menu item
    chrome.contextMenus.create({
        type: "normal",
        id: "paste_cc_ctx",
        title: "Insert password",
        contexts: ["editable"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    // get salt from local storage
    chrome.storage.local.get('passwd_salt', function(result) {
        if (!result.passwd_salt) {
            // redirect to Options
            chrome.tabs.create({
                url: chrome.extension.getURL("options.html")
            });
        } else {
            chrome.tabs.query({
                'active': true,
                'lastFocusedWindow': true
            }, function(tabs) {
                // ou ouu ouuuuu
                var curr_url = new URL(tabs[0].url).hostname;
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "paste_pass",
                    salt: result.passwd_salt,
                    curr_url: curr_url
                }, function(response) {
                    //console.log("background sent...");
                });
            });
        }
    });
});

/*
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    // ou ouu ouuuuu
    if (url) {
        var url = new URL(url).hostname;
    }
    //show_salt(url);
});
*/
