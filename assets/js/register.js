const emailIsValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const phoneIsValid = (phone) => {
  if (phone) {
    return /^[0-9]{10}$/.test(phone);
  }
  return true;
};

const nameIsValid = (name) => {
  return /^[\p{L} ]+$/u.test(name);
};

const registerUser = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const fistName = document.getElementById("fistName").value;
  const lastName = document.getElementById("lastName").value;

  let isValid = true;

  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("fistNameError").textContent = "";
  document.getElementById("lastNameError").textContent = "";

  if (!emailIsValid(email)) {
    document.getElementById("emailError").textContent = "Email không hợp lệ.";
    isValid = false;
  }

  if (password.length < 8) {
    document.getElementById("passwordError").textContent =
      "Mật khẩu phải có ít nhất 8 ký tự.";
    isValid = false;
  }

  if (!phoneIsValid(phone)) {
    document.getElementById("phoneError").textContent =
      "Số điện thoại không hợp lệ.";
    isValid = false;
  }

  if (!nameIsValid(fistName)) {
    document.getElementById("fistNameError").textContent =
      "Tên không được chứa ký tự đặc biệt hoặc số.";
    isValid = false;
  }

  if (!nameIsValid(lastName)) {
    document.getElementById("lastNameError").textContent =
      "Họ không được chứa ký tự đặc biệt hoặc số.";
    isValid = false;
  }

  if (!email) {
    document.getElementById("emailError").textContent = "Email không được bỏ trống.";
    isValid = false;
  }

  if (!fistName) {
    document.getElementById("fistNameError").textContent =
      "Tên không được bỏ trống.";
    isValid = false;
  }

  if (!lastName) {
    document.getElementById("lastNameError").textContent =
      "Họ không được bỏ trống.";
    isValid = false;
  }

  if (isValid) {
    const data = {
      email: email,
      password: password,
      fist_name: fistName,
      last_name: lastName,
      phone: phone,
    };

    fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
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
        window.location.href = "/page/login/index.html";
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }
};
