package mnemo.app.services;

import mnemo.app.entities.Topico;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public final class CalculadoraDeScore {
    private static final int[] INTERVALOS = {1, 3, 6, 12, 24};
    private static final double TETO_DATA_PROVA = 3.0;

    public static double calculate(Topico topic, LocalDate hoje) {

        LocalDate dataProva = topic.getMateria().getDataProva();
        LocalDate ultimaVezVisto = topic.getUltimaVezVisto();
        int nivel = topic.getNivel();
        double dificuldade = topic.getDificuldade();

        return (calculateReviewMultiplier(ultimaVezVisto,
                                               nivel,
                                               dificuldade,
                                               hoje) *
                       gFunction(dificuldade) *
                       calculateExamPressure(dataProva, hoje));
    }

    private static double gFunction(double d) {
        return (1 + 0.6 * (d-0.5));
    }

    private static double fFunction(double d) {
        return (1 + 0.6 * (0.5-d));
    }

    private static double calculateReviewMultiplier(LocalDate lastDateReview,
                                          int level,
                                          double d,
                                          LocalDate today) {
        long daysNotReviewed = ChronoUnit.DAYS.between(lastDateReview, today);

        return daysNotReviewed / (INTERVALOS[level] * fFunction(d));
    }

    private static double calculateExamPressure(LocalDate dataProva, LocalDate today) {

        long leftDaysUntilExam = ChronoUnit.DAYS.between(today, dataProva);
        double t = Math.clamp((12f - leftDaysUntilExam) / 12f, 0.0, 1.0);

        return 1.0 + (TETO_DATA_PROVA - 1.0) * t * t;
    }
}
