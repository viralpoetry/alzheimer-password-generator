// Generate random salt for the first time after installation
chrome.runtime.onInstalled.addListener(function(details) {
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
        url: chrome.runtime.getURL("options.html")
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
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          }
        });
      });
    }
  });
});
