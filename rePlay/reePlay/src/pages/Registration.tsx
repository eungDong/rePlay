import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { Class } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ClassCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    &:hover {
      transform: translateY(-2px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ClassTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ClassInfo = styled.div`
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
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

const ClassDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const RegistrationButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#bdc3c7' : '#27ae60'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  
  &:hover {
    background: ${props => props.disabled ? '#bdc3c7' : '#219a52'};
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;


const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  font-size: 1rem;
  font-weight: bold;
  
  &:hover {
    background: #c0392b;
  }
`;

const AdminSection = styled.div`
  border-top: 1px solid #eee;
  margin-top: 1rem;
  padding-top: 1rem;
`;

const EditButton = styled.button`
  background: #f39c12;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: #e67e22;
  }
`;

const AddButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  font-weight: bold;
  
  &:hover {
    background: #219a52;
  }
`;

const NoticeBox = styled.div`
  background: #e8f4fd;
  border-left: 4px solid #3498db;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  position: relative;
`;

const NoticeTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const NoticeContent = styled.div`
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const EditNoticeButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #2980b9;
  }
`;

const NoticeEditModal = styled.div`
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const SaveButton = styled(Button)`
  background: #27ae60;
  color: white;
  
  &:hover {
    background: #219a52;
  }
`;

const CancelButton = styled(Button)`
  background: #95a5a6;
  color: white;
  
  &:hover {
    background: #7f8c8d;
  }
`;


const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;


const Registration: React.FC = () => {
  const { classes, deleteClass, organization, updateOrganization } = useData();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [noticeText, setNoticeText] = useState(organization.registrationNotice || '');
  const [noticeTitle, setNoticeTitle] = useState(organization.registrationNoticeTitle || '📢 수강신청 안내');

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

  const handleRegistration = (classItem: Class) => {
    if (classItem.googleFormUrl) {
      window.open(classItem.googleFormUrl, '_blank');
    } else {
      alert('수강신청 폼이 아직 준비되지 않았습니다.');
    }
  };

  const handleDeleteClass = (classItem: Class) => {
    if (window.confirm(`정말로 "${classItem.title}" 클래스를 삭제하시겠습니까?`)) {
      deleteClass(classItem.id);
      alert('클래스가 삭제되었습니다.');
    }
  };

  const handleEditClass = (classItem: Class) => {
    navigate(`/class/${classItem.id}/edit`);
  };

  const handleAddClass = () => {
    navigate('/class/add');
  };

  const handleEditNotice = () => {
    setNoticeText(organization.registrationNotice || '');
    setNoticeTitle(organization.registrationNoticeTitle || '📢 수강신청 안내');
    setIsEditingNotice(true);
  };

  const handleSaveNotice = () => {
    const updatedOrganization = {
      ...organization,
      registrationNotice: noticeText.trim(),
      registrationNoticeTitle: noticeTitle.trim()
    };
    updateOrganization(updatedOrganization);
    setIsEditingNotice(false);
  };

  const handleCancelEdit = () => {
    setNoticeText(organization.registrationNotice || '');
    setNoticeTitle(organization.registrationNoticeTitle || '📢 수강신청 안내');
    setIsEditingNotice(false);
  };


  return (
    <Container>
      <Title>수강신청</Title>
      
      {(organization.registrationNotice || isAdmin) && (
        <NoticeBox>
          <NoticeTitle>
            {noticeTitle || '📢 수강신청 안내'}
          </NoticeTitle>
          <NoticeContent>
            {organization.registrationNotice || (isAdmin ? '관리자 글 작성 영역입니다. 수정 버튼을 눌러 내용을 입력하세요.' : '')}
          </NoticeContent>
          {isAdmin && (
            <EditNoticeButton onClick={handleEditNotice}>
              수정
            </EditNoticeButton>
          )}
        </NoticeBox>
      )}
      
      {isAdmin && (
        <AddButton onClick={handleAddClass}>
          새 클래스 추가
        </AddButton>
      )}
      
      {classes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#666',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>아직 개설된 클래스가 없습니다</h3>
          <p>다양한 클래스가 곧 준비될 예정입니다.</p>
          {isAdmin ? (
            <>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                관리자님, 상단의 "새 클래스 추가" 버튼을 클릭하여 첫 번째 클래스를 추가해보세요.
              </p>
            </>
          ) : (
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              제공되는 클래스에 대한 정보는 홈 페이지나 강사진 페이지를 참고해 주세요.
            </p>
          )}
        </div>
      ) : (
        <ClassesGrid>
          {classes.map((classItem) => (
          <ClassCard 
            key={classItem.id} 
            onClick={() => navigate(`/class/${classItem.id}`)}
          >
            <ClassTitle>{classItem.title}</ClassTitle>
            
            <ClassInfo>
              <InfoRow>
                <span>강사:</span>
                <span>{classItem.instructor}</span>
              </InfoRow>
              <InfoRow>
                <span>날짜:</span>
                <span>{formatDate(classItem.date)}</span>
              </InfoRow>
              <InfoRow>
                <span>시간:</span>
                <span>{formatTime(classItem.date)}</span>
              </InfoRow>
              <InfoRow>
                <span>시간:</span>
                <span>{classItem.duration}분</span>
              </InfoRow>
              <InfoRow>
                <span>정원:</span>
                <span>{classItem.currentParticipants}/{classItem.maxParticipants}명</span>
              </InfoRow>
            </ClassInfo>
            
            <ClassDescription>{classItem.description}</ClassDescription>
            
            {isAdmin ? (
              <>
                <RegistrationButton
                  disabled={classItem.currentParticipants >= classItem.maxParticipants}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegistration(classItem);
                  }}
                >
                  {classItem.currentParticipants >= classItem.maxParticipants 
                    ? '마감' 
                    : '수강신청하기'
                  }
                </RegistrationButton>
                
                <AdminSection>
                  <EditButton onClick={(e) => {
                    e.stopPropagation();
                    handleEditClass(classItem);
                  }}>
                    클래스 수정
                  </EditButton>
                  <DeleteButton onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClass(classItem);
                  }}>
                    클래스 삭제
                  </DeleteButton>
                </AdminSection>
              </>
            ) : (
              <RegistrationButton
                disabled={classItem.currentParticipants >= classItem.maxParticipants}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegistration(classItem);
                }}
              >
                {classItem.currentParticipants >= classItem.maxParticipants 
                  ? '마감' 
                  : '수강신청하기'
                }
              </RegistrationButton>
            )}
          </ClassCard>
        ))}
      </ClassesGrid>
      )}

      {isEditingNotice && (
        <NoticeEditModal onClick={(e) => e.target === e.currentTarget && handleCancelEdit()}>
          <ModalContent>
            <ModalTitle>수강신청 안내 수정</ModalTitle>
            <FormGroup>
              <Label htmlFor="noticeTitle">제목</Label>
              <Input
                id="noticeTitle"
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="📢 안내 제목을 입력하세요"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="noticeContent">내용</Label>
              <TextArea
                id="noticeContent"
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                placeholder="수강신청 관련 안내사항을 입력하세요..."
              />
            </FormGroup>
            <ModalButtonGroup>
              <CancelButton onClick={handleCancelEdit}>
                취소
              </CancelButton>
              <SaveButton onClick={handleSaveNotice}>
                저장
              </SaveButton>
            </ModalButtonGroup>
          </ModalContent>
        </NoticeEditModal>
      )}
    </Container>
  );
};

export default Registration;