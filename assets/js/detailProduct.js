const formatPrice = (price) => {
    const priceToNumber = parseInt(price);
    return priceToNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  

const getDetailProduct = () => {

    const idParams = new URLSearchParams(window.location.search);
    const id = idParams.get('id');
    let detailhtml = '';

    const detailProduct = document.getElementById('detailProduct');
  
    fetch(`http://127.0.0.1:8000/api/product/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        detailhtml += `
        <div class="product-row">
        <!-- Product media -->
        <div class="product-media">
          <img
            src=${data.image}
            alt="Giày tây nâu đỏ thương hiệu Converse All Star"
            class="product-item__img--heading"
          />
        </div>
        <!-- Product info -->
        <div class="product-info">
          <h1 class="product-heading">
            ${data.name}
          </h1>
          <!-- Brand -->
          <div class="product-info-row">
            <p class="product-info-row__item">
              <strong class="product-info-row__heignlight">
                Tình trạng:
              </strong>
              ${data.quantity  > 0 ? "Còn hàng" : "Hết hàng"}
            </p>
          </div>
          <!-- Price -->
          <div class="product-price">
            <span class="product-price__item">${formatPrice(
              data.price - data.price * (data.sale / 100)
            )}₫</span>
            <span class="product-price__discount">${formatPrice(data.price)}₫</span>
          </div>
          <!-- Description -->
          <div class="product-info-block">
            <span class="product-info__desc"> Bảo hành: 12 tháng </span>
            <span class="product-info__desc">Xuất xứ: Mỹ</span>
          </div>
          <!-- Product color -->
          <!-- quantity list -->
          <div class="product-info-wrapper">
            <!-- quantity -->
            <div class="product-info-quantity">
              <span class="product-info-quantity__desc">Số lượng:</span>
              <div class="product-info-choise">
                <span class="product-info-choise__number">${data.quantity}</span>
              </div>
            </div>
            <!-- Button -->
            <button onclick="addToCart(${data.id})" class="product-info__cart" type="submit">
              Thêm vào giỏ hàng
            </button>
            <!-- Phone -->
            <p class="product-info-phone">
              Gọi
              <a class="product-info-phone__item" href="tel:1900 6750"
                >1900 6750</a
              >
              để được trợ giúp
            </p>
          </div>
        </div>
      </div>
      `;
  
          detailProduct.innerHTML = detailhtml
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  };

  const addToCart = (id) =>{
    const user_id = localStorage.getItem("userId");
    fetch(`http://127.0.0.1:8000/api/${user_id}/cart/${id}`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        Toastify({
          text: "Thêm giỏ hàng thất bại",
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
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
  }
  getDetailProduct()
  