import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useApp} from '../context/AppContext';

export function NetworkBanner({online}: {online: boolean | null}) {
  const {colors} = useApp();
  if (online !== false) return null;
  return (
    <View style={[styles.banner, {backgroundColor: colors.warning}]}>
      <Text style={styles.text}>当前网络不可用，已切换到本地图文课时</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center'},
  text: {color: '#3C2A00', fontSize: 12, fontWeight: '700'},
});
