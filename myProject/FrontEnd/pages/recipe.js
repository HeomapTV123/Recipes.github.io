// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

// Load recipe information
fetch(`http://localhost:5000/recipes/${recipeId}`)
    .then(res => res.json())
    .then(recipe => {
        document.getElementById("recipe-title").textContent = recipe.title;
        document.getElementById("recipe-image").src = recipe.image_url;
        document.getElementById("recipe-image").alt = recipe.title;
    });

// Load ingredient list
fetch(`http://localhost:5000/recipes/${recipeId}/ingredients`)
    .then(res => res.json())
    .then(data => {
        const ul = document.getElementById("ingredient-list");
        ul.innerHTML = data.map(i => `
            <li>${i.quantity} ${i.unit} ${i.name}</li>
        `).join("");
    });

// Load steps
fetch(`http://localhost:5000/recipes/${recipeId}/steps`)
    .then(res => res.json())
    .then(steps => {
        const div = document.getElementById("step-list");
        div.innerHTML = steps.map(step => `
            <div class="step-card">
                <h3>Step ${step.step_number}</h3>
                <p>${step.instruction}</p>
            </div>
        `).join("");
    });
