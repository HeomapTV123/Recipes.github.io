// Login Form 
const loginForm = document.getElementById("loginForm");

// Sign Up Form
const signUpForm = document.getElementById("signUpForm");

// Log Out Button
const logoutBtn = document.querySelector(".logout-btn");

// Dashboard Button
const dashboardBtn = document.getElementById("dashboard-btn");

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
        if(result.role === 'admin') {
            window.location.href = "./adminDashboard.html";
        }
        else {
            window.location.href = "./mainAfterLogin.html";
        }
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

    if(!toggleBtn || !passwordField) {
        return;
    }

    toggleBtn.addEventListener("click", function() {
        // Toggle type attribute
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
    
        // Toggle the eye icon and container class for styling
        if(passwordContainer) {
            passwordContainer.classList.toggle('active');
        }
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
        const response = await fetch ('http://localhost:5000/save', {
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
                window.location.href = "/html/login.html";
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

async function removeFromFavorites(recipeId) {
    try {
        const response = await fetch (`http://localhost:5000/unsave/${recipeId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if(!response.ok) {
            if(response.status === 401) {
                alert(result.message);
                window.location.href = "/html/login.html";
                return false;
            }
            
            throw new Error(result.message || result.error || "Unknown error occurred");
        }
        alert(result.message);
        return true;

    } catch (error) {
        alert("Failed to delete recipe: " + error.message);
        return false;
    }    
}

// HANDLE FAVORITE & UNFAVORITE BUTTON CLICKS
document.addEventListener("click", async function(e) {
    const btn = e.target.closest('.favorite-btn');

    if(btn) {
        e.preventDefault();
        e.stopPropagation();

        const recipeId = btn.dataset.recipeId;
        const icon = btn.querySelector('i');
        
        // CHECK: Is the button currently active (red)?
        const isAlreadySaved = btn.classList.contains('active');

        if (isAlreadySaved) {
            // 1. REMOVE FROM FAVORITES
            const isSuccess = await removeFromFavorites(recipeId);
            
            if (isSuccess) {
                // Remove visual active state
                btn.classList.remove('active');
                icon.classList.remove('fas'); // Solid heart
                icon.classList.add('far');    // Empty heart
                // Check if the URL contains "saves.html"
                if(window.location.href.includes("saves.html")) {
                    window.location.reload();
                }
            }
        } else {
            // 2. ADD TO FAVORITES
            const isSuccess = await addToFavorites(recipeId);

            if (isSuccess) {
                // Add visual active state
                btn.classList.add('active');
                icon.classList.remove('far'); // Empty heart
                icon.classList.add('fas');    // Solid heart
            }
        }
    }
});

// Get all recipes function (mainAfterLogin)
async function getAllRecipes() {
    try {
        const response = await fetch('http://localhost:5000/recipes', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json() 
    } catch (error) {
        console.error("Error fetching recipes: ", error);
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
        console.error("Error fetching favorite recipes: ", error);
        return [];
    }
}

// Get all categories
async function getAllCatergories() {
    try {
        const response = await fetch('http://localhost:5000/recipes/categories');

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching categories", error);
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
                <a href="#" class="recipe-link" onclick="openRecipe(${recipe.recipe_id})">
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
                <a href="#" class="recipe-link" onclick="openRecipe(${recipe.recipe_id})">
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
                <a href="#" class="recipe-link" onclick="openRecipe(${recipe.recipe_id})">
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

// Dropdown menu for categories (addRecipeForm.html)
async function dropdownCategories() {
    const container = document.getElementById("category-select");
    
    if(!container) {
        return;
    }

    const categories = await getAllCatergories();

    console.log(categories);

    // Clear old recipes
    container.innerHTML = `<option value="">--Choose a category--</option>`;

    if (!categories || categories.length === 0) {
        return;
    }

    categories.forEach(category => {
        const option = document.createElement("option");

        // set the value to category name
        option.value = category.name;

        // set the text content to category name
        option.textContent = category.name;

        container.appendChild(option);
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
                <div class="hero-card">
                    <img src="${recipe.image_url}" onclick="openRecipe(${recipe.recipe_id})">
                    <div class="hero-info" onclick="openRecipe(${recipe.recipe_id})">
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

// Open recipe redirects to recipe.html
window.openRecipe = function(id) {
    window.location.href = `/html/recipe.html?id=${id}`;
}

// Display Search Results
async function displaySearchResults() {
            // get the keyword from the URL (?keyword=chicken)
            const params = new URLSearchParams(window.location.search);
            const keyword = params.get('query');

            const resultsContainer = document.getElementById("results-container");
            const searchTermDisplay = document.getElementById("search-term-display");
            if(!keyword) {
                resultsContainer.innerHTML = `
                <p>No search keyword provided</p>
                `;
                return;
            }

            if(searchTermDisplay) {
                searchTermDisplay.innerText = `Showing results for: "${keyword}"`;
            }

            try {
                const response = await fetch('http://localhost:5000/search', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ keyword: keyword })
                });

                const data = await response.json();

                // clear the loading text
                resultsContainer.innerHTML = '';

                if(response.status === 404 || !data.recipes || data.recipes.length === 0) {
                    resultsContainer.innerHTML = "<p>No recipes found.</p>";
                    return;
                }

                data.recipes.forEach(recipe => {
                    const totalTime = recipe.prep_time + recipe.cook_time;
                    const timeDisplay = totalTime < 60 
                    ? totalTime + " minutes" 
                    : (Math.round(totalTime / 60) + (Math.round(totalTime / 60) > 1 ? " hours" : " hour"));
                    
                    const card = document.createElement("div");
                    card.classList.add("recipe-card");

                    card.innerHTML = `
                    <div style="position: relative;">
                        <a href="#" class="recipe-link" onclick="openRecipe(${recipe.recipe_id})">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                            <h3>${recipe.title}</h3>
                            <p>${timeDisplay}</p> 
                        </a>
                        <button class="favorite-btn" data-recipe-id="${recipe.recipe_id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    `;
                    resultsContainer.appendChild(card);
                });
            } catch (error) {
                console.error("Error: ", error);
                resultsContainer.innerHTML = "<p>Something went wrong.</p>"
            }
}

// Search function
function searchForRecipe(keyword) {
    if(!keyword) return;

    const encodedKeyword = encodeURIComponent(keyword);

    window.location.href = `/html/search.html?query=${encodedKeyword}`;
}

// Handle search field input
const searchField = document.querySelector(".search-input");
if(searchField) {
searchField.addEventListener("keydown", (e) => {
    if(e.key === 'Enter') {

        e.preventDefault();

        const searchInput = searchField.value;
        searchForRecipe(searchInput);
    }
});
}

// Authentication check
async function checkLoginStatus() {
    try {
        const response = await fetch('http://localhost:5000/check-auth');
        const data = await response.json();

        // Update login, register, and logout buttons
        updateUI(data.isLoggedIn, data.role);


        // redirect if trying to access protected pages
        protectPage(data.isLoggedIn);
    } catch (error) {
        console.error("Failed to check authentication: ", error);
    }
}

// Update UI of login, register, and logout button
function updateUI(isLoggedIn, role) {

    const adminDashboardBtn = document.getElementById("adminDashboardBtn");
    const loginLink = document.getElementById("nav-login");
    const signUpLink = document.getElementById("nav-signup");
    const logOutLink = document.querySelector(".logout-btn");
    const favBtn = document.querySelector(".fav-btn");
    const userIcon = document.querySelector(".user");

    if(isLoggedIn && role === "admin") {
        adminDashboardBtn.innerHTML = `
            <button class="dashboard-btn" onclick="redirectToDashboard()">Dashboard</button>        
        `;
        loginLink.style.display = "none";
        signUpLink.style.display = "none";
        logOutLink.style.display = "block";
        favBtn.style.display = "block";
        userIcon.style.display = "block";
    }
    else if(isLoggedIn) {
        loginLink.style.display = "none";
        signUpLink.style.display = "none";
        logOutLink.style.display = "block";
        favBtn.style.display = "block";
        userIcon.style.display = "block";
    }
    else {
        loginLink.style.display = "block";
        signUpLink.style.display = "block";
        logOutLink.style.display = "none";
        favBtn.style.display = "none";
        userIcon.style.display = "none";        
    }
}

function protectPage(isLoggedIn) {
    // current file name
    const path = window.location.pathname;
    const page = path.split("/").pop();

    const protectedPages = ["saves.html", "mainAfterLogin.html"];

    const guestPages = ["login.html", "signup.html"];

    // if not logged in -> redirect to login page
    if(!isLoggedIn && protectedPages.includes(page)) {
        alert("You must be login to view this page.");
        window.location.href = "login.html";
    }

    // if logged in but tried to access guest pages -> redirect to mainAferLogin.html
    if(isLoggedIn && guestPages.includes(page)) {
        window.location.href = "mainAfterLogin.html";
    }
}

// Upload image field (addRecipeForm)
const cropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file")
const imageView = document.getElementById("img-view");

if(inputFile) {
    inputFile.addEventListener("change", uploadImage);
}

function uploadImage() {
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.textContent = "";
    imageView.style.border = "none";
}

// Add an ingredient in the recipe form
const addIngredientBtn = document.querySelector(".add-ingredient-btn");
if(addIngredientBtn) {
    addIngredientBtn.addEventListener("click", function(e) {
        e.preventDefault();
        addIngredient();
    });
}

function addIngredient() {
    const container = document.querySelector(".ingredient-quantity-container");

    if(!container) {
        return;
    }

    const ingredient = document.createElement("div");
    ingredient.classList.add("ingredient-quantity");

    ingredient.innerHTML = `
                    <div class="ingredient">
                        <label for="ingredient">Ingredient</label>
                        <input type="text" name="ingredient[]" aria-describedby="helpId">
                    </div>
                    <div class="quantity">
                        <label for="quantity">Quantity</label>
                        <input type="number" name="quantity[]" aria-describedby="helpId">
                    </div>
                    <div class="unit">
                        <label for="unit">Unit</label>
                        <input type="text" name="unit[]" aria-describedby="helpId">
                    </div>
                    <button type="button" class="delete-ingredient-btn">
                        Delete
                    </button>
    `;

    container.appendChild(ingredient);
}

// Delete an ingredient
const container = document.querySelector(".ingredient-quantity-container");
if(container) {
    container.addEventListener("click", function(e) {
        if(e.target.classList.contains("delete-ingredient-btn")) {
            e.preventDefault();

            // Remove the ingredient block
            e.target.closest(".ingredient-quantity").remove();
        }
    });
}

// Add ingredient tags
let ul;
let input;

let tags = [];

function createTag() {
    ul.querySelectorAll("li").forEach(li => li.remove()); // remove duplicate tags
        tags.slice().reverse().forEach(tag => {
            let liTag = `
            <li>${tag} <i class="uit uit-multiply" onclick="removeTag(this, '${tag}')"></i></li>
            `;
            ul.insertAdjacentHTML("afterbegin", liTag); // inserting li inside ul tag
            });
}

window.removeTag = function(element, tag) {
    let index = tags.indexOf(tag); // getting the removed tag index
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)]; // removing or excluding selected tag from an array
    element.parentElement.remove(); // removing li of removed tag
}

function addTag(e) {
    if(e.key == "Enter") {
        e.preventDefault();
        let tag = e.target.value.replace(/\s+/g, ' '); // removing unwanted spaces from user tag
        if(tag.length > 1 && !tags.includes(tag)) { // if tag length is greater than 1 and tag does not exist already
            tag.split(',').forEach(tag => { // splitting each tag from comma (,)
                tags.push(tag); // adding each tag inside array tags
                createTag();
            });
        }
        e.target.value = "";
    }
}

if(input) {
    input.addEventListener("keydown", addTag);
}

// Add Cooking Steps Section
const addStepBtn = document.getElementById("addStepBtn");
let stepIndex = 0;

// Create Cooking Step HTML
function createStep(index) {
    const stepDiv = document.createElement("div");
    stepDiv.classList.add("cooking-step");
    stepDiv.innerHTML = `
                        <div class="step-header">
                            <h4>Step ${index + 1}</h4>
                            <button type="button" class="delete-step-btn">Delete</button>
                        </div>
        
                        <div class="step-form-group">
                            <label class="step-label">Instruction</label>
                            <textarea class="step-input" name="steps[${index}][instruction]" rows="3" required 
                            placeholder="Describe this step..."></textarea>            
                        </div>

                        <div class="step-row">
                            <div class="step-form-group step-col-small">
                                <label class="step-label">Duration (mins)</label>
                                <input type="number" class="step-input" name="steps[${index}][duration]" placeholder="0">
                            </div>
                            <div class="step-form-group step-col-small">
                                <label class="step-label">Chef's Tip (Optional)</label>
                                <input type="text" class="step-input" name="steps[${index}][tip]">
                            </div> 
                        </div>
    `;
    return stepDiv;
}

// Add cooking steps into container
function addCookingStep() {
    const container = document.getElementById("steps-container");
    if(!container) {
        return;
    }

    const newStep = createStep(stepIndex);
    container.appendChild(newStep);

    stepIndex++;
}

if(addStepBtn) {
    addStepBtn.addEventListener("click", addCookingStep);
}

// Update step index (2 -> 1)
function updateStepIndex() {
    const steps = document.querySelectorAll(".cooking-step");

    // Loop through every step in the DOM
    steps.forEach((step, index) => {
        // update the visual header
        const header = step.querySelector(".step-header h4");
        if(header) {
            header.textContent = `Step ${index + 1}`;
        }

        // changes "steps[5][instruction] to steps[2][instruction]"
        const inputs = step.querySelectorAll("input, textarea, select");
        inputs.forEach(input => {
            const name = input.getAttribute("name");
            if(name) {
                // find steps[any_number] and replace with steps[current_index]
                const newName = name.replace(/steps\[\d+\]/, `steps[${index}]`);
                input.setAttribute("name", newName);
            }
        });
    });

    stepIndex = steps.length;
}

// Delete cooking step from container
const stepsContainer = document.getElementById("steps-container");
if(stepsContainer) {
    stepsContainer.addEventListener("click", function(e) {
        if(e.target.classList.contains("delete-step-btn")) {
            e.preventDefault();
            e.target.closest(".cooking-step").remove();
            updateStepIndex();
        }
    });
}


const addRecipeForm = document.getElementById("addRecipeForm");

if (addRecipeForm) {
    addRecipeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // =========================
        // 1. CATEGORY VALIDATION
        // =========================
        const category = document.getElementById("category-select").value;

        if (!category) {
            alert("Please choose a category before submitting the recipe.");
            return; // ⛔ STOP submission
        }

        const categories = [category];

        // =========================
        // 2. COLLECT FORM DATA
        // =========================
        const title = document.querySelector("[name='recipeName']").value;
        const prep_time = document.querySelector("[name='recipePrepTime']").value;
        const cook_time = document.querySelector("[name='recipeCookTime']").value;

        // Ingredients
        const ingredients = [...document.querySelectorAll(".ingredient-quantity")]
            .map(row => {
                const name = row.querySelector("input[name='ingredient[]']")?.value;
                const quantity = row.querySelector("input[name='quantity[]']")?.value;
                const unit = row.querySelector("input[name='unit[]']")?.value;

                if (!name) return null;
                return { name, quantity, unit };
            })
            .filter(Boolean);

        // Steps
        const steps = [...document.querySelectorAll(".cooking-step")].map(step => ({
            instruction: step.querySelector("textarea")?.value,
            duration: step.querySelector("input[type='number']")?.value,
            tip: step.querySelector("input[type='text']")?.value
        }));

        // =========================
        // 3. SEND POST REQUEST
        // =========================
        const response = await fetch("http://localhost:5000/recipes", {
            method: "POST",
            credentials: "include", // 🔥 REQUIRED
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                prep_time: Number(prep_time),
                cook_time: Number(cook_time),
                categories,
                ingredients,
                steps,
                tags: tags
            })
        });

        const result = await response.json();

        if(response.ok) {
            alert("Success! Recipe saved.");
            window.location.href = "/html/mainAfterLogin.html";
        }
        else {
            console.error(result);
            alert("Error: " + (result.message || "Failed to save recipe"));
        }
    }); 
}

// ADMIN DASHBOARD
// initialize the admin dashboard
async function initAdminDashboard() {
    try {
        // verify if user is admin
        const response = await fetch('http://localhost:5000/check-auth');
        const user = await response.json();

        if(!user.isLoggedIn || user.role !== "admin") {
            alert("Access Denied: Admin Only");
            window.location.href = "/html/login.html";
            return;
        }
    } catch (error) {
        console.error(`Error: `, error);
        window.location.href = "/html/login.html";
    }

    // After authentication is done, load the user list and recipe list
    loadUsers();
    loadAdminRecipes();
}

async function loadUsers() {
    try {
        const response = await fetch('http://localhost:5000/admin/users');
        const users = await response.json();

        document.getElementById("totalUsers").innerText = users.length;
        const tbody = document.getElementById("userTableBody");
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    ${user.role === 'admin' ? '<span>(Admin)</span>' : 
                    `<button class="btn-delete" onclick="deleteUser(${user.user_id})">Delete User</button>`}
                </td>            
            `;
            tbody.appendChild(tr);
        })

    } catch (error) {
        console.error("Error loading users: ", error);
    }
}

async function loadAdminRecipes() {
    try {
        const response = await fetch('http://localhost:5000/recipes');
        const recipes = await response.json();

        document.getElementById("totalRecipes").innerText = recipes.length;
        const tbody = document.getElementById("recipeTableBody");
        tbody.innerHTML = '';
        
        recipes.forEach(recipe => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${recipe.recipe_id}</td>
                <td>${recipe.title}</td>
                <td>${recipe.user_id}</td>
                <td>${recipe.date_published}</td>
                <td>
                    <button class="btn-delete" onclick="deleteRecipe(${recipe.recipe_id})">Delete</button>
                </td>            
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading recipes: ", error);
    }
}

window.deleteUser = async function(id) {
    if(!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    try {
        const response = await fetch(`http://localhost:5000/admin/user/${id}`, {
            method: "DELETE"
        });
        if(response.ok) {
            alert("User deleted successfully.");
            loadUsers(); // refresh users table
        }
        else {
            console.log(response.status);
            alert("Error deleting user");
        }
    } catch (error) {
        console.error(error);
    }
}

window.deleteRecipe = async function(id) {
    if(!confirm("Are you sure you want to delete this recipe?. This cannot be undone.")) return;

    try {
        const response = await fetch(`http://localhost:5000/admin/recipe/${id}`, {
            method: "DELETE"
        });
        if(response.ok) {
            alert("Recipe deleted successfully");
            loadAdminRecipes(); // refresh the recipe list
        }
    } catch (error) {
        console.error(error);
    }
}

window.switchTab = function (tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
            
    if(tabName === 'users') {
        document.getElementById('usersSection').classList.remove('hidden');
        document.getElementById('recipesSection').classList.add('hidden');
    } else {
            document.getElementById('usersSection').classList.add('hidden');
            document.getElementById('recipesSection').classList.remove('hidden');
        }
    }

window.redirectToDashboard = function() {
    window.location.href = "/html/adminDashboard.html";
}

window.addEventListener("DOMContentLoaded", () => {
    
    // Check if we are on the admin dashboard page
    if(window.location.pathname.includes("adminDashboard.html")) {
        initAdminDashboard();
    }

    else {
        // run auth check first
        checkLoginStatus();
        loadHeroSlider("Breakfast");
        
        displayRecipes();
        displayRecipesByCategory("Breakfast", "slider-breakfast");
        displayRecipesByCategory("Lunch", "slider-lunch");
        displayRecipesByCategory("Dinner", "slider-dinner");
        displayRecipesByCategory("Chicken", "slider-chicken");
        displayRecipesByCategory("Vegan", "slider-vegan");
        displayRecipesByCategory("Christmas", "slider-christmas");
        
        displayFavorites(); // saves.html
        displaySearchResults(); // search.html

        togglePassword();
        dropdownCategories(); // addRecipeForm.html

        ul = document.getElementById("tag-list");
        if(!ul) {
            return;
        }

        input = ul.querySelector(".tag-input");
        input.addEventListener("keydown", addTag);
    }
});






