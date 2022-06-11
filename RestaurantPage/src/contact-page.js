const createContactInfo = (name, position, phoneNumber, email) => {
  const contactContainer = document.createElement("div");
  contactContainer.classList.add("contact-container");

  const _name = document.createElement("h3");
  _name.textContent = name;

  const _position = document.createElement("p");
  _position.textContent = position;

  const _phoneNumber = document.createElement("p");
  _phoneNumber.textContent = phoneNumber;

  const _email = document.createElement("p");
  _email.textContent = email;

  contactContainer.appendChild(_name);
  contactContainer.appendChild(_position);
  contactContainer.appendChild(_phoneNumber);
  contactContainer.appendChild(_email);

  return contactContainer;
};

export default (() => {
  const mainContent = document.createElement("div");
  mainContent.classList.add("main-content", "contact-content");

  const h1 = document.createElement("h1");
  h1.textContent = "Contact Us";

  const contact1 = createContactInfo("Person Name 1", "Chef", "555-555-5554", "totallyRealEmail@notFake.com");
  const contact2 = createContactInfo("Person Name 2", "Manager", "555-555-5555", "perfectlyRealEmail@notFake.com");

  mainContent.appendChild(h1);
  mainContent.appendChild(contact1);
  mainContent.appendChild(contact2);

  return mainContent;
})();
