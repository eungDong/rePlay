import React, { useState } from 'react';
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

const ImageSliderContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 2rem;
`;

const ImageSlider = styled.div`
  aspect-ratio: 4/3;
  background: linear-gradient(45deg, #3498db, #2980b9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SliderButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(0,0,0,0.8);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(SliderButton)`
  left: 10px;
`;

const NextButton = styled(SliderButton)`
  right: 10px;
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  z-index: 10;
`;

const FullScreenModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;
`;

const FullScreenImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  cursor: default;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const ClickableImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
`;

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, deleteClass, updateClass } = useData();
  const { isAdmin } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

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

  const handlePrevImage = () => {
    if (classItem?.images && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (classItem?.images && currentImageIndex < classItem.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const openFullScreen = () => {
    setIsFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenOpen(false);
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

      {classItem.images && classItem.images.length > 0 && (
        <ContentSection>
          <SectionTitle>클래스 사진</SectionTitle>
          <ImageSliderContainer>
            <ImageSlider>
              {classItem.images[currentImageIndex].startsWith('data:') ? (
                <ClickableImage 
                  src={classItem.images[currentImageIndex]} 
                  alt={`${classItem.title} 사진 ${currentImageIndex + 1}`}
                  onClick={openFullScreen}
                />
              ) : (
                `클래스 사진 ${currentImageIndex + 1}`
              )}
              
              {classItem.images.length > 1 && (
                <>
                  <PrevButton 
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                  >
                    ‹
                  </PrevButton>
                  <NextButton 
                    onClick={handleNextImage}
                    disabled={currentImageIndex === classItem.images.length - 1}
                  >
                    ›
                  </NextButton>
                  <ImageCounter>
                    {currentImageIndex + 1} / {classItem.images.length}
                  </ImageCounter>
                </>
              )}
            </ImageSlider>
          </ImageSliderContainer>
        </ContentSection>
      )}

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

      {isFullScreenOpen && classItem.images && classItem.images[currentImageIndex].startsWith('data:') && (
        <FullScreenModal onClick={closeFullScreen}>
          <CloseButton onClick={closeFullScreen}>×</CloseButton>
          <FullScreenImage 
            src={classItem.images[currentImageIndex]} 
            alt={`${classItem.title} 사진 ${currentImageIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
        </FullScreenModal>
      )}
    </Container>
  );
};

export default ClassDetail;