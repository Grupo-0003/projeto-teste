package sptech.projetojpa1.dto.especificacao

import jakarta.validation.constraints.*

data class EspecificacaoDTO(
    @field:NotBlank(message = "Especificação é obrigatória")
    @field:Size(max = 70, message = "A especificação do procedimento deve ter no máximo 70 caracteres")
    val especificacao: String? = null,

    @field:NotNull(message = "Preço de colocação é obrigatório")
    @field:PositiveOrZero(message = "Preço de colocação deve ser zero ou positivo")
    val precoColocacao: Double? = null,

    @field:NotNull(message = "Preço de manutenção é obrigatório")
    @field:PositiveOrZero(message = "Preço de manutenção deve ser zero ou positivo")
    val precoManutencao: Double? = null,

    @field:NotNull(message = "Preço de retirada é obrigatório")
    @field:PositiveOrZero(message = "Preço de retirada deve ser zero ou positivo")
    val precoRetirada: Double? = null,

    @field:Pattern(
        regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$",
        message = "O tempo de colocação deve estar no formato HH:MM"
    )
    @field:NotBlank(message = "O tempo de colocação é obrigatório")
    val tempoColocacao: String? = null,

    @field:Pattern(
        regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$",
        message = "O tempo de manutenção deve estar no formato HH:MM"
    )
    @field:NotBlank(message = "O tempo de manutenção é obrigatório")
    val tempoManutencao: String? = null,

    @field:Pattern(
        regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$",
        message = "O tempo de retirada deve estar no formato HH:MM"
    )
    @field:NotBlank(message = "O tempo de retirada é obrigatório")
    val tempoRetirada: String? = null,

    val homecare: Boolean? = null,

    val colocacao: Boolean? = null,

    val manutencao: Boolean? = null,

    val retirada: Boolean? = null,

    @field:NotNull(message = "Procedimento é obrigatório")
    val procedimento: Int? = null
)

