let API_KEY = "";
let PUBLIC_KEY = "";
let databaseURL = "https://api.npoint.io/f45136bbabe00b4f3afd";
let database = null;
let userCount = 0;

async function getDatabase() {
	var response = await fetch(databaseURL);
	var jsonResponse = await response.json();
	return await jsonResponse;
}

async function loadDatabase() {
	database = await getDatabase();
	userCount = database.usercount;
}

function saveDatabase(successCallback, failCallback) {
	console.log("send database: " + JSON.stringify(database));
	fetch(databaseURL, {
		method: "POST",
		body: JSON.stringify(database)
	}).then(success => {
		if (successCallback) {
			successCallback(database);
		}
	}, error => {
		console.log(error);
		if (failCallback) {
			failCallback(database, error);
		}
	});
}

function sendKeyRSA(destinationID, successCallback, failCallback) {
	console.log("send key: " + destinationID);
	if (!database.users) {
		database.users = {};
	}
	let users = database.users;
	if (!users[destinationID]) {
		users[destinationID] = {};
	}

	if (!users[destinationID][getCookie("id")]) {
		users[destinationID][getCookie("id")] = {};
	}

	if (!users[destinationID][getCookie("id")].messages) {
		users[destinationID][getCookie("id")].messages = [];
	}
	users[destinationID][getCookie("id")].status = "NONE";
	users[destinationID][getCookie("id")].messages.push({"type": "RSA", "from_id": getCookie("id"), "from_name": getCookie("name"), "from_photo": getCookie("photo"), "public_key": getCookie("public_key"), "timestamp": new Date().getTime()});
	console.log(JSON.stringify(users));
	fetch(databaseURL, {
		method: "POST",
		body: JSON.stringify(database)
	}).then(success => {
		if (successCallback) {
			successCallback(database);
		}
	}, error => {
		console.log(error);
		if (failCallback) {
			failCallback(database, error);
		}
	});
}

async function sendKeyAES(destinationID, key, public_key, successCallback, failCallback) {
	console.log("send key: " + destinationID);
	if (!database.users) {
		database.users = {};
	}
	let users = database.users;
	if (!users[destinationID]) {
		users[destinationID] = {};
	}

	if (!users[destinationID][getCookie("id")]) {
		users[destinationID][getCookie("id")] = {};
	}

	if (!users[destinationID][getCookie("id")].messages) {
		users[destinationID][getCookie("id")].messages = [];
	}




	console.log("send key AES: " + public_key);
	let ciphertext = await encryptRSA2(public_key, key);

	users[destinationID][getCookie("id")].status = "NONE";
	users[destinationID][getCookie("id")].messages.push({"type": "AES", "from_id": getCookie("id"), "from_name": getCookie("name"), "from_photo": getCookie("photo"), "key": ciphertext, "timestamp": new Date().getTime()});
	console.log(JSON.stringify(users));
	fetch(databaseURL, {
		method: "POST",
		body: JSON.stringify(database)
	}).then(success => {
		if (successCallback) {
			successCallback(database);
		}
	}, error => {
		console.log(error);
		if (failCallback) {
			failCallback(database, error);
		}
	});
}

function clearMessages(id) {
	database.users[getCookie("id")][id].messages = [];
	saveDatabase();
}

function sendMessage(destinationID, ciphertext, successCallback, failCallback) {
	
	if (!database.users) {
		database.users = {};
	}
	let users = database.users;
	if (!users[destinationID]) {
		users[destinationID] = {};
	}

	if (!users[destinationID][getCookie("id")]) {
		users[destinationID][getCookie("id")] = {};
	}

	if (!users[destinationID][getCookie("id")].messages) {
		users[destinationID][getCookie("id")].messages = [];
	}
	users[destinationID][getCookie("id")].status = "NONE";
	users[destinationID][getCookie("id")].messages.push({"type": "message", "from_id": getCookie("id"), "from_name": getCookie("name"), "from_photo": getCookie("photo"), "message": ciphertext.toString(), "timestamp": new Date().getTime()});
	console.log(users[destinationID][getCookie("id")].messages);
	fetch(databaseURL, {
		method: "POST",
		body: JSON.stringify(database)
	}).then(success => {
		if (successCallback) {
			successCallback(database);
		}
	}, error => {
		console.log(error);
		if (failCallback) {
			failCallback(database, error);
		}
	});
}