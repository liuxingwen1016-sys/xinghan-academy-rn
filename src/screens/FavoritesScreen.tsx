import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {FlatList, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon} from '../components/AppIcon';
import {CourseCover} from '../components/CourseCover';
import {ProgressBar} from '../components/ProgressBar';
import {TopBar} from '../components/TopBar';
import {useApp} from '../context/AppContext';
import {courses} from '../data/courses';
import {RootStackParamList} from '../types';

export function FavoritesScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'Favorites'>) {
  const {colors, favorites, getCourseProgress} = useApp();
  const favoriteCourses = courses.filter(course => favorites.includes(course.id));

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.surface}]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent={false} />
      <TopBar title="我的收藏" onBack={navigation.goBack} />
      <FlatList
        data={favoriteCourses}
        keyExtractor={course => course.id}
        contentContainerStyle={[styles.list, !favoriteCourses.length && styles.emptyList]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={favoriteCourses.length ? <Text style={[styles.count, {color: colors.textMuted}]}>共收藏 {favoriteCourses.length} 门课程</Text> : null}
        ListEmptyComponent={<View style={styles.empty}>
          <View style={[styles.emptyIcon, {backgroundColor: colors.surfaceMuted}]}><AppIcon name="bookmark-outline" size={42} color={colors.primary} /></View>
          <Text style={[styles.emptyTitle, {color: colors.text}]}>暂时没有收藏课程</Text>
          <Text style={[styles.emptyHint, {color: colors.textMuted}]}>在课程详情页点击右上角收藏按钮即可添加</Text>
        </View>}
        renderItem={({item}) => {
          const progress = getCourseProgress(item.id);
          return <Pressable onPress={() => navigation.navigate('CourseDetail', {courseId: item.id})} style={({pressed}) => [styles.card, {backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.76 : 1}]}>
            <CourseCover course={item} compact />
            <View style={styles.copy}>
              <Text numberOfLines={1} style={[styles.title, {color: colors.text}]}>{item.title}</Text>
              <Text style={[styles.meta, {color: colors.textMuted}]}>{item.level} · {item.instructor} · {item.duration}</Text>
              <View style={styles.progressRow}><Text style={[styles.progressLabel, {color: colors.textMuted}]}>课程进度</Text><Text style={[styles.progressValue, {color: colors.primary}]}>{progress}%</Text></View>
              <ProgressBar value={progress} height={5} />
            </View>
            <AppIcon name="chevron-right" size={23} color={colors.textMuted} />
          </Pressable>;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  list: {padding: 16, paddingBottom: 28},
  emptyList: {flexGrow: 1},
  count: {fontSize: 12, marginBottom: 12},
  card: {minHeight: 108, borderWidth: 1, borderRadius: 15, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center'},
  copy: {flex: 1, marginHorizontal: 12},
  title: {fontSize: 15, fontWeight: '900'},
  meta: {fontSize: 10, marginTop: 6},
  progressRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 5},
  progressLabel: {fontSize: 9},
  progressValue: {fontSize: 10, fontWeight: '900'},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80},
  emptyIcon: {width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center'},
  emptyTitle: {fontSize: 18, fontWeight: '900', marginTop: 18},
  emptyHint: {fontSize: 12, lineHeight: 18, marginTop: 7, textAlign: 'center'},
});
