var sidebarOpenBtn = document.getElementById("sidebar-open");
var sidebarCloseBtn = document.getElementById("sidebar-close");
var sidebar = document.getElementById("sidebar");
var submenu = document.getElementById("submenu");
var submenuToggler = document.getElementById("submenu-toogler");
var overlay = document.querySelector(".overlay");

sidebarOpenBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  document.body.style.position = "fixed";
  overlay.style.display = "block";
});

sidebarCloseBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
  document.body.style.position = "static";
  // overlay.style.display = 'none';
  overlay.style.display = "none";
  submenu.classList.remove("active");
});

submenuToggler.addEventListener("click", () => {
  console.log("helo");

  submenu.classList.toggle("submenu--active");
});

overlay.addEventListener("click", e => {
  if (e.target == overlay) {
    overlay.style.display = "none";
    sidebar.classList.remove("active");
    submenu.classList.remove("active");
    document.body.style.position = "static";
  }
});
