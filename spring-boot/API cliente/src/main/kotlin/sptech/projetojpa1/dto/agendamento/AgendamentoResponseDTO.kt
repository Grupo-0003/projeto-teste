package sptech.projetojpa1.dto.agendamento

import sptech.projetojpa1.domain.Status
import java.time.LocalDateTime

data class AgendamentoResponseDTO(
    var idAgendamento: Int?,
    var dataHorario: LocalDateTime?,
    var tipoAgendamento: String?,
    var usuario: String?,
    var tempoAgendar: Int?,
    var usuarioTelefone: String? = null,
    var usuarioCpf: String? = null,
    var usuarioId: Int?,
    var procedimento: String?,
    var especificacao: String?,
    var fkEspecificacao: Int?,
    var fkProcedimento: Int?,
    var statusAgendamento: Status
)
