// global variable
var clickedEl;

function password_funct(salt, curr_url, shadowRoot) {
  const box = clickedEl;
  const passphraseInput = shadowRoot.getElementById("frm-pass-input");
  if (!passphraseInput) {
    console.error("Passphrase input not found");
    return;
  }
  
  let passphrase = passphraseInput.value;
  // derive password from passphrase, cryptographic salt and current URL
  let password = generator(passphrase, salt, curr_url);
  box.value = password;
  // clean up
  passphrase = null;
  password = null;
}

function injectPopup(salt, curr_url) {
  // Create shadow host element
  const shadowHost = document.createElement('div');
  shadowHost.id = 'alzheimer-password-generator-shadow-host';
  
  // Create shadow root
  const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
  
  // Load external CSS for shadow DOM
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('css/custom.css');
  
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  // Create modal dialog
  const modal = document.createElement('div');
  modal.className = 'modal';

  // Create title bar
  const titleBar = document.createElement('div');
  titleBar.className = 'title-bar';
  titleBar.textContent = 'Password Generator';

  // Create form
  const form = document.createElement('form');
  form.id = 'frm2';
  
  // Create URL input group
  const urlGroup = document.createElement('div');
  urlGroup.className = 'form-group';
  
  const urlLabel = document.createElement('label');
  urlLabel.textContent = 'Current URL:';
  
  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.name = 'curr_url';
  urlInput.value = curr_url;
  urlInput.readOnly = true;
  urlInput.tabIndex = -1;
  
  urlGroup.appendChild(urlLabel);
  urlGroup.appendChild(urlInput);
  
  // Create passphrase input group
  const passGroup = document.createElement('div');
  passGroup.className = 'form-group';
  
  const passLabel = document.createElement('label');
  passLabel.textContent = 'Passphrase:';
  
  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.id = 'frm-pass-input';
  passInput.name = 'pass';
  passInput.value = '';
  
  passGroup.appendChild(passLabel);
  passGroup.appendChild(passInput);
  
  form.appendChild(urlGroup);
  form.appendChild(passGroup);

  // Create buttons container
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'buttons';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'btn-secondary';
  cancelButton.textContent = 'Cancel';
  
  const okButton = document.createElement('button');
  okButton.type = 'button';
  okButton.className = 'btn-primary';
  okButton.textContent = 'OK';

  buttonsDiv.appendChild(cancelButton);
  buttonsDiv.appendChild(okButton);

  // Assemble modal
  modal.appendChild(titleBar);
  modal.appendChild(form);
  modal.appendChild(buttonsDiv);
  overlay.appendChild(modal);
  
  // Add styles and content to shadow root
  shadowRoot.appendChild(link);
  shadowRoot.appendChild(overlay);

  // Close modal function
  function closeModal() {
    if (shadowHost.parentNode) {
      shadowHost.parentNode.removeChild(shadowHost);
    }
  }

  // Event handlers
  okButton.onclick = function() {
    password_funct(salt, curr_url, shadowRoot);
    closeModal();
  };
  
  cancelButton.onclick = closeModal;

  // Handle Enter key
  form.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      okButton.click();
    }
  });

  // Handle Escape key on the shadow host
  shadowHost.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Close on overlay click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Make shadow host focusable for keyboard events
  shadowHost.tabIndex = -1;
  shadowHost.style.position = 'fixed';
  shadowHost.style.top = '0';
  shadowHost.style.left = '0';
  shadowHost.style.width = '100%';
  shadowHost.style.height = '100%';
  shadowHost.style.pointerEvents = 'none';
  shadowHost.style.zIndex = '2147483647';
  
  // Allow pointer events only on the overlay inside shadow DOM
  overlay.style.pointerEvents = 'auto';

  // Add to document and focus
  document.body.appendChild(shadowHost);
  shadowHost.focus();
  
  // Focus on passphrase field after a small delay to ensure rendering
  setTimeout(() => {
    const passphraseInput = shadowRoot.getElementById('frm-pass-input');
    if (passphraseInput) {
      passphraseInput.focus();
    }
  }, 100);
}

// detect right click on element
document.addEventListener("mousedown", function(ev) {
  if (ev.button == 2) {
    clickedEl = ev.target;
  }
}, true);

// receive salt from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  if ((message.action === "paste_pass") && (typeof message.salt !== "undefined") && (typeof message.curr_url !== "undefined")) {
    // is this site using HTTPS?
    if (window.location.protocol != "https:") {
      alert("This site isn't using HTTPS connection!");
      sendResponse({success: false, error: "Not HTTPS"});
    } else {
      // ask for passphrase
      injectPopup(message.salt, message.curr_url);
      sendResponse({success: true});
    }
  } else {
    //console.log(message.action + " " + message.salt + " " + message.curr_url);
    sendResponse({success: false, error: "Invalid message"});
  }
});
