const getListBill = () => {
  const table = document.getElementById("table-bill");

  if (table.rows.length > 1) {
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
  }

  fetch(`http://127.0.0.1:8000/api/bill`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      totalPages = data.totalPages;

      data.forEach((element) => {
        const newRow = table.insertRow();
        newRow.innerHTML = `
        <td>${element.user.full_name}</td>
        <td>
            ${element.user.phone}
        </td>
        <td>${element.address}</td>
        <td>${formatCreatedAt(element.created_at)}</td>
        <td>${formatPrice(element.total) + "đ"}</td>
        <td>${
          element.status === 0 ? "Chờ xác nhận" : "Đã xác nhận"
        }</td>
        <td>
            ${
              element.status === 0
                ? `<button
                  type="button"
                  class="btn btn-warning"
                  onclick="updateStatusBill(${element.id})"
                >
                  Xác nhận
                </button>`
                : `
                <button
                type="button"
                class="btn btn-success"
              >
                Đã xác nhận
              </button>
              `
            }
          <button
            type="button"
            class="btn btn-danger"
            onclick="deleteBill(${element.id})"
          >
            Xóa
          </button>
        </td>
        `
      });
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const updateStatusBill = (id) => {
  const table = document.getElementById("table-bill");
  fetch(`http://127.0.0.1:8000/api/bill/${id}`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        Toastify({
          text: "Cập nhật thất bại",
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
      if (table.rows.length > 1) {
        while (table.rows.length > 1) {
          table.deleteRow(1);
        }
      }
      getListBill();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};


const deleteBill = (id) => {
    const table = document.getElementById("table-bill");
    fetch(`http://127.0.0.1:8000/api/bill/${id}`, {
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
        if (table.rows.length > 1) {
            while (table.rows.length > 1) {
              table.deleteRow(1);
            }
          }
        getListBill();
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  };

getListBill();
