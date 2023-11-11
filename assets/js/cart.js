const formatPrice = (price) => {
  const priceToNumber = parseInt(price);
  return priceToNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getListCart = () => {
  const id = localStorage.getItem("userId");

  const table = document.getElementById("cartTable");
  const noData = document.getElementById("noData");
  const totalPrice = document.getElementById("totalPrice");

  noData.textContent = "";
  let totalPr = 0;

  fetch(`http://127.0.0.1:8000/api/cart/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        noData.textContent = "Không có dữ liệu";
      } else {
        data.forEach((element) => {
          const newRow = table.insertRow();
          newRow.innerHTML = `
        <tr>
        <td style="width: 188px; height: 140px">
          <div class="cart-body__img">
            <a class="cart-body__link" href="#!">
              <img
                class="cart-body__thumb"
                src=${element.product.image}
                alt=""
              />
            </a>
          </div>
        </td>
        <td>
          <h3 class="cart-body__name">
            ${element.product.name}
          </h3>
        </td>
        <td>
          <div class="cart-body-price">
            <span class="cart-body__prices">${formatPrice(
              element.product.price -
                element.product.price * (element.product.sale / 100)
            )}₫</span>
          </div>
        </td>
        <td>
          <div class="cart-body-btn">
            <button class="cart-body-btn__increase" type="">+</button>
            <input
              class="cart-body-btn__quantity"
              type="text"
              name="number"
              id="number"
              value=${element.quantity}
            />
            <button class="cart-body-btn__reduce" type="">-</button>
          </div>
        </td>
        <td>
          <div class="cart-body-price">
            <span class="cart-body__prices">${formatPrice(
              (element.product.price -
                element.product.price * (element.product.sale / 100)) *
                element.quantity
            )}₫</span>
          </div>
        </td>
        <td>
          <div class="cart-body-delete" onclick="removeProductCart(${element.product.id})">
            <div class="cart-body-delete__item" href="">
              <i class="fa-solid fa-trash-can"></i>
            </div>
          </div>
        </td>
      </tr>
        `;
        });

        data.forEach((element) => {
          totalPr += (element.product.price - element.product.price * (element.product.sale / 100)) *element.quantity
        });

        totalPrice.textContent = formatPrice(totalPr) +"₫"
      }
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const removeProductCart = (id) => {
  const user_id = localStorage.getItem("userId");
  fetch(`http://127.0.0.1:8000/api/${user_id}/cart/${id}`, {
  method: "DELETE",
})
  .then((response) => {
    if (!response.ok) {
      Toastify({
        text: "Xóa thất bại",
        backgroundColor: "red",
      }).showToast();
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    Toastify({
      text: data.message,
      backgroundColor: "green",
    }).showToast();
    const table = document.getElementById("cartTable");
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      getListCart()
  })
  .catch((error) => {
    console.error("Lỗi:", error);
  });
}

getListCart();