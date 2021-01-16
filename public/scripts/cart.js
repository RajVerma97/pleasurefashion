
var deleteBtns = document.querySelectorAll('.delete__btn');
deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', async (e) => {
        var productId = e.target.getAttribute('product-id');
        const response = await axios.post(`/wishlist/remove/${productId}`);
        location.reload();

    });
})
