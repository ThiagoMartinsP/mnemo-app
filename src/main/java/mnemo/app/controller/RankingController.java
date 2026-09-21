package mnemo.app.controller;


import mnemo.app.dto.TopicoPontuado;
import mnemo.app.services.RankingService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    private final RankingService service;

    public RankingController(RankingService service) { this.service = service; }

    @GetMapping
    public List<TopicoPontuado> getRanking(@RequestParam(required = false) LocalDate date) {
        LocalDate hoje = (date != null) ? date : LocalDate.now();
        return this.service.rankingAt(hoje);
    }
}
