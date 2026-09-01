import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from 'react';
import {courses, getAllLessons} from '../data/courses';
import {AppColors, darkColors, lightColors} from '../theme/colors';

const STORAGE_KEY = '@xinghan-academy/state-v1';

type PersistedState = {
  completedLessonIds: string[];
  favorites: string[];
  quizScores: Record<string, number>;
  darkMode: boolean;
};

type AppContextValue = PersistedState & {
  hydrated: boolean;
  colors: AppColors;
  toggleFavorite: (courseId: string) => void;
  isFavorite: (courseId: string) => boolean;
  completeLesson: (lessonId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => number;
  saveQuizScore: (courseId: string, score: number) => void;
  setDarkMode: (enabled: boolean) => void;
  resetProgress: () => void;
};

const initialState: PersistedState = {
  completedLessonIds: ['rn-l1', 'rn-l2', 'rn-l3'],
  favorites: ['rn-101'],
  quizScores: {},
  darkMode: false,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({children}: PropsWithChildren) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (value) {
          setState({...initialState, ...(JSON.parse(value) as PersistedState)});
        }
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }
  }, [hydrated, state]);

  const value = useMemo<AppContextValue>(() => {
    const update = (recipe: (current: PersistedState) => PersistedState) => setState(recipe);

    return {
      ...state,
      hydrated,
      colors: state.darkMode ? darkColors : lightColors,
      toggleFavorite: courseId =>
        update(current => ({
          ...current,
          favorites: current.favorites.includes(courseId)
            ? current.favorites.filter(id => id !== courseId)
            : [...current.favorites, courseId],
        })),
      isFavorite: courseId => state.favorites.includes(courseId),
      completeLesson: lessonId =>
        update(current => ({
          ...current,
          completedLessonIds: current.completedLessonIds.includes(lessonId)
            ? current.completedLessonIds
            : [...current.completedLessonIds, lessonId],
        })),
      isLessonComplete: lessonId => state.completedLessonIds.includes(lessonId),
      getCourseProgress: courseId => {
        const course = courses.find(item => item.id === courseId);
        if (!course) return 0;
        const lessons = getAllLessons(course);
        const completed = lessons.filter(lesson => state.completedLessonIds.includes(lesson.id)).length;
        return lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
      },
      saveQuizScore: (courseId, score) =>
        update(current => ({...current, quizScores: {...current.quizScores, [courseId]: score}})),
      setDarkMode: enabled => update(current => ({...current, darkMode: enabled})),
      resetProgress: () => update(current => ({...initialState, darkMode: current.darkMode})),
    };
  }, [hydrated, state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
