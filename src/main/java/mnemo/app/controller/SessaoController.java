package mnemo.app.controller;

import mnemo.app.entities.Sessao;
import mnemo.app.services.SessaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessao")
public class SessaoController {
    private final SessaoService service;

    public SessaoController(SessaoService service) {
        this.service = service;
    }

    @PostMapping
    public Sessao create(@RequestBody Sessao sessao) {
        return service.criar(sessao.getDia(),
                             sessao.getAvaliacao(),
                             sessao.getDuracao(),
                             sessao.getTopico().getId());
    }

    @GetMapping
    public List<Sessao> getAll() {
        return service.listarTodas();
    }
}
