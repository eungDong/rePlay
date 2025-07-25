import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import type { Class } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding: 2rem 1rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
  
  h3 {
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
  }
  
  p {
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    
    @media (max-width: 768px) {
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
`;

const CalendarContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  .react-calendar__month-view__weekdays {
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  .react-calendar__tile {
    @media (max-width: 480px) {
      height: 40px;
      font-size: 0.8rem;
    }
  }
  
  .react-calendar__tile--active {
    background:rgb(230, 159, 28) !important;
    color: white !important;
  }
  
  .react-calendar__tile--hasClass {
    background: #f8d7da !important;
    color: #721c24 !important;
    position: relative;
  }
  
  .react-calendar__tile--hasClass:hover {
    background: #f5c6cb !important;
  }
  
  .react-calendar__tile--active.react-calendar__tile--hasClass {
    background:rgb(228, 145, 113) !important;
    color: #155724 !important;
  }
`;


const Footer = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    padding: 1.5rem 0;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
  
  h3 {
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    font-size: 0.95rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
    max-height: 85vh;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 10px;
  }
`;

const ModalTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ClassCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #3498db;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ClassTitle = styled.h4`
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ClassInfo = styled.div`
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.8rem;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.2rem;
  }
  
  span:first-child {
    font-weight: bold;
    color: #34495e;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  span:last-child {
    color: #666;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const RegisterButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#bdc3c7' : '#27ae60'};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: 100%;
  font-weight: bold;
  margin-top: 0.5rem;
  
  &:hover {
    background: ${props => props.disabled ? '#bdc3c7' : '#219a52'};
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const CloseButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  float: right;
  margin-top: 1rem;
  
  &:hover {
    background: #7f8c8d;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    float: none;
    margin-top: 0.8rem;
  }
`;

const HiddenLoginButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  color: #adb5bd;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  opacity: 0.3;
  z-index: 100;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
    background: #e9ecef;
    border-color: #adb5bd;
    color: #495057;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 1024px) {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 45px;
    height: 45px;
    font-size: 14px;
    background: transparent;
    border: none;
    opacity: 0.4;
    
    &:hover {
      transform: scale(1.1);
      opacity: 0.7;
      background: transparent;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  @media (max-width: 768px) {
    bottom: 5px;
    left: 5px;
    width: 40px;
    height: 40px;
    font-size: 12px;
    background: transparent;
    border: none;
    opacity: 0.4;
    
    &:hover {
      opacity: 0.7;
      background: transparent;
    }
  }
`;

const Home: React.FC = () => {
  const { organization, classes, isLoading } = useData();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateClasses, setSelectedDateClasses] = useState<Class[]>([]);

  const classSchedule = classes.map(cls => cls.date);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (classSchedule.some(classDate => 
        classDate.getDate() === date.getDate() &&
        classDate.getMonth() === date.getMonth() &&
        classDate.getFullYear() === date.getFullYear()
      )) {
        return 'react-calendar__tile--hasClass';
      }
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    const dayClasses = classes.filter(cls => 
      cls.date.getDate() === date.getDate() &&
      cls.date.getMonth() === date.getMonth() &&
      cls.date.getFullYear() === date.getFullYear()
    );
    
    if (dayClasses.length > 0) {
      setSelectedDateClasses(dayClasses);
      setIsModalOpen(true);
    }
  };

  const handleRegistration = (classItem: Class) => {
    if (classItem.googleFormUrl) {
      window.open(classItem.googleFormUrl, '_blank');
    } else {
      alert('수강신청 폼이 아직 준비되지 않았습니다.');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#666',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>로딩 중...</h3>
          <p>데이터를 불러오고 있습니다.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Hero>
        <Title>{organization.name}</Title>
        <Subtitle>{organization.organizationDescription || ''}</Subtitle>
      </Hero>

      <Section>
        <SectionTitle> 소개</SectionTitle>
        <Grid>
          <InfoCard>
            <h3>취지</h3>
            <p>{organization.description}</p>
          </InfoCard>
          
          <InfoCard>
            <h3>이력</h3>
            <p>{organization.history}</p>
          </InfoCard>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>클래스 일정</SectionTitle>
        <CalendarContainer>
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
              }
            }}
            value={selectedDate}
            onClickDay={handleDateClick}
            tileClassName={tileClassName}
          />
          <p style={{ marginTop: '1rem', color: '#666' }}>
            빨간색으로 표시된 날짜를 클릭하면 해당 날의 클래스 정보를 확인하고 수강신청할 수 있습니다.
          </p>
        </CalendarContainer>
      </Section>
      
      <Footer>
        <FooterContent>
          <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Contact</h3>
          <ContactInfo>
            <ContactItem>
              <span>📞</span>
              <span>{organization.contact.phone}</span>
            </ContactItem>
            <ContactItem>
              <span>✉️</span>
              <span>{organization.contact.email}</span>
            </ContactItem>
          </ContactInfo>
        </FooterContent>
      </Footer>

      {isModalOpen && (
        <Modal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <ModalContent>
            <ModalTitle>{formatSelectedDate(selectedDate)} 클래스</ModalTitle>
            
            {selectedDateClasses.map((classItem) => (
              <ClassCard key={classItem.id}>
                <ClassTitle>{classItem.title}</ClassTitle>
                
                <ClassInfo>
                  <InfoRow>
                    <span>강사:</span>
                    <span>{classItem.instructor}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>시간:</span>
                    <span>{formatTime(classItem.date)} ({classItem.duration}분)</span>
                  </InfoRow>
                  <InfoRow>
                    <span>장소:</span>
                    <span>{classItem.location || '미정'}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>정원:</span>
                    <span>{classItem.currentParticipants}/{classItem.maxParticipants}명</span>
                  </InfoRow>
                </ClassInfo>
                
                <RegisterButton
                  disabled={classItem.currentParticipants >= classItem.maxParticipants}
                  onClick={() => handleRegistration(classItem)}
                >
                  {classItem.currentParticipants >= classItem.maxParticipants 
                    ? '마감' 
                    : '수강신청하기'
                  }
                </RegisterButton>
              </ClassCard>
            ))}
            
            <CloseButton onClick={() => setIsModalOpen(false)}>
              닫기
            </CloseButton>
          </ModalContent>
        </Modal>
      )}
      
      <HiddenLoginButton 
        onClick={() => navigate('/login')}
        title="관리자 로그인"
      >
        🔐
      </HiddenLoginButton>
    </Container>
  );
};

export default Home;