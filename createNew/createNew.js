document.getElementById('createNew').addEventListener("submit", async (e)=>{
    e.preventDefault();
    const brand = document.querySelector("#brand").value;
    const name = document.querySelector("#name").value;
    const scent_profile = document.querySelector("#scent_profile").value;
    const img_url = document.querySelector("#image_url").value;
    const user_id = localStorage.getItem('userId');

    const body = {
        brand: brand,
        name : name,
        scent_profile : scent_profile,
        img_url : img_url,
        user_id : user_id,
    }
    console.log(body)

    const response = await fetch("http://localhost:1337/fragrances", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    window.location.href = "../index.html"
})