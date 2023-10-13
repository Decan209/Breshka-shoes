document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header");
  const footerContainer = document.getElementById("footer");

  fetch("../../layout/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerContainer.innerHTML = data;
      highlightActiveLink();
    });

  fetch("../../layout/footer.html")
    .then((response) => response.text())
    .then((data) => (footerContainer.innerHTML = data));
});
function highlightActiveLink() {
    const currentUrl = window.location.href;
    const menuLinks = document.querySelectorAll('.menu a');
    console.log(currentUrl);
    menuLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add('active');
        }
    });
}
