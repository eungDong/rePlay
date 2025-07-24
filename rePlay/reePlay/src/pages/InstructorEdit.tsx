import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { compressImage, validateImageSize } from '../utils/imageCompression';
import type { Instructor } from '../types';

const Container = styled.div`
  max-width: 800px;
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

const Header = styled.div`
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  opacity: 0.9;
  font-size: 1.1rem;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #34495e;
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #f39c12;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  min-height: 120px;
  resize: vertical;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #f39c12;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
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

const ErrorMessage = styled.div`
  background: #e74c3c;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 1rem;
`;

const PreviewImage = styled.div`
  width: 100px;
  height: 100px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  
  &:hover {
    background: #c0392b;
  }
`;

const AddImagePlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
  
  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const InstructorEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { instructors, updateInstructor } = useData();
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    images: [] as string[],
    specialties: '',
    experience: '',
    detailedDescription: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const instructorToEdit = instructors.find(inst => inst.id === id);
    if (!instructorToEdit) {
      navigate('/instructors');
      return;
    }

    setFormData({
      name: instructorToEdit.name,
      bio: instructorToEdit.bio,
      images: instructorToEdit.images || [],
      specialties: instructorToEdit.specialties.join(', '),
      experience: instructorToEdit.experience,
      detailedDescription: instructorToEdit.detailedDescription || ''
    });
  }, [id, instructors, isAdmin, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        try {
          if (!validateImageSize(file)) {
            setError('이미지 파일 크기는 10MB 이하여야 합니다.');
            continue;
          }

          const compressedImage = await compressImage(file);
          setFormData(prev => ({
            ...prev, 
            images: [...prev.images, compressedImage]
          }));
        } catch (error) {
          console.error('Error compressing image:', error);
          setError('이미지 압축 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('강사명을 입력해주세요.');
      return;
    }


    if (!formData.bio.trim()) {
      setError('소개를 입력해주세요.');
      return;
    }

    if (!formData.specialties.trim()) {
      setError('전문분야를 입력해주세요.');
      return;
    }

    if (!formData.experience.trim()) {
      setError('경력을 입력해주세요.');
      return;
    }

    const currentInstructor = instructors.find(inst => inst.id === id);
    if (!currentInstructor) {
      setError('강사를 찾을 수 없습니다.');
      return;
    }

    const updatedInstructor: Instructor = {
      ...currentInstructor,
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      images: formData.images,
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
      experience: formData.experience.trim(),
      detailedDescription: formData.detailedDescription.trim()
    };

    updateInstructor(id!, updatedInstructor);
    alert('강사 정보가 수정되었습니다.');
    navigate(`/instructor/${id}`);
  };

  const instructorToEdit = instructors.find(inst => inst.id === id);

  if (!isAdmin) {
    return null;
  }

  if (!instructorToEdit) {
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

  return (
    <Container>
      <BackButton onClick={() => navigate(`/instructor/${id}`)}>
        ← 뒤로 가기
      </BackButton>

      <Header>
        <Title>강사 정보 수정</Title>
        <Subtitle>"{instructorToEdit.name}" 강사의 정보를 수정합니다</Subtitle>
      </Header>

      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">강사명 *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="강사명을 입력하세요"
              required
            />
          </FormGroup>


          <FormGroup>
            <Label htmlFor="bio">소개 *</Label>
            <TextArea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="강사의 간단한 소개를 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>프로필 사진 (여러 장 선택 가능)</Label>
            <ImagePreview>
              {formData.images.map((image, index) => (
                <PreviewImage key={index}>
                  <img src={image} alt={`미리보기 ${index + 1}`} />
                  <RemoveImageButton onClick={() => removeImage(index)}>
                    ×
                  </RemoveImageButton>
                </PreviewImage>
              ))}
              <AddImagePlaceholder onClick={() => document.getElementById('imageUpload')?.click()}>
                +
              </AddImagePlaceholder>
            </ImagePreview>
            <FileInput
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="specialties">전문분야 (쉼표로 구분) *</Label>
            <Input
              type="text"
              id="specialties"
              name="specialties"
              value={formData.specialties}
              onChange={handleInputChange}
              placeholder="요가, 필라테스, 웨이트"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="experience">이력 *</Label>
            <TextArea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="이력을 입력하세요&#10;예: 2020-2023 ABC 피트니스 센터 요가 강사&#10;2018-2020 XYZ 스튜디오 필라테스 강사"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="detailedDescription">상세 소개 (선택사항)</Label>
            <TextArea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              placeholder="강사에 대한 더 자세한 소개를 입력하세요. 줄바꿈도 가능합니다."
              style={{ minHeight: '150px' }}
            />
            <small style={{ color: '#666', marginTop: '0.5rem' }}>
              이 필드를 입력하면 기본 소개 문구 대신 여기에 입력한 내용이 표시됩니다.
            </small>
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate(`/instructor/${id}`)}>
              취소
            </CancelButton>
            <SaveButton type="submit">
              수정 완료
            </SaveButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default InstructorEdit;