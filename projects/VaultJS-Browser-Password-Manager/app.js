/******************************************************************
 * Author: William Adejoh
 * Project: VaultJS Password Manager
 * Version: 1.0
 * Description: Main frontend logic. Handles 
 *              Register -> Login -> Vault. Talk to PHP for Save/Load.
 *              Does all crypto in the browser with Web Crypto API
 *****************************************************************/

/*// Base API path. Change this 1 time if you move the project
const API_BASE = '/wp-portfolio/projects/VaultJS-Browser-Password-Manager/'

// [Built-in] Helper to build full URL
function api(endpoint) {
    return API_BASE + endpoint;  // e.g. api('register.php') -> full path
}*/

// SECTION 1: APP STATE + CONFIG

let vault = {}; // empty object, holds all passwords while app is open, e.g { "google.com": "password123" }
let cryptoKey; // holds AES(Advanced Encryption Standard) encryption key derived from master password. Never leaves browser
let userId = localStorage.getItem('user_id');    // Persist user ID across page refresh
let salt = localStorage.getItem('salt');         // Persist salt across page refresh

// SECTION 2: APP FLOW / UI CONTROL

// This function hides login and shows register form
function showRegister() {
    document.getElementById('landing-info').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.remove('hidden');
}

// This function hides register and shows login form
function showLogin() {
    document.getElementById('landing-info').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

// This function hides auth forms and shows the vault UI
function showVault() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('vault-section').classList.remove('hidden');
}

// This function creates new user account
// Get username/password -> send to register.php -> save salt/user_id -> go to login

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !password) {
        alert("Username and password required");
        return;
    }

    try {
        const response = await fetch('/wp-portfolio/projects/VaultJS-Browser-Password-Manager/register.php', {
            method: 'POST',  // POST [HTTP Method] Send data in request body
            headers: {'Content-Type': 'application/json'},  // Tell PHP we are sending JSON
            body: JSON.stringify({username: username})    // Convert JS object to JSON string
        });
        const result = await response.json();     //Parse JSON response from PHP
        if (result.status === 'success') {
            alert("Account created! Now login with your new account.");
            localStorage.setItem('user_id', result.user_id);
            localStorage.setItem('salt', result.salt);
            showLogin();          //  Move user to login screen
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Register failed:", error);
        alert("Could not connect to server.");
    }
}

// 5. This function logs user in
// Get username -> ask login.php for salt -> derive key -> load vault -> show vault

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert("Username and password required");
        return;
    }

    try {
        // step 1: Get the user's salt from the server
        const response = await fetch('/wp-portfolio/projects/VaultJS-Browser-Password-Manager/login.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username})
        });
        const result = await response.json();

        if (result.status !== 'success') {
            alert("Error: " + result.message);
            return;
        }
        // step 2: save user info and derive the encryption key using the real salt
        userId = result.user_id;
        salt = result.salt;
        localStorage.setItem('user_id', userId);
        localStorage.setItem('salt', salt);

        cryptoKey = await deriveKey(password, salt);    // call crypto worker function
        // step 3: load the user's vault from server and decrypt it
        await loadFromServer();
        showVault();       // if all good, show the vault
        renderVault();
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Check username/password");
    }
}

// 6. logout function
function logout() {
    cryptoKey = null;
    vault = {};
    localStorage.clear();
    document.getElementById('vault-section').classList.add('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('landing-info').classList.remove('hidden');
    location.reload();    // refresh page to go back to register/login
}

// SECTION 3: CRYPTO LOGIC / WEB CRYPTO API

// 1. KEY DERIVATION - PBKDF2(Password-Based Key Derivation Function 2)
// Cyber Security: Turn password into encryption key. Slow = secure

async function deriveKey(password, salt_b64) {
    const enc = new TextEncoder();   // built-in class, converts string to bytes
    const passwordBuffer = enc.encode(password);
    const saltBuffer = Uint8Array.from(atob(salt_b64), c => c.charCodeAt(0));   // Decode base64 salt to bytes

    const keyMaterial = await window.crypto.subtle.importKey(     // Web Crypto API, Import raw password
        "raw", enc.encode(password), {name: "PBKDF2"}, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(        // Web Crypto API: run PBKDF2 100000 times to get AES key
        {name: "PBKDF2", 
        salt: saltBuffer, 
        iterations: 100000,    // High iterations = slow for hackers
        hash: "SHA-256"
        },
        keyMaterial, 
        {name: "AES-GCM", length: 256},   // 256-bit AES key
        false,                    // not extractable
        ["encrypt", "decrypt"]
    );
}
        
// 2. ENCRYPT VAULT
// Encrypts the vault object with AES-GCM and returns {iv, data} both base64 encoded
async function encryptVault() {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Web Crypto, 12-bytes(random Initialization Vector). Unique
    const enc = new TextEncoder();
    const data = enc.encode(JSON.stringify(vault));  //turns vault object into bytes for encryption

    const ciphertext = await crypto.subtle.encrypt(    // Web Crypto Encrypt
        {name: "AES-GCM", iv}, 
        cryptoKey, 
        data
    );
    return {
            iv: btoa(String.fromCharCode(...iv)),  // built-in function "Binary to ASCII(btoa)" converts bytes to base64 for JSON
            data: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    }; 
}
        
// 3. DECRYPT VAULT - Take encrypted data from server and decrypts it back into vault object
// atob(ASCII to Binary) converts base64 text to bytes, Uint8Array.from() puts bytes into an array the Web Crypto API can use
async function decryptVault(iv_b64, data_b64) {
    const iv = Uint8Array.from(atob(iv_b64), c => c.charCodeAt(0));   // base64 -> bytes
    const data = Uint8Array.from(atob(data_b64), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt(    //Web crypto Decrypt
        {name: "AES-GCM", iv: iv}, cryptoKey, data    // browser unscrambles the data using same crptoKey + same iv
    ); 
    const dec = new TextDecoder();    
    vault = JSON.parse(dec.decode(decrypted));  // bytes to text string(JS Object)
}


//  SECTION 4: VAULT UI + SERVER SYNC
        
// 1. PASSWORD GENERATOR - Create strong random 16-character password

function generatePassword(length = 16) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";  // pool of characters to pick from
    let retVal = "";
    const randomValues = crypto.getRandomValues(new Uint32Array(length)); // built-in method cryptographically Secure random
    for (let i = 0; i < length; i++) {
        retVal += charset[randomValues[i] % charset.length];   
    }
    return retVal;
}

// 2. Copies password to clipboard API (Built-in Browser API)

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);    // copies text. Needs https or localhost
        alert("Copied to clipboard!");   // Quick feedback
    } catch (err) {
        alert("Failed to copy. Your browser may block it");
    }
}

// 3. Removes 1 entry from vault object and re-renders

function deleteEntry(site) {
    if (confirm(`Delete password for ${site}?`)) {
        delete vault[site];     // deletes key from object
        renderVault();
    }
}
// 4. Prompts for website, generate password, adds to vault, re-renders

function generateAndAdd() {
    const site = prompt("Website name: e.g. google.com");     // prompt for website
    if (!site) return;
    const pwd = generatePassword();           // 16-char secure password
    vault[site] = pwd;                        // add to vault object
    renderVault();                            // refreshes the screen and shows new entry
    /*alert(`Generated for ${site}: ${pwd}`); */  // shows the password to copy it
}

// 5. This function Draws vault object to HTML list

function renderVault() {
    const list = document.getElementById('vault-list');
    list.innerHTML = "";    // Clear list

    if (Object.keys(vault).length === 0) {
        list.innerHTML = "<li style='text-align:center; color:#94a3b8;'>Your vault is empty. Click 'Generate New Password' to start</li>";
        return;
    }

    for (const site in vault) {
        const li = document.createElement('li');  // Create <li> element

        li.innerHTML = `
          <div>
            <b>${site}</b><br>
            <code>${vault[site]}</code>
          </div>
          <div>
            <button class="btn-small" onclick="copyToClipboard('${vault[site]}')">Copy</button>
            <button class="btn-small btn-danger" onclick="deleteEntry('${site}')">Del</button>
          </div>`;
        list.appendChild(li);
    }
}

// 6. This function encrypts vault and sends to save.php
        
async function saveToServer() {
    const {iv, data} = await encryptVault();  // get encrypted data {iv:"base64...", data:"base64..."} 
    await fetch('/wp-portfolio/projects/VaultJS-Browser-Password-Manager/save.php',                       // send to PHP
      {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({user_id: userId, iv: iv, data: data})
      });
    alert("Vault saved!");
}

// 7. This function gets encrypted vault from load.php and decrypts it

async function loadFromServer() {
    try {
        const response = await fetch('/wp-portfolio/projects/VaultJS-Browser-Password-Manager/load.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id: userId})
        });
        const result = await response.json();
    
        if (result.status === 'success' && result.data) {
            await decryptVault(result.iv, result.data);    // Decrypt what server sent
            alert("Vault reloaded from cloud");
        } else {
            vault = {};     //New user, start with empty vault
            alert("No vault found on cloud. Starting fresh");
        }
        renderVault();
    } catch (error) {
        console.error("Load failed:", error);
        alert("Failed to reload vault");
    }
}

