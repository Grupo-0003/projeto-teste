package sptech.projetojpa1.dto.empresa

import java.time.LocalDateTime

data class EmpresaResponseDTO(
    val codigo: Int,
    val nome: String,
    val contato: LocalDateTime,
    val CNPJ: String,
    val enderecoId: Int,
    val horarioFuncionamentoId: Int?
)
