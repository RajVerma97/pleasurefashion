var sizeBtns = document.querySelectorAll(".size__btn");
var quantitySelector = document.querySelector(".cart__quantity");
var addToCartBtn = document.querySelector(".cart__btn");
var buyBtn = document.querySelector(".buy__btn");
var productStats = {};
var productId = buyBtn.getAttribute("product-id");
var likeBtns = document.querySelectorAll(".like__btn");

sizeBtns[0].classList.add("size__btn--active");

sizeBtns.forEach((sizeBtn) => {
  sizeBtn.addEventListener("click", (e) => {
    sizeBtns.forEach((sizeBtn) => {
      sizeBtn.classList.remove("size__btn--active");
    });
    e.target.classList.add("size__btn--active");
  });
});

addToCartBtn.addEventListener("click", async (e) => {
  console.log();
  var productSize = document
    .querySelector(".size__btn--active")
    .getAttribute("size");

  var productQuantity = quantitySelector.value;
  productStats = {
    productId: productId,
    productSize: productSize,
    productQuantity: productQuantity,
  };
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productStats),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      throw new Error(error.message || "User not logged in");
    }

    addToCartBtn.style.display = "none";
  } catch (error) {
    console.log(error);
  }
});

buyBtn.addEventListener("click", async (e) => {
  buyBtn.style.display = "none";

  var productSize = document
    .querySelector(".size__btn--active")
    .getAttribute("size");
  var productId = e.target.getAttribute("product-id");

  var productQuantity = quantitySelector.value;

  var productPrice = "<%-product.price%>";

  var amount = productPrice * productQuantity * 100;

  var newOrder = {
    productId,
    productQuantity,
    productSize,
  };

  try {
    const response = await fetch("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });

    console.log(response);
    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      throw new Error(error.message || "User not logged in");
    }
  } catch (error) {
    console.log(error);
  }
});

const updateLikes = (e) => {
  var commentId = e.target.getAttribute("commentid");
  var action = e.target.getAttribute("action");
  var counter;

  if (action == "like") {
    e.target.classList.add("active");
    e.target.textContent = Number(e.target.textContent) + 1;
    counter = 1;

    axios
      .get(`/comments/${commentId}/${action}`)
      .then((result) => console.log(result));

    action = "dislike";
    e.target.setAttribute("action", "dislike");
  } else if (action == "dislike") {
    e.target.classList.remove("active");

    e.target.textContent = Number(e.target.textContent) - 1;
    counter = -1;

    axios
      .get(`/comments/${commentId}/${action}`)
      .then((result) => console.log(result));

    action = "like";
    e.target.setAttribute("action", "like");
  }
};

likeBtns.forEach((likeBtn) => {
  likeBtn.addEventListener("click", updateLikes);
});
