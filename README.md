# password-generator
Chrome extension for domain dependent password generation.


Work in progress.
TODO:
- use something which is masking password instead of simple prompt
- better parse url address (remove www, etc...)
- add some CSS and UI



Current Threat Model:
 - No one with an access to the PC with installed extension should be able to authenticate without knowing the correct passphrase.

 - The same passphrase used in two different web browsers should produce two different passwords (cryptographic salt will solve this problem).

 - If an attacker obtains password for some websites, she should not be able to derive passwords for another websites using that knowledge.

 - Attacker should not be able to brute force master passphrase from the salt and knowledge of one password (PBKDF with lots of iterations).
