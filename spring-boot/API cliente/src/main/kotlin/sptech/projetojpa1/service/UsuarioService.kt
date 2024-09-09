package sptech.projetojpa1.service

import jakarta.persistence.EntityManager
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.domain.usuario.Cliente
import sptech.projetojpa1.domain.usuario.Profissional
import sptech.projetojpa1.dto.usuario.*
import sptech.projetojpa1.repository.*
import java.util.*

@Service
class UsuarioService(
    @Autowired private val usuarioRepository: UsuarioRepository,
    @Autowired private val nivelAcessoRepository: NivelAcessoRepository,
    @Autowired private val enderecoRepository: EnderecoRepository,
    @Autowired private val empresaRepository: EmpresaRepository,
    @Autowired private val fichaAnamneseRepository: FichaAnamneseRepository,
    @Autowired private val respostaRepository: RespostaRepository,
    @Autowired private val feedbackRepository: FeedbackRepository,
    @Autowired private val agendamentoRepository: AgendamentoRepository,
    @Autowired private val entityManager: EntityManager
) {
    fun salvarUsuario(dto: UsuarioRequest): Usuario {
        val usuario: Usuario = if (dto.nivelAcessoId == 1) {
            Cliente(
                codigo = dto.codigo,
                nome = dto.nome,
                email = dto.email,
                senha = dto.senha,
                instagram = dto.instagram,
                cpf = dto.cpf,
                telefone = dto.telefone,
                dataNasc = dto.dataNasc,
                genero = dto.genero,
                indicacao = dto.indicacao,
                foto = null,
                status = dto.status,
                nivelAcesso = dto.nivelAcessoId.let { nivelAcessoRepository.findById(it).orElse(null) },
                endereco = dto.enderecoId?.let { enderecoRepository.findById(it).orElse(null) },
                empresa = dto.empresaId?.let { empresaRepository.findById(it).orElse(null) },
                fichaAnamnese = dto.fichaAnamneseId?.let { fichaAnamneseRepository.findById(it).orElse(null) }
            )
        } else {
            Profissional(
                codigo = dto.codigo,
                nome = dto.nome,
                email = dto.email,
                senha = dto.senha,
                instagram = dto.instagram,
                cpf = dto.cpf,
                telefone = dto.telefone,
                dataNasc = dto.dataNasc,
                genero = dto.genero,
                indicacao = dto.indicacao,
                foto = null,
                status = dto.status,
                nivelAcesso = dto.nivelAcessoId?.let { nivelAcessoRepository.findById(it).orElse(null) },
                endereco = dto.enderecoId?.let { enderecoRepository.findById(it).orElse(null) },
                empresa = dto.empresaId?.let { empresaRepository.findById(it).orElse(null) },
                especialidade = ""
            )
        }

        return usuarioRepository.save(usuario)
    }


    fun fazerLogin(request: UsuarioLoginRequest): UsuarioLoginResponse? {
        val usuario = usuarioRepository.findByEmailIgnoreCase(request.email)
        return if (usuario != null && usuario.senha.equals(request.senha, ignoreCase = true)) {
            usuario.status = true
            usuarioRepository.save(usuario)
            UsuarioLoginResponse(
                mensagem = "Login realizado com sucesso.",
                nome = usuario.nome ?: "",
                email = usuario.email ?: "",
                cpf = usuario.cpf ?: "",
                instagram = usuario.instagram ?: "",
                empresa = usuario.empresa
            )
        } else {
            null
        }
    }

    fun fazerLogoffPorId(id: Int): String {
        val usuario = usuarioRepository.findById(id).orElse(null)
        return if (usuario != null) {
            usuario.status = false
            usuarioRepository.save(usuario)
            "Logoff do(a) ${usuario.nome} realizado com sucesso."
        } else {
            "Usuário com ID $id não está cadastrado em nosso sistema, verifique a credencial e tente novamente."
        }
    }

    fun atualizarUsuarioPorCpf(cpf: String, dto: UsuarioAtualizacaoRequest): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        usuario.apply {
            nome = dto.nome ?: nome
            email = dto.email ?: email
//            senha = dto.senha ?: senha
            instagram = dto.instagram ?: instagram
            dataNasc = dto.dataNasc ?: dataNasc
            telefone = dto.telefone ?: telefone
            genero = dto.genero ?: genero
            indicacao = dto.indicacao ?: indicacao
        }
        return usuarioRepository.save(usuario)
    }

    @Transactional
    fun deletarUsuarioPorId(id: Int): Boolean {
        val usuario = usuarioRepository.findById(id).orElse(null) ?: return false

        // Excluindo Feedbacks relacionados ao Usuário
        feedbackRepository.deleteAllByUsuario(usuario)

        // Excluindo Agendamentos relacionados ao Usuário
        agendamentoRepository.deleteAllByUsuario(usuario)

        // Excluindo Respostas relacionadas ao Usuário
        respostaRepository.deleteAllByUsuario(usuario)

        // Excluindo outras entidades associadas (se necessário)
        // Adicione aqui outras exclusões necessárias, seguindo o padrão acima

        // Por fim, excluir o próprio Usuário
        usuarioRepository.delete(usuario)
        return true
    }


    fun listarUsuariosAtivos(): List<Usuario> = usuarioRepository.findByStatusTrue()

    fun listarTodosUsuarios(): List<UsuarioResponseDTO> {
        val usuarios = usuarioRepository.findAll()
        return usuarios.map { usuario ->
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                dataNasc = usuario.dataNasc,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                status = usuario.status
            )
        }
    }

    fun getByCpf(cpf: String): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        return UsuarioResponseDTO(
            idUsuario = usuario.codigo,
            nome = usuario.nome,
            instagram = usuario.instagram,
            telefone = usuario.telefone,
            cpf = usuario.cpf,
            dataNasc = usuario.dataNasc,
            status = usuario.status
        )
    }

    fun getByStatus(status: Boolean): List<UsuarioResponseDTO> {
        val usuarios = usuarioRepository.findByStatus(status)
        return usuarios.map { usuario ->
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                dataNasc = usuario.dataNasc,
                status = usuario.status
            )
        }
    }

    fun atualizarFotoUsuario(cpf: String, imagem: ByteArray): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        usuario.foto = imagem
        return usuarioRepository.save(usuario)
    }

    fun getFoto(codigo: Int): ByteArray? = usuarioRepository.findFotoByCodigo(codigo)

    fun getUsuariosByNivelAcesso(codigo: Int): List<Usuario> {
        val nivelAcesso = nivelAcessoRepository.findById(codigo).orElse(null)
        return if (nivelAcesso != null) {
            usuarioRepository.findByStatusTrueAndNivelAcesso(nivelAcesso)
        } else {
            emptyList()
        }
    }

    fun getIndicacoesFontes(): List<Usuario> = usuarioRepository.findClientesPorOrigem()

    fun getClientesAtivos(): Int {
        return usuarioRepository.findClientesAtivos()
    }

    fun findTop3Indicacoes(): List<String> {
        return usuarioRepository.findTop3Indicacoes()
    }

    fun buscarNumeroIndicacoes(): List<Int> {
        return usuarioRepository.buscarNumerosDivulgacao()
    }

    fun getClientesInativos(): Int {
        return usuarioRepository.findClientesInativos()
    }

    fun getClientesFidelizadosUltimosTresMeses(): Int {
        return usuarioRepository.findClientesFidelizadosUltimosTresMeses()
    }

    @Transactional
    fun atualizarStatusParaInativo(cpf: String): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findByCpf(cpf)
        return if (usuario != null) {
            println("Usuário encontrado: $usuario")
            if (usuario.status == false) {
                println("Usuário já está inativo.")
                return UsuarioResponseDTO(
                    idUsuario = usuario.codigo,
                    nome = usuario.nome,
                    instagram = usuario.instagram,
                    telefone = usuario.telefone,
                    cpf = usuario.cpf,
                    dataNasc = usuario.dataNasc,
                    status = usuario.status
                )
            }
            usuario.status = false
            usuarioRepository.save(usuario)
            entityManager.flush() // Garantir que a transação seja sincronizada com o banco
            println("Status atualizado para: ${usuario.status}")
            return UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                dataNasc = usuario.dataNasc,
                status = usuario.status
            )
        } else {
            println("Usuário não encontrado para o CPF: $cpf")
            null
        }
    }

    @Transactional
    fun atualizarStatusParaAtivo(cpf: String): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findByCpf(cpf)
        return if (usuario != null) {
            println("Usuário encontrado: $usuario")
            if (usuario.status == true) {
                println("Usuário já está ativo.")
                return UsuarioResponseDTO(
                    idUsuario = usuario.codigo,
                    cpf = usuario.cpf,
                    nome = usuario.nome,
                    status = usuario.status
                )
            }
            usuario.status = true
            usuarioRepository.save(usuario)
            entityManager.flush() // Garantir que a transação seja sincronizada com o banco
            println("Status atualizado para: ${usuario.status}")
            return UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                cpf = usuario.cpf,
                nome = usuario.nome,
                status = usuario.status
            )
        } else {
            println("Usuário não encontrado para o CPF: $cpf")
            null
        }
    }

    fun getClientesConcluidosUltimos5Meses(): List<Int> {
        return usuarioRepository.findClientesConcluidos5Meses()
    }

    fun getClientesFidelizadosUltimos5Meses(): List<Int> {
        return usuarioRepository.findClientesFidelizados5Meses()
    }
}