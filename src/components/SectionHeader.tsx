import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useApp} from '../context/AppContext';
import {AppIcon} from './AppIcon';

export function SectionHeader({title, action, onAction}: {title: string; action?: string; onAction?: () => void}) {
  const {colors} = useApp();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10} style={styles.actionWrap}>
          <Text style={[styles.action, {color: colors.textMuted}]}>{action}</Text>
          <AppIcon name="chevron-right" size={14} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9},
  title: {fontSize: 14, fontWeight: '900'},
  actionWrap: {flexDirection: 'row', alignItems: 'center'},
  action: {fontSize: 9, fontWeight: '600'},
});
