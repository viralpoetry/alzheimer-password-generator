
// for backward compatibility
if (!chrome.runtime) {
    // Chrome 20-21
    chrome.runtime = chrome.extension;
} else if(!chrome.runtime.onMessage) {
    // Chrome 22-25
    chrome.runtime.onMessage = chrome.extension.onMessage;
    chrome.runtime.sendMessage = chrome.extension.sendMessage;
    chrome.runtime.onConnect = chrome.extension.onConnect;
    chrome.runtime.connect = chrome.extension.connect;
}

// after install
// generate random salt for the first time?
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.tabs.create({ url: chrome.extension.getURL("options.html") });
});

function enter_password() {
    var pass = prompt("Please enter password", "");
    if (pass != null) {
        return pass;
    }
}

chrome.contextMenus.onClicked.addListener( function( info, tab) {
    // get salt from local storage
    chrome.storage.local.get('passwd_salt', function (result) {
        if(!result.passwd_salt) {
            // redirect to Options
            chrome.tabs.create({ url: chrome.extension.getURL("options.html") });
        } else {
            // ask for password
            passphrase = enter_password();
            //password = result.passwd_salt + passphrase;
            password = "";

            //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                // ou ouu ouuuuu
                var url = new URL(tabs[0].url).hostname;
                console.log(url);
                password = generator(passphrase, url);
                delete passphrase;
                chrome.tabs.sendMessage(tabs[0].id, {action: "paste_pass", data: password}, function(response) {
                    delete password;
                });
            });
        }
    });
});

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    // ou ouu ouuuuu
    if (url) {
        var url = new URL(url).hostname;
    }
    //show_salt(url);
});

// from http://stackoverflow.com/questions/11889329/word-array-to-string
function wordToByteArray(wordArray) {
    var byteArray = [], word, i, j;
    for (i = 0; i < wordArray.length; ++i) {
        word = wordArray[i];
        for (j = 3; j >= 0; --j) {
            byteArray.push((word >> 8 * j) & 0xFF);
        }
    }
    return byteArray;
}

function transform_to_pass(hash) {
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var byteArray = wordToByteArray(hash.words);
    password = "";
    // 16 chars
    for(x = 0; x< 16; x++) {
        password += chars.charAt(byteArray[x] % 62);
    }
    //console.log(byteArray);
    return password;
}

function generator(passphrase, page_info) {
    //salt  = CryptoJS.lib.WordArray.random(32);
    // decode salt from string to type WordArray
    var salt = CryptoJS.enc.Hex.parse(page_info);
    hash = CryptoJS.PBKDF2(passphrase, salt, { keySize: 256/32, iterations: 1000 });
    return transform_to_pass(hash);
}


// create context menu item
chrome.contextMenus.create({ type: "normal", id: "paste_cc_ctx", title: "Insert password", contexts: ["editable"] });



