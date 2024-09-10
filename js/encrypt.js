const iv = CryptoJS.enc.Utf8.parse("ftPnk6cjNX0iWhsIyZV8fZM43cWrjbIp");
const keyCharset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function encryptAES(plaintext, key) {
    const keyutf = CryptoJS.enc.Utf8.parse(key);
    return CryptoJS.AES.encrypt(plaintext, keyutf, {iv: iv});
}

function decryptAES(ciphertext, key) {
    const keyutf = CryptoJS.enc.Utf8.parse(key);
	return CryptoJS.AES.decrypt(ciphertext, keyutf, {iv: iv});
}

function generateChatKey() {
	return generateRandomString(32, keyCharset);
}

// PEM encoded X.509 key

async function encryptRSA2(key, plaintext) {
    try {
    	const publicKey =
	    `-----BEGIN PUBLIC KEY-----
		${key}
		-----END PUBLIC KEY-----`;
        const pub = await importPublicKey(publicKey);
        const encrypted = await encryptRSA(pub, new TextEncoder().encode(plaintext));
        const encryptedBase64 = window.btoa(ab2str(encrypted));
        return encryptedBase64.replace(/(.{64})/g, "$1\n");
    } catch (error) {
        return error;
    }
}

async function decryptRSA2(key, ciphertextB64) {
    try {
    	const privateKey =
	    `-----BEGIN PRIVATE KEY-----
		${key}
		-----END PRIVATE KEY-----`;
        const priv = await importPrivateKey(privateKey);
        const decrypted = await decryptRSA(priv, str2ab(window.atob(ciphertextB64)));
        return decrypted;
    } catch (error) {
        return error;
    }
}

async function encryptRSA(key, plaintext) {
    let encrypted = await window.crypto.subtle.encrypt({
            name: "RSA-OAEP"
        },
        key,
        plaintext
    );
    return encrypted;
}

async function decryptRSA(key, ciphertext) {
    let decrypted = await window.crypto.subtle.decrypt({
            name: "RSA-OAEP"
        },
        key,
        ciphertext
    );
    return new TextDecoder().decode(decrypted);
}

function getSpkiDer(spkiPem) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    var pemContents = spkiPem.substring(pemHeader.length, spkiPem.length - pemFooter.length);
    var binaryDerString = window.atob(pemContents);
    return str2ab(binaryDerString);
}


async function importPublicKey(spkiPem) {
    return await window.crypto.subtle.importKey(
        "spki",
        getSpkiDer(spkiPem), {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

async function importPrivateKey(pkcs8Pem) {
    return await window.crypto.subtle.importKey(
        "pkcs8",
        getPkcs8Der(pkcs8Pem), {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
    );
}



function getPkcs8Der(pkcs8Pem) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    var pemContents = pkcs8Pem.substring(pemHeader.length, pkcs8Pem.length - pemFooter.length);
    var binaryDerString = window.atob(pemContents);
    return str2ab(binaryDerString);
}


//
// Helper
//

// https://stackoverflow.com/a/11058858
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}