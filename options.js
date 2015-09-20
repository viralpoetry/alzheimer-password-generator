// update div element with app status
function show_result(txt) {
    var status = document.getElementById('status');
    status.textContent = txt;
}

// Saves options to chrome.storage
function save_options() {
    // lname
    salt = document.getElementById("frm1").elements.item(0).value;

    chrome.storage.local.set({
        'passwd_salt': salt
    }, function() {
        // Notify that we saved.
        if (chrome.extension.lastError) {
            console.log('An error occurred: ' + chrome.extension.lastError.message);
        } else {
            show_result('Data has been successfully saved.');
        }
    });
}

function clear_storage() {
    //window.localStorage.clear();
    chrome.storage.local.clear();
    show_result('Data has been cleared.');
    // clear form
    document.getElementById("frm1").elements.item(0).value = '';
}

chrome.storage.local.get('passwd_salt', function(result) {
    if (!result.passwd_salt) {
        // generate random salt....
        document.getElementById("frm1").elements.item(0).value = transform_to_pass(CryptoJS.lib.WordArray.random(16));
        save_options();
    } else {
        document.getElementById("frm1").elements.item(0).value = result.passwd_salt;
    }
});

document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_storage);
show_result('Please be patient, key derivation may take several seconds.');


