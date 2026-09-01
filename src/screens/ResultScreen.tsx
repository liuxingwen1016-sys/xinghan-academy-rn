import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../components/AppButton';
import {useApp} from '../context/AppContext';
import {getCourse} from '../data/courses';
import {getCourseQuiz} from '../data/quizzes';
import {RootStackParamList} from '../types';

export function ResultScreen({navigation, route}: NativeStackScreenProps<RootStackParamList, 'Result'>) {
  const {colors} = useApp();
  const {score, total, courseId} = route.params;
  const course = getCourse(courseId);
  const quiz = getCourseQuiz(courseId);
  const ratio = score / total;
  const passed = ratio >= 0.6;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, {backgroundColor: passed ? colors.primaryDark : '#55341A'}]}>
          <View style={[styles.scoreRing, {borderColor: passed ? colors.accent : colors.warning}]}>
            <Text style={styles.score}>{score}</Text><Text style={styles.total}>/ {total}</Text>
          </View>
          <Text style={styles.title}>{passed ? '恭喜完成课程测验！' : '继续加油，再试一次'}</Text>
          <Text style={styles.subtitle}>{course.title}</Text>
        </View>

        <View style={[styles.summary, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: colors.success}]}>{score}</Text><Text style={[styles.summaryLabel, {color: colors.textMuted}]}>答对</Text></View>
          <View style={[styles.divider, {backgroundColor: colors.border}]} />
          <View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: colors.warning}]}>{total - score}</Text><Text style={[styles.summaryLabel, {color: colors.textMuted}]}>待巩固</Text></View>
          <View style={[styles.divider, {backgroundColor: colors.border}]} />
          <View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: colors.primary}]}>{Math.round(ratio * 100)}%</Text><Text style={[styles.summaryLabel, {color: colors.textMuted}]}>正确率</Text></View>
        </View>

        <Text style={[styles.reviewTitle, {color: colors.text}]}>知识点解析</Text>
        {quiz.map((item, index) => (
          <View key={item.id} style={[styles.review, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.index, {backgroundColor: colors.surfaceMuted}]}><Text style={[styles.indexText, {color: colors.primary}]}>{index + 1}</Text></View>
            <View style={styles.reviewCopy}>
              <Text style={[styles.question, {color: colors.text}]}>{item.prompt}</Text>
              <Text style={[styles.answer, {color: colors.success}]}>正确答案：{String.fromCharCode(65 + item.answer)}. {item.options[item.answer]}</Text>
              <Text style={[styles.explanation, {color: colors.textMuted}]}>{item.explanation}</Text>
            </View>
          </View>
        ))}

        <AppButton label="返回课程详情" onPress={() => navigation.popToTop()} style={styles.button} />
        <AppButton label="重新测验" variant="secondary" onPress={() => navigation.replace('Quiz', {courseId})} style={styles.secondaryButton} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {paddingBottom: 28},
  hero: {paddingTop: 35, paddingBottom: 32, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30},
  scoreRing: {width: 112, height: 112, borderRadius: 56, borderWidth: 9, alignItems: 'baseline', justifyContent: 'center', flexDirection: 'row'},
  score: {color: '#FFFFFF', fontSize: 43, fontWeight: '900'},
  total: {color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '700'},
  title: {color: '#FFFFFF', fontSize: 21, fontWeight: '900', marginTop: 18},
  subtitle: {color: 'rgba(255,255,255,0.66)', fontSize: 12, marginTop: 6},
  summary: {margin: 16, marginTop: -15, borderWidth: 1, borderRadius: 16, flexDirection: 'row', paddingVertical: 16},
  summaryItem: {flex: 1, alignItems: 'center'},
  summaryValue: {fontSize: 22, fontWeight: '900'},
  summaryLabel: {fontSize: 10, marginTop: 3},
  divider: {width: 1},
  reviewTitle: {fontSize: 18, fontWeight: '900', marginHorizontal: 16, marginTop: 8, marginBottom: 12},
  review: {marginHorizontal: 16, marginBottom: 10, borderWidth: 1, borderRadius: 15, padding: 13, flexDirection: 'row'},
  index: {width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center'},
  indexText: {fontSize: 12, fontWeight: '900'},
  reviewCopy: {flex: 1, marginLeft: 10},
  question: {fontSize: 12, fontWeight: '800', lineHeight: 18},
  answer: {fontSize: 10, fontWeight: '700', marginTop: 7},
  explanation: {fontSize: 10, lineHeight: 16, marginTop: 5},
  button: {marginHorizontal: 16, marginTop: 10},
  secondaryButton: {marginHorizontal: 16, marginTop: 10},
});
