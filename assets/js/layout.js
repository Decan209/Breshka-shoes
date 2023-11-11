document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header");
  const footerContainer = document.getElementById("footer");

  fetch("./layout/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerContainer.innerHTML = data;
      highlightActiveLink();
    });

  fetch("./layout/footer.html")
    .then((response) => response.text())
    .then((data) => (footerContainer.innerHTML = data));
});

const highlightActiveLink = () => {
  const currentUrl = window.location.href;
  const menuLinks = document.querySelectorAll(".menu a");

  menuLinks.forEach((link) => {
    if (link.href === currentUrl) {
      link.classList.add("active");
    }
  });

  setHeaderUser();
};

const setHeaderUser = () => {
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const protected = localStorage.getItem("userProtected");
  
    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");
    const btnRegister = document.getElementById("btnRegister");
    const btnAdmin = document.getElementById("btnAdmin");
    const infoUser = document.getElementById('infoUser');
    const userName = document.getElementById('userName')

  
    if (email && name) {
      userName.textContent = name;
      btnRegister.style.display = "none";
      btnLogin.style.display = "none";
    } else {
      btnLogout.style.display = "none";
      infoUser.style.display = "none";
    }
  
    if (parseInt(protected) === 1) {
      btnAdmin.style.display = "block";
    } else{
      btnAdmin.style.display = "none";
    }
  
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userProtected");
  
      window.location.href = "/page/login/index.html";
    });
  };

  const searchParams = () => {
    const searchInput = document.getElementById("searchValue").value;
    let encodedSearch = encodeURIComponent(searchInput);
    window.location.href = `/page/search/index.html?q=${encodedSearch}`;
  };