import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon} from '../components/AppIcon';
import {CourseCover} from '../components/CourseCover';
import {SectionHeader} from '../components/SectionHeader';
import {useApp} from '../context/AppContext';
import {courses} from '../data/courses';
import {MainTab, RootStackParamList} from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
  setTab: (tab: MainTab) => void;
};

const ringSegments = [
  {left: 24, top: -2, transform: [{rotate: '0deg'}]},
  {left: 43, top: 7, transform: [{rotate: '45deg'}]},
  {left: 51, top: 27, transform: [{rotate: '90deg'}]},
  {left: 43, top: 46, transform: [{rotate: '135deg'}]},
  {left: 24, top: 54, transform: [{rotate: '0deg'}]},
  {left: 5, top: 46, transform: [{rotate: '45deg'}]},
  {left: -3, top: 27, transform: [{rotate: '90deg'}]},
  {left: 5, top: 7, transform: [{rotate: '135deg'}]},
] as const;

export function HomeScreen({navigation, setTab}: Props) {
  const {colors, getCourseProgress} = useApp();
  const featured = courses[0];
  const progress = getCourseProgress(featured.id);

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.primaryDark}]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent={false} />
      <ScrollView style={{backgroundColor: colors.background}} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.hero, {backgroundColor: colors.primaryDark}]}>
          <View style={styles.helloRow}>
            <View>
              <Text style={styles.hello}>Hi，学习者 👋</Text>
              <Text style={styles.caption}>今天也是加油学习的一天！</Text>
            </View>
            <Pressable style={styles.iconButton} accessibilityLabel="通知">
              <AppIcon name="bell-outline" size={22} color="#FFFFFF" />
              <View style={styles.badge} />
            </Pressable>
          </View>
          <Pressable onPress={() => setTab('courses')} style={styles.search}>
            <AppIcon name="magnify" size={19} color="#7E8FA8" />
            <Text style={styles.searchText}>搜索课程、章节或知识点</Text>
          </Pressable>
        </View>

        <View style={[styles.progressCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.cardTitleRow}>
            <Text style={[styles.cardTitle, {color: colors.text}]}>学习进度</Text>
            <Pressable style={styles.detailLink} onPress={() => setTab('learning')}>
              <Text style={[styles.detailText, {color: colors.textMuted}]}>查看学习报告</Text>
              <AppIcon name="chevron-right" size={15} color={colors.textMuted} />
            </Pressable>
          </View>
          <View style={styles.progressBody}>
            <View style={[styles.ringTrack, {borderColor: colors.surfaceMuted}]}>
              {ringSegments.slice(0, Math.max(1, Math.round(progress / 12.5))).map((position, index) => <View key={index} style={[styles.ringSegment, position, {backgroundColor: colors.primary}]} />)}
              <Text style={[styles.percent, {color: colors.text}]}>{progress}%</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}><Text style={[styles.statLabel, {color: colors.textMuted}]}>已学课程</Text><Text style={[styles.statValue, {color: colors.text}]}>12 <Text style={styles.statUnit}>门</Text></Text></View>
              <View style={styles.stat}><Text style={[styles.statLabel, {color: colors.textMuted}]}>已学时长</Text><Text style={[styles.statValue, {color: colors.text}]}>32.5 <Text style={styles.statUnit}>小时</Text></Text></View>
              <View style={styles.stat}><Text style={[styles.statLabel, {color: colors.textMuted}]}>连续学习</Text><Text style={[styles.statValue, {color: colors.text}]}>7 <Text style={styles.statUnit}>天</Text></Text></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="AI 精选课程" action="更多" onAction={() => setTab('courses')} />
          <Pressable onPress={() => navigation.navigate('CourseDetail', {courseId: featured.id})} style={styles.featured}>
            <CourseCover course={featured} />
            <View style={[styles.aiBadge, {backgroundColor: colors.warning}]}><Text style={styles.aiBadgeText}>AI 精选</Text></View>
            <View style={styles.featuredMeta}>
              <Text style={styles.featuredMetaText}>初级 · 24 课时</Text>
              <View style={styles.inlineMeta}><AppIcon name="account-multiple-outline" size={13} color="#FFFFFF" /><Text style={styles.featuredMetaText}>8.9k 人学习</Text></View>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeader title="为你推荐" action="更多" onAction={() => setTab('courses')} />
          <View style={[styles.recommendList, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            {courses.slice(1, 4).map((course, index) => (
              <Pressable
                key={course.id}
                onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}
                style={[styles.recommendRow, index < 2 && {borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth}]}>
                <CourseCover course={course} compact />
                <View style={styles.recommendCopy}>
                  <Text numberOfLines={1} style={[styles.recommendTitle, {color: colors.text}]}>{course.title}</Text>
                  <View style={styles.recommendMeta}><Text style={[styles.recommendMetaText, {color: colors.textMuted}]}>{course.level} · {course.chapters[0].lessons.length * 6} 课时</Text><View style={styles.inlineMeta}><AppIcon name="account-multiple-outline" size={12} color={colors.textMuted} /><Text style={[styles.recommendMetaText, {color: colors.textMuted}]}>{course.learners}</Text></View></View>
                  <View style={styles.rating}><AppIcon name="star" size={13} color={colors.warning} /><Text style={[styles.ratingText, {color: colors.warning}]}>{course.rating}</Text></View>
                </View>
                <AppIcon name="chevron-right" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {paddingBottom: 18},
  hero: {paddingHorizontal: 16, paddingTop: 11, paddingBottom: 29},
  helloRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13},
  hello: {color: '#FFFFFF', fontSize: 18, fontWeight: '900'},
  caption: {color: 'rgba(255,255,255,0.72)', marginTop: 3, fontSize: 10},
  iconButton: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  badge: {position: 'absolute', right: 5, top: 5, width: 7, height: 7, borderRadius: 4, borderWidth: 1.5, borderColor: '#073B83', backgroundColor: '#FF5A52'},
  search: {height: 39, borderRadius: 9, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11},
  searchText: {color: '#8794A8', marginLeft: 7, fontSize: 11},
  progressCard: {marginHorizontal: 12, marginTop: -16, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 13, elevation: 3, shadowColor: '#18365F', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width: 0, height: 4}},
  cardTitleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  cardTitle: {fontSize: 14, fontWeight: '900'},
  detailLink: {flexDirection: 'row', alignItems: 'center'},
  detailText: {fontSize: 9},
  progressBody: {flexDirection: 'row', alignItems: 'center', marginTop: 9},
  ringTrack: {width: 62, height: 62, borderRadius: 31, borderWidth: 7, alignItems: 'center', justifyContent: 'center'},
  ringSegment: {position: 'absolute', width: 14, height: 6, borderRadius: 3},
  percent: {fontWeight: '900', fontSize: 14},
  statsRow: {flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 14},
  stat: {alignItems: 'flex-start'},
  statLabel: {fontSize: 8},
  statValue: {fontSize: 14, fontWeight: '900', marginTop: 4},
  statUnit: {fontSize: 8, fontWeight: '500'},
  section: {marginTop: 16, paddingHorizontal: 12},
  featured: {overflow: 'hidden', borderRadius: 12},
  aiBadge: {position: 'absolute', right: 0, top: 0, paddingHorizontal: 9, paddingVertical: 5, borderBottomLeftRadius: 8},
  aiBadgeText: {fontSize: 8, color: '#FFFFFF', fontWeight: '800'},
  featuredMeta: {position: 'absolute', left: 12, right: 12, bottom: 9, flexDirection: 'row', justifyContent: 'space-between'},
  featuredMetaText: {fontSize: 8, color: '#FFFFFF', fontWeight: '600'},
  inlineMeta: {flexDirection: 'row', alignItems: 'center', gap: 3},
  recommendList: {borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, overflow: 'hidden'},
  recommendRow: {height: 79, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center'},
  recommendCopy: {flex: 1, minWidth: 0, marginLeft: 9},
  recommendTitle: {fontSize: 12, fontWeight: '800'},
  recommendMeta: {flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 5},
  recommendMetaText: {fontSize: 8},
  rating: {flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4},
  ratingText: {fontSize: 9, fontWeight: '700'},
});
