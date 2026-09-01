import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon} from '../components/AppIcon';
import {CourseCard} from '../components/CourseCard';
import {useApp} from '../context/AppContext';
import {courses} from '../data/courses';
import {RootStackParamList} from '../types';

const categories = ['全部', '前端开发', '移动开发', '后端开发', 'AI / 效率'];

export function CoursesScreen({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>}) {
  const {colors} = useApp();
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [category, setCategory] = useState('全部');
  const [sort, setSort] = useState<'综合' | '评分'>('综合');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = courses.filter(course => {
      const matchesCategory = category === '全部' || course.category === category;
      const matchesQuery = !normalized || `${course.title}${course.tags.join('')}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
    return sort === '评分' ? [...result].sort((a, b) => b.rating - a.rating) : result;
  }, [category, query, sort]);

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.surface}]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent={false} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({item}) => <CourseCard course={item} onPress={() => navigation.navigate('CourseDetail', {courseId: item.id})} />}
        ListHeaderComponent={<View>
          <View style={styles.titleRow}>
            <Text style={[styles.title, {color: colors.text}]}>课程</Text>
            <Pressable onPress={() => setShowSearch(value => !value)} hitSlop={12} style={styles.headerIcon}>
              <AppIcon name={showSearch ? 'close' : 'magnify'} size={23} color={colors.text} />
            </Pressable>
          </View>
          {showSearch ? <View style={[styles.search, {backgroundColor: colors.background, borderColor: colors.border}]}>
            <AppIcon name="magnify" size={18} color={colors.textMuted} />
            <TextInput value={query} onChangeText={setQuery} autoFocus placeholder="搜索课程或知识点" placeholderTextColor={colors.textMuted} style={[styles.searchInput, {color: colors.text}]} />
          </View> : null}
          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
            renderItem={({item}) => {
              const selected = category === item;
              return <Pressable onPress={() => setCategory(item)} style={[styles.chip, {backgroundColor: selected ? colors.primary : colors.surfaceMuted}]}><Text style={[styles.chipText, {color: selected ? colors.white : colors.textMuted}]}>{item}</Text></Pressable>;
            }}
          />
          <View style={[styles.filterRow, {borderBottomColor: colors.border}]}>
            <Pressable onPress={() => setSort(sort === '综合' ? '评分' : '综合')} style={styles.filterItem}><Text style={[styles.filterText, {color: colors.text}]}>{sort === '综合' ? '综合排序' : '评分优先'}</Text><AppIcon name="chevron-down" size={14} color={colors.textMuted} /></Pressable>
            <Pressable style={styles.filterItem}><Text style={[styles.filterText, {color: colors.text}]}>难度</Text><AppIcon name="chevron-down" size={14} color={colors.textMuted} /></Pressable>
            <Pressable style={styles.filterItem}><Text style={[styles.filterText, {color: colors.text}]}>时长</Text><AppIcon name="chevron-down" size={14} color={colors.textMuted} /></Pressable>
            <Pressable style={styles.filterItem}><AppIcon name="filter-variant" size={15} color={colors.text} /><Text style={[styles.filterText, {color: colors.text}]}>筛选</Text></Pressable>
          </View>
        </View>}
        ListEmptyComponent={<View style={styles.empty}><AppIcon name="magnify" size={42} color={colors.textMuted} /><Text style={[styles.emptyTitle, {color: colors.text}]}>没有找到相关课程</Text><Text style={[styles.emptyText, {color: colors.textMuted}]}>试试其他关键词或分类</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  list: {paddingHorizontal: 12, paddingBottom: 18},
  titleRow: {height: 49, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  title: {fontSize: 18, fontWeight: '900'},
  headerIcon: {width: 38, height: 38, alignItems: 'center', justifyContent: 'center'},
  search: {height: 40, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 8},
  searchInput: {flex: 1, fontSize: 11, paddingVertical: 0, marginLeft: 6},
  chips: {gap: 8, paddingVertical: 8, paddingRight: 18},
  chip: {paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16},
  chipText: {fontSize: 9, fontWeight: '700'},
  filterRow: {height: 43, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  filterItem: {flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 8},
  filterText: {fontSize: 9},
  empty: {alignItems: 'center', paddingTop: 70},
  emptyTitle: {fontSize: 15, fontWeight: '800', marginTop: 10},
  emptyText: {fontSize: 10, marginTop: 5},
});
