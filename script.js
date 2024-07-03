const profileDiv = document.getElementById('profile-div');
const profileHolders = document.querySelectorAll('.profile-holder');
const avatars = document.querySelectorAll('#avatar');
const names = document.querySelectorAll('#name');

window.onload = () => {
    if (profileDiv.classList.contains(profileDiv, '.discordlogin_div')) {
        profileDiv.style.width = "180px";
        profileDiv.style.height = "50px";
    } 
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
    const loadResult = loadUserData();

    if (loadResult.success) {
        console.log("Load was successful")
        const { username, discriminator, avatar, id } = loadResult.userData;
        // Set the welcome username string
        names.forEach(div => {
            div.innerText = `${username}`;
        });
       
        // Set the avatar image
        avatars.forEach(div => {
            div.src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`;
        });
        return;
    }
    
    if (!accessToken) {
       window.location.href('/index.html')
    }

    fetch('https://discord.com/api/users/@me', {
    headers: {
        authorization: `${tokenType} ${accessToken}`,
    },
    })
    .then(result => result.json())
    .then(response => {
      console.log(response);
      saveUserData(response);
      const { username, discriminator, avatar, id} = response;
//set the welcome username string
        names.forEach(div => {
            div.innerText = `${username}`;
        });

        //set the avatar image by constructing a url to access discord's cdn
        avatars.forEach(div => {
            div.src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`;
        });
    })
    .catch(console.error);

    };

function clickHandler() {
     const url = this.getAttribute('data-url');
     window.open(url, '_blank'); // Opens the link in a new tab
}

function openProfile(){
    profileDiv.classList.remove('discordlogin_div');
    profileDiv.classList.toggle('discordlogin_div_large');

}

function saveUserData(userData) {
    try {
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("User data saved successfully.");
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}
function loadUserData() {
    try {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            const userData = JSON.parse(storedData);
            console.log("User data loaded successfully.");
            profileDiv.removeEventListener('click', clickHandler);
            profileDiv.addEventListener('mouseenter', () => {
                profileDiv.classList.remove('discordlogin_div');
                profileDiv.classList.toggle('discordlogin_div_large');
                profileHolders.forEach(div => {
                    div.style.display = 'flex';
                    div.style.visibility = 'visible';
                });
            });
    
            profileDiv.addEventListener('mouseleave', () => {
                profileDiv.classList.remove('discordlogin_div_large');
                profileDiv.classList.toggle('discordlogin_div');
                profileHolders.forEach(div => {
                    div.style.display = 'none';
                    div.style.visibility = 'hidden';
                });
            });
            return { success: true, userData };
        } else {
            console.log("No user data found.");
            profileDiv.addEventListener('click', clickHandler);
            return { success: false, userData: null };
        }
    } catch (error) {
        console.error("Error loading user data:", error);
        return { success: false, userData: null };
    }
}
document.querySelectorAll('.clickable').forEach(element => {
    element.addEventListener('click', clickHandler);
  });


