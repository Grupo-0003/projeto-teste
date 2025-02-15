document.addEventListener("DOMContentLoaded", function () {
  // Função para exibir notificação
  function showNotification(message, isError = false, redirectUrl = null) {
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
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000); // Espera 2 segundos antes de redirecionar
      }
    }, 3000);
  }

  const instagramInput = document.getElementById("instagram");

  instagramInput.addEventListener("input", function (e) {
    let value = instagramInput.value;

    // Adiciona @ no início se ainda não tiver
    if (!value.startsWith("@")) {
      value = "@" + value;
    }

    // Substitui espaços por sublinhados
    value = value.replace(/\s+/g, "_");

    // Transforma todas as letras em minúsculas
    value = value.toLowerCase();

    // Atualiza o valor do campo com as modificações
    instagramInput.value = value;
  });

  document.getElementById("nome").addEventListener("input", function (e) {
    let input = e.target.value;

    // Remove números do valor do input
    let valueWithoutNumbers = input.replace(/\d/g, "");

    // Divide as palavras, capitaliza a primeira letra de cada uma, e une de volta
    valueWithoutNumbers = valueWithoutNumbers
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // Atualiza o campo de nome com a nova formatação
    e.target.value = valueWithoutNumbers;
  });

  document.getElementById("telefone").addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    // Limita o comprimento da string a 11 caracteres
    input = input.slice(0, 11);

    if (input.length > 2) {
      input = "(" + input.slice(0, 2) + ") " + input.slice(2);
    }
    if (input.length > 10) {
      // Corrige para inserir o hífen após o décimo caractere
      input = input.slice(0, 10) + "-" + input.slice(10);
    }
    e.target.value = input; // Atualiza o campo de telefone com a formatação
  });

  document.getElementById("cpf").addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    // Atualiza o campo oculto com o valor sem formatação antes de aplicar a formatação
    document.getElementById("cpfFormatado").value = input;

    // Formata com pontos e traço para exibição
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
      input =
        input.slice(0, 3) + "." + input.slice(3, 6) + "." + input.slice(6);
    } else if (input.length > 3) {
      input = input.slice(0, 3) + "." + input.slice(3);
    }
    e.target.value = input; // Atualiza o campo de CPF com a formatação
  });

  document.getElementById("email").addEventListener("input", function (e) {
    e.target.value = e.target.value.toLowerCase();
  });

  

  // Função para buscar endereço pelo CEP usando a API do ViaCEP
  async function buscarEnderecoPorCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new Error("Erro ao buscar o endereço pelo CEP");
      }

      const endereco = await response.json();

      if (endereco.erro) {
        showNotification(
          "CEP não encontrado. Verifique e tente novamente.",
          true
        );
        return null;
      }

      // Preenche os campos de endereço
      document.getElementById("logradouro").value = endereco.logradouro;
      document.getElementById("bairro").value = endereco.bairro;
      document.getElementById("cidade").value = endereco.localidade;
      document.getElementById("estado").value = endereco.uf;

      return endereco;
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      showNotification("Erro ao buscar o endereço. Tente novamente.", true);
    }
  }

  // Adiciona o evento de blur ao campo de CEP para buscar o endereço
  document.getElementById("cep").addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, ""); // Remove qualquer caracter não numérico

    if (cep.length === 8) {
      await buscarEnderecoPorCep(cep);
    } else {
      showNotification("CEP inválido. Verifique e tente novamente.", true);
    }
  });

  document
    .getElementById("usuarioForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      // Remover pontuações para enviar ao banco
      const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
      const telefone = document
        .getElementById("telefone")
        .value.replace(/\D/g, "");

      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const instagram = document.getElementById("instagram").value;
      const senha = document.getElementById("senha").value;
      const dataNasc = document.getElementById("nascimento").value;
      const genero = document.getElementById("genero").value;
      const nivelAcessoId = document.getElementById("nivelAcesso").value; // Captura o valor do nível de acesso

      // Captura o valor de empresa do localStorage
      const empresaId = localStorage.getItem("empresa");

      const logradouro = document.getElementById("logradouro").value;
      const numero = parseInt(document.getElementById("numero").value);
      const cep = document.getElementById("cep").value;
      const bairro = document.getElementById("bairro").value;
      const cidade = document.getElementById("cidade").value;
      const estado = document.getElementById("estado").value;
      const complemento = document.getElementById("complemento").value;

      try {
        // Cadastra o endereço
        const enderecoResponse = await fetch(
          "http://localhost:8080/api/enderecos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              logradouro,
              numero,
              cep,
              bairro,
              cidade,
              estado,
              complemento,
            }),
          }
        );

        if (!enderecoResponse.ok) {
          const errorText = await enderecoResponse.text();
          throw new Error("Erro ao cadastrar endereço: " + errorText);
        }

        // Obtém o ID do último endereço cadastrado
        const ultimoEnderecoResponse = await fetch(
          "http://localhost:8080/api/enderecos/ultimo"
        );

        if (!ultimoEnderecoResponse.ok) {
          throw new Error("Erro ao buscar o último endereço cadastrado.");
        }

        const enderecoId = await ultimoEnderecoResponse.json();
        console.log("Último endereço cadastrado com ID:", enderecoId);

        // Continua com o cadastro do funcionário usando o ID do último endereço, nível de acesso e empresaId
        const usuarioResponse = await fetch(
          "http://localhost:8080/usuarios/cadastro-usuario",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome,
              email,
              telefone,
              instagram,
              senha,
              cpf,
              dataNasc,
              genero,
              status: true,
              nivelAcessoId: parseInt(nivelAcessoId), // Converte o valor para número antes de enviar
              enderecoId,
              empresaId: parseInt(empresaId), // Converte o valor de empresaId para número antes de enviar
            }),
          }
        );

        if (usuarioResponse.ok) {
          console.log("Funcionário cadastrado com sucesso.");

          showNotification(
            "Cadastro realizado com sucesso!",
            false,
            "../../perfil.html"
          );
        } else {
          const errorText = await usuarioResponse.text();
          throw new Error(
            "Erro ao realizar cadastro de funcionário: " + errorText
          );
        }
      } catch (error) {
        console.error("Erro geral:", error);
        showNotification(error.message, true);
      }
    });

  // Configuração adicional e carregamento de imagem (opcional)
  async function carregarImagem2() {
    const cpf = localStorage.getItem("cpf"); // Captura o valor do CPF a cada execução
    const perfilImage = document.getElementById("perfilImage");

    if (!cpf) {
      console.log("CPF não encontrado.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const blob = await response.blob(); // Recebe a imagem como Blob
        const imageUrl = URL.createObjectURL(blob); // Cria uma URL temporária para o Blob

        // Define a URL da imagem carregada como src do img
        perfilImage.src = imageUrl;
        perfilImage.alt = "Foto do usuário";
        perfilImage.style.width = "20vh";
        perfilImage.style.height = "20vh";
        perfilImage.style.borderRadius = "300px";
      } else {
        console.log("Imagem não encontrada para o CPF informado.");
      }
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }

  // Carrega a imagem automaticamente quando a página termina de carregar
  window.onload = carregarImagem2;
  
});


document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
  new window.VLibras.Widget('https://vlibras.gov.br/app');
});
