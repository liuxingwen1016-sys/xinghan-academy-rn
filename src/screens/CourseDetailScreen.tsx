import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../components/AppButton';
import {AppIcon} from '../components/AppIcon';
import {CourseCover} from '../components/CourseCover';
import {ProgressBar} from '../components/ProgressBar';
import {TopBar} from '../components/TopBar';
import {useApp} from '../context/AppContext';
import {getAllLessons, getCourse} from '../data/courses';
import {RootStackParamList} from '../types';

export function CourseDetailScreen({navigation, route}: NativeStackScreenProps<RootStackParamList, 'CourseDetail'>) {
  const {colors, getCourseProgress, isFavorite, toggleFavorite, isLessonComplete} = useApp();
  const course = getCourse(route.params.courseId);
  const progress = getCourseProgress(course.id);
  const lessons = getAllLessons(course);
  const nextLesson = lessons.find(lesson => !isLessonComplete(lesson.id)) ?? lessons[0];
  const favorite = isFavorite(course.id);
  const [expandedChapter, setExpandedChapter] = useState<string | undefined>(course.chapters[Math.min(1, course.chapters.length - 1)]?.id);

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.primaryDark}]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent={false} />
      <TopBar
        title=""
        dark
        onBack={navigation.goBack}
        actionIcon={favorite ? 'bookmark' : 'bookmark-outline'}
        secondaryActionIcon="share-variant-outline"
        onAction={() => toggleFavorite(course.id)}
        onSecondaryAction={() => Share.share({message: `推荐课程：${course.title}`})}
      />
      <ScrollView style={{backgroundColor: colors.background}} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CourseCover course={course} detail />

        <View style={[styles.intro, {backgroundColor: colors.surface}]}>
          <Text style={[styles.title, {color: colors.text}]}>{course.title}</Text>
          <Text style={[styles.description, {color: colors.textMuted}]}>{course.description}</Text>
          <View style={styles.teacher}>
            <View style={[styles.avatar, {backgroundColor: `${course.accent}24`}]}><AppIcon name="account" size={25} color={course.color} /></View>
            <View style={styles.teacherCopy}><Text style={[styles.teacherName, {color: colors.text}]}>{course.instructor}</Text><Text style={[styles.teacherRole, {color: colors.textMuted}]}>跨端研发与培训讲师</Text></View>
            <Pressable style={[styles.follow, {borderColor: colors.primary}]}><AppIcon name="plus" size={14} color={colors.primary} /><Text style={[styles.followText, {color: colors.primary}]}>关注</Text></Pressable>
          </View>
        </View>

        <View style={[styles.sectionCard, {backgroundColor: colors.surface}]}>
          <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, {color: colors.text}]}>学习进度</Text><Text style={[styles.progressValue, {color: colors.primary}]}>{progress}%</Text></View>
          <ProgressBar value={progress} height={6} />
          <Text style={[styles.progressHint, {color: colors.textMuted}]}>已学 {lessons.filter(item => isLessonComplete(item.id)).length} / {lessons.length} 课时 · {course.duration}</Text>
        </View>

        <View style={[styles.sectionCard, {backgroundColor: colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>学习目标</Text>
          <View style={styles.goals}>
            {course.goals.map(goal => <View key={goal} style={styles.goalRow}><AppIcon name="check-circle" size={15} color={colors.success} /><Text style={[styles.goal, {color: colors.text}]}>{goal}</Text></View>)}
          </View>
        </View>

        <View style={[styles.sectionCard, {backgroundColor: colors.surface}]}>
          <View style={styles.chapterTop}><Text style={[styles.sectionTitle, {color: colors.text}]}>课程章节</Text><Text style={[styles.chapterCount, {color: colors.textMuted}]}>{course.chapters.length} 章 · {lessons.length} 课时</Text></View>
          {course.chapters.map((chapter, chapterIndex) => {
            const expanded = expandedChapter === chapter.id;
            const completed = chapter.lessons.filter(item => isLessonComplete(item.id)).length;
            return <View key={chapter.id} style={[styles.chapter, {borderBottomColor: colors.border}]}>
              <Pressable onPress={() => setExpandedChapter(expanded ? undefined : chapter.id)} style={styles.chapterHeader}>
                <View style={styles.chapterCopy}><Text style={[styles.chapterTitle, {color: colors.text}]}>{chapter.title}</Text><Text style={[styles.chapterMeta, {color: colors.textMuted}]}>{completed} / {chapter.lessons.length} 已完成</Text></View>
                <AppIcon name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
              </Pressable>
              {expanded ? chapter.lessons.map((lesson, lessonIndex) => {
                const complete = isLessonComplete(lesson.id);
                return <Pressable key={lesson.id} onPress={() => navigation.navigate('Lesson', {courseId: course.id, lessonId: lesson.id})} style={styles.lessonRow}>
                  <AppIcon name={complete ? 'check-circle' : lesson.type === 'video' ? 'play-circle-outline' : 'file-document-outline'} size={17} color={complete ? colors.primary : colors.textMuted} />
                  <Text numberOfLines={1} style={[styles.lessonTitle, {color: complete ? colors.primary : colors.text}]}>{chapterIndex + 1}.{lessonIndex + 1} {lesson.title.replace(/^\d+\.\d+\s*/, '')}</Text>
                  <Text style={[styles.lessonDuration, {color: colors.textMuted}]}>{lesson.duration}</Text>
                  {!complete ? <AppIcon name="lock-outline" size={13} color={colors.textMuted} /> : null}
                </Pressable>;
              }) : null}
            </View>;
          })}
        </View>

        <Pressable onPress={() => navigation.navigate('Quiz', {courseId: course.id})} style={[styles.quiz, {backgroundColor: colors.surface}]}>
          <View style={styles.quizIcon}><AppIcon name="clipboard-text-outline" size={22} color={colors.primary} /></View>
          <View style={{flex: 1}}><Text style={[styles.quizTitle, {color: colors.text}]}>课程测验</Text><Text style={[styles.quizHint, {color: colors.textMuted}]}>5 道题 · 自动评分 · 答案解析</Text></View>
          <AppIcon name="chevron-right" size={20} color={colors.textMuted} />
        </Pressable>
      </ScrollView>
      <View style={[styles.footer, {backgroundColor: colors.surface, borderTopColor: colors.border}]}>
        <AppButton label={progress ? '继续学习' : '开始学习'} onPress={() => navigation.navigate('Lesson', {courseId: course.id, lessonId: nextLesson.id})} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {paddingBottom: 78},
  intro: {paddingHorizontal: 14, paddingTop: 13, paddingBottom: 12},
  title: {fontSize: 20, fontWeight: '900'},
  description: {fontSize: 10, lineHeight: 16, marginTop: 5},
  teacher: {flexDirection: 'row', alignItems: 'center', marginTop: 12},
  avatar: {width: 35, height: 35, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  teacherCopy: {flex: 1, marginLeft: 8},
  teacherName: {fontSize: 11, fontWeight: '800'},
  teacherRole: {fontSize: 8, marginTop: 2},
  follow: {height: 28, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 2},
  followText: {fontSize: 9, fontWeight: '700'},
  sectionCard: {marginTop: 8, padding: 14},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9},
  sectionTitle: {fontSize: 13, fontWeight: '900'},
  progressValue: {fontSize: 12, fontWeight: '900'},
  progressHint: {fontSize: 8, marginTop: 7},
  goals: {marginTop: 9, gap: 7},
  goalRow: {flexDirection: 'row', alignItems: 'center'},
  goal: {fontSize: 9, marginLeft: 6, flex: 1},
  chapterTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3},
  chapterCount: {fontSize: 8},
  chapter: {borderBottomWidth: StyleSheet.hairlineWidth},
  chapterHeader: {minHeight: 48, flexDirection: 'row', alignItems: 'center'},
  chapterCopy: {flex: 1},
  chapterTitle: {fontSize: 10, fontWeight: '800'},
  chapterMeta: {fontSize: 8, marginTop: 3},
  lessonRow: {height: 39, flexDirection: 'row', alignItems: 'center', paddingLeft: 6},
  lessonTitle: {flex: 1, fontSize: 9, marginLeft: 7},
  lessonDuration: {fontSize: 8, marginRight: 5},
  quiz: {marginTop: 8, padding: 12, flexDirection: 'row', alignItems: 'center'},
  quizIcon: {width: 38, height: 38, borderRadius: 8, backgroundColor: '#EAF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 9},
  quizTitle: {fontSize: 12, fontWeight: '800'},
  quizHint: {fontSize: 8, marginTop: 3},
  footer: {position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, paddingVertical: 9, borderTopWidth: StyleSheet.hairlineWidth},
});
