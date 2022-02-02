function photographerFactory(data) {
  const { name, portrait, city, country, tagline, price } = data;

  const picture = `assets/images/photographers/ID/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    const h2 = document.createElement("h2");
    h2.textContent = name;
    const p = document.createElement("p");
    p.innerHTML = `<span>${city}, ${country}</span><br>${tagline}<br><em>${price}€/jour</em>`;
    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(p);
    return article;
  }
  return { getUserCardDOM };
}

async function mediaData() {
  const request = await fetch("../../data/photographers.json");
  const data = await request.json();
  return data;
}

async function photographerPageFactory(data) {
  const { name, portrait, city, country, tagline, id, price } = data;

  function getHeaderCardDOM() {
    const header = document.createElement("div");
    header.classList.add("photograph-header");
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.classList.add("photograph-title");
    h1.textContent = name;
    const p = document.createElement("p");
    p.classList.add("photograph-desc");
    const info = `<span>${city}, ${country}</span>
    <br>
    ${tagline}`;
    p.innerHTML = info;
    div.appendChild(h1);
    div.appendChild(p);
    const button = document.createElement("button");
    button.classList.add("contact_button");
    button.setAttribute("onclick", "displayModal()");
    button.textContent = "Contactez-moi";
    button.setAttribute("aria-label", "Contact Me");

    const picture = `assets/images/photographers/ID/${portrait}`;
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);

    header.appendChild(div);
    header.appendChild(button);
    header.appendChild(img);

    return header;
  }

  async function getSectionCardDOM() {
    async function sort() {
      section.removeChild(section.lastChild);
      return section.appendChild(await article(this.value));
    }

    const section = document.createElement("section");
    section.classList.add("photograph-book");

    const label = document.createElement("label");
    label.setAttribute("for", "sort-select");
    label.textContent = "Trier par";

    const select = document.createElement("select");
    select.setAttribute("name", "sort");
    select.setAttribute("id", "sort-select");
    select.addEventListener("change", sort);

    select.innerHTML = `<option value="Popularité">Popularité</option>
          <option value="Date">Date</option>
          <option value="Titre">Titre</option>`;
    section.appendChild(label);
    section.appendChild(select);

    const articleEl = await article();

    section.appendChild(articleEl);

    return section;
  }

  async function article(order) {
    const div = document.createElement("div");
    div.classList.add("photograph-book-body");

    let { media } = await mediaData();

    media = media.filter((item) => item.photographerId === id);
    media.shift();

    function orderBy(a, b) {
      if (order === undefined) {
        order = "Popularité";
      }
      if (order === "Date") {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
        return 0;
      }

      if (order === "Popularité") {
        if (a.likes > b.likes) {
          return -1;
        }
        if (a.likes < b.likes) {
          return 1;
        }
        return 0;
      }

      if (order === "Titre") {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      }
    }
    media.sort(orderBy);

    for (const element of media) {
      const img = document.createElement("img");
      img.setAttribute(
        "src",
        `assets/images/photographers/${id}/${element.image}`
      );
      img.setAttribute("alt", element.title);

      const footer = document.createElement("footer");
      footer.classList.add("photograph-book-footer");

      const p = document.createElement("p");
      const span = document.createElement("span");

      p.textContent = element.title;
      span.textContent = element.likes;
      span.addEventListener("click", (e) => {
        let count = parseInt(e.target.innerText);
        count++;
        e.target.innerText = count;
      });

      const a = document.createElement("a");
      a.setAttribute(
        "href",
        `assets/images/photographers/${id}/${element.image}`
      );

      a.setAttribute("aria-label", element.title);

      const article = document.createElement("article");

      a.appendChild(img);

      footer.appendChild(p);
      footer.appendChild(span);
      article.appendChild(a);
      article.appendChild(footer);
      div.appendChild(article);
      Lightbox.initialisation();
    }
    return div;
  }

  async function footer() {
    let { media } = await mediaData();

    const sum = media.reduce(function (previousValue, currentValue) {
      return {
        likes: previousValue.likes + currentValue.likes,
      };
    });

    const footer = document.createElement("footer");
    const sumLikes = document.createElement("p");
    sumLikes.innerHTML = `${sum.likes} ♥`;
    const priceDay = document.createElement("p");
    priceDay.innerHTML = `${price}€ / jour`;
    footer.appendChild(sumLikes);
    footer.appendChild(priceDay);
    footer.classList.add("photograph-footer");
    return footer;
  }

  const div = document.createElement("div");
  div.appendChild(getHeaderCardDOM());
  div.appendChild(await getSectionCardDOM());
  div.appendChild(await footer());

  return div;
}
