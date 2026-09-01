export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article';
  videoSource?: number;
  content: string[];
};

export type Chapter = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  level: '入门' | '中级' | '进阶';
  duration: string;
  learners: string;
  rating: number;
  description: string;
  instructor: string;
  color: string;
  accent: string;
  tags: string[];
  goals: string[];
  chapters: Chapter[];
  featured?: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type RootStackParamList = {
  Main: undefined;
  CourseDetail: {courseId: string};
  Lesson: {courseId: string; lessonId?: string};
  Quiz: {courseId: string};
  Result: {courseId: string; score: number; total: number};
  Lab: undefined;
};

export type MainTab = 'home' | 'courses' | 'learning' | 'quiz' | 'profile';
