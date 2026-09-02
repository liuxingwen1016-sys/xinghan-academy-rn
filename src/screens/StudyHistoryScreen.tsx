import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {FlatList, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon} from '../components/AppIcon';
import {CourseCover} from '../components/CourseCover';
import {ProgressBar} from '../components/ProgressBar';
import {TopBar} from '../components/TopBar';
import {useApp} from '../context/AppContext';
import {courses, getAllLessons} from '../data/courses';
import {RootStackParamList} from '../types';

export function StudyHistoryScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'StudyHistory'>) {
  const {colors, completedLessonIds, lastLessonByCourse, getCourseProgress} = useApp();
  const records = courses.map(course => {
    const lessons = getAllLessons(course);
    const completed = lessons.filter(lesson => completedLessonIds.includes(lesson.id)).length;
    const fallbackLesson = lessons.find(lesson => !completedLessonIds.includes(lesson.id)) ?? lessons[lessons.length - 1];
    const latestLesson = lessons.find(lesson => lesson.id === lastLessonByCourse[course.id]) ?? fallbackLesson;
    const chapter = course.chapters.find(item => item.lessons.some(lesson => lesson.id === latestLesson.id));
    return {course, lessons, completed, latestLesson, chapter, progress: getCourseProgress(course.id)};
  }).filter(record => record.completed > 0 || Boolean(lastLessonByCourse[record.course.id]));

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.surface}]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent={false} />
      <TopBar title="学习记录" onBack={navigation.goBack} />
      <FlatList
        data={records}
        keyExtractor={record => record.course.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, !records.length && styles.emptyList]}
        ListHeaderComponent={records.length ? <Text style={[styles.hint, {color: colors.textMuted}]}>点击课程，继续最近学习的课时</Text> : null}
        ListEmptyComponent={<View style={styles.empty}><AppIcon name="history" size={52} color={colors.textMuted} /><Text style={[styles.emptyTitle, {color: colors.text}]}>还没有学习记录</Text></View>}
        renderItem={({item}) => <Pressable
          onPress={() => navigation.navigate('Lesson', {courseId: item.course.id, lessonId: item.latestLesson.id})}
          style={({pressed}) => [styles.card, {backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.76 : 1}]}>
          <View style={styles.topRow}>
            <CourseCover course={item.course} compact />
            <View style={styles.courseCopy}>
              <Text numberOfLines={1} style={[styles.courseTitle, {color: colors.text}]}>{item.course.title}</Text>
              <Text style={[styles.courseMeta, {color: colors.textMuted}]}>已学 {item.completed}/{item.lessons.length} 课时 · {item.progress}%</Text>
            </View>
            <AppIcon name="chevron-right" size={23} color={colors.textMuted} />
          </View>
          <View style={styles.progressRow}><ProgressBar value={item.progress} height={6} /></View>
          <View style={[styles.lessonBox, {backgroundColor: colors.surfaceMuted}]}>
            <View style={[styles.playIcon, {backgroundColor: colors.primary}]}><AppIcon name={item.latestLesson.type === 'video' ? 'play' : 'file-document-outline'} size={17} color="#FFFFFF" /></View>
            <View style={styles.lessonCopy}>
              <Text style={[styles.chapter, {color: colors.textMuted}]}>{item.chapter?.title ?? '当前章节'}</Text>
              <Text numberOfLines={1} style={[styles.lesson, {color: colors.text}]}>{item.latestLesson.title}</Text>
            </View>
            <Text style={[styles.continue, {color: colors.primary}]}>继续学习</Text>
          </View>
        </Pressable>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  list: {padding: 16, paddingBottom: 28},
  emptyList: {flexGrow: 1},
  hint: {fontSize: 12, marginBottom: 12},
  card: {borderWidth: 1, borderRadius: 16, padding: 13, marginBottom: 14},
  topRow: {flexDirection: 'row', alignItems: 'center'},
  courseCopy: {flex: 1, marginHorizontal: 12},
  courseTitle: {fontSize: 15, fontWeight: '900'},
  courseMeta: {fontSize: 11, marginTop: 7},
  progressRow: {marginTop: 12},
  lessonBox: {minHeight: 66, borderRadius: 12, padding: 10, marginTop: 12, flexDirection: 'row', alignItems: 'center'},
  playIcon: {width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'},
  lessonCopy: {flex: 1, marginLeft: 10, minWidth: 0},
  chapter: {fontSize: 9},
  lesson: {fontSize: 12, fontWeight: '800', marginTop: 4},
  continue: {fontSize: 10, fontWeight: '900', marginLeft: 8},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80},
  emptyTitle: {fontSize: 18, fontWeight: '900', marginTop: 16},
});
