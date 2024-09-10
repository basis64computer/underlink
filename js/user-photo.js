let user_photo = null;

window.addEventListener("DOMContentLoaded", async function() {
    user_photo = await getCookiePhoto();
    document.getElementById('userProfilePhoto').src = user_photo;
});
