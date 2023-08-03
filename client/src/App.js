import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Logs from './pages/Logs'

function App() {
  return (
    // <BrowserRouter>
      <div className="App">
          <Header />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/logs' element={<Logs />} />
            </Routes>
      </div>
    // </BrowserRouter>
  );
}

export default App;
