import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Instructor, Class, Organization } from '../types';
import {
  getOrganization as getOrganizationFromFirebase,
  updateOrganization as updateOrganizationInFirebase,
  getInstructors as getInstructorsFromFirebase,
  addInstructor as addInstructorToFirebase,
  updateInstructor as updateInstructorInFirebase,
  deleteInstructor as deleteInstructorFromFirebase,
  getClasses as getClassesFromFirebase,
  addClass as addClassToFirebase,
  updateClass as updateClassInFirebase,
  deleteClass as deleteClassFromFirebase
} from '../firebase/services';

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

  // Generate class schedule from classes
  const classSchedule = classes.map(cls => cls.date);

  // Firebase에서 모든 데이터 로드
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 병렬로 데이터 로드
      const [orgData, instructorsData, classesData] = await Promise.all([
        getOrganizationFromFirebase(),
        getInstructorsFromFirebase(),
        getClassesFromFirebase()
      ]);

      if (orgData) {
        setOrganization(orgData);
      }
      setInstructors(instructorsData);
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const updateOrganization = async (org: Organization) => {
    const success = await updateOrganizationInFirebase(org);
    if (success) {
      setOrganization(org);
    }
  };

  const addInstructor = async (instructor: Instructor) => {
    const success = await addInstructorToFirebase(instructor);
    if (success) {
      // 데이터 새로고침하여 최신 상태 반영
      const updatedInstructors = await getInstructorsFromFirebase();
      setInstructors(updatedInstructors);
    }
  };

  const updateInstructor = async (id: string, instructor: Instructor) => {
    const success = await updateInstructorInFirebase(id, instructor);
    if (success) {
      const updatedInstructors = instructors.map(inst => inst.id === id ? { ...instructor, id } : inst);
      setInstructors(updatedInstructors);
    }
  };

  const deleteInstructor = async (id: string) => {
    const success = await deleteInstructorFromFirebase(id);
    if (success) {
      setInstructors(instructors.filter(inst => inst.id !== id));
    }
  };

  const addClass = async (classItem: Class) => {
    const success = await addClassToFirebase(classItem);
    if (success) {
      // 데이터 새로고침하여 최신 상태 반영
      const updatedClasses = await getClassesFromFirebase();
      setClasses(updatedClasses);
    }
  };

  const updateClass = async (id: string, classItem: Class) => {
    const success = await updateClassInFirebase(id, classItem);
    if (success) {
      const updatedClasses = classes.map(cls => cls.id === id ? { ...classItem, id } : cls);
      setClasses(updatedClasses);
    }
  };

  const deleteClass = async (id: string) => {
    const success = await deleteClassFromFirebase(id);
    if (success) {
      setClasses(classes.filter(cls => cls.id !== id));
    }
  };

  const refreshData = async () => {
    await loadData();
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