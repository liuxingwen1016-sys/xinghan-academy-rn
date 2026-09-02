import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BottomNav} from '../components/BottomNav';
import {useApp} from '../context/AppContext';
import {MainTab, RootStackParamList} from '../types';
import {CoursesScreen} from './CoursesScreen';
import {HomeScreen} from './HomeScreen';
import {LearningHubScreen} from './LearningHubScreen';
import {ProfileScreen} from './ProfileScreen';
import {QuizRecordsScreen} from './QuizRecordsScreen';

export function MainShell({navigation}: NativeStackScreenProps<RootStackParamList, 'Main'>) {
  const {colors} = useApp();
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  const changeTab = (tab: MainTab) => setActiveTab(tab);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.surface}} edges={['bottom']}>
      <View style={{flex: 1}}>
        {activeTab === 'home' ? <HomeScreen navigation={navigation} setTab={setActiveTab} /> : null}
        {activeTab === 'courses' ? <CoursesScreen navigation={navigation} /> : null}
        {activeTab === 'learning' ? <LearningHubScreen navigation={navigation} /> : null}
        {activeTab === 'quiz' ? <QuizRecordsScreen navigation={navigation} /> : null}
        {activeTab === 'profile' ? <ProfileScreen navigation={navigation} /> : null}
      </View>
      <BottomNav active={activeTab} onChange={changeTab} />
    </SafeAreaView>
  );
}
