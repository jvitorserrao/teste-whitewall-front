import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './page/index'
import ListaContato from './page/listaContato'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/listaContato" element={<ListaContato />} />
      </Routes>
    </Router>
  );
};

export default App;
