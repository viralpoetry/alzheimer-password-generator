
// update div element with app status
function show_result(txt) {
    var status = document.getElementById('status');
    status.textContent = txt;
}

function show_salt(txt) {
    var status = document.getElementById('salt');
    status.value = txt;
}

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    // ou ouu ouuuuu
    var url = new URL(url).hostname;
    show_salt(url);
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
    show_result(password);
}

function generator(passphrase, page_info) {
    //salt  = CryptoJS.lib.WordArray.random(32);
    // decode salt from string to type WordArray
    var salt = CryptoJS.enc.Hex.parse(page_info);
    hash = CryptoJS.PBKDF2(passphrase, salt, { keySize: 256/32, iterations: 1000 });
    transform_to_pass(hash);
    return hash.toString();
}

function generate_passwd() {
    // pass
    passphrase = document.getElementById("frm1").elements.item(0).value;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        // ou ouu ouuuuu
        var url = new URL(url).hostname;
        password = generator(passphrase, url);
        //show_result(password);
    }); 
}

document.getElementById('generate').addEventListener('click', generate_passwd);
show_result('Please be patient, key derivation may take several seconds.');

