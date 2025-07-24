import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { uploadMultipleImages } from '../firebase/services';
import type { Instructor } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
`;

const InstructorsGrid = styled.div<{ singleInstructor?: boolean }>`
  display: grid;
  grid-template-columns: ${props => 
    props.singleInstructor 
      ? '1fr' 
      : 'repeat(auto-fit, minmax(300px, 1fr))'
  };
  gap: 2rem;
  max-width: ${props => props.singleInstructor ? '500px' : 'none'};
  margin: ${props => props.singleInstructor ? '0 auto' : '0'};
`;

const InstructorCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const InstructorImage = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(45deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  overflow: hidden;
`;

const ImageCarousel = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  transition: opacity 0.5s ease-in-out;
`;

const ImageDots = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? 'white' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: white;
  }
`;

const InstructorInfo = styled.div`
  padding: 2rem;
`;

const InstructorName = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const InstructorBio = styled.p`
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const Specialties = styled.div`
  margin-bottom: 1rem;
`;

const SpecialtyTag = styled.span`
  background: #3498db;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const Experience = styled.p`
  color: #7f8c8d;
  font-style: italic;
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
  
  &:hover {
    background: #219a52;
  }
`;

const EditButton = styled.button`
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  margin-right: 0.5rem;
  
  &:hover {
    background: #e67e22;
  }
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: #c0392b;
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
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
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


const Instructors: React.FC = () => {
  const { isAdmin } = useAuth();
  const { instructors, addInstructor, updateInstructor, deleteInstructor } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Instructor>({
    id: '',
    name: '',
    bio: '',
    images: [],
    specialties: [],
    experience: '',
    detailedDescription: ''
  });
  const [specialtiesInput, setSpecialtiesInput] = useState('');

  const handleAddInstructor = () => {
    setEditingInstructor(null);
    setImageFiles([]);
    setFormData({
      id: '',
      name: '',
      bio: '',
      images: [],
      specialties: [],
      experience: '',
      detailedDescription: ''
    });
    setSpecialtiesInput('');
    setIsModalOpen(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setImageFiles([]);
    setFormData({...instructor});
    setSpecialtiesInput(instructor.specialties.join(', '));
    setIsModalOpen(true);
  };

  const handleDeleteInstructor = (id: string) => {
    if (window.confirm('정말로 이 강사를 삭제하시겠습니까?')) {
      deleteInstructor(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // specialtiesInput을 배열로 변환
      const specialties = specialtiesInput.split(',').map(s => s.trim()).filter(s => s);
      
      let imageUrls: string[] = [];
      
      // 새로 추가된 이미지가 있으면 Storage에 업로드
      if (imageFiles.length > 0) {
        console.log('Uploading', imageFiles.length, 'images to Firebase Storage...');
        imageUrls = await uploadMultipleImages(imageFiles, 'instructors');
        console.log('Images uploaded successfully:', imageUrls);
      }
      
      // 기존 이미지 URL들과 새 이미지 URL들 합치기
      const existingUrls = editingInstructor?.images?.filter(img => img.startsWith('http')) || [];
      const allImageUrls = [...existingUrls, ...imageUrls];
      
      const instructorData = {
        ...formData,
        specialties,
        images: allImageUrls
      };
      
      if (editingInstructor) {
        await updateInstructor(editingInstructor.id, instructorData);
      } else {
        const newInstructor = {
          ...instructorData,
          id: Date.now().toString()
        };
        await addInstructor(newInstructor);
      }
      
      // 상태 초기화
      setImageFiles([]);
      setSpecialtiesInput('');
      setIsModalOpen(false);
      
    } catch (error) {
      console.error('Error saving instructor:', error);
      alert('강사 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSpecialtiesChange = (value: string) => {
    // 입력값을 그대로 저장
    setSpecialtiesInput(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles: File[] = [];
      
      Array.from(files).forEach(file => {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} 파일이 너무 큽니다. 5MB 이하의 이미지를 선택해주세요.`);
          return;
        }
        
        validFiles.push(file);
        
        // 미리보기용 URL 생성
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData(prev => ({
            ...prev, 
            images: [...prev.images, result]
          }));
        };
        reader.readAsDataURL(file);
      });
      
      // 실제 업로드할 파일들 저장
      setImageFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const InstructorImageComponent: React.FC<{ instructor: typeof instructors[0] }> = ({ instructor }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    React.useEffect(() => {
      if (instructor.images.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % instructor.images.length);
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [instructor.images.length]);

    const validImages = instructor.images.filter(img => img && img.startsWith('data:'));
    
    if (validImages.length === 0) {
      return <>👨‍🏫</>;
    }

    if (validImages.length === 1) {
      return <img src={validImages[0]} alt={instructor.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
    }

    return (
      <ImageCarousel>
        {validImages.map((image, index) => (
          <CarouselImage
            key={index}
            src={image}
            alt={`${instructor.name} ${index + 1}`}
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          />
        ))}
        <ImageDots>
          {validImages.map((_, index) => (
            <Dot
              key={index}
              active={index === currentIndex}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </ImageDots>
      </ImageCarousel>
    );
  };

  return (
    <Container>
      <Title>강사진 소개</Title>
      
      {isAdmin && (
        <AddButton onClick={handleAddInstructor}>
          새 강사 추가
        </AddButton>
      )}
      
      {instructors.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#666',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>아직 등록된 강사가 없습니다</h3>
          <p>전문 강사진이 곧 소개될 예정입니다.</p>
          {isAdmin && (
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              관리자님, 상단의 "새 강사 추가" 버튼을 클릭하여 강사를 등록해보세요.
            </p>
          )}
        </div>
      ) : (
        <InstructorsGrid singleInstructor={instructors.length === 1}>
          {instructors.map((instructor) => (
            <InstructorCard 
              key={instructor.id}
              onClick={() => navigate(`/instructor/${instructor.id}`)}
            >
              <InstructorImage>
                <InstructorImageComponent instructor={instructor} />
              </InstructorImage>
              <InstructorInfo>
                <InstructorName>{instructor.name} 강사님</InstructorName>
                <InstructorBio>{instructor.bio}</InstructorBio>
                <Specialties>
                  {instructor.specialties.map((specialty, index) => (
                    <SpecialtyTag key={index}>{specialty}</SpecialtyTag>
                  ))}
                </Specialties>
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: '#2c3e50', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>이력</h4>
                  <Experience style={{ whiteSpace: 'pre-wrap' }}>{instructor.experience}</Experience>
                </div>
                {isAdmin && (
                  <div>
                    <EditButton onClick={(e) => {
                      e.stopPropagation();
                      handleEditInstructor(instructor);
                    }}>
                      편집
                    </EditButton>
                    <DeleteButton onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteInstructor(instructor.id);
                    }}>
                      삭제
                    </DeleteButton>
                  </div>
                )}
              </InstructorInfo>
            </InstructorCard>
          ))}
        </InstructorsGrid>
      )}

      {isModalOpen && (
        <Modal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <ModalContent>
            <h3>{editingInstructor ? '강사 정보 수정' : '새 강사 추가'}</h3>
            <Form onSubmit={handleSubmit}>
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
                <Label>이름</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>소개</Label>
                <TextArea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>전문분야 (쉼표로 구분)</Label>
                <Input
                  value={specialtiesInput}
                  onChange={(e) => handleSpecialtiesChange(e.target.value)}
                  placeholder="요가, 필라테스, 웨이트"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>이력</Label>
                <TextArea
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="이력을 입력하세요&#10;예: 2020-2023 ABC 피트니스 센터 요가 강사&#10;2018-2020 XYZ 스튜디오 필라테스 강사"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>상세 소개</Label>
                <TextArea
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({...formData, detailedDescription: e.target.value})}
                  placeholder="강사의 상세한 소개를 입력하세요&#10;교육 철학, 수업 스타일, 자격증 등을 포함해서 작성해주세요"
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>
                  취소
                </CancelButton>
                <SaveButton type="submit">
                  {editingInstructor ? '수정' : '추가'}
                </SaveButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Instructors;