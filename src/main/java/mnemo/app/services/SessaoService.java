package mnemo.app.services;

import jakarta.transaction.Transactional;
import mnemo.app.entities.Sessao;
import mnemo.app.entities.Topico;
import mnemo.app.repository.SessaoRepository;
import mnemo.app.repository.TopicoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class SessaoService {
    private final SessaoRepository sessaoRepository;
    private final TopicoRepository topicoRepository;

    public SessaoService(SessaoRepository sessaoRepository,
                         TopicoRepository topicoRepository) {
        this.sessaoRepository = sessaoRepository;
        this.topicoRepository = topicoRepository;
    }

    @Transactional
    public Sessao criar(LocalDate dia,
                        double avaliacao,
                        LocalTime duracao,
                        Long topicoId) {
        Topico topico = topicoRepository.findById(topicoId)
                .orElseThrow(() -> new
                        ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tópico não encontrado."));

        topico.setDificuldade(CalculadoraDeDificuldade.novaDificuldade(topico.getDificuldade(), avaliacao));
        Sessao sessao = new Sessao(dia, avaliacao, duracao, topico);

        return sessaoRepository.save(sessao);
    }

    public List<Sessao> listarTodas() {
        return sessaoRepository.findAll();
    }
}

