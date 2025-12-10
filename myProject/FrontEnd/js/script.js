// Login Form 
const loginForm = document.getElementById("loginForm");

// Sign Up Form
const signUpForm = document.getElementById("signUpForm");

// Log Out Button
const logoutBtn = document.querySelector(".logout-btn");

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

    const response = await fetch("http://localhost:5000/login", {
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


    const response = await fetch("http://localhost:5000/signup", {
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
            const response = await fetch('http://localhost:5000/logout', {
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

// Add to favorites()
async function addToFavorites(recipeId) {
    try {
        const response = await fetch ('http://localhost:5000/saves', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipeId: recipeId
            })
        });

        const result = await response.json();

        if(!response.ok) {
            if(response.status === 401) {
                alert(result.message);
                window.location.href = "html/login.html";
                return false;
            }
            
            throw new Error(result.message || result.error || "Unknown error occurred");
        }
        alert(result.message);
        return true;

    } catch (error) {
        console.error("Save field: ", error);
        alert("Failed to save recipe: " + error.message);
        return false;
    }
}

// HANDLE FAVORITE BUTTON CLICKS
document.addEventListener("click", async function(e) {
    const btn = e.target.closest('.favorite-btn');

    if(btn) {
        e.preventDefault();
        e.stopPropagation();


        console.log("Button dataset:" , btn.dataset);
        const recipeId = btn.dataset.recipeId;
        console.log("recipeId", recipeId);
        const icon = btn.querySelector('i');
        
        const isSuccess = await addToFavorites(recipeId);

        if(isSuccess) {
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
    }
});

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

// Get all favorited recipes
async function getAllFavorites() {
    try {
        const response = await fetch('http://localhost:5000/saves');

        if(response.status === 401) {
            console.log("User not logged in");
            return [];
        }

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching favorite recipes: ", err);
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
        const totalTime = recipe.prep_time + recipe.cook_time;
        const timeDisplay = totalTime < 60 
            ? totalTime + " minutes" 
            : (Math.round(totalTime / 60) + (Math.round(totalTime / 60) > 1 ? " hours" : " hour"));
        card.innerHTML = `
            <div style="position: relative;">
                <a href="#" class="recipe-link">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${timeDisplay}</p> 
                </a>
                <button class="favorite-btn" data-recipe-id="${recipe.recipe_id}">
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
        const totalTime = recipe.prep_time + recipe.cook_time;
        const timeDisplay = totalTime < 60 
            ? totalTime + " minutes" 
            : (Math.round(totalTime / 60) + (Math.round(totalTime / 60) > 1 ? " hours" : " hour"));
        // Set the inner HTML
        card.innerHTML = `
            <div style="position: relative;">
                <a href="#" class="recipe-link">
                    <img src="https://www.graigfarm.co.uk/cdn/shop/products/500_1400x.jpg?v=1616770783" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${timeDisplay}</p> 
                </a>
                <button class="favorite-btn" data-recipe-id="${recipe.recipe_id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Display favorites in saves.html
async function displayFavorites() {
    const container = document.getElementById("savedRecipesContainer");
    
    if(!container) {
        return;
    }

    const recipes = await getAllFavorites();

    // Clear old recipes
    container.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>No recipes found favorites</p>`;
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        const totalTime = recipe.prep_time + recipe.cook_time;
        const timeDisplay = totalTime < 60 
            ? totalTime + " minutes" 
            : (Math.round(totalTime / 60) + (Math.round(totalTime / 60) > 1 ? " hours" : " hour"));
        // Set the inner HTML
        card.innerHTML = `
            <div style="position: relative;">
                <a href="#" class="recipe-link">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${timeDisplay}</p> 
                </a>
                <button class="favorite-btn" data-recipe-id="${recipe.recipe_id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Hero Slider (main.html)
async function loadHeroSlider(category) {
    fetch(`http://localhost:5000/recipes/category/${category}`)
        .then(res => res.json())
        .then(data => {
            const slider = document.getElementById("hero-slider");
            const title = document.getElementById("hero-title");

            title.textContent = `${category} Recipes`;

            if (!data.length) {
                slider.innerHTML = `<p>No recipes found for ${category}</p>`;
                return;
            }
        
            // MOVED LOGIC INSIDE THE MAP FUNCTION
            slider.innerHTML = data.map(recipe => {
                const totalTime = recipe.prep_time + recipe.cook_time;
                const timeDisplay = totalTime < 60 
                    ? totalTime + " minutes" 
                    : (Math.round(totalTime / 60) + (Math.round(totalTime / 60) > 1 ? " hours" : " hour"));

                return `
                <div class="hero-card" onclick="openRecipe(${recipe.recipe_id})">
                    <img src="${recipe.image_url}">
                    <div class="hero-info">
                        <h3>${recipe.title}</h3>
                        <p>${timeDisplay}</p>
                    </div>
                    <button class="favorite-btn" data-recipe-id="${recipe.recipe_id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                `;
            }).join("");

            // ⭐ ADD BUTTON LOGIC HERE (after loading slider content)
            const heroSlider = document.getElementById("hero-slider");
            const btnLeft = document.getElementById("hero-left");
            const btnRight = document.getElementById("hero-right");

            btnLeft.onclick = () => {
                heroSlider.scrollBy({ left: -350, behavior: "smooth" });
            };

            btnRight.onclick = () => {
                heroSlider.scrollBy({ left: 350, behavior: "smooth" });
            };
        });
}


// Dropdown → Updates hero slider
document.querySelectorAll(".category-link").forEach(link => {
    link.addEventListener("click", () => {
        const cat = link.dataset.category;
        loadHeroSlider(cat);
    });
});


window.addEventListener("DOMContentLoaded", () => {
    displayRecipes();
    displayRecipesByCategory("Breakfast", "slider-breakfast");
    displayRecipesByCategory("Lunch", "slider-lunch");
    displayRecipesByCategory("Dinner", "slider-dinner");
    displayRecipesByCategory("Chicken", "slider-chicken");
    displayRecipesByCategory("Vegan", "slider-vegan");
    displayRecipesByCategory("Christmas", "slider-christmas");
    displayFavorites();
    loadHeroSlider("Breakfast");
    togglePassword();
});

window.openRecipe = function(id) {
    window.location.href = `./html/recipe.html?id=${id}`;
}

