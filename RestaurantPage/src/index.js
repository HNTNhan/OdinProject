import "./style.css";
import homePage from "./home-page.js";
import menuPage from "./menu-page";
import contactPage from "./contact-page";

const body = document.body;

const content = document.createElement("div");
content.setAttribute("id", "content");

const createNavBarElement = () => {
  const navBarContainer = document.createElement("div");
  navBarContainer.classList.add("nav-container");

  const ul = document.createElement("ul");
  ul.classList.add("nav-item-list");

  const home = document.createElement("li");
  home.textContent = "Home";
  home.classList.add("nav-item", "active");
  // home.setAttribute("id", "home");
  home.addEventListener("click", () => {
    main.innerHTML = "";
    main.appendChild(homePage);
    if (!home.classList.contains("active")) home.classList.add("active");
    menu.classList.remove("active");
    contact.classList.remove("active");
  });
  ul.appendChild(home);

  const menu = document.createElement("li");
  menu.textContent = "Menu";
  menu.classList.add("nav-item");
  // menu.setAttribute("id", "menu");
  menu.addEventListener("click", () => {
    main.innerHTML = "";
    main.appendChild(menuPage);
    if (!menu.classList.contains("active")) menu.classList.add("active");
    home.classList.remove("active");
    contact.classList.remove("active");
  });
  ul.appendChild(menu);

  const contact = document.createElement("li");
  contact.textContent = "Contact";
  contact.classList.add("nav-item");
  // contact.setAttribute("id", "contact");
  contact.addEventListener("click", () => {
    main.innerHTML = "";
    main.appendChild(contactPage);
    if (!contact.classList.contains("active")) contact.classList.add("active");
    home.classList.remove("active");
    menu.classList.remove("active");
  });
  ul.appendChild(contact);

  navBarContainer.appendChild(ul);

  return navBarContainer;
};

const createFooter = () => {
  const footer = document.createElement("footer");
  footer.innerHTML = "Copyright &#169; 2022 Thiện Nhân";

  return footer;
};

const main = document.createElement("main");

main.appendChild(homePage);
// main.appendChild(menu);

const navBarElement = createNavBarElement();
const footer = createFooter();

content.appendChild(navBarElement);
content.appendChild(main);
content.appendChild(footer);

body.appendChild(content);
