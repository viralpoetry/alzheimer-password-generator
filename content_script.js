
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

var clickedEl;

// detect right click on element
document.addEventListener("mousedown", function (ev) {
    if (ev.button == 2) {
        clickedEl = ev.target;
    }
}, true);

// receive salt from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var box = clickedEl;

    if (message.action === "paste_pass") {
        // is this site using HTTPS?
        if (window.location.protocol != "https:") {
            alert("This site isn't using HTTPS connection!");
        } else {
            // paste password to the selected field
            box.value = message.data;
        }
    }
});



