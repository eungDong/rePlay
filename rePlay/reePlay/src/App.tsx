import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Instructors from './pages/Instructors';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ClassDetail from './pages/ClassDetail';
import ClassEdit from './pages/ClassEdit';
import ClassAdd from './pages/ClassAdd';
import InstructorDetail from './pages/InstructorDetail';
import InstructorEdit from './pages/InstructorEdit';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    line-height: 1.6;
  }
  
  #root {
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 0;
`;

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <GlobalStyle />
          <AppContainer>
            <Navigation />
            <MainContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/instructors" element={<Instructors />} />
                <Route path="/instructor/:id" element={<InstructorDetail />} />
                <Route path="/instructor/:id/edit" element={<InstructorEdit />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/class/:id" element={<ClassDetail />} />
                <Route path="/class/:id/edit" element={<ClassEdit />} />
                <Route path="/class/add" element={<ClassAdd />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </MainContent>
          </AppContainer>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
