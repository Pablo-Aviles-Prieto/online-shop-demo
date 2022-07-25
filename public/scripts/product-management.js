const deleteProductButtonElements = document.querySelectorAll(
  '.product-item button'
);

async function deleteProduct(e) {
  const buttonElement = e.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  // Since we are calling to the same domain in the fetch, there is no need to put the localhost and port
  const response = await fetch(
    `/admin/products/${productId}?_csrf=${csrfToken}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    alert('Something went wrong while removing the product from DB!');
    return;
  }
  // We need to get to the list item since is the element we need to remove (we need 4 parentElements from the event target delete button: div => div => article => li)
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}
