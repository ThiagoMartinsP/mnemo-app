package mnemo.app.services;

import mnemo.app.entities.Materia;
import mnemo.app.entities.Sessao;
import mnemo.app.entities.Topico;
import mnemo.app.repository.SessaoRepository;
import mnemo.app.repository.TopicoRepository;
import org.junit.jupiter.api.*;

import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

public class SessaoServiceTests {

    private SessaoRepository sessaoRepository;

    private TopicoRepository topicoRepository;

    private SessaoService service;

    @BeforeEach
    public void setUp() {
        sessaoRepository = Mockito.mock(SessaoRepository.class);
        topicoRepository = Mockito.mock(TopicoRepository.class);

        service = new SessaoService(sessaoRepository, topicoRepository);
    }

    @Test
    @DisplayName("Caso onde a dificuldade ")
    public void sessaoServiceTestCase1() {

        Long topicoId = 1L;
        double dificuldadeInicial = 0.5;
        Topico topico = new Topico("Equações Diferenciais",
                                    0,
                                    dificuldadeInicial,
                                    new Materia());

        Mockito.when(topicoRepository.findById(topicoId)).thenReturn(Optional.of(topico));
        Mockito.when(sessaoRepository.save(any(Sessao.class))).thenAnswer(invoke -> invoke.getArgument(0));


        double avaliacao = 0.8;
        Sessao sessao = service.criar(LocalDate.of(2026, 6, 18),
                      avaliacao,
                      LocalTime.of(0,40),
                      topicoId);

        // topico.setDificuldade(CalculadoraDeDificuldade.novaDificuldade(topico.getDificuldade(), avaliacao));
        assertEquals(CalculadoraDeDificuldade.novaDificuldade(dificuldadeInicial, avaliacao),
                topico.getDificuldade());

        // Sessao sessao = new Sessao(dia, avaliacao, duracao, topico);
        assertSame(topico, sessao.getTopico());
    }
}
