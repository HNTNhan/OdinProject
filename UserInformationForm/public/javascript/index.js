import { countryList, errorMessages } from "./data.js";

const userInfoForm = document.querySelector("form");
const inputEmailElement = document.querySelector("#user-email");
const selectCountryElement = document.querySelector("#user-country");
const inputZipCodeElement = document.querySelector("#user-zip-code");
const inputPasswordElement = document.querySelector("#user-password");
const inputConfirmedPasswordElement = document.querySelector("#user-confirmed-password");

const loadListCountry = function () {
  countryList.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.code;
    option.textContent =
      country.name.length <= 20 ? country.name : country.name.slice(0, 20) + "...";

    selectCountryElement.appendChild(option);
  });
};

const checkInputValid = function (input) {
  return input.validity.valid;
};

const toggleInputStatus = function (showErorrElement, valid = true) {
  if (valid) {
    showErorrElement.classList.remove("unvalid");
    showErorrElement.classList.add("valid");
    showErorrElement.textContent = "";
    showErorrElement.style.display = "block";
    showErorrElement.previousElementSibling.classList.remove("unvalid");
    showErorrElement.previousElementSibling.classList.add("valid");
  } else {
    showErorrElement.classList.remove("valid");
    showErorrElement.classList.add("unvalid");
    showErorrElement.previousElementSibling.classList.remove("valid");
    showErorrElement.previousElementSibling.classList.add("unvalid");
    showErorrElement.style.display = "block";
  }
};

const showError = function (element, showErorrElement, type) {
  toggleInputStatus(showErorrElement, false);
  if (element.validity.valueMissing) {
    showErorrElement.textContent = errorMessages[type].valueMissing;
  } else if (element.validity.typeMismatch) {
    showErorrElement.textContent = errorMessages[type].typeMismatch;
  } else if (element.validity.patternMismatch) {
    showErorrElement.textContent = errorMessages[type].patternMismatch;
  } else {
    showErorrElement.textContent = errorMessages[type].other;
  }
};

const addEventListenerInput = function (element) {
  element.addEventListener("input", () => {
    const showErrorElement = element.nextElementSibling;
    if (checkInputValid(element)) {
      toggleInputStatus(showErrorElement, true);
    }
  });
};

const addEventListenerInputConfirmPassword = function () {
  inputConfirmedPasswordElement.addEventListener("input", () => {
    const showErrorElement = inputConfirmedPasswordElement.nextElementSibling;
    if (inputConfirmedPasswordElement.value === inputPasswordElement.value) {
      toggleInputStatus(showErrorElement, true);
    }
  });
};

const addEventlistenerFocusOut = function (element, type) {
  element.addEventListener("focusout", () => {
    const showErrorElement = element.nextElementSibling;
    if (type === "password") {
      checkMatchingPassword();
    }
    if (!checkInputValid(element)) {
      showError(element, showErrorElement, type);
    } else {
      toggleInputStatus(showErrorElement, true);
    }
  });
};

const checkMatchingPassword = function () {
  const showErorrElement = inputConfirmedPasswordElement.nextElementSibling;
  if (inputConfirmedPasswordElement.value === inputPasswordElement.value) {
    toggleInputStatus(showErorrElement, true);
    showErorrElement.textContent = "";
  } else {
    toggleInputStatus(showErorrElement, false);
    showErorrElement.textContent = errorMessages.confirmPassword.passwordMismatch;
  }
};

const addEventlistenerFocusOutConfirmPassword = function () {
  inputConfirmedPasswordElement.addEventListener("focusout", () => {
    checkMatchingPassword();
  });
};

addEventListenerInput(inputEmailElement, "email");
addEventListenerInput(selectCountryElement, "country");
addEventListenerInput(inputZipCodeElement, "zipCode");
addEventListenerInput(inputPasswordElement, "password");
addEventListenerInputConfirmPassword();

addEventlistenerFocusOut(inputEmailElement, "email");
addEventlistenerFocusOut(selectCountryElement, "country");
addEventlistenerFocusOut(inputZipCodeElement, "zipCode");
addEventlistenerFocusOut(inputPasswordElement, "password");
addEventlistenerFocusOutConfirmPassword();

loadListCountry();

userInfoForm.addEventListener("submit", (e) => {
  if (
    checkInputValid(inputEmailElement) &&
    checkInputValid(selectCountryElement) &&
    checkInputValid(inputZipCodeElement) &&
    checkInputValid(inputPasswordElement) &&
    checkInputValid(inputConfirmedPasswordElement)
  ) {
    e.preventDefault();
    alert("Summit Success");
  } else {
    e.preventDefault();
    alert("Please type all your information correctly before submit");
  }
});
