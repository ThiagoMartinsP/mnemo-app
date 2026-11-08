import { createBrowserRouter } from 'react-router'
import { App } from './App'
import { HojePage } from '../pages/HojePage'
import { MateriasPage } from '../pages/MateriasPage'
import { TopicosPage } from '../pages/TopicosPage'

// Rota-pai com o layout (App) e filhas renderizadas no <Outlet/> dele.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HojePage /> },
      { path: 'materias', element: <MateriasPage /> },
      { path: 'topicos', element: <TopicosPage /> },
    ],
  },
])
