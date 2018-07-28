# Alzheimer password generator

##Chrome extension for domain dependent password generation.


[https://chrome.google.com/webstore/detail/alzheimer-password-genera/emclcafdgdeodlhpenmejdapecfgenof](https://chrome.google.com/webstore/detail/alzheimer-password-genera/emclcafdgdeodlhpenmejdapecfgenof "Alzheimer password generator")

Final password is cryptographically derived from web page URL address, salt and user provided secret passphrase.
The salt should be stored physically, so you can recover it in the future.

Work in progress. The crypto part works fine, but there are some jQuery/css issues on some pages (iframes, jQuery dialog etc.)

Current Threat Model:  

 - No one with an access to the PC with installed extension should be able to authenticate without knowing the correct passphrase.

 - The same passphrase used in two different web browsers should produce two different passwords (cryptographic salt will solve this problem).

 - If an attacker obtains password for some websites, she should not be able to derive passwords for another websites using that knowledge.

 - Attacker should not be able to brute force master passphrase from the salt and knowledge of one password (PBKDF with lots of iterations).

 - it provides protection against basic keyloggers (but they can read our salt from the memory / file...)


Options page:
![alt text](https://github.com/viralpoetry/password-generator/blob/master/chrome_store_pictures/alzheimer_1.png "Options page")

Call Alzheimer pop-up:
![alt text](https://github.com/viralpoetry/password-generator/blob/master/chrome_store_pictures/alzheimer_2_.png "Call Alzheimer pop-up")

Enter password:
![alt text](https://github.com/viralpoetry/password-generator/blob/master/chrome_store_pictures/alzheimer_3.png "Enter password")

Derived strong password is placed to the form:
![alt text](https://github.com/viralpoetry/password-generator/blob/master/chrome_store_pictures/alzheimer_4.png "Derived strong password is placed to the form")

TODO:  

 - better parse url address (remove www, etc...)
 - change icon
 - create css for options page
 - focus cursor on the passphrase input
 - notify user (red alert) that the site is not using HTTPS instead of banning key generations...
 - show "Wait..." information when generating password...
 - generate random salt upon installation (but user can rewrite that value)
 - how to retrieve salt later?
 - Generate Passphrase to clipboard (when you need it outside of browser)
 - deal with forbidden right click...

KNOWN BUGS:  

 - send by Enter not always working
 - some pages rewrite my dialog css...


Version 2:  

  - user should be able to choose what kind of characters are included in the password  
  - salt in the Options page should be not readable by default  


Libraries used:  
[Delta-jQuery-UI-Theme](https://github.com/kiandra/Delta-jQuery-UI-Theme)
