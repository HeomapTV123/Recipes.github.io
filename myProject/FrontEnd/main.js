import { loadHeroSlider } from "./components/heroSlider.js";
import { loadCategoryIntoSlider } from "./components/categorySlider.js";

// Default hero = Breakfast
loadHeroSlider("Breakfast");

// Dropdown → Updates hero slider
document.querySelectorAll(".category-link").forEach(link => {
    link.addEventListener("click", () => {
        const cat = link.dataset.category;
        loadHeroSlider(cat);
    });
});

// Load static sliders
loadCategoryIntoSlider("Breakfast", "slider-breakfast");
loadCategoryIntoSlider("Lunch", "slider-lunch");
loadCategoryIntoSlider("Dinner", "slider-dinner");
loadCategoryIntoSlider("Chicken", "slider-chicken");
loadCategoryIntoSlider("Vegan", "slider-vegan");
loadCategoryIntoSlider("Christmas", "slider-christmas");

// Static slider buttons
document.querySelectorAll(".slider-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const slider = document.getElementById(btn.dataset.target);
        const amount = btn.classList.contains("left") ? -300 : 300;
        slider.scrollBy({ left: amount, behavior: "smooth" });
    });
});

