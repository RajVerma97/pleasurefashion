

var sizeBtns = document.querySelectorAll('.size__btn');
var quantitySelector = document.querySelector('.cart__quantity');
var addToCartBtn = document.querySelector('.cart__btn');
var buyBtn = document.querySelector('.buy__btn');
var productStats = {};
var productId = buyBtn.getAttribute('product-id');
var likeBtns = document.querySelectorAll('.like__btn');


// buyBtn.addEventListener('click',async (e)=>{
// const API_URL = 'http://localhost:3000/'
//         e.preventDefault();
//     const orderUrl = `${API_URL}order`;
//     const response = await axios.get(orderUrl);
//     const { data } = response;
//     const options = {
//         key: 'rzp_test_pG5ZsBewvcRAo8',
//         name: "Pleasure",
//         description: "Best Fashion For the Womens",
//         order_id: data.id,
//         handler: async (response) => {
//             try {
//                 const paymentId = response.razorpay_payment_id;
//                 const url = `${API_URL}capture/${paymentId}`;
//                 const captureResponse = await Axios.post(url, {})
//                 console.log(captureResponse.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         },
//         theme: {
//             color: "#686CFD",
//         },
//     };
//     const rzp1 = new window.Razorpay(options);
//     rzp1.open();
// });


sizeBtns[0].classList.add('size__btn--active');

sizeBtns.forEach(sizeBtn => {
    sizeBtn.addEventListener('click', (e) => {
        sizeBtns.forEach(sizeBtn => {
            sizeBtn.classList.remove('size__btn--active');
        })
        e.target.classList.add('size__btn--active');
        // console.log(e.target.textContent);



    });
});





addToCartBtn.addEventListener('click', async (e) => {

    var productSize = document.querySelector('.size__btn--active').getAttribute('size');
    addToCartBtn.style.display = "none";


    var productQuantity = quantitySelector.value;
    productStats = {
        productId: productId,
        productSize: productSize,
        productQuantity: productQuantity
    }
  
  

    const response = await axios({
        method: 'post',
        url: '/cart',
        data: productStats
    });




});



buyBtn.addEventListener('click', async (e) => {

    var productSize = document.querySelector('.size__btn--active').getAttribute('size');
    var productId = e.target.getAttribute('product-id');
    buyBtn.style.display = "none";
    var productQuantity = quantitySelector.value;

    var productPrice = '<%-product.price%>';


    var amount = productPrice * productQuantity * 100;


    var newOrder = {
        productId,
        productQuantity,
        productSize
    }
    console.log(newOrder);

    const response = await axios({
        method: 'post',
        url: '/orders',
        data: newOrder
    });
    console.log(response);


});



const updateLikes = (e) => {

    var commentId = e.target.getAttribute('commentid');
    var action = e.target.getAttribute('action');
    var counter;

    if (action == 'like') {
        e.target.classList.add('active');
        e.target.textContent = Number(e.target.textContent) + 1;
        counter = 1;

        axios.get(`/comments/${commentId}/${action}`)
            .then(result => console.log(result));

        action = 'dislike';
        e.target.setAttribute('action', 'dislike');


    }
    else if (action == 'dislike') {
        e.target.classList.remove('active');

        e.target.textContent = Number(e.target.textContent) - 1;
        counter = -1;

        axios.get(`/comments/${commentId}/${action}`)
            .then(result => console.log(result));

        action = 'like';
        e.target.setAttribute('action', 'like');

    }

}



likeBtns.forEach(likeBtn => {

    likeBtn.addEventListener('click', updateLikes);

});
