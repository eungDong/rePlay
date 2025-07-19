import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Nav = styled.nav`
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #2c3e50;
    padding: 1rem;
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #34495e;
  }
`;

const AuthSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navigation: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">re : Play</Logo>
        
        <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </MenuToggle>
        
        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/">홈</NavLink>
          <NavLink to="/instructors">강사진</NavLink>
          <NavLink to="/registration">수강신청</NavLink>
          {isAdmin && <NavLink to="/admin">관리자</NavLink>}
          
          <AuthSection>
            {user ? (
              <>
                <span style={{ color: 'white' }}>
                  {user.name}님 ({user.role === 'admin' ? '관리자' : '사용자'})
                </span>
                <Button onClick={handleLogout}>로그아웃</Button>
              </>
            ) : (
              <Button onClick={() => navigate('/login')}>로그인</Button>
            )}
          </AuthSection>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;