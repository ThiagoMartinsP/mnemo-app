import { NavLink, Outlet } from 'react-router'
import { SeedButton } from '../features/seed/SeedButton'

export function App() {
  return (
    <div className="layout">
      <header className="topo">
        <span className="marca">MNEMO</span>
        <nav className="nav">
          {/* NavLink aplica a classe "active" sozinho quando a rota casa. "end" evita que "/" fique ativo em todas. */}
          <NavLink to="/" end>
            Hoje
          </NavLink>
          <NavLink to="/materias">Matérias</NavLink>
          <NavLink to="/topicos">Tópicos</NavLink>
        </nav>
        {/* import.meta.env.DEV é substituído por true/false no build. Em produção o
            bloco vira `false && ...` e o bundler remove o componente (dead code elimination). */}
        {import.meta.env.DEV && <SeedButton />}
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
