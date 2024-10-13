let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const form = document.querySelector(".add-toy-form");

  fetchToys();
  form.addEventListener("submit", handleFormSubmit);

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => renderToy(toy));
    });
}

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  card.querySelector(".like-btn").addEventListener("click", () => increaseLikes(toy));
  toyCollection.appendChild(card);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0,
    }),
  })
    .then((response) => response.json())
    .then((newToy) => {
      renderToy(newToy);
      event.target.reset();
    });
}

function increaseLikes(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: newLikes,
    }),
  })
    .then((response) => response.json())
    .then((updatedToy) => {
      const toyCard = document.getElementById(updatedToy.id).parentElement;
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}
