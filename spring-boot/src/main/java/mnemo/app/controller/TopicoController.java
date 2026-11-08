package mnemo.app.controller;

import mnemo.app.entities.Topico;
import mnemo.app.services.TopicoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topico")
public class TopicoController {
    private final TopicoService service;

    public TopicoController(TopicoService service) {
        this.service = service;
    }

    @PostMapping
    public Topico create(@RequestBody Topico topico) {
        return service.criar(topico);
    }

    @GetMapping
    public List<Topico> getAll() {
        return service.listar();
    }
}
