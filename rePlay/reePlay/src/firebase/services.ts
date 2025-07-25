import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';
import type { Firestore } from 'firebase/firestore';
import type { Organization, Instructor, Class } from '../types';

// 이미지 업로드 함수
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// 이미지 삭제 함수
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl.includes('firebase')) return true; // Firebase Storage URL이 아니면 스킵
    
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// 여러 이미지 업로드 함수
export const uploadMultipleImages = async (files: File[], folder: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

// Organization 관련 함수들
export const getOrganization = async (): Promise<Organization | null> => {
  try {
    const docRef = doc(db, 'organization', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Organization;
    }
    return null;
  } catch (error) {
    console.error('Error getting organization:', error);
    return null;
  }
};

export const updateOrganization = async (organization: Organization): Promise<boolean> => {
  try {
    const docRef = doc(db, 'organization', 'main');
    await setDoc(docRef, organization);
    return true;
  } catch (error) {
    console.error('Error updating organization:', error);
    return false;
  }
};

// Instructors 관련 함수들
export const getInstructors = async (): Promise<Instructor[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'instructors'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
  } catch (error) {
    console.error('Error getting instructors:', error);
    return [];
  }
};

export const addInstructor = async (instructor: Instructor): Promise<boolean> => {
  try {
    // instructor.id를 문서 ID로 사용하여 저장
    await setDoc(doc(db, 'instructors', instructor.id), { ...instructor });
    console.log('Instructor added successfully with', instructor.images?.length || 0, 'images');
    return true;
  } catch (error) {
    console.error('Error adding instructor:', error);
    console.error('Instructor data:', instructor);
    return false;
  }
};

export const updateInstructor = async (id: string, instructor: Instructor): Promise<boolean> => {
  try {
    const docRef = doc(db, 'instructors', id);
    
    // 문서가 존재하는지 먼저 확인
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // 문서가 존재하면 업데이트
      await updateDoc(docRef, { ...instructor });
    } else {
      // 문서가 존재하지 않으면 새로 생성
      await setDoc(docRef, { ...instructor });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating instructor:', error);
    return false;
  }
};

export const deleteInstructor = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'instructors', id));
    return true;
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return false;
  }
};

// Classes 관련 함수들
export const getClasses = async (): Promise<Class[]> => {
  try {
    const q = query(collection(db, 'classes'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate() // Firestore Timestamp를 Date로 변환
      } as Class;
    });
  } catch (error) {
    console.error('Error getting classes:', error);
    return [];
  }
};

export const addClass = async (classItem: Class): Promise<boolean> => {
  try {
    // classItem.id를 문서 ID로 사용하여 저장
    await setDoc(doc(db, 'classes', classItem.id), { ...classItem });
    return true;
  } catch (error) {
    console.error('Error adding class:', error);
    return false;
  }
};

export const updateClass = async (id: string, classItem: Class): Promise<boolean> => {
  try {
    const docRef = doc(db, 'classes', id);
    
    // 문서가 존재하는지 먼저 확인
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // 문서가 존재하면 업데이트
      await updateDoc(docRef, { ...classItem });
    } else {
      // 문서가 존재하지 않으면 새로 생성
      await setDoc(docRef, { ...classItem });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating class:', error);
    return false;
  }
};

export const deleteClass = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'classes', id));
    return true;
  } catch (error) {
    console.error('Error deleting class:', error);
    return false;
  }
};