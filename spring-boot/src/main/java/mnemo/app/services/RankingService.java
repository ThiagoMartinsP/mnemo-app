package mnemo.app.services;

import mnemo.app.dto.TopicoPontuado;
import mnemo.app.entities.Topico;
import mnemo.app.repository.TopicoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class RankingService {
    private final TopicoRepository topicoRepository;

    public RankingService(TopicoRepository topicoRepository) {
        this.topicoRepository = topicoRepository;
    }

    public List<TopicoPontuado> rankingAt(LocalDate data) {
        List<TopicoPontuado> rank;

        rank = topicoRepository.findAll().stream()
                .map(t -> new TopicoPontuado(t, CalculadoraDeScore.calculate(t, data)))
                .sorted(Comparator.comparingDouble(TopicoPontuado::score).reversed())
                .toList();

        return rank;
    }
}
