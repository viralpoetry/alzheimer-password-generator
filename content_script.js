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

// global variable
var clickedEl;

function password_funct(salt, curr_url) {
    box = clickedEl;
    passphrase = document.getElementById("frm2").elements.item(1).value;
    // derive password from passphrase, cryptographic salt and current URL
    password = generator(passphrase, salt, curr_url);
    box.value = password;
    // clean up
    passphrase = null;
    password = null;
    delete passphrase;
    delete password;
}

// THX to http://stackoverflow.com/questions/13740912/chrome-ext-content-script-that-creates-jquery-dialog-need-to-ignore-iframes
function injectPopup(salt, curr_url) {
    var showModal = function(title) {
        $('<div />').html('<form id="frm2">\
               current URL:  <input type="text" tabindex="-1" name="curr_url" value=' + curr_url + '><br><br>\
               Passphrase:   <input id="frm-pass-input" type="password" name="pass" value="">\
               </form>')
            .appendTo("body")
            .dialog({
                title: title,
                modal: true,
                position: ['center', 20],
                width: 400,
                hide: "fade",
                show: "fade",
                buttons: {
                    "OK": function() {
                        password_funct(salt, curr_url);
                        $(this).dialog("close");
                    },
                    "Cancel": function() {
                        $(this).dialog("close");
                    }
                },
                open: function(event, ui) {
                    $(this).keypress(function(e) {
                        if (e.keyCode == $.ui.keyCode.ENTER) {
                            $(this).parent().find("button:eq(0)").trigger("click");
                        }
                    });
                },
                close: function(event, ui) {
                    $(this).dialog('destroy').remove()
                }
            });
    };
    showModal("password generator");
    // focus cursor on passphrase field
    $("#frm-pass-input").focus();
}

// detect right click on element
document.addEventListener("mousedown", function(ev) {
    if (ev.button == 2) {
        clickedEl = ev.target;
    }
}, true);

// receive salt from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var box = clickedEl;

    if ((message.action === "paste_pass") && (typeof message.salt !== "undefined") && (typeof message.curr_url !== "undefined")) {
        // is this site using HTTPS?
        if (window.location.protocol != "https:") {
            alert("This site isn't using HTTPS connection!");
        } else {
            // ask for passphrase
            injectPopup(message.salt, message.curr_url);
        }
    } else {
        //console.log(message.action + " " + message.salt + " " + message.curr_url);
    }
});
