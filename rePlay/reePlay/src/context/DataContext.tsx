import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Instructor, Class, Organization } from '../types';

interface DataContextType {
  // Organization data
  organization: Organization;
  updateOrganization: (org: Organization) => void;
  
  // Instructors data
  instructors: Instructor[];
  addInstructor: (instructor: Instructor) => void;
  updateInstructor: (id: string, instructor: Instructor) => void;
  deleteInstructor: (id: string) => void;
  
  // Classes data
  classes: Class[];
  addClass: (classItem: Class) => void;
  updateClass: (id: string, classItem: Class) => void;
  deleteClass: (id: string) => void;
  
  // Class schedule dates
  classSchedule: Date[];
  
  // localStorage 초기화 (개발용)
  clearAllData: () => void;
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
  name: "re: Play",
  description: "건강한 삶을 위한 최고의 운동 프로그램을 제공하는 전문 피트니스 기관입니다.",
  history: "2015년 설립 이래 8년간 수많은 회원들의 건강한 변화를 함께해왔습니다. 전문 강사진과 체계적인 프로그램으로 개인별 맞춤 운동을 제공하고 있습니다.",
  contact: {
    phone: '02-1234-5678',
    email: 'info@replay-fitness.com',
    address: '서울시 강남구 테헤란로 123'
  }
};

// localStorage에서 데이터 가져오기 또는 기본값 사용
const getStoredData = <T extends any>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// localStorage에 데이터 저장
const setStoredData = <T extends any>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization>(() => 
    getStoredData('organization', defaultOrganization)
  );

  const defaultInstructors: Instructor[] = [];

  const [instructors, setInstructors] = useState<Instructor[]>(() => 
    getStoredData('instructors', defaultInstructors)
  );

  const defaultClasses: Class[] = [];

  // Date 객체를 제대로 복원하기 위한 특별한 처리
  const getStoredClasses = (): Class[] => {
    try {
      const stored = localStorage.getItem('classes');
      if (stored) {
        const parsedClasses = JSON.parse(stored);
        // Date 문자열을 Date 객체로 변환
        return parsedClasses.map((cls: any) => ({
          ...cls,
          date: new Date(cls.date)
        }));
      }
    } catch {
      // 에러 발생시 기본값 반환
    }
    return defaultClasses;
  };

  const [classes, setClasses] = useState<Class[]>(() => getStoredClasses());

  // Generate class schedule from classes
  const classSchedule = classes.map(cls => cls.date);

  const updateOrganization = (org: Organization) => {
    setOrganization(org);
    setStoredData('organization', org);
  };

  const addInstructor = (instructor: Instructor) => {
    const newInstructors = [...instructors, instructor];
    setInstructors(newInstructors);
    setStoredData('instructors', newInstructors);
  };

  const updateInstructor = (id: string, instructor: Instructor) => {
    const updatedInstructors = instructors.map(inst => inst.id === id ? instructor : inst);
    setInstructors(updatedInstructors);
    setStoredData('instructors', updatedInstructors);
  };

  const deleteInstructor = (id: string) => {
    const filteredInstructors = instructors.filter(inst => inst.id !== id);
    setInstructors(filteredInstructors);
    setStoredData('instructors', filteredInstructors);
  };

  const addClass = (classItem: Class) => {
    const newClasses = [...classes, classItem];
    setClasses(newClasses);
    setStoredData('classes', newClasses);
  };

  const updateClass = (id: string, classItem: Class) => {
    const updatedClasses = classes.map(cls => cls.id === id ? classItem : cls);
    setClasses(updatedClasses);
    setStoredData('classes', updatedClasses);
  };

  const deleteClass = (id: string) => {
    const filteredClasses = classes.filter(cls => cls.id !== id);
    setClasses(filteredClasses);
    setStoredData('classes', filteredClasses);
  };

  // localStorage 전체 데이터 초기화 (개발용)
  const clearAllData = () => {
    localStorage.removeItem('organization');
    localStorage.removeItem('instructors');
    localStorage.removeItem('classes');
    setOrganization(defaultOrganization);
    setInstructors(defaultInstructors);
    setClasses(defaultClasses);
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
    clearAllData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};