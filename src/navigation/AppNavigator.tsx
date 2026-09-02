import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useApp} from '../context/AppContext';
import {RootStackParamList} from '../types';
import {CourseDetailScreen} from '../screens/CourseDetailScreen';
import {LabScreen} from '../screens/LabScreen';
import {LessonScreen} from '../screens/LessonScreen';
import {MainShell} from '../screens/MainShell';
import {QuizScreen} from '../screens/QuizScreen';
import {ResultScreen} from '../screens/ResultScreen';
import {FavoritesScreen} from '../screens/FavoritesScreen';
import {StudyHistoryScreen} from '../screens/StudyHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {colors, hydrated} = useApp();

  if (!hydrated) {
    return (
      <View style={[styles.loading, {backgroundColor: colors.primaryDark}]}>
        <Image source={require('../../assets/rn-academy-icon-v2.png')} style={styles.logo} />
        <Text style={styles.title}>RN学堂</Text>
        <Text style={styles.subtitle}>React Native 课程训练平台</Text>
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
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="StudyHistory" component={StudyHistoryScreen} />
      <Stack.Screen name="Lab" component={LabScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  logo: {width: 104, height: 104, borderRadius: 28},
  title: {color: '#FFFFFF', fontSize: 25, fontWeight: '900', marginTop: 18},
  subtitle: {color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 6},
  indicator: {marginTop: 22},
});
