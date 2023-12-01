const formatPrice = (price) => {
  const priceToNumber = parseInt(price);
  return priceToNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const productsPerPage = 9;
let currentPage = 1;
let totalPages = 1;

const getListProduct = (page, pageSize) => {
  const card = document.querySelector(".list-product-new");
  let cardHtml = "";

  fetch(`http://127.0.0.1:8000/api/product?page=${page}&pageSize=${pageSize}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      totalPages = data.totalPages;

      data.data.forEach((element) => {
        cardHtml += `
            <div class="product-new-item">
            <div class="product-new-sale">- ${element.sale}%</div>
            <img
              src="${element.image}"
              alt=""
              class="product-new-img"
            />
            <div class="product-new-name">${element.name}</div>
            <div class="product-new-price">
              <div class="product-price-default">${formatPrice(
                element.price
              )}₫</div>
              <div class="product-price-sale">${formatPrice(
                element.price - element.price * (element.sale / 100)
              )}₫</div>
            </div>
            <div class="product-new-btn">
              <a href='/page/detail/index.html?id=${element.id}'>
                <button class="product-buy-btn">MUA HÀNG</button>
              </a>
              <button class="product-new-eye">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                      stroke="#ffffff"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                      stroke="#ffffff"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        `;
      });
      card.innerHTML = cardHtml;

      createPagination(totalPages, page);
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const createPagination = (totalPages, currentPage) => {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const prevButton = createPaginationButton("Trước", currentPage - 1);
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPaginationButton(i, i);
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = createPaginationButton("Sau", currentPage + 1);
  paginationContainer.appendChild(nextButton);
};

const createPaginationButton = (label, page) => {
  const li = document.createElement("li");
  li.classList.add("page-item");

  const button = document.createElement("button");
  button.classList.add("page-link");
  button.textContent = label;

  button.addEventListener("click", () => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      getListProduct(currentPage, productsPerPage);
    }
  });

  li.appendChild(button);
  return li;
};

fetch("http://127.0.0.1:8000/api/product")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    totalPages = data.totalPages;
    createPagination(totalPages, currentPage);

    getListProduct(currentPage, productsPerPage);
  })
  .catch((error) => {
    console.error("Lỗi:", error);
  });
