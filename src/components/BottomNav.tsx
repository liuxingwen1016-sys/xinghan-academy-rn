import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useApp} from '../context/AppContext';
import {MainTab} from '../types';
import {AppIcon} from './AppIcon';

const tabs: {id: MainTab; label: string; icon: React.ComponentProps<typeof AppIcon>['name']; activeIcon: React.ComponentProps<typeof AppIcon>['name']}[] = [
  {id: 'home', label: '首页', icon: 'home-outline', activeIcon: 'home'},
  {id: 'courses', label: '课程', icon: 'book-open-outline', activeIcon: 'book-open-variant'},
  {id: 'learning', label: '学习', icon: 'school-outline', activeIcon: 'school'},
  {id: 'quiz', label: '测验', icon: 'clipboard-text-outline', activeIcon: 'clipboard-text'},
  {id: 'profile', label: '我的', icon: 'account-outline', activeIcon: 'account'},
];

export function BottomNav({active, onChange}: {active: MainTab; onChange: (tab: MainTab) => void}) {
  const {colors} = useApp();
  return (
    <View style={[styles.nav, {backgroundColor: colors.surface, borderTopColor: colors.border}]}>
      {tabs.map(tab => {
        const selected = active === tab.id;
        return (
          <Pressable key={tab.id} onPress={() => onChange(tab.id)} style={styles.item} accessibilityRole="tab">
            <View style={[styles.iconWrap, selected && {backgroundColor: colors.surfaceMuted}]}>
              <AppIcon name={selected ? tab.activeIcon : tab.icon} size={22} color={selected ? colors.primary : colors.textMuted} />
            </View>
            <Text style={[styles.label, {color: selected ? colors.primary : colors.textMuted}]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {height: 60, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', paddingTop: 4},
  item: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1},
  iconWrap: {width: 34, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center'},
  label: {fontSize: 10, lineHeight: 14, fontWeight: '600'},
});
