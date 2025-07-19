export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  images: string[];
  specialties: string[];
  experience: string;
  detailedDescription?: string;
}

export interface Class {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  instructor: string;
  date: Date;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  location?: string;
  googleFormUrl?: string;
  images?: string[];
}

export interface Organization {
  name: string;
  description: string;
  organizationDescription?: string;
  history: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  registrationNotice?: string;
  registrationNoticeTitle?: string;
}