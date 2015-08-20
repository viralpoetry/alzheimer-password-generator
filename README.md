# password-generator
Chrome extension for domain dependent password generation.


Work in progress.
TODO:
- better parse url address (remove www, etc...)
- change icon
- create css for options page
- show "Wait..." information when generating password...
- generate random salt upon installation (but user can rewrite that value)
- how to retrieve salt later?


Version 2:
- user should be able to choose what kind of characters are included in password

Current Threat Model:
 - No one with an access to the PC with installed extension should be able to authenticate without knowing the correct passphrase.

 - The same passphrase used in two different web browsers should produce two different passwords (cryptographic salt will solve this problem).

 - If an attacker obtains password for some websites, she should not be able to derive passwords for another websites using that knowledge.

 - Attacker should not be able to brute force master passphrase from the salt and knowledge of one password (PBKDF with lots of iterations).


Libraries used:
https://github.com/kiandra/Delta-jQuery-UI-Theme
