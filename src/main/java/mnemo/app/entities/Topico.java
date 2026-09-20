package mnemo.app.entities;

import java.time.LocalDate;

public class Topico {
    private String nome;
    private LocalDate ultimaVezVisto;
    private int nivel;
    private double dificuldade;

    public Topico(LocalDate dataProva,
                  String nome,
                  int nivel,
                  double dificuldade) {

        this.nome = nome;
        this.ultimaVezVisto = LocalDate.now();
        this.nivel = nivel;
        this.dificuldade = dificuldade;
    }

    public String getNome() {return nome;}

    public LocalDate getUltimaVezVisto() {return ultimaVezVisto;}

    public int getNivel() {return nivel;}

    public double getDificuldade() {return dificuldade;}

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
}
