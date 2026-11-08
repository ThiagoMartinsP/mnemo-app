package mnemo.app.services;

import jakarta.transaction.Transactional;
import mnemo.app.entities.Materia;
import mnemo.app.entities.Topico;
import mnemo.app.repository.MateriaRepository;
import mnemo.app.repository.TopicoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TestsService {
    private final TopicoRepository topicoRepository;
    private final MateriaRepository materiaRepository;

    public TestsService(TopicoRepository topicoRepository,
                               MateriaRepository materiaRepository) {
        this.topicoRepository = topicoRepository;
        this.materiaRepository = materiaRepository;
    }

    private Materia materia(String nome, LocalDate hoje, Integer diasAteProva) {
        Materia m = new Materia();
        m.setNome(nome);
        if (diasAteProva != null) {
            m.setDataProva(hoje.plusDays(diasAteProva));
        }
        return m;
    }

    private Topico topico(String nome, Materia materia, int nivel,
                          double dificuldade, int diasAtras, LocalDate hoje) {
        Topico t = new Topico();
        t.setNome(nome);
        t.setMateria(materia);
        t.setNivel(nivel);
        t.setDificuldade(dificuldade);
        t.setUltimaVezVisto(hoje.minusDays(diasAtras));
        return t;
    }

    @Transactional
    public void seedDataBase(LocalDate hoje) {
        if (topicoRepository.count() > 0) return;

        Materia teoriaDaComputacao = materiaRepository.save(materia("Teoria da Computação",          hoje, 3));
        Materia calculo3           = materiaRepository.save(materia("Cálculo 3",                     hoje, 25));
        Materia arquitetura1       = materiaRepository.save(materia("Arquitetura de Computadores 1", hoje, 13));
        Materia elementosDeLogica  = materiaRepository.save(materia("Elementos de Lógica",           hoje, 10));

        topicoRepository.saveAll(List.of(
                topico("Autômatos Finitos",      teoriaDaComputacao,     1,    0.3,  4,  hoje),
                topico("Lema do bombeamento",    teoriaDaComputacao,     2,    0.8,  5,  hoje),
                topico("Expressões Regulares",   teoriaDaComputacao,     0,    0.5,  1,  hoje),

                topico("Funções vetoriais",      calculo3,      3,    0.6,  10, hoje),
                topico("Integrais de linha",     calculo3,      1,    0.9,  6,  hoje),

                topico("Mapa de Karnaugh",       arquitetura1,    2,    0.6,  5,  hoje),
                topico("Algebra Booleana",       arquitetura1,    0,    0.5,  0,  hoje),  // recém-cadastrado
                topico("Processadores",          arquitetura1,    4,    0.3,  40, hoje),  // topo da escada

                topico("Tabela verdade",         elementosDeLogica, 1,    0.3,  21, hoje),  // abandonado (invariante 4.8)
                topico("Circuitos lógicos",      elementosDeLogica, 3,    0.4,  8,  hoje)
        ));
    }
}
