async function getData() {
    try {
        const response = await fetch("http://localhost:1337/fragrances");
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function deletePost(id) {
    try {
        const response = await fetch(`http://localhost:1337/fragrances/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            console.log(`Post with ID ${id} deleted successfully`);
            getData();
        } else {
            const errorData = await response.json();
            console.error("Failed to delete post:", errorData.message);
        }
    } catch (error) {
        console.error("Error while deleting post:", error);
    }
}

function displayData(data) {
    const fragranceList = document.getElementById("fragranceList");
    fragranceList.innerHTML = "";

    data.forEach(item => {
        const fragranceDiv = document.createElement("div");
        fragranceDiv.className = "fragrance";

        const image = document.createElement("img");
        image.src = `${item.img_url}`;
        fragranceDiv.appendChild(image);

        if (localStorage.getItem('username') === `${item.username}`) {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Delete post";

            deleteBtn.addEventListener("click", () => {
                console.log(`Delete post with ID: ${item.id}`);
                const itemId = item.id;
                console.log(itemId)
                deletePost(itemId);
            });

            fragranceDiv.appendChild(deleteBtn);
        }


        const title = document.createElement("h2");
        title.textContent = `${item.brand}  ${item.name}`;
        fragranceDiv.appendChild(title);

        const scentProfile = document.createElement("p");
        scentProfile.textContent = `Scent Profile:  ${item.scent_profile}`;
        fragranceDiv.appendChild(scentProfile);

        const username = document.createElement("p");
        username.textContent = `Posted by: ${item.username}`;
        fragranceDiv.appendChild(username);

        fragranceList.appendChild(fragranceDiv);
    });
}

const loginbtn = document.getElementById('login');
const createNew = document.getElementById('new');
const collection = document.getElementById('collection');

if(localStorage.getItem('token')){
    loginbtn.innerText = "Log Out";
    loginbtn.addEventListener('click', ()=> {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.reload();
    })
    createNew.addEventListener('click', ()=> {
        window.location.href = "/API-Development-Assignment-Fillip/createNew/createNew.html";
    })
    collection.addEventListener('click', ()=> {
        window.location.href = "/API-Development-Assignment-Fillip/collection/collection.html";
    })
}else {
    loginbtn.innerText = "Log In";
    createNew.style.display = "none";
    collection.style.display = "none"
    loginbtn.addEventListener('click', ()=> {
        window.location.href = "/API-Development-Assignment-Fillip/login/login.html";
    });
}

getData();