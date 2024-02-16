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
      const response = await axios.post('http://localhost:3000/api/auth/signup',

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
      const response = await axios.post('http://localhost:3000/api/auth/login',
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
      const response = await axios.post('http://localhost:3000/api/post', {
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

if (myBlogs) myBlogs.addEventListener("load", getBlogs(myBlogs, "http://localhost:3000/api/posts"));

if (allBlogs) allBlogs.addEventListener("load", getBlogs(allBlogs, "http://localhost:3000/api/posts"));

async function getBlogs(item, url) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  try {
    const response = await axios.get(url);
    // console.log(response);
    const posts = response.data.results;
    // console.log(posts);
    for (let index = 0; index < posts.length; index++) {
      const div = document.createElement("div");
      div.appendChild(document.createElement("h2"));
      div.lastElementChild.innerText = `${posts[index].title}`;
      div.appendChild(document.createElement("h4"));
      div.lastElementChild.innerText = `${posts[index].fullName}-${months[new Date(posts[index].createdOn).getMonth()]} ${new Date(posts[index].createdOn).getDate()},${new Date(posts[index].createdOn).getFullYear()}`
      div.appendChild(document.createElement("p"));
      div.lastElementChild.innerText = `${posts[index].text}`;
      div.className = "post";
      item.appendChild(div);
    }
  } catch (error) {
    console.log(error);
  }
}

