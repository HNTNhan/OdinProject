const addBookTitleValidation = function (title) {
  title.addEventListener("input", () => {
    title.setCustomValidity("");
    title.checkValidity();
  });

  title.addEventListener("invalid", () => {
    if (title.value === "") {
      title.setCustomValidity("Please, enter your book's title!");
    } else {
      title.setCustomValidity(
        "Title can only contain  letters, numbers, space, and dash. Try again!",
      );
    }
  });
};

const addBookAuthorValidation = function (author) {
  author.addEventListener("input", () => {
    author.setCustomValidity("");
    author.checkValidity();
  });

  author.addEventListener("invalid", () => {
    if (author.value === "") {
      author.setCustomValidity("Please, enter your book's author!");
    } else {
      author.setCustomValidity(
        "Author can only contain  letters, numbers, space, and dash. Try again!",
      );
    }
  });
};

export { addBookTitleValidation, addBookAuthorValidation };
