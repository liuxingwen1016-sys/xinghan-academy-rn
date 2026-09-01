import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useApp} from '../context/AppContext';
import {AppIcon} from './AppIcon';

type Props = {
  title: string;
  onBack?: () => void;
  action?: string;
  actionIcon?: React.ComponentProps<typeof AppIcon>['name'];
  secondaryActionIcon?: React.ComponentProps<typeof AppIcon>['name'];
  onAction?: () => void;
  onSecondaryAction?: () => void;
  dark?: boolean;
};

export function TopBar({title, onBack, action, actionIcon, secondaryActionIcon, onAction, onSecondaryAction, dark = false}: Props) {
  const {colors} = useApp();
  const foreground = dark ? '#FFFFFF' : colors.text;
  return (
    <View style={[styles.bar, {backgroundColor: dark ? colors.primaryDark : colors.surface}]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable accessibilityLabel="返回" onPress={onBack} hitSlop={12} style={styles.iconButton}>
            <AppIcon name="arrow-left" size={23} color={foreground} />
          </Pressable>
        ) : null}
      </View>
      <Text numberOfLines={1} style={[styles.title, {color: foreground}]}>{title}</Text>
      <View style={[styles.side, styles.right, (actionIcon || secondaryActionIcon) && styles.actions]}>
        {actionIcon ? <Pressable onPress={onAction} hitSlop={10} style={styles.smallIcon}><AppIcon name={actionIcon} size={21} color={foreground} /></Pressable> : null}
        {secondaryActionIcon ? <Pressable onPress={onSecondaryAction} hitSlop={10} style={styles.smallIcon}><AppIcon name={secondaryActionIcon} size={21} color={foreground} /></Pressable> : null}
        {!actionIcon && action ? <Pressable onPress={onAction} hitSlop={10}><Text style={[styles.action, {color: dark ? '#FFFFFF' : colors.primary}]}>{action}</Text></Pressable> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8},
  side: {width: 76, alignItems: 'flex-start'},
  right: {alignItems: 'flex-end'},
  actions: {flexDirection: 'row', justifyContent: 'flex-end'},
  iconButton: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  smallIcon: {width: 34, height: 40, alignItems: 'center', justifyContent: 'center'},
  title: {flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800'},
  action: {fontSize: 13, fontWeight: '700'},
});
