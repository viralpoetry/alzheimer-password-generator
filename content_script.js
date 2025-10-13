// global variable
var clickedEl;

function password_funct(salt, curr_url) {
  const box = clickedEl;
  const passphraseInput = document.getElementById("frm-pass-input");
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
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'alzheimer-modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 50px;
  `;

  // Create modal dialog
  const modal = document.createElement('div');
  modal.id = 'alzheimer-modal';
  modal.style.cssText = `
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    width: 400px;
    padding: 20px;
    font-family: Arial, sans-serif;
    animation: fadeIn 0.2s ease-in;
  `;

  // Create title bar
  const titleBar = document.createElement('div');
  titleBar.style.cssText = `
    font-weight: bold;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  `;
  titleBar.textContent = 'Password Generator';

  // Create form
  const form = document.createElement('form');
  form.id = 'frm2';
  form.innerHTML = `
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px;">Current URL:</label>
      <input type="text" tabindex="-1" name="curr_url" value="${curr_url}" 
             style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px; background-color: #f9f9f9;" readonly>
    </div>
    <div style="margin-bottom: 20px;">
      <label style="display: block; margin-bottom: 5px;">Passphrase:</label>
      <input id="frm-pass-input" type="password" name="pass" value="" 
             style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
    </div>
  `;

  // Create buttons container
  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.cssText = `
    text-align: right;
    border-top: 1px solid #eee;
    padding-top: 15px;
  `;

  const okButton = document.createElement('button');
  okButton.type = 'button';
  okButton.textContent = 'OK';
  okButton.style.cssText = `
    background-color: #007cba;
    color: white;
    border: none;
    padding: 8px 16px;
    margin-left: 10px;
    border-radius: 3px;
    cursor: pointer;
  `;
  okButton.onclick = function() {
    password_funct(salt, curr_url);
    closeModal();
  };

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = `
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 3px;
    cursor: pointer;
  `;
  cancelButton.onclick = closeModal;

  buttonsDiv.appendChild(cancelButton);
  buttonsDiv.appendChild(okButton);

  // Assemble modal
  modal.appendChild(titleBar);
  modal.appendChild(form);
  modal.appendChild(buttonsDiv);
  overlay.appendChild(modal);

  // Add keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Close modal function
  function closeModal() {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }

  // Handle Enter key
  form.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      okButton.click();
    }
  });

  // Handle Escape key
  overlay.addEventListener('keydown', function(e) {
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

  // Add to document and focus
  document.body.appendChild(overlay);
  
  // Focus on passphrase field after a small delay to ensure rendering
  setTimeout(() => {
    const passphraseInput = document.getElementById('frm-pass-input');
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
