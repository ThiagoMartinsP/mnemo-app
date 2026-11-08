package mnemo.app.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="sessao")
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="dia", nullable = false)
    private LocalDate dia;

    @Column(name="avaliacao", nullable = true)
    private double avaliacao;

    @Column(name="duracao", nullable = true)
    private LocalTime duracao;

    @OneToOne
    @JoinColumn(name="topico_id")
    private Topico topico;
}
