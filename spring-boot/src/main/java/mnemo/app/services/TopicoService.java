package mnemo.app.services;

import mnemo.app.entities.Topico;
import mnemo.app.repository.TopicoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicoService {
    private final TopicoRepository repository;

    public TopicoService(TopicoRepository repository) {
        this.repository = repository;
    }

    public Topico criar(Topico topico) { return repository.save(topico); }

    public List<Topico> listar() { return repository.findAll(); }
}
