import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon} from '../components/AppIcon';
import {CourseCover} from '../components/CourseCover';
import {ProgressBar} from '../components/ProgressBar';
import {useApp} from '../context/AppContext';
import {courses} from '../data/courses';
import {getCourseQuiz} from '../data/quizzes';
import {RootStackParamList} from '../types';

export function QuizRecordsScreen({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>}) {
  const {colors, quizScores, getCourseProgress} = useApp();
  const completedScores = courses.flatMap(course => quizScores[course.id] === undefined ? [] : [quizScores[course.id]]);
  const average = completedScores.length ? (completedScores.reduce((total, score) => total + score, 0) / completedScores.length).toFixed(1) : '--';

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.text}]}>课程测验</Text>
          <Text style={[styles.subtitle, {color: colors.textMuted}]}>查看全部课程的测验进度和成绩</Text>
        </View>
        <View style={[styles.summary, {backgroundColor: colors.primaryDark}]}>
          <View style={styles.summaryIcon}><AppIcon name="clipboard-check-outline" size={30} color="#FFFFFF" /></View>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{completedScores.length}</Text><Text style={styles.summaryLabel}>已完成</Text></View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{courses.length - completedScores.length}</Text><Text style={styles.summaryLabel}>待测验</Text></View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{average}</Text><Text style={styles.summaryLabel}>平均得分</Text></View>
        </View>

        <Text style={[styles.sectionTitle, {color: colors.text}]}>全部课程</Text>
        {courses.map(course => {
          const quiz = getCourseQuiz(course.id);
          const score = quizScores[course.id];
          const attempted = score !== undefined;
          const courseProgress = getCourseProgress(course.id);
          return <Pressable key={course.id} onPress={() => navigation.navigate('Quiz', {courseId: course.id})} style={({pressed}) => [styles.card, {backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.76 : 1}]}>
            <View style={styles.courseRow}>
              <CourseCover course={course} compact />
              <View style={styles.courseCopy}>
                <Text numberOfLines={1} style={[styles.courseTitle, {color: colors.text}]}>{course.title}</Text>
                <View style={styles.progressTitle}><Text style={[styles.progressLabel, {color: colors.textMuted}]}>课程进度</Text><Text style={[styles.progressValue, {color: colors.primary}]}>{courseProgress}%</Text></View>
                <ProgressBar value={courseProgress} height={5} />
              </View>
              <AppIcon name="chevron-right" size={23} color={colors.textMuted} />
            </View>
            <View style={[styles.metrics, {borderTopColor: colors.border}]}>
              <View style={styles.metric}><Text style={[styles.metricValue, {color: attempted ? colors.primary : colors.textMuted}]}>{attempted ? `${score}/${quiz.length}` : '--'}</Text><Text style={[styles.metricLabel, {color: colors.textMuted}]}>得分</Text></View>
              <View style={[styles.metricDivider, {backgroundColor: colors.border}]} />
              <View style={styles.metric}><Text style={[styles.metricValue, {color: colors.success}]}>{attempted ? score : '--'}</Text><Text style={[styles.metricLabel, {color: colors.textMuted}]}>答对</Text></View>
              <View style={[styles.metricDivider, {backgroundColor: colors.border}]} />
              <View style={styles.metric}><Text style={[styles.metricValue, {color: attempted ? colors.warning : colors.textMuted}]}>{attempted ? quiz.length - score : '--'}</Text><Text style={[styles.metricLabel, {color: colors.textMuted}]}>答错</Text></View>
              <View style={[styles.action, {backgroundColor: attempted ? colors.surfaceMuted : colors.primary}]}><Text style={[styles.actionText, {color: attempted ? colors.primary : '#FFFFFF'}]}>{attempted ? '再次测验' : '开始测验'}</Text></View>
            </View>
          </Pressable>;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {padding: 16, paddingBottom: 28},
  header: {paddingTop: 7, paddingBottom: 16},
  title: {fontSize: 24, fontWeight: '900'},
  subtitle: {fontSize: 12, marginTop: 5},
  summary: {height: 102, borderRadius: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center'},
  summaryIcon: {width: 52, height: 52, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginRight: 10},
  summaryItem: {flex: 1, alignItems: 'center'},
  summaryValue: {fontSize: 22, color: '#FFFFFF', fontWeight: '900'},
  summaryLabel: {fontSize: 9, color: 'rgba(255,255,255,0.68)', marginTop: 5},
  summaryDivider: {width: StyleSheet.hairlineWidth, height: 34, backgroundColor: 'rgba(255,255,255,0.22)'},
  sectionTitle: {fontSize: 17, fontWeight: '900', marginTop: 22, marginBottom: 12},
  card: {borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 13},
  courseRow: {flexDirection: 'row', alignItems: 'center'},
  courseCopy: {flex: 1, marginHorizontal: 11},
  courseTitle: {fontSize: 14, fontWeight: '900'},
  progressTitle: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 9, marginBottom: 5},
  progressLabel: {fontSize: 9},
  progressValue: {fontSize: 9, fontWeight: '900'},
  metrics: {borderTopWidth: StyleSheet.hairlineWidth, marginTop: 12, paddingTop: 11, flexDirection: 'row', alignItems: 'center'},
  metric: {width: 56, alignItems: 'center'},
  metricValue: {fontSize: 15, fontWeight: '900'},
  metricLabel: {fontSize: 8, marginTop: 3},
  metricDivider: {width: StyleSheet.hairlineWidth, height: 25},
  action: {height: 32, borderRadius: 16, paddingHorizontal: 13, marginLeft: 'auto', alignItems: 'center', justifyContent: 'center'},
  actionText: {fontSize: 10, fontWeight: '900'},
});
