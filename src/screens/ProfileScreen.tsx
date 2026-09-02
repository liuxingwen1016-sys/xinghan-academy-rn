import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Alert, Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon} from '../components/AppIcon';
import {useApp} from '../context/AppContext';
import {courses} from '../data/courses';
import {RootStackParamList} from '../types';

const menu: {id: 'favorites' | 'history'; icon: React.ComponentProps<typeof AppIcon>['name']; label: string}[] = [
  {id: 'favorites', icon: 'bookmark-outline', label: '我的收藏'},
  {id: 'history', icon: 'history', label: '学习记录'},
];

export function ProfileScreen({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>}) {
  const {colors, darkMode, setDarkMode, favorites, completedLessonIds, resetProgress, recentStudyDays, totalStudyMinutes, learningStreak} = useApp();
  const recentTotalMinutes = recentStudyDays.reduce((total, day) => total + day.minutes, 0);
  const maxDailyMinutes = Math.max(1, ...recentStudyDays.map(day => day.minutes));
  const formatRangeDate = (date: string) => {
    const [, month, day] = date.split('-').map(Number);
    return `${month}月${day}日`;
  };
  const recentRange = `${formatRangeDate(recentStudyDays[0].date)} - ${formatRangeDate(recentStudyDays[6].date)}`;

  const handleMenu = (id: 'favorites' | 'history') => navigation.navigate(id === 'favorites' ? 'Favorites' : 'StudyHistory');

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.primaryDark}]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent={false} />
      <ScrollView style={{backgroundColor: colors.primaryDark}} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, {backgroundColor: colors.primaryDark}]}>
          <Pressable style={styles.settings} onPress={() => Alert.alert('设置', '可在下方切换深色模式，或重置演示数据。')}><AppIcon name="cog-outline" size={28} color="#FFFFFF" /></Pressable>
          <View style={styles.profileRow}>
            <View style={styles.avatar}><AppIcon name="account" size={52} color="#123B70" /></View>
            <View style={styles.profileCopy}><Text style={styles.name}>学习者</Text><Text style={styles.userId}>ID: 10086</Text></View>
            <View style={[styles.level, {backgroundColor: colors.warning}]}><Text style={styles.levelText}>Lv.5</Text></View>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}><Text style={styles.statValue}>{courses.length}</Text><Text style={styles.statLabel}>我的课程</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statValue}>{(totalStudyMinutes / 60).toFixed(1)}</Text><Text style={styles.statLabel}>学习时长(小时)</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statValue}>{learningStreak}</Text><Text style={styles.statLabel}>连续学习(天)</Text></View>
          </View>
        </View>

        <View style={[styles.sheet, {backgroundColor: colors.background}]}>
          <View style={[styles.weekCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={styles.weekTitleRow}><Text style={[styles.weekTitle, {color: colors.text}]}>最近 7 天学习时长</Text><Text style={[styles.weekRange, {color: colors.textMuted}]}>{recentRange}</Text></View>
            <View style={styles.weekMeta}><Text style={[styles.weekValue, {color: colors.text}]}>{(recentTotalMinutes / 60).toFixed(1)}<Text style={styles.weekUnit}> 小时</Text></Text><Text style={[styles.weekHint, {color: colors.textMuted}]}>按实际完成课时累计</Text></View>
            <View style={styles.chart}>
              {recentStudyDays.map(day => <View key={day.date} style={styles.day}>
                <Text style={[styles.dayMinutes, {color: colors.textMuted}]}>{day.minutes}</Text>
                <View style={[styles.bar, {height: Math.max(4, Math.round((day.minutes / maxDailyMinutes) * 48)), backgroundColor: colors.primary}]} />
                <Text style={[styles.dayText, {color: colors.textMuted}]}>{day.weekday}</Text>
                <Text style={[styles.dateText, {color: colors.textMuted}]}>{day.shortDate}</Text>
              </View>)}
            </View>
          </View>

          <View style={[styles.menuCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            {menu.map((item, index) => <Pressable key={item.id} onPress={() => handleMenu(item.id)} style={[styles.menuRow, index < menu.length - 1 && {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border}]}>
              <View style={[styles.menuIcon, {backgroundColor: colors.surfaceMuted}]}><AppIcon name={item.icon} size={25} color={colors.primary} /></View>
              <View style={styles.menuCopy}><Text style={[styles.menuLabel, {color: colors.text}]}>{item.label}</Text><Text style={[styles.menuHint, {color: colors.textMuted}]}>{item.id === 'favorites' ? `${favorites.length} 门课程` : `${completedLessonIds.length} 个课时已完成`}</Text></View>
              <AppIcon name="chevron-right" size={23} color={colors.textMuted} />
            </Pressable>)}
          </View>

          <View style={[styles.menuCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={styles.menuRow}><View style={[styles.menuIcon, {backgroundColor: colors.surfaceMuted}]}><AppIcon name="weather-night" size={25} color={colors.primary} /></View><Text style={[styles.settingLabel, {color: colors.text}]}>深色模式</Text><Switch value={darkMode} onValueChange={setDarkMode} trackColor={{false: colors.border, true: colors.primary}} thumbColor="#FFFFFF" /></View>
          </View>

          <Pressable onPress={() => navigation.navigate('Lab')} style={[styles.labRow, {backgroundColor: colors.surface, borderColor: colors.border}]}><View style={[styles.menuIcon, {backgroundColor: colors.surfaceMuted}]}><AppIcon name="flask-outline" size={25} color={colors.primary} /></View><View style={{flex: 1, marginLeft: 12}}><Text style={[styles.labTitle, {color: colors.text}]}>React Native 能力实验室</Text><Text style={[styles.labHint, {color: colors.textMuted}]}>体验动画、系统分享与原生能力</Text></View><AppIcon name="chevron-right" size={23} color={colors.textMuted} /></Pressable>

          <Pressable onPress={() => Alert.alert('重置演示数据', '将恢复初始学习进度和收藏，是否继续？', [{text: '取消', style: 'cancel'}, {text: '重置', style: 'destructive', onPress: resetProgress}])} style={styles.reset}><Text style={[styles.resetText, {color: colors.textMuted}]}>重置演示数据</Text></Pressable>
          <Text style={[styles.version, {color: colors.textMuted}]}>RN学堂 Android Demo · v1.1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {paddingBottom: 0},
  header: {paddingHorizontal: 16, paddingTop: 10, paddingBottom: 21},
  settings: {position: 'absolute', right: 11, top: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 2},
  profileRow: {height: 102, flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 72, height: 72, borderRadius: 36, backgroundColor: '#D8EEFF', borderWidth: 3, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'},
  profileCopy: {flex: 1, marginLeft: 15},
  name: {color: '#FFFFFF', fontSize: 21, fontWeight: '900'},
  userId: {color: 'rgba(255,255,255,0.72)', fontSize: 12, marginTop: 6},
  level: {borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 45},
  levelText: {color: '#633A00', fontSize: 10, fontWeight: '900'},
  stats: {height: 80, borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', borderRadius: 13, flexDirection: 'row', alignItems: 'center'},
  stat: {flex: 1, alignItems: 'center'},
  statDivider: {width: StyleSheet.hairlineWidth, height: 34, backgroundColor: 'rgba(255,255,255,0.22)'},
  statValue: {color: '#FFFFFF', fontSize: 20, fontWeight: '900'},
  statLabel: {color: 'rgba(255,255,255,0.68)', fontSize: 10, marginTop: 6},
  sheet: {borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 14, paddingTop: 16},
  weekCard: {borderWidth: 1, borderRadius: 15, padding: 15},
  weekTitleRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  weekTitle: {fontSize: 15, fontWeight: '900'},
  weekRange: {fontSize: 9},
  weekMeta: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9},
  weekValue: {fontSize: 24, fontWeight: '900'},
  weekUnit: {fontSize: 11, fontWeight: '500'},
  weekHint: {fontSize: 9},
  chart: {height: 124, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginTop: 5},
  day: {height: 118, width: 39, alignItems: 'center', justifyContent: 'flex-end'},
  dayMinutes: {fontSize: 8, marginBottom: 3},
  bar: {width: 10, borderRadius: 5},
  dayText: {fontSize: 9, marginTop: 5},
  dateText: {fontSize: 8, marginTop: 3},
  menuCard: {borderWidth: 1, borderRadius: 14, marginTop: 13, overflow: 'hidden'},
  menuRow: {height: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14},
  menuIcon: {width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  menuCopy: {flex: 1, marginLeft: 13},
  menuLabel: {fontSize: 14, fontWeight: '800'},
  menuHint: {fontSize: 10, marginTop: 4},
  settingLabel: {flex: 1, fontSize: 14, fontWeight: '800', marginLeft: 13},
  labRow: {borderWidth: 1, borderRadius: 14, marginTop: 13, minHeight: 72, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center'},
  labTitle: {fontSize: 13, fontWeight: '900'},
  labHint: {fontSize: 10, marginTop: 4},
  reset: {height: 48, alignItems: 'center', justifyContent: 'center'},
  resetText: {fontSize: 11},
  version: {fontSize: 10, textAlign: 'center', marginBottom: 10},
});
