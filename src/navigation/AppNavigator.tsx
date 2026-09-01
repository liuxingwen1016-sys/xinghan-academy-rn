import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useApp} from '../context/AppContext';
import {RootStackParamList} from '../types';
import {CourseDetailScreen} from '../screens/CourseDetailScreen';
import {LabScreen} from '../screens/LabScreen';
import {LessonScreen} from '../screens/LessonScreen';
import {MainShell} from '../screens/MainShell';
import {QuizScreen} from '../screens/QuizScreen';
import {ResultScreen} from '../screens/ResultScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {colors, hydrated} = useApp();

  if (!hydrated) {
    return (
      <View style={[styles.loading, {backgroundColor: colors.primaryDark}]}>
        <View style={[styles.logo, {borderColor: colors.accent}]}><Text style={styles.logoText}>星</Text></View>
        <Text style={styles.title}>星瀚学堂</Text>
        <Text style={styles.subtitle}>React Native 培训学习平台</Text>
        <ActivityIndicator color={colors.accent} style={styles.indicator} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="Main" component={MainShell} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Result" component={ResultScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="Lab" component={LabScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  logo: {width: 92, height: 92, borderWidth: 4, borderRadius: 28, alignItems: 'center', justifyContent: 'center'},
  logoText: {color: '#FFFFFF', fontSize: 40, fontWeight: '900'},
  title: {color: '#FFFFFF', fontSize: 25, fontWeight: '900', marginTop: 18},
  subtitle: {color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 6},
  indicator: {marginTop: 22},
});
