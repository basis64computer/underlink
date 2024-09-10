let contactBot;
let contact = [];
let encryption = false;

async function loadContact() {
	let file_id = getCookie("contact");
	let response = await fetch(`https://api.telegram.org/bot${database_bot.TOKEN}/getFile?file_id=${getCookie("contact")}`);
	let json = await response.json();
	if (json.ok == false) {
		return null;
	}
	result = "https://api.telegram.org/file/bot" + database_bot.TOKEN + "/" + await json.result.file_path;
    console.log("photo_json: " + JSON.stringify(result));
    return await result;
}

async function initializeContact() {
	contactBot = new Bot(database_bot.TOKEN, database_bot.ChatID);
	let url = await loadContact();
	if (!url) {
		contact = [];
		return;
	}
	let response = await fetch("https://api.codetabs.com/v1/proxy?quest=" + url);
	let data = await response.text();
	console.log("response: " + data);
	if (data) {
		if (encryption) {
			contact = JSON.parse(decryptAES(data, getCookie("key")).toString(CryptoJS.enc.Utf8));
		} else {
			contact = JSON.parse(data);
		}
	} else {
		contact = [];
	}
}

async function saveContact() {
	setCookie("contact", null);
	contactBot = new Bot(database_bot.TOKEN, database_bot.ChatID);
	let res = null;
	if (encryption) {
		res = await contactBot.sendFile(encryptAES(JSON.stringify(contact), getCookie("key")).toString());
	} else {
		res = await contactBot.sendFile(JSON.stringify(contact));
	}
	console.log("contact: " + JSON.stringify(res));
	if (!res.result) {
		console.log(res);
		return;
	}
	let contactId = await res.result.document.file_id;
	console.log("contact: ");
	setCookie("contact", await contactId);
}

function addContact(id, name, photo) {
	id = parseInt(id);
	if (isAdded(id)) {
		$("#addContactFailModal").modal("show");
		return;
	}
	var d = new Date();
	contact.push({"id": parseInt(id), "name": name, "photo": photo, "key": null, "timestamp": d.getTime(), "unread_messages": 0, "messages": []});
}

function updateInbox(id, name, photo, timestamp, unreadMessages) {
	let userID = parseInt(id);
	let position = getPositionById(userID);
	if (isAdded(userID)) {
		console.log("this is added " + typeof id);
		contact[position].photo = photo;
		contact[position].timestamp = timestamp;
		contact[position].unread_messages = unreadMessages;
		console.log(JSON.stringify(contact));
	} else {
		//console.log(contact);
		//console.log("data type: " + typeof id);
		contact.push({"id": userID, "name": name, "photo": photo, "key": null, "timestamp": timestamp, "unread_messages": unreadMessages, "messages_count": 0, "messages": []});
		console.log("JSON push: " + typeof userID);
		console.log(JSON.stringify(contact));
	}
}

function contactPutRSA(id, timestamp, publicKey) {
	let position = getPositionById(id);
	if (position < 0) {
		console.log("id: " + id);
		return;
	}

	contact[position].message_count++;
	contact[position].messages.push({"id": id, "message_id": contact[position].message_count, "timestamp": timestamp, "type": "RSA", "public_key": publicKey});
	return contact[position].message_count;
}

function contactPutAES(id, timestamp, key) {
	let position = getPositionById(userID);
	if (position < 0) {
		return;
	}

	contact[position].message_count++;
	contact[position].messages.push({"id": id, "message_id": contact[position].message_count, "timestamp": timestamp, "type": "RSA", "key": key});
}

function contactPutMessage(id, timestamp, message) {
	let position = getPositionById(userID);
	if (position < 0) {
		return;
	}

	contact[position].message_count++;
	contact[position].messages.push({"id": id, "message_id": contact[position].message_count, "timestamp": timestamp, "type": "message", "text": message});
}

function setContactName(id, name) {
	id = parseInt(id);
	for(var i=0; i<contact.length; i++) {
		if (contact[i].id = id) {
			return contact[i].name = name;
		}
	}
	return null;
}

function deleteContact(id) {
	id = parseInt(id);
	const removeContactById = (contactArray, id) => contactArray.filter(contact => contact.id !== id);
	contact = removeContactById(contact, id);
	console.log(id);
}

function deleteMessage(id, messageID) {
	id = parseInt(id);
	let position = getPositionById(id);
	let messagesContactArray = contact[position].messages;
	const removeMessageById = (messagesArray, id) => messagesArray.filter(messagesContactArray => messagesContactArray.id !== id);
	contact = removeMessageById(messagesContactArray, id);
	contact[position].messages = messagesContactArray;
	console.log(id);
}

function isAdded(id) {
	id = parseInt(id);
	const checkUsername = obj => obj.id === id;
	return contact.some(checkUsername);
}

function getPositionById(id) {
	id = parseInt(id);
	for(var i=0; i<contact.length; i++) {
		if (contact[i].id == id) {
			return i;
		}
	}
	return -1;
}

function getKey(id) {
	for(var i=0; i<contact.length; i++) {
		if (contact[i].id == id && contact[i].key) {
			return contact[i].key;
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
