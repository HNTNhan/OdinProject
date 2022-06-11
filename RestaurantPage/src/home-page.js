import imagePath from "./rezha-ramadhan-sV8M_Lkg60Y-unsplash.jpg";

const createMainContent = () => {
  const mainContent = document.createElement("div");
  mainContent.classList.add("main-content");

  const image = new Image();
  image.src = imagePath;
  image.classList.add("home-image");

  const textContent = document.createElement("div");
  textContent.classList.add("text-content");

  const h1 = document.createElement("h1");
  h1.textContent = "Restaurant";

  const hourInfo = document.createElement("div");
  hourInfo.classList.add("content-item", "hour-info");

  const hourInfoHeader = document.createElement("h2");
  hourInfoHeader.textContent = "Hours";
  const hourInfoContent = document.createElement("p");
  hourInfoContent.innerHTML = `Sunday: 8am - 8pm<br>Monday: 6am - 6pm<br>Tuesday: 6am - 6pm<br>Wednesday: 6am - 6pm<br>Thursday: 6am - 10pm<br>Friday: 6am - 10pm<br>Saturday: 8am - 10pm`;

  hourInfo.appendChild(hourInfoHeader);
  hourInfo.appendChild(hourInfoContent);

  textContent.appendChild(h1);
  textContent.appendChild(hourInfo);

  mainContent.appendChild(image);
  mainContent.appendChild(textContent);

  return mainContent;
};

const mainContent = createMainContent();

export default mainContent;
