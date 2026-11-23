package mnemo.app.services;

import jakarta.transaction.Transactional;
import mnemo.app.entities.Materia;
import mnemo.app.repository.MateriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MateriaService {
    private final MateriaRepository repository;

    public MateriaService(MateriaRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Materia criar(Materia materia) {
        return repository.save(materia);
    }

    public List<Materia> listar() {
        return repository.findAll();
    }

    public Materia buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matéria " + id + " não encontrada"));
    }

    public Materia atualizar(Long id, Materia materiaAtualizada) {
        materiaAtualizada.setId(id);
        return repository.save(materiaAtualizada);
    }
}
