export function loadHeroSlider(category) {
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

            slider.innerHTML = data.map(recipe => `
                <div class="hero-card" onclick="openRecipe(${recipe.recipe_id})">
                    <img src="${recipe.image_url || './assets/default.jpg'}">
                    <div class="hero-info">
                        <h3>${recipe.title}</h3>
                        <p>${recipe.prep_time + recipe.cook_time} mins</p>
                    </div>
                </div>
            `).join("");

            // ⭐ ADD BUTTON LOGIC HERE (after loading slider content)
            const heroSlider = document.getElementById("hero-slider");
            const btnLeft = document.getElementById("hero-left");
            const btnRight = document.getElementById("hero-right");

            // btnLeft.onclick = () => {
            //     heroSlider.scrollBy({ left: -350, behavior: "smooth" });
            // };

            // btnRight.onclick = () => {
            //     heroSlider.scrollBy({ left: 350, behavior: "smooth" });
            // };
        });
}

// Make openRecipe available globally
window.openRecipe = function(id) {
    window.location.href = `./html/recipe.html?id=${id}`;
}
