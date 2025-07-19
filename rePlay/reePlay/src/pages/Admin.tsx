import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Navigate } from 'react-router-dom';
import type { Organization } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  max-width: 600px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #34495e;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem;
    font-size: 1rem;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem;
    font-size: 1rem;
    min-height: 80px;
  }
`;

const Button = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  
  &:hover {
    background: #219a52;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid #c3e6cb;
  margin-bottom: 1rem;
`;


const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const { organization, updateOrganization } = useData();
  
  const [editOrgInfo, setEditOrgInfo] = useState<Organization>(organization);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setEditOrgInfo(organization);
  }, [organization]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleOrgInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization(editOrgInfo);
    setShowSuccessMessage(true);
    
    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };


  const renderOrgInfo = () => (
    <TabContent>
      <h3>기관 정보 관리</h3>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        메인 페이지에 표시되는 기관 정보를 수정할 수 있습니다. 수정 후 저장하면 즉시 반영됩니다.
      </p>
      {showSuccessMessage && (
        <SuccessMessage>
          ✅ 기관 정보가 성공적으로 업데이트되었습니다! 메인 페이지에서 변경사항을 확인할 수 있습니다.
        </SuccessMessage>
      )}
      <Form onSubmit={handleOrgInfoSubmit}>
        <FormGroup>
          <Label>기관명</Label>
          <Input
            value={editOrgInfo.name}
            onChange={(e) => setEditOrgInfo({...editOrgInfo, name: e.target.value})}
          />
        </FormGroup>
         <FormGroup>
          <Label>기관명 아래 내용</Label>
          <TextArea
            value={editOrgInfo.organizationDescription || ''}
            onChange={(e) => setEditOrgInfo({...editOrgInfo, organizationDescription: e.target.value})}
            placeholder="기관명 아래에 표시될 별도의 내용을 입력하세요"
            style={{ minHeight: '120px' }}
          />
        </FormGroup>
        <FormGroup>
          <Label>취지</Label>
          <TextArea
            value={editOrgInfo.description}
            onChange={(e) => setEditOrgInfo({...editOrgInfo, description: e.target.value})}
            placeholder="기관의 설립 목적과 취지를 입력하세요"
            style={{ minHeight: '120px' }}
          />
        </FormGroup>
        <FormGroup>
          <Label>이력</Label>
          <TextArea
            value={editOrgInfo.history}
            onChange={(e) => setEditOrgInfo({...editOrgInfo, history: e.target.value})}
            placeholder="기관의 연혁과 발전 과정을 입력하세요"
            style={{ minHeight: '120px' }}
          />
        </FormGroup>
        <FormGroup>
          <Label>전화번호</Label>
          <Input
            value={editOrgInfo.contact.phone}
            onChange={(e) => setEditOrgInfo({...editOrgInfo, contact: {...editOrgInfo.contact, phone: e.target.value}})}
          />
        </FormGroup>
        <FormGroup>
          <Label>이메일</Label>
          <Input
            type="email"
            value={editOrgInfo.contact.email}
            onChange={(e) => setEditOrgInfo({...editOrgInfo, contact: {...editOrgInfo.contact, email: e.target.value}})}
          />
        </FormGroup>
        <Button type="submit">메인 페이지 정보 저장</Button>
      </Form>
    </TabContent>
  );



  return (
    <Container>
      <Title>관리자 페이지</Title>
      
      {renderOrgInfo()}
    </Container>
  );
};

export default Admin;