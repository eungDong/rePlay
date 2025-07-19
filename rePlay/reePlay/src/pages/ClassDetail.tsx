import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #7f8c8d;
  }
`;

const ClassHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-bottom: 1.5rem;
  }
`;

const ClassTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ClassSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const ContentSection = styled.section`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #3498db;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const InfoLabel = styled.div`
  font-weight: bold;
  color: #34495e;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const InfoValue = styled.div`
  color: #666;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const Description = styled.div`
  line-height: 1.8;
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;


const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    margin-top: 1.5rem;
  }
`;

const RegisterButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#bdc3c7' : '#27ae60'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.1rem;
  font-weight: bold;
  
  &:hover {
    background: ${props => props.disabled ? '#bdc3c7' : '#219a52'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  
  &:hover {
    background: #c0392b;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const EditButton = styled.button`
  background: #f39c12;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  
  &:hover {
    background: #e67e22;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const ParticipantControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ControlButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#bdc3c7' : '#3498db'};
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  
  &:hover {
    background: ${props => props.disabled ? '#bdc3c7' : '#2980b9'};
  }
`;

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, deleteClass, updateClass } = useData();
  const { isAdmin } = useAuth();

  const classItem = classes.find(cls => cls.id === id);

  if (!classItem) {
    return (
      <Container>
        <BackButton onClick={() => navigate('/registration')}>
          ← 뒤로 가기
        </BackButton>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2>클래스를 찾을 수 없습니다.</h2>
        </div>
      </Container>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegistration = () => {
    if (classItem.googleFormUrl) {
      window.open(classItem.googleFormUrl, '_blank');
    } else {
      alert('수강신청 폼이 아직 준비되지 않았습니다.');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`정말로 "${classItem.title}" 클래스를 삭제하시겠습니까?`)) {
      deleteClass(classItem.id);
      alert('클래스가 삭제되었습니다.');
      navigate('/registration');
    }
  };

  const handleParticipantChange = (change: number) => {
    const newParticipants = classItem.currentParticipants + change;
    
    if (newParticipants < 0 || newParticipants > classItem.maxParticipants) {
      return;
    }

    const updatedClass = {
      ...classItem,
      currentParticipants: newParticipants
    };

    updateClass(classItem.id, updatedClass);
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/registration')}>
        ← 뒤로 가기
      </BackButton>

      <ClassHeader>
        <ClassTitle>{classItem.title}</ClassTitle>
        <ClassSubtitle>강사: {classItem.instructor}</ClassSubtitle>
      </ClassHeader>

      <ContentSection>
        <SectionTitle>클래스 정보</SectionTitle>
        <InfoGrid>
          <InfoCard>
            <InfoLabel>날짜</InfoLabel>
            <InfoValue>{formatDate(classItem.date)}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>시간</InfoLabel>
            <InfoValue>{formatTime(classItem.date)}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>수강시간</InfoLabel>
            <InfoValue>{classItem.duration}분</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>장소</InfoLabel>
            <InfoValue>{classItem.location || '미정'}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>정원</InfoLabel>
            <InfoValue>
              {isAdmin ? (
                <ParticipantControl>
                  <ControlButton onClick={() => handleParticipantChange(-1)} disabled={classItem.currentParticipants <= 0}>
                    -
                  </ControlButton>
                  <span>{classItem.currentParticipants}/{classItem.maxParticipants}명</span>
                  <ControlButton onClick={() => handleParticipantChange(1)} disabled={classItem.currentParticipants >= classItem.maxParticipants}>
                    +
                  </ControlButton>
                </ParticipantControl>
              ) : (
                `${classItem.currentParticipants}/${classItem.maxParticipants}명`
              )}
            </InfoValue>
          </InfoCard>
        </InfoGrid>
      </ContentSection>

      <ContentSection>
        <SectionTitle>상세 설명</SectionTitle>
        {classItem.detailedDescription ? (
          <Description>
            {classItem.detailedDescription}
          </Description>
        ) : classItem.description ? (
          <Description>
            {classItem.description}
          </Description>
        ) : (
          <Description style={{ fontStyle: 'italic', color: '#888' }}>
            클래스 설명이 설정되지 않았습니다. 관리자가 클래스 수정을 통해 설명을 추가할 수 있습니다.
          </Description>
        )}
      </ContentSection>


      <ActionButtons>
        <RegisterButton
          disabled={classItem.currentParticipants >= classItem.maxParticipants}
          onClick={handleRegistration}
        >
          {classItem.currentParticipants >= classItem.maxParticipants 
            ? '마감' 
            : '수강신청하기'
          }
        </RegisterButton>
        
        {isAdmin && (
          <>
            <EditButton onClick={() => navigate(`/class/${classItem.id}/edit`)}>
              클래스 수정
            </EditButton>
            <DeleteButton onClick={handleDelete}>
              클래스 삭제
            </DeleteButton>
          </>
        )}
      </ActionButtons>
    </Container>
  );
};

export default ClassDetail;