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
                <a href="#" class="recipe-card" onclick="openRecipe(${recipe.recipe_id})">
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

function openRecipe(id) {
    window.location.href = `recipe.html?id=${id}`;
}

