import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Course} from '../types';
import {AppIcon} from './AppIcon';

const courseIcons: Record<string, React.ComponentProps<typeof AppIcon>['name']> = {
  RN: 'react',
  TS: 'language-typescript',
  JS: 'language-javascript',
  Node: 'nodejs',
  Vue: 'vuejs',
  Flutter: 'cellphone-cog',
};

export function CourseCover({course, compact = false, detail = false}: {course: Course; compact?: boolean; detail?: boolean}) {
  const icon = courseIcons[course.shortTitle] ?? 'book-open-variant';
  return (
    <View style={[styles.cover, {backgroundColor: course.color}, compact && styles.compact, detail && styles.detail]}>
      <View style={[styles.glow, {backgroundColor: course.accent}]} />
      <View style={styles.slashOne} />
      <View style={styles.slashTwo} />
      <View style={[styles.logo, compact && styles.logoCompact]}>
        <AppIcon name={icon} size={compact ? 37 : 54} color={course.accent} />
      </View>
      {!compact ? <View style={styles.copy}>
        <Text numberOfLines={2} style={[styles.title, detail && styles.detailTitle]}>{course.title}</Text>
        {!detail ? <Text style={styles.subtitle}>从基础到项目实战，掌握跨平台开发</Text> : null}
      </View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {height: 132, borderRadius: 12, overflow: 'hidden', paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center'},
  compact: {width: 86, height: 64, borderRadius: 7, paddingHorizontal: 0, justifyContent: 'center'},
  detail: {height: 174, borderRadius: 0, paddingHorizontal: 24},
  glow: {position: 'absolute', width: 150, height: 150, borderRadius: 75, right: -42, top: -48, opacity: 0.13},
  slashOne: {position: 'absolute', width: 220, height: 70, backgroundColor: 'rgba(31,113,225,0.18)', right: -72, top: 1, transform: [{rotate: '-32deg'}]},
  slashTwo: {position: 'absolute', width: 180, height: 50, backgroundColor: 'rgba(255,255,255,0.05)', right: -22, bottom: -22, transform: [{rotate: '-32deg'}]},
  logo: {width: 64, height: 64, alignItems: 'center', justifyContent: 'center', marginRight: 12},
  logoCompact: {marginRight: 0},
  copy: {flex: 1},
  title: {fontSize: 19, lineHeight: 24, fontWeight: '900', color: '#FFFFFF'},
  detailTitle: {fontSize: 22, lineHeight: 28},
  subtitle: {fontSize: 10, color: 'rgba(255,255,255,0.76)', marginTop: 8},
});
