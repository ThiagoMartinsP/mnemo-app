package mnemo.app.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="topico")
public class Topico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String nome;

    @Column(name="ultima_vez_visto")
    @JsonProperty("ultima_vez_visto")
    @JsonFormat(pattern="dd/MM/yyyy")
    private LocalDate ultimaVezVisto;

    private int nivel;
    private double dificuldade;

    @ManyToOne
    @JoinColumn(name="materia_id", nullable = false)
    private Materia materia;

    public Topico() {}

    public Topico(String nome,
                  LocalDate dataProva,
                  int nivel,
                  double dificuldade,
                  Materia materia) {

        this.nome = nome;
        this.ultimaVezVisto = LocalDate.now();
        this.nivel = nivel;
        this.dificuldade = dificuldade;
        this.materia = materia;
    }

    public Long getId() { return this.id; }

    public String getNome() { return nome; }

    public LocalDate getUltimaVezVisto() { return ultimaVezVisto; }

    public int getNivel() { return nivel; }

    public double getDificuldade() { return dificuldade; }

    public Materia getMateria() { return this.materia; }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setUltimaVezVisto(LocalDate ultimaVezVisto) {
        this.ultimaVezVisto = ultimaVezVisto;
    }

    public void setDificuldade(double dificuldade) {
        this.dificuldade = dificuldade;
    }

    public void setNivel(int nivel) {
        this.nivel = nivel;
    }

    public void setMateria(Materia materia) { this.materia = materia; }
}
