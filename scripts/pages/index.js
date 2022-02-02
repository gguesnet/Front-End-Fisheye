async function getPhotographers() {
  // Penser à remplacer par les données récupérées dans le json
  const request = await fetch("../../data/photographers.json");
  const data = await request.json();
  const photographers = data.photographers;
  // et bien retourner le tableau photographers seulement une fois
  return {
    photographers: [...photographers],
  };
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");
  console.log(photographers);
  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
    const articles = document.querySelectorAll("article");
    articles.forEach((article) => article.addEventListener("click", onClick));
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  console.log(photographers);
  displayData(photographers);
}

async function onClick(e) {
  const { photographers } = await getPhotographers();
  const result = photographers.filter(
    (item) => item.name === e.target.getAttribute("alt")
  );
  console.log(result);
  localStorage.clear();
  localStorage.setItem("photographer", JSON.stringify(result));
  window.location.href = "http://127.0.0.1:5500/photographer.html";
}

init();
