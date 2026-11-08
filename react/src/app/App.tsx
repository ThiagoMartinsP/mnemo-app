import { NavLink, Outlet } from 'react-router'

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
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
