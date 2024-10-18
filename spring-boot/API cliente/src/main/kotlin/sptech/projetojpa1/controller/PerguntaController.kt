package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.domain.Pergunta
import sptech.projetojpa1.dto.pergunta.PerguntaCreateRequest
import sptech.projetojpa1.dto.pergunta.PerguntaResponse
import sptech.projetojpa1.dto.pergunta.PerguntaUpdateRequest
import sptech.projetojpa1.service.PerguntaService

@RestController
@RequestMapping("/api/perguntas")
class PerguntaController(
    private val perguntaService: PerguntaService
) {

    @Operation(
        summary = "Cadastrar nova pergunta",
        description = "Cria uma nova pergunta no sistema e retorna a pergunta cadastrada."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Recurso criado com sucesso."),
            ApiResponse(responseCode = "400", description = "Requisição inválida."),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor.")
        ]
    )
    @PostMapping
    fun criarPergunta(@RequestBody @Valid request: PerguntaCreateRequest): ResponseEntity<PerguntaResponse> {
        val perguntaSalva = perguntaService.criarPergunta(request)
        return ResponseEntity.status(201).body(perguntaSalva)
    }

    @Operation(
        summary = "Listar todas as perguntas",
        description = "Retorna uma lista de todas as perguntas cadastradas no sistema."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida."),
            ApiResponse(responseCode = "204", description = "Nenhuma pergunta encontrada."),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor.")
        ]
    )
    @GetMapping
    fun listarPerguntas(): ResponseEntity<List<PerguntaResponse>> {
        val perguntas = perguntaService.listarPerguntas()
        return if (perguntas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.ok(perguntas)
        }
    }

    @Operation(
        summary = "Listar perguntas ativas",
        description = "Retorna uma lista de perguntas ativas ou inativas com base no status fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida."),
            ApiResponse(responseCode = "204", description = "Nenhuma pergunta encontrada."),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor.")
        ]
    )
    @GetMapping("/ativas")
    fun listarPerguntasAtivas(@RequestParam ativa: Boolean): ResponseEntity<List<PerguntaResponse>> {
        val perguntas = perguntaService.listarPerguntasAtivas(ativa)
        return if (perguntas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.ok(perguntas)
        }
    }

    @Operation(summary = "Listar perguntas desativadas", description = "Lista todas as perguntas desativadas.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Sucesso"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor")
        ]
    )
    @GetMapping("/desativadas")
    fun listarPerguntasDesativadas(): ResponseEntity<List<Pergunta>> {
        val perguntasDesativadas = perguntaService.listarPerguntasDesativadas()
        return if (perguntasDesativadas.isNotEmpty()) {
            ResponseEntity.ok(perguntasDesativadas)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(
        summary = "Buscar pergunta por ID",
        description = "Retorna uma pergunta específica com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pergunta encontrada."),
            ApiResponse(responseCode = "404", description = "Pergunta não encontrada."),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor.")
        ]
    )
    @GetMapping("/{id}")
    fun buscarPerguntaPorId(@PathVariable id: Int): ResponseEntity<PerguntaResponse> {
        return try {
            val pergunta = perguntaService.listarPerguntaPorId(id)
            ResponseEntity.ok(pergunta)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(
        summary = "Atualizar pergunta",
        description = "Atualiza os dados de uma pergunta existente com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pergunta atualizada com sucesso."),
            ApiResponse(responseCode = "404", description = "Pergunta não encontrada."),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor.")
        ]
    )
    @PutMapping("/{id}")
    fun atualizarPergunta(
        @PathVariable id: Int,
        @RequestBody @Valid request: PerguntaUpdateRequest
    ): ResponseEntity<PerguntaResponse> {
        return try {
            val perguntaAtualizada = perguntaService.atualizarPergunta(id, request)
            ResponseEntity.ok(perguntaAtualizada)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(summary = "Excluir pergunta", description = "Exclui uma pergunta existente com base no ID fornecido.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Pergunta excluída com sucesso."),
            ApiResponse(responseCode = "404", description = "Pergunta não encontrada."),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor.")
        ]
    )
    @DeleteMapping("/{id}")
    fun excluirPergunta(@PathVariable id: Int): ResponseEntity<Void> {
        return try {
            perguntaService.excluirPergunta(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).build()
        }
    }


@Operation(
    summary = "Listar as 4 primeiras perguntas ativas",
    description = "Retorna as primeiras 4 perguntas ativas no sistema."
)

@ApiResponses(
    value = [
        ApiResponse(responseCode = "200", description = "Operação bem sucedida."),
        ApiResponse(responseCode = "204", description = "Nenhuma pergunta encontrada."),
        ApiResponse(responseCode = "500", description = "Erro interno de servidor."),
        ApiResponse(responseCode = "400", description = "Má requisição.")
    ]
)
@GetMapping("/ativas/primeiras")
fun listarPrimeirasPerguntasAtivas():ResponseEntity<List<PerguntaResponse>>{
    val primeirasPerguntas = perguntaService.listarPrimeirasPerguntasAtivas()
    return if(primeirasPerguntas.isEmpty()){
        ResponseEntity.status(204).build()
    } else{
        ResponseEntity.ok(primeirasPerguntas)
    }


}

}