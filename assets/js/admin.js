const formatPrice = (price) => {
  const priceToNumber = parseInt(price);
  return priceToNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const openFileSelection = () => {
  document.getElementById("imageFile").click();
};

const displaySelectedImage = (event, targetId) => {
  const selectedImage = document.getElementById(targetId);
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
  } else {
    selectedImage.src =
      "https://researchcoach.co.uk/wp-content/plugins/accelerated-mobile-pages/images/SD-default-image.png";
  }
};

const openFileSelectionUpdate = () => {
  document.getElementById("imageFileUpdate").click();
};

const displaySelectedImageUpdate = (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
    
      document.getElementById("selectedImageUpdate").src = e.target.result
    };

    reader.readAsDataURL(file);
  } else {
    selectedImage.src =
      "https://researchcoach.co.uk/wp-content/plugins/accelerated-mobile-pages/images/SD-default-image.png";
  }
};


let productId
const showModalUpdateProduct = (id, name, price, sale, quantity, type, image) => {

  document.getElementById("updateProductName").value = name;
  document.getElementById("updateProductPrice").value = price;
  document.getElementById("updateProductSale").value = sale;
  document.getElementById("updateProductQuantity").value = quantity;
  document.getElementById("updateProductCategory").value = type;
  document.getElementById("selectedImageUpdate").src = image;
  document.getElementById("imageFileUpdate").value = "";
  productId = id
};

let deleteData = {};
const deleteProduct = (id, name) => {
  const deleteProductName = document.getElementById("deleteProductName");
  deleteProductName.textContent = name;
  deleteData.id = id;
};

const productsPerPage = 2;
let currentPage = 1;
let totalPages = 1;

const getListProduct = (page, pageSize) => {
  const table = document.getElementById("table-product");

  if (table.rows.length > 1) {
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
  }

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
        const newRow = table.insertRow();
        newRow.innerHTML = `
      <th scope="row">${element.id}</th>
      <td>${element.name}</td>
      <td>
        <img
          class="img-product-table"
          src=${element.image}
          alt=""
        />
      </td>
      <td>${element.sale + "%"}</td>
      <td>${formatPrice(element.price) + "₫"}</td>
      <td>${
        formatPrice(element.price - element.price * (element.sale / 100)) + "₫"
      }</td>
      <td>${element.quantity}</td>
      <td>
        <button
          type="button"
          class="btn btn-danger"
          data-bs-toggle="modal"
          data-bs-target="#deleteProductModal"
          onclick="deleteProduct(${element.id}, '${element.name}')"
        >
          Xóa
        </button>
        <button
          onclick="showModalUpdateProduct(${element.id}, '${element.name}', ${
          element.price
        }, ${element.sale}, ${element.quantity}, '${element.type}' ,'${
          element.image
        }')"
          type="button"
          class="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#updateModal"
        >
          Cập nhật
        </button>
      </td>
      `;
      });

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

const addProduct = () => {
  const hiddenDismissButton = document.getElementById("hiddenDismissButton");

  const productName = document.getElementById("productName").value;
  const productPrice = document.getElementById("productPrice").value;
  const productPromotion = document.getElementById("productPromotion").value;
  const productQuantity = document.getElementById("productQuantity").value;
  const productCategory = document.getElementById("productCategory").value;

  const formData = new FormData();
  formData.append("name", productName);
  formData.append("price", productPrice);
  formData.append("quantity", productQuantity);
  formData.append("sale", productPromotion);
  formData.append("type", productCategory);
  formData.append("image", document.getElementById("imageFile").files[0]);

  fetch("http://127.0.0.1:8000/api/product", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        Toastify({
          text: "Thêm mới thất bại",
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
      const table = document.getElementById("table-product");
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      getListProduct();
      hiddenDismissButton.click();
      document.getElementById("productName").value = '';
      document.getElementById("productPrice").value = '';
      document.getElementById("productPromotion").value = '';
      document.getElementById("productQuantity").value = '';
      document.getElementById("productCategory").value = '';
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const updateProduct = () => {
  const hiddenDismissButton = document.getElementById("hiddenButtonSave");

  const productName = document.getElementById("updateProductName").value;
  const productPrice = document.getElementById("updateProductPrice").value;
  const productPromotion = document.getElementById("updateProductSale").value;
  const productQuantity = document.getElementById("updateProductQuantity").value;
  const productCategory = document.getElementById("updateProductCategory").value;

  const formData = new FormData();
  formData.append("name", productName);
  formData.append("price", productPrice);
  formData.append("quantity", productQuantity);
  formData.append("sale", productPromotion);
  formData.append("type", productCategory);
  formData.append("image", document.getElementById("imageFileUpdate").files[0]);

  fetch(`http://127.0.0.1:8000/api/product/${productId}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        Toastify({
          text: "Cập nhật sản phẩm thất bại",
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
      const table = document.getElementById("table-product");
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      getListProduct();
      hiddenDismissButton.click();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const deleteProductAction = () => {
  const closeModalDeleteProduct = document.getElementById(
    "closeModalDeleteProduct"
  );

  fetch(`http://127.0.0.1:8000/api/product/${deleteData.id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        Toastify({
          text: data.message,
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
      const table = document.getElementById("table-product");
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      getListProduct();
      closeModalDeleteProduct.click();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};


