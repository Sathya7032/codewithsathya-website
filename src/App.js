import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import Updates from './pages/Updates';
import SnippetsPage from './pages/SnippetsPage';
import TechnologyDetail from './pages/TechnologyDetail';
import TutorialsPage from './pages/TutorialsPage';
import TutorialTopics from './pages/TutorialTopics';
import TutorialPage from './pages/TutorialPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<HomePage/>} path='/'/>
      <Route element={<BlogPage/>} path='/blogs'/>
      <Route element={<Updates/>} path='/tech-updates'/>
      <Route element={<SnippetsPage/>} path='/code-snippets' />
      <Route element={<TechnologyDetail/>} path='/technologies/:slug'/>
      <Route element={<TutorialsPage />} path='/tutorials'/>
      <Route element={<TutorialTopics/>} path='/topics/:slug' />
      <Route element={<TutorialPage/>} path='/topic/:slug' />
    </Routes>
    </BrowserRouter>
  );
}

export default App;