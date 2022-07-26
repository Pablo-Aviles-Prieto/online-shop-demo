const addToCartButtonElement = document.querySelector(
  '#product-details button'
);
const cartBadges = document.querySelectorAll('.nav-items .badge'); // We use the querySelectorAll since there 2 badges, in the desktop and in the mobile menu (since in the mobile version we have an aside with another nav bar).

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
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

  const responseData = await response.json();

  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadge of cartBadges) {
    cartBadge.textContent = newTotalQuantity;
  }
}

addToCartButtonElement.addEventListener('click', addToCart);
