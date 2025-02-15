package sptech.projetojpa1.dto.agendamento

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime
import java.util.*

data class AgendamentoRequestDTO(
    @field:NotNull(message = "Data e horário não podem ser nulos")
    var dataHorario: LocalDateTime?,

    @field:NotNull(message = "Tipo de agendamento não pode ser nulo")
    var tipoAgendamento: String?,

    @field:NotNull(message = "Id do usuário não pode ser nulo")
    @field:Min(value = 1, message = "Id do usuário deve ser maior que 0")
    var fk_usuario: Int,

    @field:NotNull(message = "Id do procedimento não pode ser nulo")
    @field:Min(value = 1, message = "Id do procedimento deve ser maior que 0")
    var fk_procedimento: Int,

    @field:NotNull(message = "Id da especificação não pode ser nulo")
    @field:Min(value = 1, message = "Id da especificação deve ser maior que 0")
    var fk_especificacao: Int,

    var tempoAgendar: Int? = null,

    @field:NotNull(message = "Homecare não pode ser nulo")
    var homecare: Boolean,

    @field:NotNull(message = "Valor não pode ser nulo")
    var valor: Double,

    @field:NotNull(message = "Id do status não pode ser nulo")
    @field:Min(value = 1, message = "Id do status deve ser maior que 0")
    var fk_status: Int,

    // Novos campos
    var cep: String? = null,
    var logradouro: String? = null,
    var numero: String? = null
)
