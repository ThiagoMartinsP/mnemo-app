package mnemo.app.controller;

import mnemo.app.services.TestsService;
import org.aspectj.weaver.ast.Test;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/test")
public class TestsController {
    private final TestsService testsService;

    public TestsController(TestsService testsService) {
        this.testsService = testsService;
    }

    @PostMapping("/seedDataBase")
    public void seedDataBase() {
        testsService.seedDataBase(LocalDate.now());
    }
}
