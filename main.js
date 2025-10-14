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
        // Validate URL and extract hostname safely
        var curr_url;
        try {
          var url = new URL(tabs[0].url);
          // Check if it's a valid web URL (http or https)
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            curr_url = url.hostname;
          } else {
            // Handle special URLs like chrome://, about: and others
            console.warn("Password generation not supported for URL:", tabs[0].url);
            return;
          }
        } catch (error) {
          console.error("Invalid URL:", tabs[0].url, error);
          return;
        }

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
