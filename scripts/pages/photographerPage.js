//Mettre le code JavaScript lié à la page photographer.html

class Lightbox {
  static initialisation() {
    const links = Array.from(
      document.querySelectorAll(
        'a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".avif"]'
      )
    );
    const gallery = links.map((link) => link.getAttribute("href"));
    links.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        new Lightbox(
          e.currentTarget.getAttribute("href"),
          gallery,
          e.currentTarget.getAttribute("aria-label")
        );
      })
    );
  }

  constructor(url, images, alt) {
    console.log(alt);
    this.element = this.buildDOM(url, alt);
    this.images = images;
    this.loadImage(url, alt);
    this.onKeyUp = this.onKeyUp.bind(this);
    document.body.appendChild(this.element);
    document.addEventListener("keyup", this.onKeyUp);
  }

  loadImage(url, alt) {
    this.url = null;
    const image = new Image();
    const container = this.element.querySelector(".lightbox__container");
    const loader = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = alt;
    loader.classList.add("lightbox__loader");
    container.innerHTML = "";
    container.appendChild(loader);
    image.onload = () => {
      container.removeChild(loader);
      container.appendChild(image);
      container.appendChild(p);
      this.url = url;
    };
    image.src = url;
    image.alt = alt;
  }

  onKeyUp(e, alt) {
    console.log(alt);
    if (e.key === "Escape") {
      this.close(e);
    } else if (e.key === "ArrowLeft") {
      this.prev(e, alt);
    } else if (e.key === "ArrowRight") {
      this.next(e, alt);
    }
  }

  close(e) {
    e.preventDefault();
    this.element.classList.add("fadeOut");
    window.setTimeout(() => {
      this.element.parentElement.removeChild(this.element);
    }, 500);
    document.removeEventListener("keyup", this.onKeyUp);
  }

  next(e, alt) {
    console.log(alt);
    e.preventDefault();
    let i = this.images.findIndex((image) => image === this.url);
    if (i === this.images.length - 1) {
      i = -1;
    }
    this.loadImage(this.images[i + 1], alt);
  }

  prev(e, alt) {
    console.log(alt);
    e.preventDefault();
    let i = this.images.findIndex((image) => image === this.url);
    if (i === 0) {
      i = this.images.length;
    }
    this.loadImage(this.images[i - 1], alt);
  }

  buildDOM(url, alt) {
    console.log(alt);
    const dom = document.createElement("div");
    dom.classList.add("lightbox");
    dom.innerHTML = `<button class="lightbox__close">Fermer</button>
                           <button class="lightbox__next">Suivant</button>
                           <button class="lightbox__prev">Précédent</button>
                           <div class="lightbox__container"></div>`;
    dom
      .querySelector(".lightbox__close")
      .addEventListener("click", this.close.bind(this));
    dom
      .querySelector(".lightbox__next")
      .addEventListener("click", this.next.bind(this), alt);
    dom
      .querySelector(".lightbox__prev")
      .addEventListener("click", this.prev.bind(this), alt);
    return dom;
  }
}

async function getPhotographerPage() {
  const localStorageData = JSON.parse(localStorage.getItem("photographer"));
  const data = localStorageData[0];
  return data;
}

async function displayData(photographer) {
  const mainDOM = document.getElementById("main");
  const data = photographer;

  mainDOM.appendChild(await photographerPageFactory(data));
}

async function init() {
  const photographer = await getPhotographerPage();
  displayData(photographer);
}

init();
Lightbox.initialisation();
