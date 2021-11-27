let myLibrary = JSON.parse(localStorage.getItem("myLibrary")) ?? [];
let chooseBookID = null;
let isFilter = false;

const addBookForm = document.querySelector(".add-book-form");
const filterForm = document.querySelector(".filter-form");
let showBookSection = document.querySelector(".book-info");
// const listBook = document.querySelector(".book-info>table");
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

function Book(title, author, pages, status) {
  this.id = title.slice(0, 4) + Math.floor(Math.random() * 9999);
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.dateAdded = Date();
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
  // showAddBook(
  //   myLibrary.length,
  //   title,
  //   author,
  //   pages,
  //   status,
  //   myLibrary[myLibrary.length - 1].dateAdded
  // );

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

async function deleteBook(e) {
  if (!chooseBookID) return;
  myLibrary.splice(
    myLibrary.findIndex((book) => book.id === chooseBookID),
    1
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
  changeStatusButton.textContent = "Change status?";
  changeStatusButton.addEventListener("click", function (e) {
    changeStatusModal.style.display = "flex";
    chooseBookID = id.toString();
  });

  const deleteBookButton = document.createElement("button");
  deleteBookButton.classList.add("edit-button");
  deleteBookButton.textContent = "Delete?";
  deleteBookButton.addEventListener("click", function (e) {
    checkDeleteModal.style.display = "flex";
    chooseBookID = id.toString();
  });

  td.appendChild(changeStatusButton);
  td.appendChild(deleteBookButton);

  return td;
}

function createTableRowElement(id, title, author, pages, status, date, type) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-id", id.toString());
  tr.appendChild(createElement(type, id));
  tr.appendChild(createElement(type, title));
  tr.appendChild(createElement(type, author));
  tr.appendChild(createElement(type, pages));
  tr.appendChild(createElement(type, status === "New" ? "" : status));
  tr.appendChild(createElement(type, date));
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
      createTableRowElement(
        "ID",
        "Title",
        "Author",
        "Pages",
        "Status",
        "Date",
        "th"
      )
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
          "td"
        )
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

// function showAddBook(id, title, author, pages, status, date) {
//   console.log(123231);
//   listBook.appendChild(
//     createTableRowElement(
//       id,
//       title,
//       author,
//       pages,
//       status,
//       date.toDateString(),
//       "td"
//     )
//   );
// }

function updateBookStatus(status) {
  const bookChoosed = document.querySelector(`tr[data-id="${chooseBookID}"]`);
  bookChoosed.childNodes[4].textContent = status === "New" ? "" : status;
}

// function updateBookDelete() {
//   const bookChoosed = document.querySelector(`tr[data-id="${chooseBookID}"]`);
//   bookChoosed.parentNode.removeChild(bookChoosed);
// }

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
    if (book.status !== status && status !== "All") return;
    if (dateFrom !== "" && book.dateAdded < new Date(`"${dateFrom}"`)) return;
    if (dateTo !== "" && book.dateAdded > new Date(`"${dateTo}"`)) return;
    return book;
  });

  isFilter = true;
  filterChooseText.textContent = `Author/title: "${search}", status: "${status}", from: "${dateFrom}", to: "${dateTo}"`;
  showAllBooks(0, filterLibrary.length, filterLibrary);
}

function loading() {
  loaderModal.style.display = "flex";
  const time = Math.random() * 2000 + 500;

  return new Promise((res) => {
    setTimeout(() => {
      loaderModal.style.display = "none";
      res();
    }, time);
  });
}

addBookForm.addEventListener("submit", (e) => AddBookToLibrary(e));

filterForm.addEventListener("submit", (e) => filterBook(e, filterForm));

cancelAddFormButton.addEventListener("click", function (e) {
  e.preventDefault();
  addBookModal.style.display = "none";
});

addBookButton.addEventListener("click", function (e) {
  addBookModal.style.display = "flex";
});

cancelCheckDelete.addEventListener("click", function (e) {
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
