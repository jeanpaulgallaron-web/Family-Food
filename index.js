const modal = document.getElementById("familyModal");
const openBtn = document.getElementById("familyOpenBtn");
const closeBtn = document.getElementById("familyCloseBtn");

openBtn.addEventListener("click", () => modal.classList.add("active"));
closeBtn.addEventListener("click", () => modal.classList.remove("active"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

function updateCounts() {
  const foods = JSON.parse(localStorage.getItem("gallaron_foods_vault")) || [];
  const categories = ["Breakfast", "Lunch", "Dinner", "Midnight Snacks"];

  categories.forEach(cat => {
    const count = foods.filter(f => f.category === cat).length;
    const el = document.getElementById(`badge-${cat}`);
    if (el) el.textContent = `${count} ${count === 1 ? 'Dish' : 'Dishes'} Logged`;
  });
}

updateCounts();