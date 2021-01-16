var heartIcons = document.querySelectorAll('.heart__icon');

heartIcons.forEach(heartIcon => {
    heartIcon.addEventListener('click', async (e) => {

        var productId = e.target.getAttribute('product_id');

        if (e.target.classList.contains('added')) {

            e.target.classList.remove('added');
            console.log(" before req:remove product from wishlist");

            const removeResponse = await axios.post(`/wishlist/remove/${productId}`);
            console.log("after req");
            console.log("reloading the whole page");
            location.reload();


        }
        else {
            e.target.classList.add('added');

            console.log(" before req:add product to the wishlist");
            const addResponse = await axios.post(`/wishlist/add/${productId}`);

            console.log("after req");
            console.log("reloading the whole page");
            location.reload();




        }






    });


})
