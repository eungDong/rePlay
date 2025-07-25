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

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const InstructorName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Experience = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const SpecialtiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SpecialtyTag = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const ContentSection = styled.section`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Bio = styled.div`
  line-height: 1.8;
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ImageSliderContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 2rem;
`;

const ImageClickHint = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-style: italic;
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

const FullScreenSliderButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const FullScreenPrevButton = styled(FullScreenSliderButton)`
  left: 20px;
`;

const FullScreenNextButton = styled(FullScreenSliderButton)`
  right: 20px;
`;

const FullScreenImageCounter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 1rem;
  z-index: 10;
`;

const ClickableImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
`;

const ClassesSection = styled.div`
  margin-top: 2rem;
`;

const ClassCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #3498db;
`;

const ClassName = styled.h4`
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ClassInfo = styled.p`
  color: #666;
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
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
`;

const InstructorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { instructors, deleteInstructor, classes } = useData();
  const { isAdmin } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  const instructor = instructors.find(inst => inst.id === id);

  if (!instructor) {
    return (
      <Container>
        <BackButton onClick={() => navigate('/instructors')}>
          ← 뒤로 가기
        </BackButton>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2>강사를 찾을 수 없습니다.</h2>
        </div>
      </Container>
    );
  }

  // 해당 강사가 진행하는 클래스들 (현재 시간 이후의 수업만)
  const now = new Date();
  const instructorClasses = classes.filter(cls => cls.instructor === instructor.name && cls.date >= now);

  const handleDelete = () => {
    if (window.confirm(`정말로 "${instructor.name}" 강사를 삭제하시겠습니까?`)) {
      deleteInstructor(instructor.id);
      alert('강사가 삭제되었습니다.');
      navigate('/instructors');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const handlePrevImage = () => {
    if (instructor?.images && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (instructor?.images && currentImageIndex < instructor.images.length - 1) {
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
      <BackButton onClick={() => navigate('/instructors')}>
        ← 뒤로 가기
      </BackButton>

      <ProfileHeader>
        <ProfileImage>
          {instructor.images && instructor.images.length > 0 && instructor.images[0].startsWith('data:') ? (
            <img src={instructor.images[0]} alt={instructor.name} />
          ) : (
            '👨‍🏫'
          )}
        </ProfileImage>
        <ProfileInfo>
          <InstructorName>{instructor.name} 강사님</InstructorName>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>이력</h3>
            <Experience style={{ whiteSpace: 'pre-wrap' }}>{instructor.experience}</Experience>
          </div>
          <SpecialtiesContainer>
            {instructor.specialties.map((specialty, index) => (
              <SpecialtyTag key={index}>{specialty}</SpecialtyTag>
            ))}
          </SpecialtiesContainer>
        </ProfileInfo>
      </ProfileHeader>

      {instructor.detailedDescription && (
        <ContentSection>
          <SectionTitle>강사 소개</SectionTitle>
          <Bio style={{ whiteSpace: 'pre-wrap' }}>{instructor.detailedDescription}</Bio>
        </ContentSection>
      )}

      {instructor.images && instructor.images.length > 0 && (
        <ContentSection>
          <SectionTitle>강사 사진</SectionTitle>
          <ImageSliderContainer>
            <ImageSlider>
              {instructor.images[currentImageIndex].startsWith('data:') ? (
                <ClickableImage 
                  src={instructor.images[currentImageIndex]} 
                  alt={`${instructor.name} 사진 ${currentImageIndex + 1}`}
                  onClick={openFullScreen}
                />
              ) : (
                `강사 활동 사진 ${currentImageIndex + 1}`
              )}
              
              {instructor.images.length > 1 && (
                <>
                  <PrevButton 
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                  >
                    ‹
                  </PrevButton>
                  <NextButton 
                    onClick={handleNextImage}
                    disabled={currentImageIndex === instructor.images.length - 1}
                  >
                    ›
                  </NextButton>
                  <ImageCounter>
                    {currentImageIndex + 1} / {instructor.images.length}
                  </ImageCounter>
                </>
              )}
            </ImageSlider>
          </ImageSliderContainer>
          <ImageClickHint>이미지를 클릭하여 더 큰 화면으로 볼 수 있습니다. </ImageClickHint>
        </ContentSection>
      )}

      <ContentSection>
        <SectionTitle>진행 중인 클래스</SectionTitle>
        <ClassesSection>
          {instructorClasses.length > 0 ? (
            instructorClasses.map((classItem) => (
              <ClassCard key={classItem.id}>
                <ClassName>{classItem.title}</ClassName>
                <ClassInfo>날짜: {formatDate(classItem.date)}</ClassInfo>
                <ClassInfo>장소: {classItem.location || '미정'}</ClassInfo>
                <ClassInfo>정원: {classItem.currentParticipants}/{classItem.maxParticipants}명</ClassInfo>
              </ClassCard>
            ))
          ) : (
            <p style={{ color: '#666', textAlign: 'center' }}>
              현재 진행 중인 클래스가 없습니다.
            </p>
          )}
        </ClassesSection>
      </ContentSection>

      {isAdmin && (
        <ActionButtons>
          <EditButton onClick={() => navigate(`/instructor/${id}/edit`)}>
            강사 정보 수정
          </EditButton>
          <DeleteButton onClick={handleDelete}>
            강사 삭제
          </DeleteButton>
        </ActionButtons>
      )}

      {isFullScreenOpen && instructor.images && instructor.images[currentImageIndex].startsWith('data:') && (
        <FullScreenModal onClick={closeFullScreen}>
          <CloseButton onClick={closeFullScreen}>×</CloseButton>
          <FullScreenImage 
            src={instructor.images[currentImageIndex]} 
            alt={`${instructor.name} 사진 ${currentImageIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {instructor.images.length > 1 && (
            <>
              <FullScreenPrevButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                disabled={currentImageIndex === 0}
              >
                ‹
              </FullScreenPrevButton>
              <FullScreenNextButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                disabled={currentImageIndex === instructor.images.length - 1}
              >
                ›
              </FullScreenNextButton>
              <FullScreenImageCounter>
                {currentImageIndex + 1} / {instructor.images.length}
              </FullScreenImageCounter>
            </>
          )}
        </FullScreenModal>
      )}
    </Container>
  );
};

export default InstructorDetail;