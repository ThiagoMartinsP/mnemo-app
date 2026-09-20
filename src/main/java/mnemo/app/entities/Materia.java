package mnemo.app.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "materias")
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "data_prova")
    @JsonProperty("data_prova")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataProva;

    public Materia() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getDataProva() { return dataProva; }
    public void setDataProva(LocalDate dataProva) { this.dataProva = dataProva; }
}
