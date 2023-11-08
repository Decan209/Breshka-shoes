const emailIsValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const loginUser = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let isValid = true;

  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  if (!emailIsValid(email)) {
    document.getElementById("emailError").textContent = "Email không hợp lệ.";
    isValid = false;
  }

  if (password.length < 8) {
    document.getElementById("passwordError").textContent =
      "Mật khẩu phải có ít nhất 8 ký tự.";
    isValid = false;
  }

  if (isValid) {
    const data = {
      email: email,
      password: password,
    };

    fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
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
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userPhone", data.phone);
        localStorage.setItem("userProtected", data.is_admin);

        if (data.is_admin === 1) {
            window.location.href = "/page/Admin/index.html";
        } else {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }
};
