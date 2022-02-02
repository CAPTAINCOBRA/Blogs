const searchInput = document.querySelector("[data-search]");

let users = [];

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const blogTitle = document.querySelectorAll(".blogTitle");

  const blogStyles = [];

  blogTitle.forEach((blog) => {
    const title = blog.textContent.toLowerCase();
    if (title.indexOf(value) != -1) {
      blog.parentElement.parentElement.style.display = "flex";
      blogStyles.push(blog.parentElement.parentElement.style.display);
    } else {
      blog.parentElement.parentElement.style.display = "none";
      blogStyles.push(blog.parentElement.parentElement.style.display);
    }

    if (blogTitle[blogTitle.length - 1] == blog) {
      console.log(blogStyles);
      if (blogStyles.includes("flex")) {
        document.querySelector(".no-result-found").style.display = "none";
      } else {
        document.querySelector(".no-result-found").style.display = "flex";
      }
    }
  });

  //   users.forEach((user) => {
  //     const isVisible =
  //       user.name.toLowerCase().includes(value) ||
  //       user.email.toLowerCase().includes(value);
  //     user.element.classList.toggle("hide", !isVisible);
  //   });
});
