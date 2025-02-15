package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.agendamento.AgendamentoDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoRequestDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoResponseDTO
import sptech.projetojpa1.dto.agendamento.BloqueioRequestDTO
import sptech.projetojpa1.service.AgendamentoService
import java.time.LocalDate
import java.time.LocalTime

@RestController
@RequestMapping("/api/agendamentos")
class AgendamentoController(private val agendamentoService: AgendamentoService) {

    @Operation(
        summary = "Cria um novo agendamento",
        description = "Cria um novo agendamento com base nos dados fornecidos. Retorna o agendamento criado."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Agendamento criado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
        ]
    )
    @PostMapping
    fun criarNovoAgendamento(@Valid @RequestBody agendamentoRequestDTO: AgendamentoRequestDTO): ResponseEntity<*> {
        return try {
            val agendamentoResponseDTO = agendamentoService.criarAgendamento(agendamentoRequestDTO)
            ResponseEntity.ok(agendamentoResponseDTO)
        } catch (ex: IllegalArgumentException) {
            ResponseEntity.badRequest().body(ex.message)
        }
    }

    @GetMapping("/agendamento-status")
    fun getAgendamentosPorStatus(
        @RequestParam(required = false) startDate: String?
    ): ResponseEntity<Map<String, Int>> {
        val agendamentosPorStatus = agendamentoService.obterAgendamentosPorStatus(startDate)
        return if (agendamentosPorStatus.isNotEmpty()) {
            ResponseEntity.ok(agendamentosPorStatus)
        } else {
            ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        }
    }






    @GetMapping("/tempo-medio")
    fun getTempoMedioEntreAgendamentos(): ResponseEntity<Double> {
        val tempoMedio = agendamentoService.obterTempoMedioEntreAgendamentos()
        return if (tempoMedio != null) {
            ResponseEntity.ok(tempoMedio)
        } else {
            ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        }
    }

    @Operation(
        summary = "Lista todos os agendamentos",
        description = "Retorna uma lista de todos os agendamentos, excluindo os de tipo 'Bloqueio'."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Agendamentos listados com sucesso")
        ]
    )
    @GetMapping("/listar")
    fun listarTodosAgendamentos(): ResponseEntity<List<AgendamentoResponseDTO>> {
        val agendamentos = agendamentoService.listarTodosAgendamentos()
        return ResponseEntity.ok(agendamentos)
    }

    @Operation(
        summary = "Obtém um agendamento pelo ID",
        description = "Retorna um agendamento específico com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Agendamento encontrado"),
            ApiResponse(responseCode = "404", description = "Agendamento não encontrado")
        ]
    )
    @GetMapping("/buscar/{id}")
    fun obterAgendamentoPorId(@PathVariable id: Int): ResponseEntity<*> {
        val agendamentoResponseDTO = agendamentoService.obterAgendamento(id)
        return ResponseEntity.ok(agendamentoResponseDTO)
    }

    @Operation(
        summary = "Atualiza um agendamento existente pelo ID",
        description = "Atualiza um agendamento específico com base no ID fornecido e nos dados atualizados."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Agendamento atualizado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
            ApiResponse(responseCode = "404", description = "Agendamento não encontrado")
        ]
    )
    @PutMapping("/atualizar/{id}")
    fun atualizarAgendamentoExistente(
        @PathVariable id: Int,
        @Valid @RequestBody agendamentoRequestDTO: AgendamentoRequestDTO
    ): ResponseEntity<*> {
        val agendamentoResponseDTO = agendamentoService.atualizarAgendamento(id, agendamentoRequestDTO)
        return ResponseEntity.ok(agendamentoResponseDTO)
    }

    @Operation(
        summary = "Atualiza o status de um agendamento pelo ID",
        description = "Atualiza o status de um agendamento específico com base no ID fornecido e no novo status."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Status do agendamento atualizado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
            ApiResponse(responseCode = "404", description = "Agendamento ou status não encontrado")
        ]
    )
    @PutMapping("/atualizar-status/{id}")
    fun atualizarStatusAgendamento(
        @PathVariable id: Int,
        @RequestParam statusId: Int
    ): ResponseEntity<*> {
        val agendamentoResponseDTO = agendamentoService.atualizarStatusAgendamento(id, statusId)
        return ResponseEntity.ok(agendamentoResponseDTO)
    }

    @Operation(
        summary = "Exclui um agendamento pelo ID",
        description = "Remove um agendamento específico com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Agendamento excluído com sucesso"),
            ApiResponse(responseCode = "404", description = "Agendamento não encontrado")
        ]
    )
    @DeleteMapping("/excluir/{id}")
    fun excluirAgendamentoExistente(@PathVariable id: Int): ResponseEntity<*> {
        agendamentoService.excluirAgendamento(id)
        return ResponseEntity.ok().build<Any>()
    }

    @Operation(
        summary = "Filtra agendamentos com base em critérios",
        description = "Retorna uma lista de agendamentos filtrados com base nos parâmetros fornecidos."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Agendamentos filtrados com sucesso")
        ]
    )
    @GetMapping("/filtro")
    fun filtrarAgendamentos(
        @RequestParam(required = false) dataInicio: LocalDate?,
        @RequestParam(required = false) dataFim: LocalDate?,
        @RequestParam(required = false) clienteId: Int?,
        @RequestParam(required = false) procedimentoId: Int?,
        @RequestParam(required = false) especificacaoId: Int?
    ): ResponseEntity<List<AgendamentoResponseDTO>> {
        val agendamentosFiltrados = agendamentoService.filtrarAgendamentos(
            dataInicio, dataFim, clienteId, procedimentoId, especificacaoId
        )
        return ResponseEntity.ok(agendamentosFiltrados)
    }

    @GetMapping("/tempo-gasto-ultimo-mes")
    fun getTempoGastoPorProcedimento(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Map<String, Double>> {
        val tempoGasto = agendamentoService.obterTempoGastoPorProcedimento(startDate, endDate)
        return if (tempoGasto.isNotEmpty()) {
            ResponseEntity.ok(tempoGasto)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/procedimentos-realizados-trimestre")
    fun getProcedimentosRealizadosEntreDatas(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Map<String, Int>> {
        val procedimentosRealizados = agendamentoService.obterProcedimentosRealizadosEntreDatas(startDate, endDate)
        return if (procedimentosRealizados.isNotEmpty()) {
            ResponseEntity.ok(procedimentosRealizados)
        } else {
            ResponseEntity.noContent().build()
        }
    }



    @GetMapping("/valor-total-ultimo-mes")
    fun getValorTotalPorPeriodo(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Map<String, Double>> {
        val valorTotalProcedimentos = agendamentoService.obterValorTotalEntreDatas(startDate, endDate)
        return if (valorTotalProcedimentos.isNotEmpty()) {
            ResponseEntity.ok(valorTotalProcedimentos)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(
        summary = "Obtém a quantidade de agendamentos realizados no último trimestre",
        description = "Retorna a quantidade de agendamentos concluídos no último trimestre."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Quantidade de agendamentos concluídos retornada com sucesso"
            )
        ]
    )
    @GetMapping("/agendamentos-realizados")
    fun agendamentosRealizadosUltimoTrimestre(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Int> {
        val quantidadeConcluidos = agendamentoService.agendamentosRealizadosTrimestre(startDate, endDate)
        return ResponseEntity.ok(quantidadeConcluidos)
    }


    @GetMapping("/tempo-para-agendar")
    fun tempoParaAgendar(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<List<Int>> {
        val tempoPara = agendamentoService.tempoParaAgendar(startDate, endDate)
        return ResponseEntity.ok(tempoPara)
    }

    @GetMapping("/media-tempo-entre-agendamentos")
    fun getMediaTempoEntreAgendamentos(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Double> {
        val mediaTempo = agendamentoService.obterMediaTempoEntreAgendamentos(startDate, endDate)
        return ResponseEntity.ok(mediaTempo)
    }


    @GetMapping("/total-agendamentos-hoje")
    fun getTotalAgendamentosPorDia(
        @RequestParam(required = false) startDate: String?
    ): ResponseEntity<Int> {
        println(startDate)
        val totalAgendamentos = agendamentoService.getTotalAgendamentosPorDia(startDate)
        return ResponseEntity.ok(totalAgendamentos)
    }

    @GetMapping("/futuros")
    fun getTotalAgendamentosFuturos(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Int> {
        val agenFuturos = agendamentoService.obterTotalAgendamentosFuturos(startDate, endDate)
        return ResponseEntity.ok(agenFuturos)
    }


    @GetMapping("/receita-ultimos-tres-meses")
    fun getTotalReceitaEntreDatas(
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Map<String, Double>> {
        val totalReceita = agendamentoService.obterTotalReceitaEntreDatas(startDate, endDate)
        return if (totalReceita.isNotEmpty()) {
            ResponseEntity.ok(totalReceita)
        } else {
            ResponseEntity.noContent().build()
        }
    }


    @GetMapping("/agendamentos-realizados-ultimos-cinco-meses")
    fun agendamentosRealizados(
        @RequestParam("startDate") startDate: String,
        @RequestParam("endDate") endDate: String
    ): ResponseEntity<Map<String, Int>> {
        val quantidadeConcluidos = agendamentoService.agendamentosRealizados(startDate, endDate)
        return ResponseEntity.ok(quantidadeConcluidos)
    }



    @Operation(
        summary = "Lista horários disponíveis para agendamento",
        description = "Retorna uma lista de horários disponíveis para agendamento em uma data específica."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Horários disponíveis retornados com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
        ]
    )
    @GetMapping("/horarios-disponiveis")
    fun listarHorariosDisponiveis(
        @RequestParam empresaId: Int,
        @RequestParam data: String
    ): ResponseEntity<List<LocalTime>> {
        val dataFormatada = LocalDate.parse(data)
        val horariosDisponiveis = agendamentoService.listarHorariosDisponiveis(empresaId, dataFormatada)
        return ResponseEntity.ok(horariosDisponiveis)
    }

    @Operation(
        summary = "Bloqueia horários para agendamento",
        description = "Bloqueia um intervalo de horários em um dia específico para evitar novos agendamentos."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Horários bloqueados com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
        ]
    )
    @PostMapping("/bloquear")
    fun bloquearHorarios(@RequestBody request: BloqueioRequestDTO) {
        val dia = LocalDate.parse(request.dia)  // Conversão de String para LocalDate
        val horaInicio = LocalTime.parse(request.horaInicio)  // Conversão de String para LocalTime
        val horaFim = LocalTime.parse(request.horaFim)

        agendamentoService.bloquearHorarios(
            dia,
            horaInicio,
            horaFim,
            request.usuarioId
        )
    }

    @Operation(
        summary = "Conta usuários com status zero",
        description = "Retorna a quantidade de usuários com status zero."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Quantidade de usuários com status zero retornada com sucesso"
            )
        ]
    )
    @GetMapping("/count/arquivados")
    fun countUsuariossWithStatusZero(): Int {
        return agendamentoService.countUsuariosWithStatusZero()
    }

    @Operation(
        summary = "Conta usuários com status um",
        description = "Retorna a quantidade de usuários com status um."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Quantidade de usuários com status um retornada com sucesso"
            )
        ]
    )
    @GetMapping("/count/ativos")
    fun countUsuariossWithStatusUm(): Int {
        return agendamentoService.countUsuariosWithStatusUm()
    }

    @Operation(
        summary = "Conta a quantidade de dias entre o ultimo agendamento e a data atual",
        description = "Retorna a quantidade de dias entre o ultimo agendamento e a data atual."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Retorna a quantidade de dias entre o ultimo agendamento e a data atual com sucesso"
            )
        ]
    )
    @GetMapping("/count-dias-ultimo-agendamento/{idUsuario}")
    fun countDiasUltimoAgendamento(@PathVariable idUsuario: Int): Int {
        return agendamentoService.countDiasUltimoAgendamento(idUsuario)
    }

    @Operation(
        summary = "Retorna o dia mais agendado da semana",
        description = "Mostra o dia da semana mais agendado de acordo com cada usuario."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Retorna o dia mais agendado da semana"
            )
        ]
    )

    @GetMapping("/dia-mais-agendado/{idUsuario}")
    fun getDiaMaisAgendadoPorUsuario(@PathVariable idUsuario: Int): String {
        return agendamentoService.buscarDiaMaisAgendadoPorUsuario(idUsuario)
    }


    @GetMapping("/procedimentos-usuario-mes")
    fun getProcedimentosPorUsuarioEMes(
        @RequestParam usuarioId: Long,
        @RequestParam mesAno: String
    ): ResponseEntity<Map<String, Int>> {
        val procedimentos = agendamentoService.obterProcedimentosPorUsuarioEMes(usuarioId, mesAno)
        return ResponseEntity.ok(procedimentos)
    }

    @Operation(
        summary = "Retorna o intervalo de horario mais agendado",
        description = "Mostra o intervalo de horário mais agendado dependendo de cada usuário."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Retorna o itervalo de horário mais agendado"
            )
        ]
    )

    @GetMapping("/usuarios/{idUsuario}/intervalo-mais-agendado")
    fun getMostBookedTimeByUser(@PathVariable idUsuario: Int): String {
        return agendamentoService.getMostBookedTimeByUser(idUsuario)
            ?: "Nenhum agendamento encontrado para o usuário."
    }

    @GetMapping("/agendamentos/usuario/{usuarioId}")
    fun listarAgendamentosPorUsuario(@PathVariable usuarioId: Int): List<AgendamentoDTO> {
        return agendamentoService.listarAgendamentosPorUsuario(usuarioId)

    }

    @RestController
    @RequestMapping("/api/agendamentos")
    class AgendamentoController(
        private val agendamentoService: AgendamentoService
    ) {

        @Operation(
            summary = "Desbloquear horários de agendamento",
            description = "Remove todos os agendamentos do tipo 'Bloqueio' para um determinado dia e intervalo de tempo."
        )
        @ApiResponses(
            value = [
                ApiResponse(responseCode = "200", description = "Horários desbloqueados com sucesso"),
                ApiResponse(
                    responseCode = "404",
                    description = "Nenhum horário bloqueado encontrado no intervalo especificado"
                ),
                ApiResponse(responseCode = "400", description = "Erro nos parâmetros de entrada")
            ]
        )
        @DeleteMapping("/desbloquear")
        fun desbloquearHorarios(
            @RequestParam dia: LocalDate,
            @RequestParam horaInicio: LocalTime
        ): ResponseEntity<String> {
            return try {
                // Chama o serviço para desbloquear o horário
                agendamentoService.desbloquearHorarios(dia, horaInicio)

                // Retorna uma resposta de sucesso
                ResponseEntity.ok("Horário de bloqueio desbloqueado com sucesso!")
            } catch (e: IllegalArgumentException) {
                // Retorna uma resposta de erro se nenhum bloqueio for encontrado
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
            } catch (e: Exception) {
                // Retorna uma resposta genérica de erro para outras exceções
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao desbloquear horário.")
            }
        }
    }

    @GetMapping("/calcular-orcamento")
        fun calcularOrcamento(
            @RequestParam fkProcedimento: Int,
            @RequestParam fkEspecificacao: Int,
            @RequestParam tipoAgendamento: String
        ): ResponseEntity<Double> {
            val orcamento = agendamentoService.obterPrecoOrcamento(fkEspecificacao, tipoAgendamento)

            return if (orcamento != null) {
                ResponseEntity.ok(orcamento)
            } else {
                ResponseEntity.status(HttpStatus.NOT_FOUND).build()
            }

    }
}




