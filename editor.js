const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get('category') || 'Lunch';
const currentIcon = urlParams.get('icon') || '🍲';

let capturedBase64 = "";

document.getElementById("currentCategoryBadge").textContent = `${currentIcon} ${currentCategory}`;
document.getElementById("formTitle").textContent = `📷 Add Mom's ${currentCategory}`;
document.getElementById("galleryCategoryTitle").textContent = `${currentIcon} Saved ${currentCategory} Dishes`;

const foodForm = document.getElementById("foodForm");
const foodName = document.getElementById("foodName");
const foodDate = document.getElementById("foodDate");
const foodDesc = document.getElementById("foodDesc");
const fileInput = document.getElementById("fileInput");
const cameraInput = document.getElementById("cameraInput");
const previewContainer = document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");
const removePhotoBtn = document.getElementById("removePhotoBtn");
const foodGallery = document.getElementById("foodGallery");

foodDate.value = new Date().toISOString().split('T')[0];

function processImage(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 900;
      const scale = MAX_WIDTH / img.width;
      canvas.width = (img.width > MAX_WIDTH) ? MAX_WIDTH : img.width;
      canvas.height = (img.width > MAX_WIDTH) ? img.height * scale : img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      capturedBase64 = canvas.toDataURL("image/jpeg", 0.75);
      imagePreview.src = capturedBase64;
      previewContainer.style.display = "block";
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

fileInput.addEventListener("change", (e) => processImage(e.target.files[0]));
cameraInput.addEventListener("change", (e) => processImage(e.target.files[0]));

function resetImage() {
  capturedBase64 = "";
  imagePreview.src = "";
  previewContainer.style.display = "none";
  fileInput.value = "";
  cameraInput.value = "";
}
removePhotoBtn.addEventListener("click", resetImage);

function getStoredFood() {
  return JSON.parse(localStorage.getItem("gallaron_foods_vault")) || [];
}

function saveStoredFood(data) {
  localStorage.setItem("gallaron_foods_vault", JSON.stringify(data));
  renderGallery();
}

function renderGallery() {
  const allFoods = getStoredFood();
  const dishes = allFoods.filter(f => f.category === currentCategory);
  foodGallery.innerHTML = "";

  if (dishes.length === 0) {
    foodGallery.innerHTML = `
      <div class="empty-state">
        <p>No ${currentCategory} dishes saved yet.<br>Take a photo or upload above to save Mom's food!</p>
      </div>
    `;
    return;
  }

  dishes.forEach((dish) => {
    const card = document.createElement("div");
    card.className = "food-card";
    const mediaSrc = dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80";

    card.innerHTML = `
      <div class="card-media">
        <img src="${mediaSrc}" alt="${dish.name}" />
        <span class="badge-overlay">${dish.date}</span>
      </div>
      <div class="card-content">
        <div>
          <h4 class="dish-heading">${dish.name}</h4>
          <p class="dish-story">${dish.desc || "Cooked with love by Mom."}</p>
        </div>
        <button class="btn-trash" onclick="removeDish('${dish.id}')">Delete</button>
      </div>
    `;
    foodGallery.appendChild(card);
  });
}

foodForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newEntry = {
    id: Date.now().toString(),
    category: currentCategory,
    name: foodName.value.trim(),
    date: foodDate.value,
    desc: foodDesc.value.trim(),
    image: capturedBase64
  };

  const currentList = getStoredFood();
  currentList.unshift(newEntry);
  saveStoredFood(currentList);

  foodName.value = "";
  foodDesc.value = "";
  foodDate.value = new Date().toISOString().split('T')[0];
  resetImage();
});

window.removeDish = function(id) {
  if (confirm("Are you sure you want to remove this dish?")) {
    const updated = getStoredFood().filter(dish => dish.id !== id);
    saveStoredFood(updated);
  }
};

renderGallery();