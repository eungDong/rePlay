import { initializeApp } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Firebase 앱 초기화
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // 로컬 개발환경에서는 오프라인 모드로 시작
  if (import.meta.env.DEV) {
    console.log('개발 모드: Firebase 오프라인 모드로 실행');
    disableNetwork(db).catch(console.warn);
  }
} catch (error) {
  console.warn('Firebase 초기화 실패, 오프라인 모드로 실행:', error);
  // Firebase 초기화 실패 시 더미 설정으로 재시도
  app = initializeApp({
    apiKey: "demo-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  });
  db = getFirestore(app);
}

export { db, enableNetwork, disableNetwork };
export default app;