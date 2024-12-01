function showNotification(message, isError = false) {
  console.log("Exibindo notificação:", message, isError); // Adiciona um log para verificar
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");

  if (!notification || !notificationMessage) {
    console.error("Elementos de notificação não encontrados no DOM.");
    return; // Evita erros se os elementos não existirem
  }

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


document.addEventListener("DOMContentLoaded", () => {
  let isEditingPersonal = false;
  let isEditingEmpresa = false;

  // Função para alternar a edição dos campos do formulário de usuário
  // function toggleEditing() {
  //   if (isEditingEmpresa) {
  //     toggleEditingEmpresa(); // Se os campos empresariais estão sendo editados, desativa
  //   }
  //   isEditingPersonal = !isEditingPersonal;
  
  //   const lockIcons = document.querySelectorAll("#personalForm .lock-icon");
  //   const fields = document.querySelectorAll("#personalForm input, #personalForm select");
  //   const saveButton = document.getElementById("save-usuario-button");
  //   const globalSaveButton = document.querySelector(".save-button"); // Botão geral de salvar
  
  //   if (isEditingPersonal) {
  //     lockIcons.forEach((lockIcon) => {
  //       lockIcon.style.display = "inline"; // Exibe ícones de cadeado
  //     });
  
  //     fields.forEach((field) => {
  //       if (field.id !== "cpf" && field.id !== "nascimento") {
  //         // Apenas habilita campos que não sejam CPF e Data de Nascimento
  //         field.disabled = false;
  //       }
  //     });
  
  //     saveButton.disabled = false; // Habilita o botão de salvar dados pessoais
  //     if (globalSaveButton) globalSaveButton.disabled = false; // Habilita o botão geral de salvar
  //   } else {
  //     lockIcons.forEach((lockIcon) => {
  //       lockIcon.style.display = "none"; // Oculta ícones de cadeado
  //     });
  
  //     fields.forEach((field) => {
  //       field.disabled = true; // Desabilita todos os campos
  //     });
  
  //     saveButton.disabled = true; // Desabilita o botão de salvar dados pessoais
  //     if (globalSaveButton) globalSaveButton.disabled = true; // Desabilita o botão geral de salvar
  //   }
  
  //   // Garante que CPF e Data de Nascimento permaneçam desabilitados
  //   const cpfField = document.getElementById("cpf");
  //   const nascimentoField = document.getElementById("nascimento");
  
  //   if (cpfField) cpfField.disabled = true;
  //   if (nascimentoField) nascimentoField.disabled = true;
  // }
  
  

  // Função para alternar a edição dos campos do formulário de empresa
  function toggleEditingEmpresa() {
    if (isEditingPersonal) {
      toggleEditing(); // Se os campos pessoais estão sendo editados, desativa
    }
    isEditingEmpresa = !isEditingEmpresa;
  
    const lockIcons = document.querySelectorAll("#empresaForm .lock-icon");
    const fields = document.querySelectorAll("#empresaForm input, #empresaForm select");
    const saveButton = document.getElementById("save-empresa");
    const cnpjField = document.getElementById("cnpj"); // Seleciona o campo de CNPJ
  
    if (isEditingEmpresa) {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "inline"; // Exibe ícones de cadeado
      });
  
      fields.forEach((field) => {
        if (field.id !== "cnpj") {
          // Apenas habilita campos que não sejam o CNPJ
          field.disabled = false;
        }
      });
  
      saveButton.disabled = false; // Habilita o botão de salvar
    } else {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "none"; // Oculta ícones de cadeado
      });
  
      fields.forEach((field) => {
        field.disabled = true; // Desabilita todos os campos
      });
  
      saveButton.disabled = true; // Desabilita o botão de salvar
    }
  
    // Garante que o CNPJ permanece desabilitado
    if (cnpjField) {
      cnpjField.disabled = true;
    }
  }
  

  document.getElementById("save-empresa").addEventListener("click", function (event) {
    event.preventDefault(); // Evita o comportamento padrão do botão
    const modal = document.getElementById("modalEditarEmpresa");
    modal.style.display = "block"; // Exibe o modal
  });
  
  // Função para fechar o modal
  document.getElementById("fechar_modal").addEventListener("click", function () {
    const modal = document.getElementById("modalEditarEmpresa");
    modal.style.display = "none"; // Fecha o modal
  });

  document.getElementById("save-usuario-button").addEventListener("click", function (event) {
    event.preventDefault(); // Evita o comportamento padrão do botão
    const modal = document.getElementById("modalEditarUsuario");
    modal.style.display = "block"; // Exibe o modal
  });
  
  // Função para fechar o modal
  document.getElementById("fechar_modal_usuario").addEventListener("click", function () {
    const modal = document.getElementById("modalEditarUsuario");
    modal.style.display = "none"; // Fecha o modal
  });


  document.getElementById("atualizar-empresa").addEventListener("click", function () {
    // Capturar os valores dos inputs
    const nomeEmpresa = document.getElementById("empresa").value;
    const cnpj = formatCnpj(document.getElementById("cnpj").value); // Remove a máscara do CNPJ
    const telefone = formatPhoneNumberToLong(document.getElementById("telefone-empresa").value);
    const cep = formatCep(document.getElementById("cep").value);
    const logradouro = document.getElementById("logradouro").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade-empresa").value;
    const estado = document.getElementById("estado-empresa").value;
    const diaInicio = document.getElementById("diaInicio").value;
    const diaFim = document.getElementById("diaFim").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFim = document.getElementById("horaFim").value;
  
    // Montar o objeto para enviar para a API
    const empresaData = {
      nome: nomeEmpresa,
      telefone: telefone,
      cnpj: cnpj,
      endereco: {
        logradouro: logradouro,
        cep: cep,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        numero: numero,
        complemento: complemento,
      },
      horarioFuncionamento: {
        diaInicio: diaInicio,
        diaFim: diaFim,
        horarioAbertura: horaInicio,
        horarioFechamento: horaFim,
      },
    };
  
    // Recuperar o CPF do localStorage
    const cpf = localStorage.getItem("cpf");
  
    if (!cpf) {
      showNotification("CPF não encontrado. Faça login novamente.", true);
      return;
    }
  
    // Fazer requisição PUT para o endpoint de atualização de empresa
    fetch(`http://localhost:8080/api/empresas/${cpf}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresaData),
    })
      .then((response) => {
        if (!response.ok) {
          // Se a resposta não for OK, lançar um erro para o catch
          throw new Error(`Erro ao atualizar empresa: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Exibir notificação de sucesso
        showNotification("Empresa atualizada com sucesso!", false);
  
        // Fecha o modal
        document.getElementById("modalEditarEmpresa").style.display = "none";
  
        // Recarregar a página após 1 segundo
        setTimeout(function () {
          location.reload();
        }, 1000);
      })
      .catch((error) => {
        // Exibir notificação de erro
        showNotification(error.message, true);
      });
  });
  
  document.getElementById("atualizar-usuario").addEventListener("click", async function () {
    try {
      // Recuperar o CPF do localStorage
      const cpf = localStorage.getItem("cpf");
      if (!cpf) {
        showNotification("CPF não encontrado. Faça login novamente.", true);
        return;
      }
  
      // Capturar os valores dos inputs
      const usuarioDTO = {
        nome: document.getElementById("nome").value,
        dataNasc: document.getElementById("nascimento").value,
        telefone: formatPhoneNumberToLong(document.getElementById("telefone").value), // Converte o telefone para o formato longo
        genero: document.getElementById("genero").value,
        instagram: document.getElementById("instagram").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
      };
  
      // Fazer requisição PATCH para o endpoint de atualização de usuário
      const usuarioResponse = await fetch(
        `http://localhost:8080/usuarios/atualizacao-usuario-por-cpf/${cpf}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioDTO),
        }
      );
  
      // Verificar se a resposta foi bem-sucedida
      if (!usuarioResponse.ok) {
        throw new Error(`Erro ao atualizar usuário: ${usuarioResponse.status}`);
      }
  
      // Exibir notificação de sucesso
      showNotification("Dados do usuário atualizados com sucesso!", false);
  
      // Atualizar localStorage com os novos dados
      localStorage.setItem("nome", usuarioDTO.nome);
      localStorage.setItem("instagram", usuarioDTO.instagram);
  
      // Recarregar a página após 1 segundo
      setTimeout(function () {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
  
      // Exibir notificação de erro
      showNotification("Erro ao atualizar dados do usuário!", true);
    }
  });
  
  

  // Adicionar o event listener ao botão de editar dados empresariais
  const editIconEmpresa = document.getElementById("editIconEmpresa");
  if (editIconEmpresa) {
    editIconEmpresa.addEventListener("click", toggleEditingEmpresa);
  }

  

  // Função auxiliar para formatar o número de telefone para o formato correto
  function formatPhoneNumberToLong(phoneNumber) {
    if (!phoneNumber) return null;
    const cleaned = String(phoneNumber).replace(/\D/g, ""); // Remove caracteres não numéricos
    return parseInt(cleaned, 10); // Converte para número
  }

  // Adicionar o event listener ao botão de salvar dados pessoais
  // const saveUsuarioButton = document.getElementById("save-usuario-button");
  // if (saveUsuarioButton) {
  //   saveUsuarioButton.addEventListener("click", async function () {
  //     await atualizarUsuario();
  //   });
  // }

  // Adicionar o event listener ao botão de salvar dados empresariais
  // const saveEmpresaButton = document.getElementById("save-empresa-button");
  // if (saveEmpresaButton) {
  //   saveEmpresaButton.addEventListener("click", async function () {
  //     await atualizarEmpresa();
  //   });
  // }

  // Função para carregar os dados do usuário e empresa
  async function carregarDados() {
    const cpf = localStorage.getItem("cpf");
    if (cpf) {
      const userData = await fetchUserDataByCpf(cpf);
      if (userData) {
        // Preencher dados pessoais
        document.getElementById("nome").value = userData.nome || "";
        document.getElementById("nascimento").value = userData.dataNasc || "";
        document.getElementById("telefone").value = formatPhoneNumber(
          userData.telefone || ""
        );
        document.getElementById("cpf").value = userData.cpf || "";
        document.getElementById("genero").value = userData.genero || "";
        document.getElementById("instagram").value = userData.instagram || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("senha").value = userData.senha || "";

        // Preencher dados da empresa, se existirem
        if (userData.empresa) {
          document.getElementById("empresa").value =
            userData.empresa.nome || "";
          document.getElementById("cnpj").value = formatCnpj(userData.empresa.cnpj || "");
          document.getElementById("telefone-empresa").value =
          formatPhoneNumber(userData.empresa.telefone || "");
          document.getElementById("cep").value =
          formatCep(userData.empresa.endereco.cep || "");
          document.getElementById("logradouro").value =
            userData.empresa.endereco.logradouro || "";
          document.getElementById("numero").value =
            userData.empresa.endereco.numero || "";
          document.getElementById("bairro").value =
            userData.empresa.endereco.bairro || "";
          document.getElementById("cidade-empresa").value =
            userData.empresa.endereco.cidade || "";
          document.getElementById("estado-empresa").value =
            userData.empresa.endereco.estado || "";
          document.getElementById("complemento").value =
            userData.empresa.endereco.complemento || "";
          document.getElementById("diaInicio").value =
            userData.empresa.horarioFuncionamento.diaInicio || "";
          document.getElementById("diaFim").value =
            userData.empresa.horarioFuncionamento.diaFim || "";
          document.getElementById("horaInicio").value =
            userData.empresa.horarioFuncionamento.horarioAbertura || "";
          document.getElementById("horaFim").value =
            userData.empresa.horarioFuncionamento.horarioFechamento || "";
        }
      }
    }
  }

  carregarDados(); // Carregar os dados do usuário e empresa ao iniciar a página

  // Obtém os elementos do DOM
const importButton = document.getElementById('import-button');
const fileInput = document.getElementById('file-input');
const importExportModal = document.getElementById('importExportModal');
const closeModalButton = document.getElementById('close-modal-btn');
const importModalButton = document.getElementById('import-modal-btn');
const exportModalButton = document.getElementById('export-modal-btn');

// Função para abrir o modal
importButton.addEventListener('click', () => {
  importExportModal.style.display = 'flex'; // Exibe o modal
});

// Fechar o modal ao clicar no X
closeModalButton.addEventListener('click', () => {
  importExportModal.style.display = 'none'; // Fecha o modal
});
// Função de Importação
importModalButton.addEventListener('click', () => {
  fileInput.click(); // Simula o clique no input de arquivo
});

// Função de Exportação
exportModalButton.addEventListener('click', () => {
  try {
    // Localiza o arquivo no diretório do projeto
    const filePath = '../../Documento de Layout.docx'; // Caminho relativo ao documento

    // Cria um link para download
    const link = document.createElement('a');
    link.href = filePath; // Define o caminho do arquivo
    link.download = 'Documento de Layout.docx'; // Define o nome do arquivo ao ser baixado
    link.click(); // Simula o clique para iniciar o download
  } catch (error) {
    alert('Erro ao exportar documento');
  }
});


// Adiciona o evento de alteração no input de arquivo para enviar o arquivo ao backend
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0]; // Obtém o arquivo selecionado
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Envia a requisição para o backend
    const response = await fetch('http://localhost:8080/api/importacao/importar', {
      method: 'POST',
      body: formData
    });

    // Processa a resposta
    const result = await response.text();
    if (response.ok) {
      showNotification("Importação Realizada com Sucesso!", false);
      setTimeout(() => {
        window.location.reload(); // Recarrega a página após 2 segundos
      }, 2000);
    } else {
      alert(`Erro: ${result}`);
    }
  } catch (error) {
    showNotification("Importação Falhou!", true);
  }
});

  
});

// Função para buscar os dados do usuário por CPF
async function fetchUserDataByCpf(cpf) {
  try {
    const response = await fetch(
      `http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`
    );
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do usuário: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }
  return null;
}

// Carregar os dados do usuário quando o CPF estiver disponível
async function carregarDadosUsuario() {
  const cpf = localStorage.getItem("cpf");
  if (cpf) {
    const userData = await fetchUserDataByCpf(cpf);
    if (userData) {
      document.getElementById("nome").value = userData.nome || "";
      document.getElementById("nascimento").value = userData.dataNasc || "";
      document.getElementById("telefone").value = formatPhoneNumber(
        userData.telefone || ""
      ); // Garantindo que seja string
      document.getElementById("cpf").value = userData.cpf || "";
      document.getElementById("genero").value = userData.genero || "";
      document.getElementById("instagram").value = userData.instagram || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("senha").value = userData.senha || "";
    }
  }
}

carregarDadosUsuario(); // Chamar a função para carregar os dados do usuário

// Função para formatar o número de telefone para exibição
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== "string") return ""; // Verificação adicional para garantir que seja string
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

async function fetchUserDataByCpf(cpf) {
  try {
    const response = await fetch(
      `http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`
    );
    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }
  return null; // Retorna null em caso de erro
}

document.addEventListener("DOMContentLoaded", async () => {
  const cpf = localStorage.getItem("cpf");
  if (cpf) {
    const userData = await fetchUserDataByCpf(cpf);
    if (userData) {
      fillUserProfile(userData);
    } else {
      console.error(
        "Usuário não encontrado ou erro ao buscar dados do usuário."
      );
    }
  }

  function fillUserProfile(userData) {
    // Dados do usuário
    document.getElementById("nome").value = userData.nome || "";
    document.getElementById("nascimento").value = userData.dataNasc || "";
    document.getElementById("telefone").value =
      formatPhoneNumber(userData.telefone) || "";
    document.getElementById("cpf").value = userData.cpf || "";
    document.getElementById("genero").value = userData.genero || "";
    document.getElementById("instagram").value = userData.instagram || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("senha").value = userData.senha || "";

    // Verificar se os dados da empresa existem
    if (userData.empresa) {
      // Dados da empresa
      document.getElementById("empresa").value = userData.empresa.nome || "";
      document.getElementById("cnpj").value = formatCnpj(userData.empresa.cnpj) || "";
      document.getElementById("telefone-empresa").value =
      formatPhoneNumber(userData.empresa.telefone) || "";

      // Endereço da empresa
      if (userData.empresa.endereco) {
        document.getElementById("cep").value =
        formatCep (userData.empresa.endereco.cep) || "";
        document.getElementById("logradouro").value =
          userData.empresa.endereco.logradouro || "";
        document.getElementById("numero").value =
          userData.empresa.endereco.numero || "";
        document.getElementById("bairro").value =
          userData.empresa.endereco.bairro || "";
        document.getElementById("cidade-empresa").value =
          userData.empresa.endereco.cidade || "";
        document.getElementById("estado-empresa").value =
          userData.empresa.endereco.estado || "";
        document.getElementById("complemento").value =
          userData.empresa.endereco.complemento || "";
      }

      // Horário de funcionamento
      if (userData.empresa.horarioFuncionamento) {
        document.getElementById("diaInicio").value =
          userData.empresa.horarioFuncionamento.diaInicio || "";
        document.getElementById("diaFim").value =
          userData.empresa.horarioFuncionamento.diaFim || "";
        document.getElementById("horaInicio").value =
          userData.empresa.horarioFuncionamento.horarioAbertura || "";
        document.getElementById("horaFim").value =
          userData.empresa.horarioFuncionamento.horarioFechamento || "";
      }
    } else {
      console.warn("Dados da empresa não encontrados.");
    }
  }

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return "";
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  }

  function formatCep(cep) {
    if (!cep) return ""; // Retorna vazio se o CEP for undefined ou nulo
    const cleaned = ("" + cep).replace(/\D/g, ""); // Remove qualquer caractere que não seja número
    const match = cleaned.match(/^(\d{5})(\d{3})$/); // Verifica se o CEP segue o padrão de 5 dígitos + 3 dígitos
    if (match) {
      return `${match[1]}-${match[2]}`; // Retorna no formato 00000-000
    }
    return cep; // Retorna o valor original caso não bata com o padrão
  }

  function formatCnpj(cnpj) {
    if (!cnpj) return ""; // Retorna vazio se o CNPJ for indefinido ou nulo
    const cleaned = ("" + cnpj).replace(/\D/g, ""); // Remove todos os caracteres que não são números
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/); // Verifica se o valor corresponde ao padrão do CNPJ
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`; // Retorna no formato 00.000.000/0000-00
    }
    return cnpj; // Retorna o valor original se não corresponder ao padrão
  }
  
  
  // document
  //   .getElementById("save-usuario-button")
  //   .addEventListener("click", async function () {
  //     const cpf = localStorage.getItem("cpf");
  //     await atualizarUsuario();
  //   });


  function formatPhoneNumberToLong(phoneNumber) {
    if (!phoneNumber) return null;
    const cleaned = phoneNumber.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    return parseInt(cleaned, 10); // Converte para número
  }

  function salvarNomeLocalStorage() {
    const nome = document.getElementById("nome").value;
    if (nome) {
      localStorage.setItem("nome", nome);
    }
  }

  function exibirNomeUsuario() {
    const nome = localStorage.getItem("nome");
    if (nome) {
      document.getElementById("userName").textContent = nome;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    exibirNomeUsuario();
  });

  // async function atualizarUsuario(cpf) {
  //   try {
  //     const cpf = localStorage.getItem("cpf");
  //     const usuarioDTO = {
  //       nome: document.getElementById("nome").value,
  //       dataNasc: document.getElementById("nascimento").value,
  //       telefone: formatPhoneNumberToLong(
  //         document.getElementById("telefone").value
  //       ),
  //       genero: document.getElementById("genero").value,
  //       instagram: document.getElementById("instagram").value,
  //       email: document.getElementById("email").value,
  //       senha: document.getElementById("senha").value,
  //     };

  //     const usuarioResponse = await fetch(
  //       `http://localhost:8080/usuarios/atualizacao-usuario-por-cpf/${cpf}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(usuarioDTO),
  //       }
  //     );
  //     // Exibe mensagem de sucesso
  //     showNotification("Dados da usuário atualizados com sucesso!");
  //     setTimeout(function () {
  //       location.reload();
  //     }, 1000);

  //     if (!usuarioResponse.ok) {
  //       throw new Error(`Erro ao atualizar usuário: ${usuarioResponse.status}`);
  //     }

  //     // Atualizar localStorage
  //     localStorage.setItem("nome", usuarioDTO.nome);
  //     localStorage.setItem("instagram", usuarioDTO.instagram);

  //     console.log("Usuário atualizado com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao atualizar o usuário:", error);

  //     // Exibe mensagem de erro
  //     showNotification("Erro ao atualizar dados do usuário!", true);
  //   }

  //   // Oculta a notificação após alguns segundos
  //   setTimeout(() => {
  //     document.getElementById("notification").style.display = "none";
  //   }, 5000); // Oculta a notificação após 5 segundos
  // }

  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }

  // Selecionando os elementos do formulário
  const cepInput = document.querySelector("#cep");
  const logradouroInput = document.querySelector("#logradouro");
  const bairroInput = document.querySelector("#bairro");
  const cidadeInput = document.querySelector("#cidade");
  const estadoInput = document.querySelector("#estado");

  // Função para buscar o endereço pelo CEP
  const buscaEndereco = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        return;
      }

      // Populando os campos com os dados recebidos
      logradouroInput.value = data.logradouro;
      bairroInput.value = data.bairro;
      cidadeInput.value = data.localidade;
      estadoInput.value = data.uf;
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
    }
  };

  // Evento que detecta quando o usuário terminou de digitar o CEP
  cepInput.addEventListener("blur", () => {
    const cep = cepInput.value.replace(/\D/g, ""); // Remove qualquer caractere que não seja número
    if (cep.length === 8) {
      // Verifica se o CEP tem 8 dígitos
      buscaEndereco(cep);
    } else {
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // const profileImageInput = document.getElementById("profileImage");
  const confirmModal = document.getElementById("confirmModal");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");
  const closeButton = document.querySelector(".close");
  let selectedFile = null;

  // profileImageInput.addEventListener("change", function () {
  //   selectedFile = this.files[0];
  //   if (selectedFile) {
  //     confirmModal.style.display = "block";
  //   }
  // });

  // confirmButton.addEventListener("click", async function () {
  //   if (selectedFile) {
  //     const formData = new FormData();
  //     formData.append("foto", selectedFile);

  //     const cpf = localStorage.getItem("cpf");
  //     if (cpf) {
  //       try {
  //         const response = await fetch(
  //           `http://localhost:8080/usuarios/atualizacao-foto/${cpf}`,
  //           {
  //             method: "POST",
  //             body: formData,
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error(`Erro ao atualizar foto: ${response.status}`);
  //         }

  //         const updatedUser = await response.json();

  //         document.getElementById("notification-message").textContent =
  //           "Foto atualizada com sucesso!";
  //         document.getElementById("notification").style.display = "block";
  //       } catch (error) {
  //         console.error("Erro ao atualizar foto:", error);
  //         alert("Erro ao atualizar foto.");
  //       }
  //     } else {
  //       alert("CPF não encontrado.");
  //     }
  //   }
  //   confirmModal.style.display = "none";
  // });

  // cancelButton.addEventListener("click", function () {
  //   confirmModal.style.display = "none";
  // });

  // closeButton.addEventListener("click", function () {
  //   confirmModal.style.display = "none";
  // });

  // window.addEventListener("click", function (event) {
  //   if (event.target == confirmModal) {
  //     confirmModal.style.display = "none";
  //   }
  // });
});
document.addEventListener("DOMContentLoaded", function () {
  // Função para capitalizar a primeira letra de cada palavra
  function capitalizeWords(input) {
    const words = input.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 0) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
      }
    }
    return words.join(" ");
  }

  // Função para formatar CNPJ
  function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, ""); // Remove tudo que não é número
    if (cnpj.length > 14) cnpj = cnpj.substr(0, 14); // Limita a 14 dígitos
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  // Função para formatar CEP
  function formatCEP(cep) {
    cep = cep.replace(/[^\d]/g, ""); // Remove tudo que não é número
    if (cep.length > 8) cep = cep.substr(0, 8); // Limita a 8 dígitos
    return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  }

  // Função para validar campos sem números
  function removeNumbers(input) {
    return input.replace(/\d/g, ""); // Remove todos os números
  }

  // Validação para o campo "Nome da Empresa"
  const empresaInput = document.getElementById("empresa");
  empresaInput.addEventListener("input", function () {
    this.value = capitalizeWords(this.value);
  });

  // Validação para o campo "CNPJ"
  const cnpjInput = document.getElementById("cnpj");
  cnpjInput.addEventListener("input", function () {
    this.value = formatCNPJ(this.value);
  });

  // Validação para o campo "CEP"
  const cepInput = document.getElementById("cep");
  cepInput.addEventListener("input", function () {
    this.value = formatCEP(this.value);
  });

  // Validações para os campos "Logradouro", "Bairro", "Cidade", e "Estado"
  const logradouroInput = document.getElementById("logradouro");
  logradouroInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  const bairroInput = document.getElementById("bairro");
  bairroInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  const cidadeInput = document.getElementById("cidade-empresa"); // Verifique o ID correto no HTML
  if (cidadeInput) {
    cidadeInput.addEventListener("input", function () {
      this.value = capitalizeWords(removeNumbers(this.value));
    });
  } else {
    console.warn("Elemento 'cidade-empresa' não encontrado.");
  }

  const estadoInput = document.getElementById("estado-empresa");
  estadoInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  document.addEventListener("DOMContentLoaded", function () {
    // Função para popular um select
    function populateSelect(selectId, value) {
      const select = document.getElementById(selectId);
      if (select) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      } else {
        console.warn(`Elemento com ID ${selectId} não encontrado.`);
      }
    }

    // Mockar dias da semana no select
    const dias = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    dias.forEach((dia) => {
      populateSelect("diasInicio", dia);
      populateSelect("diasFim", dia);
    });

    // Mockar horários de funcionamento no select
    for (let i = 0; i < 24; i++) {
      const hora = i < 10 ? `0${i}:00` : `${i}:00`;
      populateSelect("horarioInicio", hora);
      populateSelect("horarioFim", hora);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const nomeInput = document.getElementById("nome");

    nomeInput.addEventListener("input", function () {
      const words = nomeInput.value.split(" ");
      for (let i = 0; i < words.length; i++) {
        if (words[i].length > 0) {
          words[i] =
            words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
        }
      }
      nomeInput.value = words.join(" ");
    });
  });

  // document.addEventListener("DOMContentLoaded", () => {
  //   const telefoneInput = document.getElementById("telefone");
  //   const telefoneEmpresaInput = document.getElementById("telefone-empresa")

  //   const formatPhoneNumber = (value) => {
  //     if (!value) return value;
  //     const phoneNumber = value.replace(/[^\d]/g, "");
  //     const phoneNumberLength = phoneNumber.length;

  //     if (phoneNumberLength < 3) return phoneNumber;
  //     if (phoneNumberLength < 7) {
  //       return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  //     }
  //     return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
  //       2,
  //       7
  //     )}-${phoneNumber.slice(7, 11)}`;
  //   };

  //   const handlePhoneNumberInput = (e) => {
  //     e.target.value = formatPhoneNumber(e.target.value);
  //   };

  //   telefoneInput.addEventListener("input", handlePhoneNumberInput);
  //   telefoneEmpresaInput.addEventListener("input", handlePhoneNumberInput);

  // });

  document.addEventListener("DOMContentLoaded", () => {
    const instagramInput = document.getElementById("instagram");

    instagramInput.addEventListener("input", (event) => {
      let value = event.target.value;

      // Adicionar '@' no início se não estiver presente
      if (!value.startsWith("@")) {
        value = "@" + value;
      }

      // Substituir espaços por '_'
      value = value.replace(/\s/g, "_");

      // Remover caracteres inválidos
      value = value.replace(/[^a-z0-9_@]/g, "");

      // Garantir que não há letras maiúsculas
      value = value.toLowerCase();

      // Atualizar o campo de entrada com o valor formatado
      event.target.value = value;
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");

    emailInput.addEventListener("input", (event) => {
      let value = event.target.value;

      // Converter todas as letras para minúsculas
      value = value.toLowerCase();

      // Remover caracteres especiais, exceto @ e .
      value = value.replace(/[^a-z0-9@.]/g, "");

      // Atualizar o campo de entrada com o valor formatado
      event.target.value = value;
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const senhaInput = document.getElementById("senha");

    senhaInput.addEventListener("mouseover", () => {
      senhaInput.type = "text";
    });

    senhaInput.addEventListener("mouseout", () => {
      senhaInput.type = "password";
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  let isEditingPersonal = false; // Controle da edição dos dados pessoais

  // Função para alternar a edição dos campos do formulário de usuário e do upload de foto
  function toggleEditing() {
    isEditingPersonal = !isEditingPersonal;

    // Seleciona os campos de input e o botão de envio de foto
    const lockIcons = document.querySelectorAll("#personalForm .lock-icon");
    const fields = document.querySelectorAll(
      "#personalForm input, #personalForm select"
    );
    const saveButton = document.getElementById("save-usuario-button");

    const fileInput = document.getElementById("file"); // Campo de upload de foto
    const uploadButton = document.getElementById("uploadButton"); // Botão de envio da foto

    if (isEditingPersonal) {
      lockIcons.forEach((lockIcon) => (lockIcon.style.display = "inline")); // Exibe ícones de cadeado
      fields.forEach((field) => (field.disabled = false)); // Habilita todos os campos
      saveButton.disabled = false; // Habilita o botão de salvar

      // Habilita o campo e o botão de upload de foto
      fileInput.disabled = false;
      uploadButton.disabled = false;
    } else {
      lockIcons.forEach((lockIcon) => (lockIcon.style.display = "none")); // Oculta ícones de cadeado
      fields.forEach((field) => (field.disabled = true)); // Desabilita todos os campos
      saveButton.disabled = true; // Desabilita o botão de salvar

      // Desabilita o campo e o botão de upload de foto
      fileInput.disabled = true;
      uploadButton.disabled = true;
    }
  }

   // Adicionar o event listener ao botão de editar dados pessoais
   const editIconUsuario = document.getElementById("editIconUsuario");
   if (editIconUsuario) {
     editIconUsuario.addEventListener("click", toggleEditing);
   }

  // Adiciona o event listener ao botão de edição de dados pessoais
  // const editIconUsuario = document.getElementById("editIconUsuario");
  // if (editIconUsuario) {
  //   editIconUsuario.addEventListener("click", toggleEditing);
  // }

  // Event listener para o formulário de upload de foto
  // document.getElementById("file").addEventListener("change", function () {
  //   const fileInput = document.getElementById("file");
  //   const responseMessage = document.getElementById("responseMessage");
  
  //   if (fileInput.files.length > 0) {
  //     responseMessage.textContent = `Ficheiro "${fileInput.files[0].name}" anexado com sucesso!`;
  //     responseMessage.style.color = "blue"; // Cor azul para notificação de anexo
  //   } else {
  //     responseMessage.textContent = "Nenhum ficheiro anexado.";
  //     responseMessage.style.color = "red";
  //   }
  // });
  
  document.getElementById("file").addEventListener("change", function () {
    const fileInput = document.getElementById("file");
  
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      showNotification(`Ficheiro "${fileName}" anexado com sucesso!`, false); // Notificação de sucesso
    } else {
      showNotification("Nenhum ficheiro anexado.", true); // Notificação de erro
    }
  });
  
  document
    .getElementById("uploadForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const cpf = document.getElementById("cpf").value;
      const fileInput = document.getElementById("file");
  
      if (!cpf || fileInput.files.length === 0) {
        showNotification("Por favor, insira um CPF válido e selecione um ficheiro.", true);
        return;
      }
  
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
  
      try {
        const response = await fetch(
          `http://localhost:8080/usuarios/upload-foto/${cpf}`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        const result = await response.text();
  
        if (response.ok) {
          showNotification(
            "Foto enviada com sucesso! Recarregue a página para ter acesso à foto atualizada.",
            false
          ); // Notificação de sucesso
        } else {
          showNotification(`Erro ao enviar a foto: ${result}`, true); // Notificação de erro
        }
  
        // Desabilita o upload após a submissão
        toggleEditing();
      } catch (error) {
        console.error("Erro ao enviar a foto:", error);
        showNotification("Erro ao enviar a foto.", true); // Notificação de erro
      }
    });
  
  
    
new window.VLibras.Widget("https://vlibras.gov.br/app");
});

async function carregarImagem() {
  const cpf = document.getElementById("cpf").value.trim(); // Captura o valor do CPF a cada execução
  const imageContainer = document.getElementById("imageContainer");

  // Limpa o contêiner de imagem antes da nova busca
  imageContainer.innerHTML = "";

  if (!cpf) {
    imageContainer.innerHTML = "<p style='color: red;'>CPF não encontrado.</p>";
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

      // Cria um elemento de imagem e exibe na div
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Foto do usuário";
      imageContainer.appendChild(img);
    } else {
      imageContainer.innerHTML =
        "<p style='color: red;'>Imagem não encontrada para o CPF informado.</p>";
    }
  } catch (error) {
    console.error("Erro ao buscar a imagem:", error);
    imageContainer.innerHTML =
      "<p style='color: red;'>Erro ao buscar a imagem. Tente novamente.</p>";
  }
}

// Carrega a imagem automaticamente quando a página termina de carregar
window.onload = function () {
  carregarImagem();
} ;

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

// Selecionar elementos de navegação
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const funcionarioFoto = document.querySelector(".foto-funcionario");
const funcionarioNome = document.querySelector(".funcionario-info h4");
const funcionarioCargo = document.querySelector(".funcionario-info p");

// URL padrão para imagem de perfil genérica
const fotoGenerica = "icon.png";

// Variáveis de controle
let funcionarios = [];
let funcionarioIndex = 0;
let autoSlideInterval;

// Função para carregar os funcionários com base no ID da empresa
async function carregarFuncionarios() {
  const empresaId = localStorage.getItem("empresa"); // Obtém o ID da empresa do localStorage
  if (!empresaId) {
    console.warn("ID da empresa não encontrado no localStorage.");
    return;
  }

  try {
    // Requisição para obter funcionários da empresa (nome e cargo)
    const response = await fetch(`http://localhost:8080/usuarios/empresa/${empresaId}`);
    if (response.ok) {
      funcionarios = await response.json();

      // Para cada funcionário, buscar a foto separadamente
      for (let i = 0; i < funcionarios.length; i++) {
        const nome = encodeURIComponent(funcionarios[i].nome); // Encode nome para URL
        try {
          const fotoResponse = await fetch(`http://localhost:8080/usuarios/busca-imagem-usuario-nome/${nome}`);
          if (fotoResponse.ok) {
            const blob = await fotoResponse.blob();
            funcionarios[i].foto = URL.createObjectURL(blob); // Gera URL local da imagem
          } else {
            funcionarios[i].foto = fotoGenerica; // Imagem genérica em caso de erro
          }
        } catch (fotoError) {
          console.error("Erro ao buscar foto:", fotoError);
          funcionarios[i].foto = fotoGenerica;
        }
      }

      mostrarFuncionario(funcionarioIndex); // Mostrar o primeiro funcionário após carregar
      iniciarAutoSlide(); // Iniciar troca automática após carregar
    } else {
      console.error(`Erro ao buscar funcionários: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao buscar dados dos funcionários:", error);
  }
}


function mostrarFuncionario(index) {
  const funcionario = funcionarios[index];
  const nivelAcessoText = funcionario.nivelAcesso === 1 ? "Administrador" : "Funcionário";

  // Atualiza conteúdo do carrossel
  funcionarioFoto.src = funcionario.foto || fotoGenerica;
  funcionarioNome.textContent = funcionario.nome;
  funcionarioCargo.textContent = `Cargo: ${nivelAcessoText}`;

  // Adiciona o evento de clique na área "clicavel"
  document.querySelector(".clicavel").onclick = () => {
    window.location.href = `perfilForms/editar-funcionario/editar-funcionario.html?codigo=${funcionario.codigo}&endereco=${funcionario.endereco}&nome=${funcionario.nome}`;
  };
}

// Eventos de navegação do carrossel
prevButton.addEventListener("click", () => {
  clearInterval(autoSlideInterval); // Parar troca automática ao clicar
  funcionarioIndex =
    (funcionarioIndex - 1 + funcionarios.length) % funcionarios.length;
  mostrarFuncionario(funcionarioIndex);
  iniciarAutoSlide(); // Reiniciar troca automática
});

nextButton.addEventListener("click", () => {
  clearInterval(autoSlideInterval); // Parar troca automática ao clicar
  funcionarioIndex = (funcionarioIndex + 1) % funcionarios.length;
  mostrarFuncionario(funcionarioIndex);
  iniciarAutoSlide(); // Reiniciar troca automática
});

// Função para iniciar a troca automática
function iniciarAutoSlide() {
  autoSlideInterval = setInterval(() => {
    funcionarioIndex = (funcionarioIndex + 1) % funcionarios.length;
    mostrarFuncionario(funcionarioIndex);
  }, 5000); // Troca a cada 5 segundos
}

// Chama a função para carregar os funcionários ao carregar a página
document.addEventListener("DOMContentLoaded", carregarFuncionarios);


