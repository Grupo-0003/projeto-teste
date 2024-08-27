package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
@Table(name = "procedimento")
open class Procedimento(
    @Id
    @Column(name = "id_procedimento")
    var idProcedimento: Int = 0,

    @field:NotNull(message = "O campo tipo não pode ser nulo")
    @field:Size(min = 1, max = 100, message = "O campo tipo deve ter entre 1 e 100 caracteres")
    var tipo: String?,

    @field:NotNull(message = "O campo descrição não pode ser nulo")
    @field:Size(min = 1, max = 500, message = "O campo descrição deve ter entre 1 e 500 caracteres")
    var descricao: String?

)