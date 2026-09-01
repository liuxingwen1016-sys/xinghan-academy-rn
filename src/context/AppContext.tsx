import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from 'react';
import {courses, getAllLessons} from '../data/courses';
import {AppColors, darkColors, lightColors} from '../theme/colors';

const STORAGE_KEY = '@xinghan-academy/state-v1';

type PersistedState = {
  completedLessonIds: string[];
  favorites: string[];
  quizScores: Record<string, number>;
  studyMinutesByDate: Record<string, number>;
  darkMode: boolean;
};

export type StudyDay = {
  date: string;
  shortDate: string;
  weekday: string;
  minutes: number;
};

type AppContextValue = PersistedState & {
  hydrated: boolean;
  colors: AppColors;
  recentStudyDays: StudyDay[];
  totalStudyMinutes: number;
  learningStreak: number;
  toggleFavorite: (courseId: string) => void;
  isFavorite: (courseId: string) => boolean;
  completeLesson: (lessonId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => number;
  saveQuizScore: (courseId: string, score: number) => void;
  setDarkMode: (enabled: boolean) => void;
  resetProgress: () => void;
};

const localDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const dateBefore = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
};

const initialStudyMinutes = [42, 75, 96, 68, 71, 54, 110].reduce<Record<string, number>>((result, minutes, index) => {
  result[localDateKey(dateBefore(6 - index))] = minutes;
  return result;
}, {});

const initialState: PersistedState = {
  completedLessonIds: ['rn-l1', 'rn-l2', 'rn-l3'],
  favorites: ['rn-101'],
  quizScores: {},
  studyMinutesByDate: initialStudyMinutes,
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
          const restored = JSON.parse(value) as Partial<PersistedState>;
          setState({...initialState, ...restored, studyMinutesByDate: restored.studyMinutesByDate ?? initialState.studyMinutesByDate});
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
    const allLessons = courses.flatMap(course => getAllLessons(course));
    const recentStudyDays = Array.from({length: 7}, (_, index) => {
      const date = dateBefore(6 - index);
      const dateKey = localDateKey(date);
      return {
        date: dateKey,
        shortDate: `${date.getMonth() + 1}/${date.getDate()}`,
        weekday: `周${'日一二三四五六'[date.getDay()]}`,
        minutes: state.studyMinutesByDate[dateKey] ?? 0,
      };
    });
    const totalStudyMinutes = Object.values(state.studyMinutesByDate).reduce((total, minutes) => total + minutes, 0);
    let learningStreak = 0;
    while ((state.studyMinutesByDate[localDateKey(dateBefore(learningStreak))] ?? 0) > 0) learningStreak += 1;

    return {
      ...state,
      hydrated,
      colors: state.darkMode ? darkColors : lightColors,
      recentStudyDays,
      totalStudyMinutes,
      learningStreak,
      toggleFavorite: courseId =>
        update(current => ({
          ...current,
          favorites: current.favorites.includes(courseId)
            ? current.favorites.filter(id => id !== courseId)
            : [...current.favorites, courseId],
        })),
      isFavorite: courseId => state.favorites.includes(courseId),
      completeLesson: lessonId => update(current => {
        if (current.completedLessonIds.includes(lessonId)) return current;
        const lesson = allLessons.find(item => item.id === lessonId);
        const [minutesText = '0', secondsText = '0'] = lesson?.duration.split(':') ?? [];
        const lessonMinutes = Math.max(1, Math.round((Number(minutesText) * 60 + Number(secondsText)) / 60));
        const today = localDateKey(new Date());
        return {
          ...current,
          completedLessonIds: [...current.completedLessonIds, lessonId],
          studyMinutesByDate: {
            ...current.studyMinutesByDate,
            [today]: (current.studyMinutesByDate[today] ?? 0) + lessonMinutes,
          },
        };
      }),
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
