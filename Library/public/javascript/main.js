import { addBookTitleValidation, addBookAuthorValidation } from "./form-validation.js";

let myLibrary = JSON.parse(localStorage.getItem("myLibrary")) ?? [];
let chooseBookID = null;
let isFilter = false;
let showBookSection = document.querySelector(".book-info");

const modalContainer = document.querySelectorAll(".modal-container");
const addBookForm = document.querySelector(".add-book-form");
const filterForm = document.querySelector(".filter-form");
const addBookModal = document.querySelector(".add-book-modal");
const changeStatusModal = document.querySelector(".change-status-modal");
const checkDeleteModal = document.querySelector(".check-delete-modal");
const filterChooseText = document.querySelector(".filter-choose-text");
const loaderModal = document.querySelector(".loader-modal");

const cancelAddFormButton = document.querySelector(".cancel-add-form");
const addBookButton = document.querySelector(".add-new-book-button");
const cancelCheckDelete = document.querySelector(".cancel-delete");
const confirmCheckDelete = document.querySelector(".confirm-delete");
const cancelFilter = document.querySelector(".cancel-filter-button");
const statusButtons = document.querySelectorAll(".status-button");

class Book {
  constructor(title, author, pages, status) {
    this.id = title.slice(0, 3) + Math.floor(Math.random() * 9999);
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.dateAdded = Date();
  }
}

async function AddBookToLibrary(e) {
  e.preventDefault();
  const title = e.target.title.value.trim();
  const author = e.target.author.value.trim();
  const pages = e.target.pages.value || "unknow";
  const status = e.target.status.value;

  await loading();

  myLibrary.push(new Book(title, author, pages, status));
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  if (isFilter) filterBook(null, filterForm);
  else showAllBooks(0, myLibrary.length, myLibrary);

  e.target.title.value = "";
  e.target.author.value = "";
  e.target.pages.value = "";
  e.target.status.value = "New";
  filterChooseText.textContent = "";
  addBookModal.style.display = "none";
}

async function changeState(status) {
  if (!chooseBookID) return;
  let index = myLibrary.findIndex((book) => book.id === chooseBookID);
  if (myLibrary[index].status !== status) {
    myLibrary[index].status = status;
    await loading();
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    updateBookStatus(status);
  }
  chooseBookID = null;
  changeStatusModal.style.display = "none";
}

async function deleteBook() {
  if (!chooseBookID) return;
  myLibrary.splice(
    myLibrary.findIndex((book) => book.id === chooseBookID),
    1,
  );
  await loading();
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

  if (isFilter) filterBook(null, filterForm);
  else showAllBooks(0, myLibrary.length, myLibrary);

  chooseBookID = null;
  checkDeleteModal.style.display = "none";
}

function createElement(type, content) {
  const element = document.createElement(`${type}`);
  element.textContent = content;
  return element;
}

function createEditCell(td, id) {
  const changeStatusButton = document.createElement("button");
  changeStatusButton.classList.add("edit-button");
  changeStatusButton.classList.add("change-status-button");
  changeStatusButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg>
  `;
  changeStatusButton.addEventListener("click", function () {
    changeStatusModal.style.display = "flex";
    chooseBookID = id.toString();
  });

  const deleteBookButton = document.createElement("button");
  deleteBookButton.classList.add("edit-button");
  deleteBookButton.classList.add("delete-button");
  deleteBookButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
  `;
  deleteBookButton.addEventListener("click", function () {
    checkDeleteModal.style.display = "flex";
    chooseBookID = id.toString();
  });

  td.appendChild(changeStatusButton);
  td.appendChild(deleteBookButton);

  return td;
}

function createTableRowElement(id, title, author, pages, status, date, type) {
  const tr = document.createElement("tr");
  let dateFormat = date;
  if (type === "td") {
    const dateObj = new Date(date);
    dateFormat = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
  }

  tr.setAttribute("data-id", id.toString());
  tr.appendChild(createElement(type, id));
  tr.appendChild(createElement(type, title));
  tr.appendChild(createElement(type, author));
  tr.appendChild(createElement(type, pages));
  tr.appendChild(createElement(type, status));
  tr.appendChild(createElement(type, dateFormat));
  if (type === "td") {
    tr.appendChild(createEditCell(createElement(type, ""), id));
  }
  return tr;
}

async function showAllBooks(start = 0, end = -1, myLibrary) {
  showBookSection.innerHTML = "";

  if (myLibrary.length > 0) {
    end = end === -1 ? myLibrary.length : end;
    const table = document.createElement("table");
    table.appendChild(
      createTableRowElement("ID", "Title", "Author", "Pages", "Status", "Date", "th"),
    );

    for (let i = start; i < end; i++) {
      table.appendChild(
        createTableRowElement(
          myLibrary[i].id,
          myLibrary[i].title,
          myLibrary[i].author,
          myLibrary[i].pages,
          myLibrary[i].status,
          new Date(myLibrary[i].dateAdded).toDateString(),
          "td",
        ),
      );
    }

    showBookSection.appendChild(table);
  } else {
    const p = document.createElement("p");
    p.textContent = "Library don't have any book to show!";
    p.classList.add("empty-notify");
    showBookSection.appendChild(p);
  }
}

function updateBookStatus(status) {
  const bookChoosed = document.querySelector(`tr[data-id="${chooseBookID}"]`);
  bookChoosed.childNodes[4].textContent = status;
}

async function filterBook(e, form) {
  if (e) e.preventDefault();
  const search = form.search.value.toLowerCase().trim();
  const dateFrom = form.dateFrom.value;
  const dateTo = form.dateTo.value;
  const status = form.status.value;

  await loading();

  const filterLibrary = myLibrary.filter((book) => {
    if (
      book.title.toLowerCase().search(search) < 0 &&
      book.author.toLowerCase().search(search) < 0
    ) {
      return;
    }
    console.log(new Date(book.dateAdded), new Date(dateFrom));
    if (book.status !== status && status !== "All") return;
    if (dateFrom !== "" && new Date(book.dateAdded).getTime() < new Date(dateFrom).getTime())
      return;
    if (dateTo !== "" && new Date(book.dateAdded).getTime() > new Date(dateTo).getTime()) return;
    return book;
  });

  isFilter = true;
  filterChooseText.textContent = `Author/title: "${search}", status: "${status}", from: "${dateFrom}", to: "${dateTo}"`;
  showAllBooks(0, filterLibrary.length, filterLibrary);
}

function loading() {
  loaderModal.style.display = "flex";
  const time = Math.random() * 500 + 500;

  return new Promise((res) => {
    setTimeout(() => {
      loaderModal.style.display = "none";
      res();
    }, time);
  });
}

addBookTitleValidation(addBookForm.querySelector("#title"));
addBookAuthorValidation(addBookForm.querySelector("#author"));

modalContainer.forEach((container) => {
  container.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.style.display = "none";
    }
  });
});

statusButtons.forEach((statusButton) => {
  statusButton.addEventListener("click", (e) => {
    changeState(e.currentTarget.getAttribute("data-value"));
  });
});

addBookForm.addEventListener("submit", (e) => AddBookToLibrary(e));

filterForm.addEventListener("submit", (e) => filterBook(e, filterForm));

cancelAddFormButton.addEventListener("click", function (e) {
  e.preventDefault();
  addBookModal.style.display = "none";
});

addBookButton.addEventListener("click", function () {
  addBookModal.style.display = "flex";
});

cancelCheckDelete.addEventListener("click", function () {
  checkDeleteModal.style.display = "none";
});

confirmCheckDelete.addEventListener("click", (e) => deleteBook(e));

cancelFilter.addEventListener("click", async function (e) {
  e.preventDefault();
  await loading();
  filterChooseText.textContent = "";
  filterForm.search.value = "";
  filterForm.status.value = "All";
  filterForm.dateFrom.value = "";
  filterForm.dateTo.value = "";
  isFilter = false;
  showAllBooks(0, myLibrary.length, myLibrary);
});

window.addEventListener("load", () => {
  showAllBooks(0, myLibrary.length, myLibrary);
});
