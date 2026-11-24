package mnemo.app.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="sessao")
public class Sessao {

    public Sessao() {}

    public Sessao(LocalDate dia,
                  double avaliacao,
                  LocalTime duracao,
                  Topico topico) {
        this.dia = dia;
        this.avaliacao = avaliacao;
        this.duracao = duracao;
        this.topico = topico;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="dia", nullable = false)
    private LocalDate dia;

    @Column(name="avaliacao", nullable = true)
    private double avaliacao;

    @Column(name="duracao", nullable = true)
    private LocalTime duracao;

    @ManyToOne
    @JoinColumn(name="topico_id")
    private Topico topico;

    public Long getId() {return id;}

    public LocalDate getDia() {return dia;}

    public double getAvaliacao() {return avaliacao;}

    public LocalTime getDuracao() {return duracao;}

    public Topico getTopico() {return topico;}

    public void setDia(LocalDate dia) {this.dia = dia;}

    public void setAvaliacao(double avaliacao) {this.avaliacao = avaliacao;}

    public void setDuracao(LocalTime duracao) {this.duracao = duracao;}

    public void setTopico(Topico topico) {this.topico = topico;}
}
