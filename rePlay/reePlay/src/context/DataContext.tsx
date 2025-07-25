import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Instructor, Class, Organization } from '../types';


// Firebase 서비스를 동적으로 import하여 에러 방지
let firebaseServices: any = null;

const loadFirebaseServices = async () => {
  try {
    firebaseServices = await import('../firebase/services');
    return firebaseServices;
  } catch (error) {
    console.warn('Firebase 서비스 로드 실패, 로컬 모드로 실행:', error);
    return null;
  }
};

interface DataContextType {
  // Organization data
  organization: Organization;
  updateOrganization: (org: Organization) => Promise<void>;
  
  // Instructors data
  instructors: Instructor[];
  addInstructor: (instructor: Instructor) => Promise<void>;
  updateInstructor: (id: string, instructor: Instructor) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;
  
  // Classes data
  classes: Class[];
  addClass: (classItem: Class) => Promise<void>;
  updateClass: (id: string, classItem: Class) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  
  // Class schedule dates
  classSchedule: Date[];
  
  // Loading states
  isLoading: boolean;
  
  // 데이터 새로고침
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// 기본 데이터
const defaultOrganization: Organization = {
  name: "",
  description: "",
  history: "",
  contact: {
    phone: '',
    email: '',
    address: ''
  }
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization>(defaultOrganization);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Generate class schedule from classes
  const classSchedule = classes.map(cls => cls.date);

  // Firebase에서 모든 데이터 로드 (에러 핸들링 개선)
  const loadData = async () => {
    setIsLoading(true);
    
    try {
      const services = await loadFirebaseServices();
      
      if (!services) {
        console.log('오프라인 모드로 실행');
        setIsOfflineMode(true);
        setIsLoading(false);
        return;
      }

      // 병렬로 데이터 로드
      const [orgData, instructorsData, classesData] = await Promise.all([
        services.getOrganization().catch(() => null),
        services.getInstructors().catch(() => []),
        services.getClasses().catch(() => [])
      ]);

      if (orgData) {
        setOrganization(orgData);
      }
      setInstructors(instructorsData);
      setClasses(classesData);
      setIsOfflineMode(false);
    } catch (error) {
      console.warn('Firebase 연결 실패, 오프라인 모드로 전환:', error);
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드 및 localStorage 정리
  useEffect(() => {
    // localStorage의 기존 데이터 정리
    localStorage.removeItem('organization');
    localStorage.removeItem('instructors');
    localStorage.removeItem('classes');
    
    loadData();
  }, []);

  const updateOrganization = async (org: Organization) => {
    if (isOfflineMode) {
      setOrganization(org);
      return;
    }
    
    try {
      const services = await loadFirebaseServices();
      if (services) {
        const success = await services.updateOrganization(org);
        if (success) {
          setOrganization(org);
        }
      }
    } catch (error) {
      console.warn('Firebase 업데이트 실패, 로컬에서만 업데이트:', error);
      setOrganization(org);
    }
  };

  const addInstructor = async (instructor: Instructor) => {
    console.log('강사 추가 시작:', instructor);
    
    if (isOfflineMode) {
      console.log('오프라인 모드에서 강사 추가');
      setInstructors(prev => [...prev, instructor]);
      return;
    }
    
    try {
      const services = await loadFirebaseServices();
      if (services) {
        console.log('Firebase 서비스로 강사 추가 시도');
        const success = await services.addInstructor(instructor);
        if (success) {
          const updatedInstructors = await services.getInstructors();
          setInstructors(updatedInstructors);
          console.log('Firebase에서 강사 추가 성공');
        } else {
          console.log('Firebase 추가 실패, 로컬에서만 추가');
          setInstructors(prev => [...prev, instructor]);
        }
      } else {
        console.log('Firebase 서비스 없음, 로컬에서만 추가');
        setInstructors(prev => [...prev, instructor]);
      }
    } catch (error) {
      console.warn('Firebase 추가 실패, 로컬에서만 추가:', error);
      setInstructors(prev => [...prev, instructor]);
    }
  };

  const updateInstructor = async (id: string, instructor: Instructor) => {
    console.log('강사 업데이트 시작:', id, instructor);
    
    if (isOfflineMode) {
      console.log('오프라인 모드에서 강사 업데이트');
      const updatedInstructors = instructors.map(inst => inst.id === id ? { ...instructor, id } : inst);
      setInstructors(updatedInstructors);
      return;
    }
    
    try {
      const services = await loadFirebaseServices();
      if (services) {
        console.log('Firebase 서비스로 강사 업데이트 시도');
        const success = await services.updateInstructor(id, instructor);
        if (success) {
          const updatedInstructors = instructors.map(inst => inst.id === id ? { ...instructor, id } : inst);
          setInstructors(updatedInstructors);
          console.log('Firebase에서 강사 업데이트 성공');
        } else {
          console.log('Firebase 업데이트 실패, 로컬에서만 업데이트');
          const updatedInstructors = instructors.map(inst => inst.id === id ? { ...instructor, id } : inst);
          setInstructors(updatedInstructors);
        }
      } else {
        console.log('Firebase 서비스 없음, 로컬에서만 업데이트');
        const updatedInstructors = instructors.map(inst => inst.id === id ? { ...instructor, id } : inst);
        setInstructors(updatedInstructors);
      }
    } catch (error) {
      console.warn('Firebase 업데이트 실패, 로컬에서만 업데이트:', error);
      const updatedInstructors = instructors.map(inst => inst.id === id ? { ...instructor, id } : inst);
      setInstructors(updatedInstructors);
    }
  };

  const deleteInstructor = async (id: string) => {
    console.log('강사 삭제 시작:', id);
    
    if (isOfflineMode) {
      console.log('오프라인 모드에서 강사 삭제');
      setInstructors(instructors.filter(inst => inst.id !== id));
      return;
    }
    
    try {
      const services = await loadFirebaseServices();
      if (services) {
        console.log('Firebase 서비스로 강사 삭제 시도');
        const success = await services.deleteInstructor(id);
        if (success) {
          setInstructors(instructors.filter(inst => inst.id !== id));
          console.log('Firebase에서 강사 삭제 성공');
        } else {
          console.log('Firebase 삭제 실패, 로컬에서만 삭제');
          setInstructors(instructors.filter(inst => inst.id !== id));
        }
      } else {
        console.log('Firebase 서비스 없음, 로컬에서만 삭제');
        setInstructors(instructors.filter(inst => inst.id !== id));
      }
    } catch (error) {
      console.warn('Firebase 삭제 실패, 로컬에서만 삭제:', error);
      setInstructors(instructors.filter(inst => inst.id !== id));
    }
  };

  const addClass = async (classItem: Class) => {
    console.log('클래스 추가 시작:', classItem);
    
    if (isOfflineMode) {
      console.log('오프라인 모드에서 클래스 추가');
      setClasses(prev => [...prev, classItem]);
      return;
    }
    
    try {
      const services = await loadFirebaseServices();
      if (services) {
        console.log('Firebase 서비스로 클래스 추가 시도');
        const success = await services.addClass(classItem);
        if (success) {
          const updatedClasses = await services.getClasses();
          setClasses(updatedClasses);
          console.log('Firebase에서 클래스 추가 성공');
        } else {
          console.log('Firebase 추가 실패, 로컬에서만 추가');
          setClasses(prev => [...prev, classItem]);
        }
      } else {
        console.log('Firebase 서비스 없음, 로컬에서만 추가');
        setClasses(prev => [...prev, classItem]);
      }
    } catch (error) {
      console.warn('Firebase 추가 실패, 로컬에서만 추가:', error);
      setClasses(prev => [...prev, classItem]);
    }
  };

  const updateClass = async (id: string, classItem: Class) => {
    console.log('클래스 업데이트 시작:', id, classItem);
    
    if (isOfflineMode) {
      console.log('오프라인 모드에서 클래스 업데이트');
      const updatedClasses = classes.map(cls => cls.id === id ? { ...classItem, id } : cls);
      setClasses(updatedClasses);
      return;
    }
    
    try {
      const services = await loadFirebaseServices();
      if (services) {
        console.log('Firebase 서비스로 클래스 업데이트 시도');
        const success = await services.updateClass(id, classItem);
        if (success) {
          const updatedClasses = classes.map(cls => cls.id === id ? { ...classItem, id } : cls);
          setClasses(updatedClasses);
          console.log('Firebase에서 클래스 업데이트 성공');
        } else {
          console.log('Firebase 업데이트 실패, 로컬에서만 업데이트');
          const updatedClasses = classes.map(cls => cls.id === id ? { ...classItem, id } : cls);
          setClasses(updatedClasses);
        }
      } else {
        console.log('Firebase 서비스 없음, 로컬에서만 업데이트');
        const updatedClasses = classes.map(cls => cls.id === id ? { ...classItem, id } : cls);
        setClasses(updatedClasses);
      }
    } catch (error) {
      console.warn('Firebase 업데이트 실패, 로컬에서만 업데이트:', error);
      const updatedClasses = classes.map(cls => cls.id === id ? { ...classItem, id } : cls);
      setClasses(updatedClasses);
    }
  };

  const deleteClass = async (id: string) => {
    console.log('클래스 삭제 시작:', id);
    
    if (isOfflineMode) {
      console.log('오프라인 모드에서 클래스 삭제');
      setClasses(classes.filter(cls => cls.id !== id));
      return;
    }
    
    try {
      const services = await loadFirebaseServices();
      if (services) {
        console.log('Firebase 서비스로 클래스 삭제 시도');
        const success = await services.deleteClass(id);
        if (success) {
          setClasses(classes.filter(cls => cls.id !== id));
          console.log('Firebase에서 클래스 삭제 성공');
        } else {
          console.log('Firebase 삭제 실패, 로컬에서만 삭제');
          setClasses(classes.filter(cls => cls.id !== id));
        }
      } else {
        console.log('Firebase 서비스 없음, 로컬에서만 삭제');
        setClasses(classes.filter(cls => cls.id !== id));
      }
    } catch (error) {
      console.warn('Firebase 삭제 실패, 로컬에서만 삭제:', error);
      setClasses(classes.filter(cls => cls.id !== id));
    }
  };

  const refreshData = async () => {
    if (isOfflineMode) {
      console.log('오프라인 모드에서는 데이터 새로고침을 할 수 없습니다.');
      return;
    }
    
    try {
      await loadData();
    } catch (error) {
      console.warn('데이터 새로고침 실패:', error);
    }
  };

  const value = {
    organization,
    updateOrganization,
    instructors,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    classes,
    addClass,
    updateClass,
    deleteClass,
    classSchedule,
    isLoading,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};