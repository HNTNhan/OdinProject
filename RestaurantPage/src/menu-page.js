import path1 from "./1.jpg";
import path2 from "./2.jpg";
import path3 from "./3.jpg";
import path4 from "./4.jpg";
import path5 from "./5.jpg";

const createDishInfo = (name, path, price) => {
  const dishContainer = document.createElement("div");
  dishContainer.classList.add("dish-container");

  const imageDish = new Image();
  imageDish.src = path;

  const nameDish = document.createElement("h3");
  nameDish.textContent = name;

  const priceDish = document.createElement("p");
  priceDish.textContent = "Price: " + price;

  dishContainer.appendChild(imageDish);
  dishContainer.appendChild(nameDish);
  dishContainer.appendChild(priceDish);

  return dishContainer;
};

export default (() => {
  const mainContent = document.createElement("div");
  mainContent.classList.add("main-content", "menu-content");

  const h1 = document.createElement("h1");
  h1.textContent = "Menu";

  const dish1 = createDishInfo("Deep Fried Tofu", path1, "4.5$");
  const dish2 = createDishInfo("Crab Meat Soup", path2, "2$");
  const dish3 = createDishInfo("Beef Salad with Vegetables in Spicy Sauce", path3, "8$");
  const dish4 = createDishInfo("Deep Fried Milk Squid with Fish Sauce", path4, "9$");
  const dish5 = createDishInfo("Grilled Oyster with Cheese", path5, "3.5$");

  mainContent.appendChild(h1);
  mainContent.appendChild(dish1);
  mainContent.appendChild(dish2);
  mainContent.appendChild(dish3);
  mainContent.appendChild(dish4);
  mainContent.appendChild(dish5);

  return mainContent;
})();
