export function loadCategoryIntoSlider(category, elementId) {
    fetch(`http://localhost:5000/recipes/category/${category}`)
        .then(res => res.json())
        .then(data => {
            const slider = document.getElementById(elementId);

            slider.innerHTML = data.map(r => `
                <div class="recipe-card" onclick="openRecipe(${r.recipe_id})">
                    <img src="${r.image_url || './assets/default.jpg'}">
                    <div class="recipe-info">
                        <h4>${r.title}</h4>
                        <p>${r.prep_time + r.cook_time} mins</p>
                    </div>
                </div>
            `).join("");
        });
}

