import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useApp} from '../context/AppContext';
import {Course} from '../types';
import {AppIcon} from './AppIcon';
import {CourseCover} from './CourseCover';

export function CourseCard({course, onPress}: {course: Course; onPress: () => void}) {
  const {colors, getCourseProgress} = useApp();
  const progress = getCourseProgress(course.id);
  const lessonCount = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({pressed}) => [styles.row, {borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1}]}>
      <CourseCover course={course} compact />
      <View style={styles.body}>
        <Text numberOfLines={1} style={[styles.title, {color: colors.text}]}>{course.title}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.level, {backgroundColor: `${colors.success}18`}]}><Text style={[styles.levelText, {color: colors.success}]}>{course.level}</Text></View>
          {progress > 0 ? <Text style={[styles.progress, {color: colors.primary}]}>已学 {progress}%</Text> : null}
        </View>
        <View style={styles.infoRow}>
          <View style={styles.inline}><AppIcon name="clock-outline" size={12} color={colors.textMuted} /><Text style={[styles.info, {color: colors.textMuted}]}>{lessonCount} 课时 · {course.duration}</Text></View>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.inline}><AppIcon name="account-multiple-outline" size={12} color={colors.textMuted} /><Text style={[styles.info, {color: colors.textMuted}]}>{course.learners} 人学习</Text></View>
          <View style={styles.inline}><AppIcon name="star" size={13} color={colors.warning} /><Text style={[styles.rating, {color: colors.warning}]}>{course.rating}</Text></View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {height: 92, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 10},
  body: {flex: 1, height: 68, marginLeft: 10},
  title: {fontSize: 12, fontWeight: '800'},
  metaRow: {flexDirection: 'row', alignItems: 'center', marginTop: 3},
  level: {borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2},
  levelText: {fontSize: 7, fontWeight: '800'},
  progress: {fontSize: 8, fontWeight: '700', marginLeft: 6},
  infoRow: {marginTop: 5},
  bottomRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3},
  inline: {flexDirection: 'row', alignItems: 'center', gap: 3},
  info: {fontSize: 8},
  rating: {fontSize: 9, fontWeight: '700'},
});
