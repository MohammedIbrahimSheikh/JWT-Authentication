const signUp = document.getElementById("signup");
const logIn = document.getElementById("login");
const write = document.getElementById("write");
const myBlogs = document.getElementById("my-blogs");
const allBlogs = document.getElementById("all-blogs");

if (signUp) {
  signUp.addEventListener("submit", async (event) => {
    event.preventDefault();
    let firstName = document.getElementById("firstname");
    let lastName = document.getElementById("lastname");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirmpassword = document.getElementById("confirmpassword");
    if (password !== confirmpassword) {
      document.querySelector("#message").innerText = "Password didn't match,Please try again!";
      return;
    }
    try {
      const response = await axios.post('https://personal-blog-app.cyclic.app/api/auth/signup',

        {
          "firstName": firstName.value.trim(),
          "lastName": lastName.value.trim(),
          "email": email.value.trim(),
          "password": password.value.trim()
        })
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
      confirmpassword.value = "";
      window.location.href = "./login.html"
      // document.querySelector("#message").innerHTML = response.data;
    }
    catch (error) {
      console.error(error.response.data);
    }
  })
}
if (logIn) {
  logIn.addEventListener("submit", async (event) => {
    event.preventDefault();
    let email = document.getElementById("login-email");
    let password = document.getElementById("login-password");
    try {
      const response = await axios.post('https://personal-blog-app.cyclic.app/api/auth/login',
        {
          "email": email.value.trim(),
          "password": password.value.trim()
        }
      )
      email.value = "";
      password.value = "";
      window.location.href = "./index.html"
      // document.querySelector("#message").innerHTML = response.data;
    }
    catch (error) {
      console.error(error.response.data);
    }
  })
}

if (write) {
  write.addEventListener("submit", async (event) => {
    event.preventDefault();
    let title = document.getElementById("title");
    let text = document.getElementById("text");
    // console.log(title,text);
    try {
      const response = await axios.post('https://personal-blog-app.cyclic.app/api/post', {
        "title": title.value.trim(),
        "text": text.value.trim()
      });
      title.value = "";
      text.value = "";
      setTimeout(() => { window.alert("Post has been Created!") }, 300);
      // console.log(response);
      // if (response)
    }
    catch (error) {
      // console.log(error.response.data);
      if (error.response.data.message = "invalid token") window.location.href = "./login.html"
      else console.error(error)
    }
  })
}

if (myBlogs) myBlogs.addEventListener("load", getBlogs(myBlogs, "https://personal-blog-app.cyclic.app/api/posts"));

if (allBlogs) allBlogs.addEventListener("load", getBlogs(allBlogs, "https://personal-blog-app.cyclic.app/api/posts"));

async function getBlogs(item, url) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  try {
    const response = await axios.get(url);
    // console.log(response);
    const posts = response.data.results;
    // console.log(posts);
    for (let index = 0; index < posts.length; index++) {
      const divBlog = document.createElement("div");
      let date = new Date(posts[index].createdOn);
      divBlog.className = "blog";
      divBlog.innerHTML =
       `
       <div class="blog-head">
          <img src="../src/img/profile-img.png" class="user-img"/>
          <div class="title-name-date">
              <h2 class="title">${posts[index].title}</h2>
              <div class="name-date">${posts[index].fullName}-${months[date.getMonth()]}${date.getDate()},${date.getFullYear()}</div>
          </div>
        </div>
        <article class="blog-text">${posts[index].text}</article>
      `
      item.appendChild(divBlog);
    }
  } catch (error) {
    console.log(error);
  }
}

