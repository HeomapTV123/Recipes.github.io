// Login Form 
const loginForm = document.getElementById("loginForm");

// Sign Up Form
const signUpForm = document.getElementById("signUpForm");

// Load recipes into a specific slider
function loadCategory(categoryName, sliderId) {
    fetch(`http://localhost:5000/recipes/category/${categoryName}`)
        .then(res => res.json())
        .then(recipes => {
            const slider = document.getElementById(sliderId);

            if (!recipes || recipes.length === 0) {
                slider.innerHTML = `<p>No recipes found for ${categoryName}</p>`;
                return;
            }

            slider.innerHTML = recipes.map(recipe => `
                <a href="#" class="recipe-card">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <div class="recipe-info">
                        <h3>${recipe.title}</h3>
                        <p>${recipe.prep_time + recipe.cook_time} mins</p>
                    </div>
                </a>
            `).join("");
        })
        .catch(err => console.error(`Error loading ${categoryName}:`, err));
}

// Load all sliders at once
loadCategory("Breakfast", "slider-breakfast");
loadCategory("Lunch", "slider-lunch");
loadCategory("Dinner", "slider-dinner");
loadCategory("Chicken", "slider-chicken");
loadCategory("Vegan", "slider-vegan");
loadCategory("Christmas", "slider-christmas");

// Slider scroll buttons
document.querySelectorAll(".slider-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const sliderId = btn.getAttribute("data-target");
        const slider = document.getElementById(sliderId);

        slider.scrollBy({
            left: btn.classList.contains("left") ? -300 : 300,
            behavior: "smooth"
        });
    });
});

// If login form exists, then perform login function
if(loginForm) {
loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const usernameLogin = document.getElementById("usernameLogin").value.trim(); 
    const passwordLogin = document.getElementById("passwordLogin").value.trim(); 

    const usernameLoginError = document.getElementById("usernameLoginError");
    const passwordLoginError = document.getElementById("passwordLoginError");
    
    let isEmpty = false;

    if(usernameLogin == "" || passwordLogin == "") {
            usernameLoginError.innerHTML = `
            <p style="color:red; margin-left: 5px">Username field cannot be empty</p>
            `;
            setTimeout(() => {
                usernameLoginError.innerHTML = "";
            }, 3000);
            passwordLoginError.innerHTML = `
            <p style="color:red; margin-left: 5px">Password field cannot be empty</p>
            `;
            setTimeout(() => {
                passwordLoginError.innerHTML = "";
            }, 3000);
            isEmpty = true;
    }

    if(isEmpty) return;

    const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            name: usernameLogin,
            password_hash: passwordLogin
        })
    });

    const result = await response.json();
    if(result.message === "Login successful") {
        window.location.href = "./mainAfterLogin.html";
    }
    else {
        passwordLoginError.innerHTML = `
            <p style="color:red; margin-left: 5px">${result.message}</p>
            `;
        setTimeout(() => {
            passwordLoginError.innerHTML = "";
        }, 3000);
    }
});
}

// if signUpForm exists then perform sign up function
if(signUpForm) {
signUpForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById("usernameInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    let isEmpty = false;
    
    const usernameEl = document.getElementById("usernameError");
    const passwordEl = document.getElementById("passwordError");
    const emailEl = document.getElementById("emailError");


        if(username == "" ) {
            usernameEl.innerHTML = `
            <p style="color:red; margin-left: 5px">Username field cannot be empty</p>
            `;
            setTimeout(() => {
                usernameEl.innerHTML = "";
            }, 3000);
        }
        if(email == "") {
            emailEl.innerHTML = `
            <p style="color:red; margin-left: 5px">Email field cannot be empty</p>
            `;
            setTimeout(() => {
                emailEl.innerHTML = "";
            }, 3000);
        }
        if(password == "") {
            passwordEl.innerHTML = `
            <p style="color:red; margin-left: 5px">Password field cannot be empty</p>
            `;
            setTimeout(() => {
                passwordEl.innerHTML = "";
            }, 3000);
            isEmpty = true;
        }

    if(isEmpty) return;


    const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: username,
            email: email,
            password_hash: password
        })
    });

    const result = await response.json();

    if(result.message === "User created successfully") {
        window.location.href = "./mainAfterLogin.html";
    }
    else {
        passwordEl.innerHTML = `
        <p style="color:red; margin-left: 5px">${result.message}</p>
        `;
        setTimeout(() => {
                passwordEl.innerHTML = "";
            }, 3000);
    }
    
});
}


