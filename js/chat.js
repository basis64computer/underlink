let chatBot;
let chat = [];

/*
 * Memuat chat dari database
 */
async function loadChat() {
	let file_id = getCookie("chat");
	let response = await fetch(`https://api.telegram.org/bot${database_bot.TOKEN}/getFile?file_id=${getCookie("chat")}`);
	let json = await response.json();
	if (json.ok == false) {
		return null;
	}
	result = "https://api.telegram.org/file/bot" + database_bot.TOKEN + "/" + await json.result.file_path;
    console.log("photo_json: " + JSON.stringify(result));
    return await result;
}

/*
 * Memuat chat dari database
 */
async function initializeChat() {
	chatBot = new Bot(database_bot.TOKEN, database_bot.ChatID);
	let url = await loadChat();
	if (!url) {
		chat = [];
		return;
	}
	let response = await fetch("https://api.codetabs.com/v1/proxy?quest=" + url);
	let data = await response.text();
	console.log("response: " + data);
	if (data) {
		chat = JSON.parse(decryptAES(data, getCookie("key")).toString(CryptoJS.enc.Utf8));
	} else {
		chat = [];
	}
}

/*
 * Database disimpan dalam bentuk JSON
 * dan dienkripsi menggunakan kunci simetris
 */
async function saveChat() {
	setCookie("chat", null);
	chatBot = new Bot(database_bot.TOKEN, database_bot.ChatID);
	/*
	 * Chat pengguna dienkripsi terlebih dahulu
	 * sebelum dikirim ke database
	 */
	let cipherText = encryptAES(JSON.stringify(chat), getCookie("key")).toString();
	let res = await chatBot.sendFile(cipherText);
	if (!res.result) {
		alert("Tidak dapat menyimpan chat, pastikan koneksi internet Anda terhubung ke internet\n\n" + res);
		console.log(res);
		return;
	}
	/*
	 * Menyimpan ID file chat ke cookie pengguna
	 */
	setCookie("chat", await res.result.document.file_id);
}

/*
 * Menyimpan pesan baru yang berasal dari inbox
 */
function addMessage(id, type, message, photo) {
	if (!chat[id]) {
		chat[id] = {};
	}

	if (!chat[id].messages) {
		chat[id].messages = [];
	}

	if (type == "RSA") {
		chat[id].messages.push({"message_id": chat[id].count++, "from_id": id, "from_photo": photo, "type": "RSA"});
	} else if (type == "AES") {
		chat[id].messages.push({"message_id": chat[id].count++, "from_id": id, "from_photo": photo, "type": "AES"});
	} else if (type == "message") {
		chat[id].messages.push({"message_id": chat[id].count++, "from_id": id, "from_photo": photo, "type": "message", "message": message});
	}
}

/*
 * Menghapus pesan
 */
function deleteMessage(fromID, messageID) {
	userChat = chat[fromID].messages;
	const removeMessageById = (chatArray, id) => chatArray.filter(userChat => userChat.message_id !== messageID);
	userChat = removeMessageById(chat, id);
	chat[fromID].messages = userChat;
}

/*
 * Menghapus chat
 */
function deleteChat(id) {
	id = id.toString();
	const array = Object.values(obj).map(value => value.box)
	const removeChatById = (chatArray, id) => chatArray.filter(chat => chat.id !== id);
	chat = removeChatById(chat, id);
	console.log(id);
}

function isAdded(id) {
	const checkUsername = obj => obj.id === id;
	return chat.some(checkUsername);
}

function getKey(id) {
	for(var i=0; i<chat.length; i++) {
		if (chat[i].key) {
			return chat[i].key;
		}
	}
	return null;
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    	console.log("loaded");
    	var res = JSON.stringify(xhr.responseText);
      callback(res);
  };
  xhr.open('GET', "https://api.codetabs.com/v1/proxy?quest=" + url);
  xhr.send();
}
