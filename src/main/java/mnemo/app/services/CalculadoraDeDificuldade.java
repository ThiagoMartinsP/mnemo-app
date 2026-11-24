package mnemo.app.services;

public class CalculadoraDeDificuldade {
    private static final double ALFA = 0.12;

    public static double novaDificuldade(double atual, double avaliacao) {
        return (1 - ALFA)*atual + ALFA*avaliacao;
    }
}
