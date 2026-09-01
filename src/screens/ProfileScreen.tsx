import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Alert, Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon} from '../components/AppIcon';
import {useApp} from '../context/AppContext';
import {courses} from '../data/courses';
import {RootStackParamList} from '../types';

const menu: {icon: React.ComponentProps<typeof AppIcon>['name']; label: string}[] = [
  {icon: 'star-outline', label: '我的收藏'},
  {icon: 'clock-outline', label: '学习记录'},
  {icon: 'download-outline', label: '下载管理'},
  {icon: 'forum-outline', label: '问答社区'},
  {icon: 'help-circle-outline', label: '帮助与反馈'},
];

export function ProfileScreen({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>}) {
  const {colors, darkMode, setDarkMode, favorites, resetProgress, recentStudyDays, totalStudyMinutes, learningStreak} = useApp();
  const recentTotalMinutes = recentStudyDays.reduce((total, day) => total + day.minutes, 0);
  const maxDailyMinutes = Math.max(1, ...recentStudyDays.map(day => day.minutes));
  const formatRangeDate = (date: string) => {
    const [, month, day] = date.split('-').map(Number);
    return `${month}月${day}日`;
  };
  const recentRange = `${formatRangeDate(recentStudyDays[0].date)} - ${formatRangeDate(recentStudyDays[6].date)}`;

  const handleMenu = (label: string) => {
    if (label === '我的收藏') {
      const names = courses.filter(course => favorites.includes(course.id)).map(course => course.title);
      Alert.alert('我的收藏', names.length ? names.join('\n') : '暂时没有收藏课程');
    } else Alert.alert(label, label === '下载管理' ? '演示课程的视频、图文和题库均已内置，可离线使用。' : '该入口用于培训演示，可在后续版本接入真实服务。');
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.primaryDark}]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent={false} />
      <ScrollView style={{backgroundColor: colors.primaryDark}} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, {backgroundColor: colors.primaryDark}]}>
          <Pressable style={styles.settings} onPress={() => Alert.alert('设置', '可在下方切换深色模式，或重置演示数据。')}><AppIcon name="cog-outline" size={22} color="#FFFFFF" /></Pressable>
          <View style={styles.profileRow}>
            <View style={styles.avatar}><AppIcon name="account" size={43} color="#123B70" /></View>
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
            {menu.map((item, index) => <Pressable key={item.label} onPress={() => handleMenu(item.label)} style={[styles.menuRow, index < menu.length - 1 && {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border}]}>
              <AppIcon name={item.icon} size={19} color={colors.text} />
              <Text style={[styles.menuLabel, {color: colors.text}]}>{item.label}</Text>
              <AppIcon name="chevron-right" size={18} color={colors.textMuted} />
            </Pressable>)}
          </View>

          <View style={[styles.menuCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={styles.menuRow}><AppIcon name="weather-night" size={19} color={colors.text} /><Text style={[styles.menuLabel, {color: colors.text}]}>深色模式</Text><Switch value={darkMode} onValueChange={setDarkMode} trackColor={{false: colors.border, true: colors.primary}} thumbColor="#FFFFFF" /></View>
          </View>

          <Pressable onPress={() => navigation.navigate('Lab')} style={[styles.labRow, {backgroundColor: colors.surface, borderColor: colors.border}]}><AppIcon name="flask-outline" size={20} color={colors.primary} /><View style={{flex: 1, marginLeft: 10}}><Text style={[styles.labTitle, {color: colors.text}]}>React Native 能力实验室</Text><Text style={[styles.labHint, {color: colors.textMuted}]}>体验动画、系统分享与原生能力</Text></View><AppIcon name="chevron-right" size={18} color={colors.textMuted} /></Pressable>

          <Pressable onPress={() => Alert.alert('重置演示数据', '将恢复初始学习进度和收藏，是否继续？', [{text: '取消', style: 'cancel'}, {text: '重置', style: 'destructive', onPress: resetProgress}])} style={styles.reset}><Text style={[styles.resetText, {color: colors.textMuted}]}>重置演示数据</Text></Pressable>
          <Text style={[styles.version, {color: colors.textMuted}]}>星瀚学堂 Android Demo · v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {paddingBottom: 0},
  header: {paddingHorizontal: 14, paddingTop: 8, paddingBottom: 18},
  settings: {position: 'absolute', right: 10, top: 6, width: 38, height: 38, alignItems: 'center', justifyContent: 'center', zIndex: 2},
  profileRow: {height: 82, flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 58, height: 58, borderRadius: 29, backgroundColor: '#D8EEFF', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'},
  profileCopy: {flex: 1, marginLeft: 11},
  name: {color: '#FFFFFF', fontSize: 16, fontWeight: '900'},
  userId: {color: 'rgba(255,255,255,0.72)', fontSize: 9, marginTop: 4},
  level: {borderRadius: 5, paddingHorizontal: 7, paddingVertical: 4, marginRight: 40},
  levelText: {color: '#633A00', fontSize: 8, fontWeight: '900'},
  stats: {height: 66, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.28)', borderRadius: 10, flexDirection: 'row', alignItems: 'center'},
  stat: {flex: 1, alignItems: 'center'},
  statDivider: {width: StyleSheet.hairlineWidth, height: 28, backgroundColor: 'rgba(255,255,255,0.22)'},
  statValue: {color: '#FFFFFF', fontSize: 15, fontWeight: '900'},
  statLabel: {color: 'rgba(255,255,255,0.68)', fontSize: 7, marginTop: 4},
  sheet: {borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 12, paddingTop: 14},
  weekCard: {borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, padding: 12},
  weekTitleRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  weekTitle: {fontSize: 12, fontWeight: '900'},
  weekRange: {fontSize: 7},
  weekMeta: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7},
  weekValue: {fontSize: 18, fontWeight: '900'},
  weekUnit: {fontSize: 8, fontWeight: '500'},
  weekHint: {fontSize: 7},
  chart: {height: 101, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginTop: 3},
  day: {height: 96, width: 36, alignItems: 'center', justifyContent: 'flex-end'},
  dayMinutes: {fontSize: 6, marginBottom: 2},
  bar: {width: 8, borderRadius: 4},
  dayText: {fontSize: 7, marginTop: 4},
  dateText: {fontSize: 6, marginTop: 2},
  menuCard: {borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, marginTop: 10, overflow: 'hidden'},
  menuRow: {height: 47, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12},
  menuLabel: {flex: 1, fontSize: 10, marginLeft: 10},
  labRow: {borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, marginTop: 10, minHeight: 55, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center'},
  labTitle: {fontSize: 10, fontWeight: '800'},
  labHint: {fontSize: 8, marginTop: 3},
  reset: {height: 40, alignItems: 'center', justifyContent: 'center'},
  resetText: {fontSize: 9},
  version: {fontSize: 8, textAlign: 'center', marginBottom: 8},
});
