package mnemo.app.services;

import jakarta.transaction.Transactional;
import mnemo.app.entities.Materia;
import mnemo.app.repository.MateriaRepository;
import org.springframework.stereotype.Service;

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
}
