function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  notificationMessage.textContent = message;
  if (isError) {
    notification.classList.add("error");
  } else {
    notification.classList.remove("error");
  }
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefoneFormatado").value;
    const instagram = document.getElementById("instagram").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
      showNotification("As senhas não coincidem.", true);
      return;
    }

    const payload = {
      nome,
      email,
      telefone,
      instagram,
      senha,
      cpf,
      dataNasc: null,
      genero: null,
      indicacao: null,
      status: true,
      nivelAcessoId: 2,
      enderecoId: null,
      empresaId: null,
      fichaAnamneseId: null,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/usuarios/cadastro-usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        localStorage.setItem("nome", nome);
        localStorage.setItem("email", email);
        localStorage.setItem("cpf", cpf);
        localStorage.setItem("instagram", instagram);
        localStorage.setItem("empresa", empresa);

        showNotification("Cadastro realizado com sucesso!");
        window.location.href = "../app/index/index.html";
      } else {
        showNotification("Cadastro realizado com sucesso!");
      }
    } catch (error) {
      showNotification("Cadastro realizado com sucesso!");
      setTimeout(() => {
        window.location.href = "../login/login.html";
    }, 2000);
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;
  
    const payload = {
      email,
      senha,
    };
  
    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const loginData = await response.json();
        
        // Limpa o localStorage antes de salvar novos dados
        localStorage.clear();

        // Salva o nome, email e cpf no localStorage
        localStorage.setItem("nome", loginData.nome);
        localStorage.setItem("email", loginData.email);
        localStorage.setItem("cpf", loginData.cpf);
        localStorage.setItem("instagram", loginData.instagram);
        localStorage.setItem("empresa", loginData.empresa?.idEmpresa);
        localStorage.setItem("idUsuario", loginData.idUsuario);
  
        // Chama a função para registrar o log de login
        await registrarLogLoginLogoff(loginData.idUsuario);
  
        showNotification("Login realizado com sucesso!");

        // Verifica se o dispositivo está em modo mobile (largura menor que 768px)
        if (window.innerWidth <= 768) {
          // Redireciona para a página mobile
          window.location.href = `../mobile/index-mobile/index-mobile.html?cpf=${loginData.cpf}`;
        } else {
          // Redireciona para a página desktop
          window.location.href = "../app/index/index.html";
        }

        // Verifica se há dados faltantes (por exemplo: data_nasc, genero, etc.)
        if (!loginData.data_nasc || !loginData.genero || !loginData.endereco) {
          // Exibe um modal pedindo para completar os dados após o redirecionamento
          setTimeout(() => {
            showModalParaCompletarDados();
          }, 2000); // Atraso para garantir o redirecionamento antes
        }
      } else {
        showNotification(
          "Erro ao realizar login. Verifique suas credenciais.",
          true
        );
      }
    } catch (error) {
      showNotification("Erro ao realizar login.", true);
      console.error("Erro:", error);
    }
  });

function showModalParaCompletarDados() {
  const modalCadastro = document.getElementById("modal-cadastro");
  modalCadastro.style.display = "block";
}

async function registrarLogLoginLogoff(idUsuario) {
  try {
    const logData = {
      logi: "LOGIN",
      dataHorario: new Date().toISOString(),
      fkUsuario: idUsuario,
    };
  
    const response = await fetch("http://localhost:8080/login-logoff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    });
  
    if (!response.ok) {
      throw new Error("Erro ao registrar log de login");
    }
  
    console.log("Log de login registrado com sucesso!");
  } catch (error) {
    console.error("Erro ao registrar o log de login:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  const mobileRegisterBtn = document.getElementById("mobileRegisterBtn");

  mobileLoginBtn.addEventListener("click", function () {
    signInForm.classList.add("active");
    signUpForm.classList.remove("active");
  });

  mobileRegisterBtn.addEventListener("click", function () {
    signUpForm.classList.add("active");
    signInForm.classList.remove("active");
  });

  signUpForm.classList.add("active");
});

document.addEventListener("DOMContentLoaded", function () {
  const instagramInput = document.getElementById("instagram");

  instagramInput.addEventListener("input", function (e) {
    let value = instagramInput.value;
    if (!value.startsWith("@")) {
      value = "@" + value;
    }
    value = value.replace(/\s+/g, "_").toLowerCase();
    instagramInput.value = value;
  });
});

function togglePasswordVisibility() {
  const senhaInput = document.getElementById("senha");
  const toggleIcon = document.getElementById("toggleIcon");

  if (senhaInput.type === "password") {
    senhaInput.type = "text";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  } else {
    senhaInput.type = "password";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  }
}

document.getElementById("telefone").addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (input.length > 2) {
    input = "(" + input.slice(0, 2) + ") " + input.slice(2);
  }
  if (input.length > 10) {
    input = input.slice(0, 10) + "-" + input.slice(10);
  }
  e.target.value = input;
  document.getElementById("telefoneFormatado").value = input.replace(/\D/g, "");
});

document.getElementById("cpf").addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, "");
  document.getElementById("cpfFormatado").value = input;
  if (input.length > 9) {
    input =
      input.slice(0, 3) +
      "." +
      input.slice(3, 6) +
      "." +
      input.slice(6, 9) +
      "-" +
      input.slice(9, 11);
  } else if (input.length > 6) {
    input = input.slice(0, 3) + "." + input.slice(3, 6) + "." + input.slice(6);
  } else if (input.length > 3) {
    input = input.slice(0, 3) + "." + input.slice(3);
  }
  e.target.value = input;
});

document.getElementById("nome").addEventListener("input", function (e) {
  let valueWithoutNumbers = e.target.value.replace(/\d/g, "");
  e.target.value = valueWithoutNumbers
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("email").addEventListener("input", function (e) {
    e.target.value = e.target.value.toLowerCase();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordInput = button.previousElementSibling;
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      button.innerHTML = type === "password" ? "&#128065;" : "&#128584;";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginEmail").addEventListener("input", function (e) {
    e.target.value = e.target.value.toLowerCase();
  });
});
