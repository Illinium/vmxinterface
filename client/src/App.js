import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Logs from './pages/Logs';
import './App.css';

function App() {
  return (
      <div className="App">
          <Header />
          <div className='container'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/logs' element={<Logs />} />
            </Routes>
          </div>
      </div>
  );
}

export default App;
