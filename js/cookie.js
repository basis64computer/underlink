function setCookieDays(name, value, days) {
	let expires = "";
	if (days) {
		let d = new Date();
		d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "expires=" + d.toUTCString();
	}
	document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";SameSite=Lax" + ";path=/";
}

function setCookie(name, value) {
	let expires = "";
	let d = new Date();
	d.setTime(d.getTime() + (100 * 365 * 24 * 60 * 60 * 1000));
	expires = "expires=" + d.toUTCString();
	document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";SameSite=Lax" + ";path=/";
}

function deleteAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}

function getCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
	let c = ca[i];
		while (c.charAt(0) === ' ')
			c = c.substring(1, c.length);

		if (c.indexOf(nameEQ) === 0) {
			return JSON.parse(c.substring(nameEQ.length, c.length));
		}
	}
	return null;
}

function cookieSetPhoto(file_id) {
	setCookie("photo", file_id);
}

async function telegramGetPhoto() {
	response = await fetch(`https://api.telegram.org/bot${database_bot.TOKEN}/getFile?file_id=${getCookie("photo")}`);
	json = await response.json();
	if (json.ok == false) {
		return "assets/img/user.png";
	}
	result = "https://api.telegram.org/file/bot" + database_bot.TOKEN + "/" + await json.result.file_path;
    console.log("photo_json: " + JSON.stringify(result));
    return await result;
}

async function getCookiePhoto() {
	return await telegramGetPhoto();
    //setCookie("photo", result, 0);
    
	//return "assets/img/user.png";
}

async function generateRSAKeyPair() {
                const keyPair = await window.crypto.subtle.generateKey(
                    {
                        name: "RSA-OAEP",
                        modulusLength: 2048,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: "SHA-256",
                    },
                    true, // whether the key is extractable (i.e. can be used in exportKey)
                    ["encrypt", "decrypt"] // can be any combination of "sign" and "verify" or "encrypt" and "decrypt"
                );

                const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
                const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

                return {
                    publicKey: arrayBufferToBase64(publicKey),
                    privateKey: arrayBufferToBase64(privateKey),
                };
            }

            function arrayBufferToBase64(buffer) {
                const binary = String.fromCharCode(...new Uint8Array(buffer));
                return window.btoa(binary);
            }



async function generateCookies(success) {
	const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const numbers = '0123456789';
	const randomString = generateRandomString(32, charset);
	const randumNumbers = generateRandomString(10, numbers);

	await loadDatabase();
	setCookie("id", 1000000000 + userCount, 0);
	database.usercount++;
	console.log("user: " + JSON.stringify(database));
	saveDatabase(success);

	generateRSAKeyPair().then((keyPair) => {
		setCookie("public_key", keyPair.publicKey);
		setCookie("private_key", keyPair.privateKey);
	});

	setCookie("name", "user" + randumNumbers, 0);
	setCookie("photo", "assets/img/user.png");
	setCookie("key", randomString);
	console.log("Created new cookies.");
}

function checkCookies() {
	console.log("Check cookies...");
	console.log("Cookie ID: " + getCookie("id"));
	
	if (getCookie("id") == null || getCookie("id") == "invalid") {
		generateCookies();
	} else {
		console.log("failed create new cookies." + getCookie("id"));
	}
}