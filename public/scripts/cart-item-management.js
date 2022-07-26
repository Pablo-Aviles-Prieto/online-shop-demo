const cartItemUpdateFormElements = document.querySelectorAll(
  '.cart-item-management'
); // We get an array with all the items matching the selector.
const cartBadges = document.querySelectorAll('.nav-items .badge'); // We use the querySelectorAll since there 2 badges, in the desktop and in the mobile menu (since in the mobile version we have an aside with another nav bar).

async function updateCartItem(e) {
  // We want to prevent the default behaviour of the browser (sending the form request), thx to the event we get in the DOM.
  e.preventDefault();

  const form = e.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value; // We need to access to the input that is the 1st child from the form (the element(target) who caused the event).

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong!');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  // We  get a json response with an obj that holds data in the function updateCartItem() of the cart.controller
  const responseData = await response.json();

  // We check the updated price of the item
  if (responseData.updatedCartData.updatedItemPrice === 0) {
    e.target.parentElement.remove();
  } else {
    e.target.parentElement.firstElementChild.lastElementChild.firstElementChild.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  const cartTotalPriceElement = document.getElementById('cart-total-price');
  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  // We loop for the array that we retrieve with the cartBadges = document.querySelectorAll
  for (const cartBadge of cartBadges) {
    cartBadge.textContent = responseData.updatedCartData.newTotalQuantity;
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}
