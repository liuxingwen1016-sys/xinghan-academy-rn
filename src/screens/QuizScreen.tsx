import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../components/AppButton';
import {AppIcon} from '../components/AppIcon';
import {ProgressBar} from '../components/ProgressBar';
import {TopBar} from '../components/TopBar';
import {useApp} from '../context/AppContext';
import {getCourseQuiz} from '../data/quizzes';
import {RootStackParamList} from '../types';

const optionLabels = ['A', 'B', 'C', 'D'];

export function QuizScreen({navigation, route}: NativeStackScreenProps<RootStackParamList, 'Quiz'>) {
  const {colors, saveQuizScore} = useApp();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState(false);
  const quiz = getCourseQuiz(route.params.courseId);
  const question = quiz[index];
  const selected = answers[question.id];
  const isLast = index === quiz.length - 1;

  const next = () => {
    if (selected === undefined) {
      setError(true);
      return;
    }
    setError(false);
    if (isLast) {
      const score = quiz.reduce((total, item) => total + (answers[item.id] === item.answer ? 1 : 0), 0);
      saveQuizScore(route.params.courseId, score);
      navigation.replace('Result', {courseId: route.params.courseId, score, total: quiz.length});
    } else setIndex(current => current + 1);
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.surface}]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent={false} />
      <TopBar title="课程测验" onBack={navigation.goBack} />
      <View style={[styles.content, {backgroundColor: colors.surface}]}>
        <Text style={[styles.progressCount, {color: colors.text}]}>{index + 1} / {quiz.length}</Text>
        <ProgressBar value={((index + 1) / quiz.length) * 100} height={5} />
        <View style={[styles.typeBadge, {backgroundColor: `${colors.primary}12`}]}><Text style={[styles.typeText, {color: colors.primary}]}>单选题</Text></View>
        <Text style={[styles.question, {color: colors.text}]}>{question.prompt}</Text>
        <View style={styles.options}>
          {question.options.map((option, optionIndex) => {
            const active = selected === optionIndex;
            return <Pressable
              key={option}
              onPress={() => {setAnswers(current => ({...current, [question.id]: optionIndex})); setError(false);}}
              style={({pressed}) => [styles.option, {backgroundColor: active ? `${colors.primary}08` : colors.surface, borderColor: active ? colors.primary : colors.border, opacity: pressed ? 0.75 : 1}]}>
              <Text style={[styles.optionLabel, {color: colors.textMuted}]}>{optionLabels[optionIndex]}</Text>
              <Text style={[styles.optionText, {color: colors.text}]}>{option}</Text>
              <AppIcon name={active ? 'check-circle' : 'circle-outline'} size={19} color={active ? colors.primary : colors.border} />
            </Pressable>;
          })}
        </View>
        {error ? <Text style={[styles.error, {color: '#E24A4A'}]}>请选择一个答案后继续</Text> : null}
      </View>
      <View style={[styles.footer, {backgroundColor: colors.surface, borderTopColor: colors.border}]}>
        <View style={styles.footerRow}>
          {index > 0 ? <AppButton label="上一题" variant="secondary" onPress={() => {setIndex(current => current - 1); setError(false);}} style={styles.previous} /> : null}
          <AppButton label={isLast ? '提交测验' : '下一题'} onPress={next} style={styles.next} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {flex: 1, paddingHorizontal: 16, paddingTop: 17},
  progressCount: {fontSize: 15, fontWeight: '900', marginBottom: 9},
  typeBadge: {alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4, marginTop: 20},
  typeText: {fontSize: 8, fontWeight: '800'},
  question: {fontSize: 14, lineHeight: 22, fontWeight: '700', marginTop: 13},
  options: {gap: 11, marginTop: 22},
  option: {height: 57, borderWidth: 1.2, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13},
  optionLabel: {width: 24, fontSize: 10},
  optionText: {flex: 1, fontSize: 11, marginLeft: 4},
  error: {fontSize: 9, fontWeight: '700', marginTop: 11},
  footer: {paddingHorizontal: 12, paddingVertical: 9, borderTopWidth: StyleSheet.hairlineWidth},
  footerRow: {flexDirection: 'row', gap: 9},
  previous: {flex: 0.42},
  next: {flex: 1},
});
