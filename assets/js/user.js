const formatCreatedAt = (createdAtString) => {
  const createdAt = new Date(createdAtString);
  const hours = String(createdAt.getHours()).padStart(2, "0");
  const minutes = String(createdAt.getMinutes()).padStart(2, "0");
  const seconds = String(createdAt.getSeconds()).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const year = createdAt.getFullYear();

  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};

const clearTableAndLoadData = async()=> {
    console.log("test");
    const tableAdmin = document.getElementById("table-admin");
    const tableUser = document.getElementById("table-user");

    while (tableAdmin.rows.length > 1 || tableUser.rows.length > 1) {
        if (tableAdmin.rows.length > 1) {
            tableAdmin.deleteRow(1);
        }
        if (tableUser.rows.length > 1) {
            tableUser.deleteRow(1);
        }
    }

    await getListAdmin();
    await getListUser(); 
}



const getListAdmin = () => {
  const table = document.getElementById("table-admin");

  fetch("http://127.0.0.1:8000/api/admin")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((element) => {
        const newRow = table.insertRow();
        newRow.innerHTML = `
        <th scope="row">${element.id}</th>
        <td>${element.full_name}</td>
        <td>${element.email}</td>
        <td>${element.phone ? element.phone : ""}</td>
        <td>${element.status === 1 ? "Hoạt động" : "Đã bị khóa"}</td>
        <td>${formatCreatedAt(element.created_at)}</td>
        <td>
         ${
           element.protected === 1
             ? ""
             : `
             <button type="button" class="btn btn-warning" onclick="updateStatus(${
               element.id
             })">${element.status === 1 ? "Khóa" : "Mở khóa"}</button>
            <button
                type="button"
                class="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#updateAdminModal"
                onclick="showModalUpdate(${element.id}, '${
                 element.full_name
               }', '${element.email}', '${element.phone}')"
            >
            Cập nhật
            </button>`
         }
        </td>
        `;
      });
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const getListUser = () => {
  const table = document.getElementById("table-user");

  fetch("http://127.0.0.1:8000/api/user")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((element) => {
        const newRow = table.insertRow();
        newRow.innerHTML = `
          <th scope="row">${element.id}</th>
          <td>${element.full_name}</td>
          <td>${element.email}</td>
          <td>${element.phone ? element.phone : ""}</td>
          <td>${element.status === 1 ? "Hoạt động" : "Đã bị khóa"}</td>
          <td>${formatCreatedAt(element.created_at)}</td>
          <td>
            <button type="button" class="btn btn-warning" onclick="updateStatus(${
                element.id
            })">${element.status === 1 ? "Khóa" : "Mở khóa"}</button>    
          </td>
          `;
      });
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const addAdmin = () => {
  const hiddenDismissButton = document.getElementById(
    "hiddenDismissButtonAdmin"
  );

  const adminName = document.getElementById("adminName").value;
  const adminEmail = document.getElementById("adminEmail").value;
  const adminPhone = document.getElementById("adminPhone").value;
  const adminPassword = document.getElementById("adminPassword").value;

  const data = {
    full_name: adminName,
    email: adminEmail,
    password: adminPassword,
    phone: adminPhone,
  };

  fetch("http://127.0.0.1:8000/api/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        Toastify({
          text: "Thêm tài khoản thất bại",
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
      const table = document.getElementById("table-admin");
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      getListAdmin();
      hiddenDismissButton.click();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

const updateStatus = (id) => {
  fetch(`http://127.0.0.1:8000/api/admin/status/${id}`, {
    method: "PATCH",
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
      clearTableAndLoadData();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

let adminId;

const showModalUpdate = (id, full_name, email, phone) => {
  document.getElementById("updateAdminName").value = full_name;
  document.getElementById("updateAdminEmail").value = email;
  document.getElementById("updateAdminPhone").value = phone;
  document.getElementById("updateAdminPassword").value = "";
  adminId = id;
};

const updateAdmin = () => {
  const hiddenDismissButton = document.getElementById("hiddenUpdateAdminModal");

  const adminName = document.getElementById("updateAdminName").value;
  const adminEmail = document.getElementById("updateAdminEmail").value;
  const adminPhone = document.getElementById("updateAdminPhone").value;
  const adminPassword = document.getElementById("updateAdminPassword").value;

  const data = {
    full_name: adminName,
    email: adminEmail,
    password: adminPassword,
    phone: adminPhone,
  };

  fetch(`http://127.0.0.1:8000/api/admin/${adminId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.json().then((data) => {
          Toastify({
            text: data.message,
            backgroundColor: "red",
          }).showToast();
        });
      }
    })
    .then((data) => {
      Toastify({
        text: data.message,
        backgroundColor: "green",
      }).showToast();
      const table = document.getElementById("table-admin");
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      getListAdmin();
      hiddenDismissButton.click();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};

// const deleteProductAction = () => {
//   const closeModalDeleteProduct = document.getElementById(
//     "closeModalDeleteProduct"
//   );

//   fetch(`http://127.0.0.1:8000/api/product/${deleteData.id}`, {
//     method: "DELETE",
//   })
//     .then((response) => {
//       if (!response.ok) {
//         Toastify({
//           text: data.message,
//           backgroundColor: "red",
//         }).showToast();
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       Toastify({
//         text: data.message,
//         backgroundColor: "green",
//       }).showToast();
//       const table = document.getElementById("table-product");
//       while (table.rows.length > 1) {
//         table.deleteRow(1);
//       }
//       getListProduct();
//       closeModalDeleteProduct.click();
//     })
//     .catch((error) => {
//       console.error("Lỗi:", error);
//     });
// };

getListAdmin();
getListUser();
