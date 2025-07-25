import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { compressImage, validateImageSize } from '../utils/imageCompression';
import type { Class } from '../types';

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
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
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
    border-color: #27ae60;
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
    border-color: #27ae60;
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #27ae60;
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

const ClassAdd: React.FC = () => {
  const navigate = useNavigate();
  const { addClass, instructors } = useData();
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    maxParticipants: '',
    location: '',
    googleFormUrl: '',
    images: [] as string[]
  });

  const [error, setError] = useState('');

  // 관리자가 아니면 리다이렉트
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          // Check if adding this image would exceed the limit of 10 images
          if (formData.images.length >= 10) {
            setError('최대 10장의 이미지만 업로드할 수 있습니다.');
            break;
          }

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
    // Reset file input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!formData.title.trim()) {
      setError('클래스명을 입력해주세요.');
      return;
    }

    if (!formData.description.trim() && !formData.detailedDescription.trim()) {
      setError('클래스 설명 또는 상세 설명 중 최소 하나는 입력해주세요.');
      return;
    }

    if (!formData.instructor.trim()) {
      setError('강사명을 입력해주세요.');
      return;
    }

    if (!formData.date || !formData.time) {
      setError('날짜와 시간을 모두 입력해주세요.');
      return;
    }

    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration <= 0) {
      setError('올바른 소요시간을 입력해주세요.');
      return;
    }

    const maxParticipants = parseInt(formData.maxParticipants);
    if (isNaN(maxParticipants) || maxParticipants <= 0) {
      setError('올바른 최대 참가자수를 입력해주세요.');
      return;
    }

    // 새 클래스 생성
    const newClass: Class = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      detailedDescription: formData.detailedDescription.trim(),
      instructor: formData.instructor.trim(),
      date: new Date(`${formData.date}T${formData.time}`),
      duration: duration,
      maxParticipants: maxParticipants,
      currentParticipants: 0,
      location: formData.location.trim(),
      googleFormUrl: formData.googleFormUrl.trim(),
      images: formData.images
    };

    addClass(newClass);
    alert('새 클래스가 추가되었습니다.');
    navigate('/registration');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/registration')}>
        ← 뒤로 가기
      </BackButton>

      <Header>
        <Title>새 클래스 추가</Title>
        <Subtitle>새로운 클래스 정보를 입력해주세요</Subtitle>
      </Header>

      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">클래스명 *</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="클래스명을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">클래스 설명 (1~2줄 이하의 간단한 설명)</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="클래스에 대한 간단한 설명을 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="detailedDescription">상세 설명 (3줄 이상의 자세한 설명)</Label>
            <TextArea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              placeholder="클래스에 대한 자세한 설명, 준비물, 주의사항 등을 입력하세요 (클래스 설명과 상세 설명 중 최소 하나는 입력해주세요)"
              style={{ minHeight: '200px' }}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="instructor">강사 *</Label>
            <Select
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              required
            >
              <option value="">강사를 선택하세요</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.name}>
                  {instructor.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="date">날짜 *</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="time">시간 *</Label>
            <Input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="duration">소요시간 (분) *</Label>
            <Input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="60"
              min="1"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="maxParticipants">최대 참가자수 *</Label>
            <Input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              placeholder="15"
              min="1"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="location">장소</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="스튜디오 A, 운동실 등"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="googleFormUrl">구글 폼 URL</Label>
            <Input
              type="url"
              id="googleFormUrl"
              name="googleFormUrl"
              value={formData.googleFormUrl}
              onChange={handleInputChange}
              placeholder="https://forms.gle/..."
            />
          </FormGroup>

          <FormGroup>
            <Label>클래스 사진 (선택사항)</Label>
            <ImagePreview>
              {formData.images.map((image, index) => (
                <PreviewImage key={index}>
                  <img src={image} alt={`미리보기 ${index + 1}`} />
                  <RemoveImageButton onClick={() => removeImage(index)}>
                    ×
                  </RemoveImageButton>
                </PreviewImage>
              ))}
              {formData.images.length < 10 && (
                <AddImagePlaceholder onClick={() => document.getElementById('imageUpload')?.click()}>
                  +
                </AddImagePlaceholder>
              )}
            </ImagePreview>
            <FileInput
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <small style={{ color: '#666', marginTop: '0.5rem' }}>
              클래스와 관련된 사진을 최대 10장까지 업로드할 수 있습니다. ({formData.images.length}/10)
            </small>
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate('/registration')}>
              취소
            </CancelButton>
            <SaveButton type="submit">
              클래스 추가
            </SaveButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default ClassAdd;