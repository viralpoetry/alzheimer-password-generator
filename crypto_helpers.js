
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

