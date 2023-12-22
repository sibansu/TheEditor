import './App.css';
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage';
import EditorPage from './Pages/EditorPage';
import {Toaster} from 'react-hot-toast'
function App() {
  return (
    <div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<HomePage></HomePage>} />
          <Route exact path='/editor/:roomId' element={<EditorPage></EditorPage>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
