import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../components/AppButton';
import {CourseCover} from '../components/CourseCover';
import {ProgressBar} from '../components/ProgressBar';
import {SectionHeader} from '../components/SectionHeader';
import {useApp} from '../context/AppContext';
import {courses, getAllLessons} from '../data/courses';
import {RootStackParamList} from '../types';
import {AppIcon} from '../components/AppIcon';

export function LearningHubScreen({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>}) {
  const {colors, completedLessonIds, getCourseProgress, quizScores, isLessonComplete, recentStudyDays, totalStudyMinutes, learningStreak} = useApp();
  const course = courses[0];
  const lessons = getAllLessons(course);
  const progress = getCourseProgress(course.id);
  const nextLesson = lessons.find(lesson => !completedLessonIds.includes(lesson.id)) ?? lessons[lessons.length - 1];
  const maxDailyMinutes = Math.max(1, ...recentStudyDays.map(day => day.minutes));

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.text}]}>我的学习</Text>
          <Text style={[styles.subtitle, {color: colors.textMuted}]}>每一次完成，都是能力的累积</Text>
        </View>

        <View style={[styles.summary, {backgroundColor: colors.primaryDark}]}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>累计学习</Text>
              <Text style={styles.summaryValue}>{(totalStudyMinutes / 60).toFixed(1)} <Text style={styles.summaryUnit}>小时</Text></Text>
            </View>
            <View style={styles.streak}><AppIcon name="fire" size={15} color="#FFB233" /><Text style={styles.streakText}>连续学习 {learningStreak} 天</Text></View>
          </View>
          <View style={styles.weekBars}>
            {recentStudyDays.map((day, index) => (
              <View key={day.date} style={styles.day}>
                <View style={[styles.bar, {height: Math.max(4, Math.round((day.minutes / maxDailyMinutes) * 70)), backgroundColor: index === 6 ? colors.warning : colors.accent}]} />
                <Text style={styles.dayText}>{day.weekday.replace('周', '')}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="继续学习" />
          <View style={[styles.continueCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <CourseCover course={course} compact />
            <View style={styles.continueBody}>
              <Text style={[styles.courseTitle, {color: colors.text}]}>{course.title}</Text>
              <Text numberOfLines={1} style={[styles.lessonTitle, {color: colors.textMuted}]}>{nextLesson.title}</Text>
              <View style={styles.progressRow}><Text style={[styles.progressText, {color: colors.textMuted}]}>课程进度</Text><Text style={[styles.progressText, {color: colors.primary}]}>{progress}%</Text></View>
              <ProgressBar value={progress} height={6} />
            </View>
          </View>
          <AppButton label="继续学习" onPress={() => navigation.navigate('Lesson', {courseId: course.id, lessonId: nextLesson.id})} style={styles.button} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="最近课时" action="课程详情" onAction={() => navigation.navigate('CourseDetail', {courseId: course.id})} />
          {lessons.slice(0, 5).map((lesson, index) => {
            const complete = isLessonComplete(lesson.id);
            return (
              <Pressable
                key={lesson.id}
                onPress={() => navigation.navigate('Lesson', {courseId: course.id, lessonId: lesson.id})}
                style={[styles.lessonRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                <View style={[styles.lessonIndex, {backgroundColor: complete ? colors.success : colors.surfaceMuted}]}>
                  {complete ? <AppIcon name="check" size={16} color={colors.white} /> : <Text style={[styles.lessonIndexText, {color: colors.primary}]}>{index + 1}</Text>}
                </View>
                <View style={styles.lessonCopy}>
                  <Text numberOfLines={1} style={[styles.lessonRowTitle, {color: colors.text}]}>{lesson.title}</Text>
                  <Text style={[styles.lessonMeta, {color: colors.textMuted}]}>{lesson.type === 'video' ? '视频' : '图文'} · {lesson.duration}</Text>
                </View>
                <AppIcon name="chevron-right" size={20} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => navigation.navigate('Quiz', {courseId: course.id})}
          style={[styles.quizCard, {backgroundColor: colors.surfaceMuted, borderColor: colors.border}]}>
          <View><Text style={[styles.quizTitle, {color: colors.text}]}>课程测验</Text><Text style={[styles.quizSubtitle, {color: colors.textMuted}]}>5 道题 · 检验学习效果</Text></View>
          <View style={styles.quizAction}><Text style={[styles.quizScore, {color: colors.primary}]}>{quizScores[course.id] !== undefined ? `${quizScores[course.id]}/5` : '开始'}</Text><AppIcon name="chevron-right" size={18} color={colors.primary} /></View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {paddingHorizontal: 16, paddingBottom: 26},
  header: {paddingTop: 17, paddingBottom: 16},
  title: {fontSize: 24, fontWeight: '900'},
  subtitle: {fontSize: 12, marginTop: 4},
  summary: {borderRadius: 20, padding: 18},
  summaryTop: {flexDirection: 'row', justifyContent: 'space-between'},
  summaryLabel: {color: 'rgba(255,255,255,0.72)', fontSize: 12},
  summaryValue: {color: '#FFFFFF', fontSize: 27, fontWeight: '900', marginTop: 4},
  summaryUnit: {fontSize: 12, fontWeight: '500'},
  streak: {alignSelf: 'flex-start', flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.12)'},
  streakText: {color: '#FFFFFF', fontSize: 11, fontWeight: '700'},
  weekBars: {height: 98, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginTop: 14},
  day: {alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: 24},
  bar: {width: 7, borderRadius: 4},
  dayText: {color: 'rgba(255,255,255,0.58)', fontSize: 9, marginTop: 6},
  section: {marginTop: 24},
  continueCard: {borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', gap: 12},
  continueBody: {flex: 1, justifyContent: 'space-between', paddingVertical: 2},
  courseTitle: {fontSize: 15, fontWeight: '800'},
  lessonTitle: {fontSize: 11},
  progressRow: {flexDirection: 'row', justifyContent: 'space-between'},
  progressText: {fontSize: 10, fontWeight: '700'},
  button: {marginTop: 10},
  lessonRow: {borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 11, marginBottom: 9},
  lessonIndex: {width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'},
  lessonIndexText: {fontSize: 13, fontWeight: '900'},
  lessonCopy: {flex: 1, marginLeft: 11},
  lessonRowTitle: {fontSize: 13, fontWeight: '700'},
  lessonMeta: {fontSize: 10, marginTop: 4},
  quizCard: {borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  quizTitle: {fontSize: 16, fontWeight: '800'},
  quizSubtitle: {fontSize: 11, marginTop: 4},
  quizScore: {fontSize: 14, fontWeight: '800'},
  quizAction: {flexDirection: 'row', alignItems: 'center'},
});
