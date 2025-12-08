// Login Form 
const loginForm = document.getElementById("loginForm");

// Sign Up Form
const signUpForm = document.getElementById("signUpForm");

// Log Out Button
const logoutBtn = document.querySelector(".logout-btn");


// // Load recipes into a specific slider
// function loadCategory(categoryName, sliderId) {
//     fetch(`http://localhost:5000/recipes/category/${categoryName}`)
//         .then(res => res.json())
//         .then(recipes => {
//             const slider = document.getElementById(sliderId);

//             if (!recipes || recipes.length === 0) {
//                 slider.innerHTML = `<p>No recipes found for ${categoryName}</p>`;
//                 return;
//             }

//             slider.innerHTML = recipes.map(recipe => `
//                 <a href="#" class="recipe-card">
//                     <img src="${recipe.image_url}" alt="${recipe.title}">
//                     <div class="recipe-info">
//                         <h3>${recipe.title}</h3>
//                             <p>${ recipe.prep_time + recipe.cook_time < 60  ?  recipe.prep_time + recipe.cook_time + " minutes" : 
//                             (Math.round((recipe.prep_time + recipe.cook_time) / 60) > 1 ? Math.round((recipe.prep_time + recipe.cook_time) / 60) + " hours" 
//                             : Math.round((recipe.prep_time + recipe.cook_time) / 60) + " hour")}</p>                     
//                     </div>
//                 </a>
//             `).join("");
//         })
//         .catch(err => console.error(`Error loading ${categoryName}:`, err));
// }

// // Load all sliders at once
// loadCategory("Asian", "slider-breakfast");
// loadCategory("Quick & Easy", "slider-lunch");
// loadCategory("Dinner", "slider-dinner");
// loadCategory("Chicken", "slider-chicken");
// loadCategory("Vegan", "slider-vegan");
// loadCategory("Christmas", "slider-christmas");

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

// Add recipes to favorites
document.addEventListener("click", function(e) {
    const btn = e.target.closest('.favorite-btn');

    if(btn) {
        e.preventDefault();
        e.stopPropagation();

        const icon = btn.querySelector('i');

        btn.classList.toggle('active');

        if(btn.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
        else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    }
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

// Show/Hide Password
function togglePassword() {
    const toggleBtn = document.getElementById("toggleBtn");
    const passwordContainer = document.getElementById("passwordContainer");
    const passwordField = document.querySelector('.password');
    toggleBtn.addEventListener("click", function() {
        // Toggle type attribute
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
    
        // Toggle the eye icon and container class for styling
        passwordContainer.classList.toggle('active');
    });
    }


// Log out function
if(logoutBtn) {
    logoutBtn.addEventListener("click", async () => {

        try {
            const response = await fetch('http://localhost:5000/auth/logout', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
        });

            if(!response.ok) {
                console.error('Logout failed');
                throw new Error(`Error: ${response.status}`);
            }
            else {
                // Redirect user to main page
                window.location.href = "./main.html";
            }

            return response.json();
        } catch (error) {
            console.error("Error: ", err);
            
        }

    });
}




// Get all recipes function (mainAfterLogin)
async function getAllRecipes() {
    try {
        const response = await fetch('http://localhost:5000/recipes');

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json() 
    } catch (error) {
        console.error("Error fetching recipes: ", err);
        return [];
    }
} 

// Get recipes by category
async function getRecipesByCategory(category) {
    try {
        const response = await fetch(`http://localhost:5000/recipes/category/${category}`);

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching recipes by category: ", category + err);
        return [];
    }
}

// Display all recipes
async function displayRecipes() {
    const container = document.querySelector('.recipe-container');
    const recipes = await getAllRecipes();

    // Clear container first
    container.innerHTML = "";

    if (!recipes || recipes.length === 0) {
                container.innerHTML = `<p>No recipes found</p>`;
                return;
            }

    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        // 2. Set the inner HTML
        // Notice we use 'far fa-heart' (Regular/Outline) by default
        card.innerHTML = `
            <div style="position: relative;">
                <a href="#" class="recipe-link">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${ recipe.prep_time + recipe.cook_time < 60  ?  recipe.prep_time + recipe.cook_time + " minutes" : 
                        (Math.round((recipe.prep_time + recipe.cook_time) / 60) > 1 ? Math.round((recipe.prep_time + recipe.cook_time) / 60) + " hours" 
                        : Math.round((recipe.prep_time + recipe.cook_time) / 60) + " hour")}</p> 
                </a>
                <button class="favorite-btn" data-id="${recipe.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Display recipes by category
async function displayRecipesByCategory(category, sliderId) {
    const container = document.getElementById(sliderId);
    const recipes = await getRecipesByCategory(category);

    // Clear old recipes
    container.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>No recipes found in ${categoryName}</p>`;
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        // Set the inner HTML
        card.innerHTML = `
            <div style="position: relative;">
                <a href="#" class="recipe-link">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${ recipe.prep_time + recipe.cook_time < 60  ?  recipe.prep_time + recipe.cook_time + " minutes" : 
                        (Math.round((recipe.prep_time + recipe.cook_time) / 60) > 1 ? Math.round((recipe.prep_time + recipe.cook_time) / 60) + " hours" 
                        : Math.round((recipe.prep_time + recipe.cook_time) / 60) + " hour")}</p> 
                </a>
                <button class="favorite-btn" data-id="${recipe.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;

        container.appendChild(card);
    });

}


window.addEventListener("DOMContentLoaded", () => {
    displayRecipes();
    displayRecipesByCategory("Breakfast", "slider-breakfast");
    displayRecipesByCategory("Lunch", "slider-lunch");
    displayRecipesByCategory("Dinner", "slider-dinner");
    displayRecipesByCategory("Chicken", "slider-chicken");
    displayRecipesByCategory("Breakfast", "slider-vegan");
    displayRecipesByCategory("Breakfast", "slider-christmas");

    togglePassword();
});
