import React from 'react';
import {ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import {useApp} from '../context/AppContext';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({label, onPress, variant = 'primary', loading, disabled, style}: Props) {
  const {colors} = useApp();
  const primary = variant === 'primary';
  const secondary = variant === 'secondary';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor: primary ? colors.primary : secondary ? colors.surfaceMuted : 'transparent',
          borderColor: secondary ? colors.border : 'transparent',
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={primary ? colors.white : colors.primary} />
      ) : (
        <Text style={[styles.label, {color: primary ? colors.white : colors.primary}]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  label: {fontSize: 14, fontWeight: '800'},
});
