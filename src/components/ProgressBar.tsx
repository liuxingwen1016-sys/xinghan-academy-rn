import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useApp} from '../context/AppContext';

export function ProgressBar({value, height = 7}: {value: number; height?: number}) {
  const {colors} = useApp();
  const normalized = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, {height, backgroundColor: colors.surfaceMuted}]}>
      <View style={[styles.fill, {width: `${normalized}%`, backgroundColor: colors.primary}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {width: '100%', borderRadius: 99, overflow: 'hidden'},
  fill: {height: '100%', borderRadius: 99},
});
