package mnemo.app.controller;

import mnemo.app.entities.Materia;
import mnemo.app.services.MateriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materia")
public class MateriaController {
    private final MateriaService service;

    public MateriaController(MateriaService service) {
        this.service = service;
    }

    @PostMapping
    public Materia create(@RequestBody Materia materia) {
        return service.criar(materia);
    }

    @GetMapping
    public List<Materia> getAll() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Materia getById(@PathVariable("id") Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Materia update(@PathVariable("id") Long id,
                          @RequestBody Materia materiaAtualizada) {
        return service.atualizar(id, materiaAtualizada);
    }
}
