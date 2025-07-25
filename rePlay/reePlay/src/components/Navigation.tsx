import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Nav = styled.nav`
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.2rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
  
  &:hover {
    color: #3498db;
  }
  
  @media (max-width: 768px) {
    margin-left: 60px;
  }
  
  @media (max-width: 480px) {
    margin-left: 50px;
  }
`;

const LogoImage = styled.img`
  width: 125px;
  height: 125px;
  object-fit: contain;
  margin-top: 15px;
  margin-right: -25px;
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    position: absolute;
    left: -70px;
    margin-right: 0;
  }
  
  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    position: absolute;
    left: -60px;
    margin-right: 0;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: calc(100% + 1rem);
    left: -2rem;
    right: -2rem;
    background-color: #2c3e50;
    padding: 1rem 2rem;
    display: ${props => props.isOpen ? 'flex' : 'none'};
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border-top: 1px solid #34495e;
    z-index: 999;
    gap: 0.5rem;
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
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #34495e;
    border-radius: 0;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const AuthSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.8rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #34495e;
    
    span {
      text-align: center;
      font-size: 0.9rem;
    }
  }
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
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.8rem;
    font-size: 0.9rem;
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
    margin-right: 1rem;
  }
  
  @media (max-width: 480px) {
    margin-right: 1.5rem;
  }
`;

const Navigation: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <LogoImage src={`${import.meta.env.BASE_URL}리플레이 로고.png`} alt="re: Play Logo" />
        re: Play
        </Logo>
        
        <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </MenuToggle>
        
        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/" onClick={handleLinkClick}>홈</NavLink>
          <NavLink to="/instructors" onClick={handleLinkClick}>강사진</NavLink>
          <NavLink to="/registration" onClick={handleLinkClick}>수강신청</NavLink>
          {isAdmin && <NavLink to="/admin" onClick={handleLinkClick}>관리자</NavLink>}
          
          {user && (
            <AuthSection>
              <span style={{ color: 'white' }}>
                {user.name}님 ({user.role === 'admin' ? '관리자' : '사용자'})
              </span>
              <Button onClick={handleLogout}>로그아웃</Button>
            </AuthSection>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;