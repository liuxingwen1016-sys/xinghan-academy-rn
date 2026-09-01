import NetInfo from '@react-native-community/netinfo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Platform, Pressable, Share, StatusBar, StyleSheet, Text, ToastAndroid, Vibration, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../components/AppButton';
import {TopBar} from '../components/TopBar';
import {useApp} from '../context/AppContext';
import {RootStackParamList} from '../types';
import {AppIcon} from '../components/AppIcon';

export function LabScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'Lab'>) {
  const {colors} = useApp();
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const [network, setNetwork] = useState('检测中…');
  const [pressCount, setPressCount] = useState(0);

  const refreshNetwork = () => {
    setNetwork('检测中…');
    NetInfo.fetch().then(state => {
      setNetwork(state.isConnected && state.isInternetReachable !== false ? `在线 · ${state.type}` : '离线 · 已启用本地兜底');
    }).catch(() => setNetwork('无法获取网络状态'));
  };

  useEffect(refreshNetwork, []);

  const playAnimation = () => {
    rotate.setValue(0);
    Animated.sequence([
      Animated.spring(scale, {toValue: 1.16, useNativeDriver: true}),
      Animated.parallel([
        Animated.spring(scale, {toValue: 1, useNativeDriver: true}),
        Animated.timing(rotate, {toValue: 1, duration: 500, useNativeDriver: true}),
      ]),
    ]).start();
  };

  const showToast = () => {
    Vibration.vibrate(35);
    if (Platform.OS === 'android') ToastAndroid.show('这是 Android 原生 Toast', ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent={false} />
      <TopBar title="RN 能力实验室" onBack={navigation.goBack} />
      <View style={styles.content}>
        <View style={[styles.hero, {backgroundColor: colors.primaryDark}]}>
          <Animated.View style={[styles.atom, {borderColor: colors.accent, transform: [{scale}, {rotate: rotate.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']})}]}]}>
            <AppIcon name="react" size={42} color={colors.accent} />
          </Animated.View>
          <View style={styles.heroCopy}><Text style={styles.heroTitle}>原生体验，前端效率</Text><Text style={styles.heroText}>点击下方卡片，现场感受 RN 与 Android 的交互能力。</Text></View>
        </View>

        <View style={styles.grid}>
          <Pressable onPress={playAnimation} style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <AppIcon name="animation-play-outline" size={28} color={colors.primary} /><Text style={[styles.cardTitle, {color: colors.text}]}>原生动画</Text><Text style={[styles.cardHint, {color: colors.textMuted}]}>缩放 + 旋转</Text>
          </Pressable>
          <Pressable onPress={showToast} style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <AppIcon name="message-badge-outline" size={28} color={colors.warning} /><Text style={[styles.cardTitle, {color: colors.text}]}>Toast / 震动</Text><Text style={[styles.cardHint, {color: colors.textMuted}]}>Android 系统反馈</Text>
          </Pressable>
          <Pressable onPress={() => {setPressCount(value => value + 1);}} style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Text style={[styles.icon, {color: colors.success}]}>{pressCount}</Text><Text style={[styles.cardTitle, {color: colors.text}]}>状态更新</Text><Text style={[styles.cardHint, {color: colors.textMuted}]}>点击计数 +1</Text>
          </Pressable>
          <Pressable onPress={refreshNetwork} style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <AppIcon name="wifi" size={28} color={colors.accent} /><Text style={[styles.cardTitle, {color: colors.text}]}>网络检测</Text><Text style={[styles.cardHint, {color: colors.textMuted}]}>{network}</Text>
          </Pressable>
        </View>

        <View style={[styles.device, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.deviceTitle, {color: colors.text}]}>当前设备</Text>
          <View style={styles.deviceRow}><Text style={[styles.deviceLabel, {color: colors.textMuted}]}>系统</Text><Text style={[styles.deviceValue, {color: colors.text}]}>Android {Platform.Version}</Text></View>
          <View style={styles.deviceRow}><Text style={[styles.deviceLabel, {color: colors.textMuted}]}>设备</Text><Text style={[styles.deviceValue, {color: colors.text}]}>{(Platform.constants as {Model?: string}).Model ?? 'Android Device'}</Text></View>
          <View style={styles.deviceRow}><Text style={[styles.deviceLabel, {color: colors.textMuted}]}>屏幕</Text><Text style={[styles.deviceValue, {color: colors.text}]}>{Math.round(Dimensions.get('window').width)} × {Math.round(Dimensions.get('window').height)}</Text></View>
          <View style={styles.deviceRow}><Text style={[styles.deviceLabel, {color: colors.textMuted}]}>网络</Text><Text style={[styles.deviceValue, {color: colors.text}]}>{network}</Text></View>
        </View>

        <AppButton label="调用系统分享" onPress={() => Share.share({message: '我正在使用星瀚学堂学习 React Native！'})} style={styles.share} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {padding: 16},
  hero: {borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center'},
  atom: {width: 76, height: 76, borderRadius: 38, borderWidth: 3, alignItems: 'center', justifyContent: 'center'},
  heroCopy: {flex: 1, marginLeft: 15},
  heroTitle: {color: '#FFFFFF', fontSize: 18, fontWeight: '900'},
  heroText: {color: 'rgba(255,255,255,0.68)', fontSize: 11, lineHeight: 17, marginTop: 6},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginTop: 16},
  card: {width: '48.3%', minHeight: 126, borderWidth: 1, borderRadius: 16, padding: 14},
  icon: {fontSize: 27, fontWeight: '900'},
  cardTitle: {fontSize: 14, fontWeight: '800', marginTop: 12},
  cardHint: {fontSize: 9, lineHeight: 14, marginTop: 4},
  device: {borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 16},
  deviceTitle: {fontSize: 15, fontWeight: '900', marginBottom: 8},
  deviceRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6},
  deviceLabel: {fontSize: 11},
  deviceValue: {fontSize: 11, fontWeight: '700', maxWidth: '70%'},
  share: {marginTop: 14},
});
