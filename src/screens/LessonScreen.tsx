import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Video, {VideoRef} from 'react-native-video';
import {AppButton} from '../components/AppButton';
import {AppIcon} from '../components/AppIcon';
import {ProgressBar} from '../components/ProgressBar';
import {TopBar} from '../components/TopBar';
import {useApp} from '../context/AppContext';
import {getAllLessons, getCourse} from '../data/courses';
import {RootStackParamList} from '../types';

export function LessonScreen({navigation, route}: NativeStackScreenProps<RootStackParamList, 'Lesson'>) {
  const {colors, completeLesson, isLessonComplete, getCourseProgress, recordLessonVisit} = useApp();
  const course = getCourse(route.params.courseId);
  const lessons = getAllLessons(course);
  const currentIndex = Math.max(0, lessons.findIndex(item => item.id === route.params.lessonId));
  const lesson = lessons[currentIndex] ?? lessons[0];
  const nextLesson = lessons[currentIndex + 1];
  const currentChapter = course.chapters.find(chapter => chapter.lessons.some(item => item.id === lesson.id));
  const localVideoSource = lesson.videoSource as unknown as React.ComponentProps<typeof Video>['source'];
  const [tab, setTab] = useState<'catalog' | 'notes'>('catalog');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [videoPosition, setVideoPosition] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<VideoRef>(null);
  const noteKey = useMemo(() => `@xinghan-academy/note/${lesson.id}`, [lesson.id]);

  useEffect(() => {
    setPlaying(false);
    setVideoLoading(false);
    setVideoError(false);
    setVideoPosition(0);
    setVideoDuration(0);
    setVideoEnded(false);
    recordLessonVisit(course.id, lesson.id);
    AsyncStorage.getItem(noteKey).then(value => setNote(value ?? '')).catch(() => setNote(''));
  }, [noteKey]);

  const startVideo = () => {
    if (videoEnded) {
      videoRef.current?.seek(0);
      setVideoPosition(0);
      setVideoEnded(false);
    }
    setVideoError(false);
    setVideoLoading(true);
    setPlaying(true);
  };

  const retryVideo = () => {
    setVideoKey(value => value + 1);
    startVideo();
  };

  const formatVideoTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const wholeSeconds = Math.floor(seconds);
    return `${String(Math.floor(wholeSeconds / 60)).padStart(2, '0')}:${String(wholeSeconds % 60).padStart(2, '0')}`;
  };

  const saveNote = () => {
    AsyncStorage.setItem(noteKey, note).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }).catch(() => undefined);
  };

  const completeAndContinue = () => {
    completeLesson(lesson.id);
    if (nextLesson) navigation.replace('Lesson', {courseId: course.id, lessonId: nextLesson.id});
    else navigation.replace('Quiz', {courseId: course.id});
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.surface}]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent={false} />
      <TopBar title="学习" onBack={navigation.goBack} actionIcon="download-outline" secondaryActionIcon="dots-vertical" onAction={() => Alert.alert('离线课程', '本课的视频、图文摘要和测验均已内置，可直接离线观看。')} onSecondaryAction={() => Alert.alert('课时信息', `第 ${currentIndex + 1} / ${lessons.length} 课时`)} />
      <ScrollView style={[styles.scroll, {backgroundColor: colors.background}]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {lesson.type === 'video' ? <View style={styles.video} testID="lesson-video">
          <Video
            key={videoKey}
            ref={videoRef}
            source={localVideoSource}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            paused={!playing}
            controls={playing}
            playInBackground={false}
            preventsDisplaySleepDuringVideoPlayback
            progressUpdateInterval={500}
            controlsStyles={{
              hideNavigationBarOnFullScreenMode: true,
              hideNotificationBarOnFullScreenMode: true,
            }}
            onLoadStart={() => setVideoLoading(true)}
            onLoad={({duration, currentTime}) => {
              setVideoDuration(duration);
              setVideoPosition(currentTime);
              setVideoLoading(false);
            }}
            onProgress={({currentTime}) => setVideoPosition(currentTime)}
            onEnd={() => {
              completeLesson(lesson.id);
              setPlaying(false);
              setVideoEnded(true);
              setVideoPosition(videoDuration);
            }}
            onError={() => {
              setPlaying(false);
              setVideoLoading(false);
              setVideoError(true);
            }}
          />

          {!playing && !videoError ? <View style={styles.videoPoster} pointerEvents="none">
            <View style={styles.editorTop}><View style={styles.editorDot} /><View style={[styles.editorDot, {backgroundColor: '#F8C14F'}]} /><View style={[styles.editorDot, {backgroundColor: '#47C778'}]} /></View>
            <View style={styles.editorBody}>
              <View style={styles.codePane}>{[82, 58, 73, 45, 66, 52].map((width, index) => <View key={index} style={[styles.codeLine, {width: `${width}%`, backgroundColor: index % 2 ? '#16A7C5' : '#3178D8'}]} />)}</View>
              <View style={styles.phone}><View style={styles.phoneNotch} /><View style={styles.phoneCard} /><View style={styles.phoneCard} /><View style={[styles.phoneButton, {backgroundColor: colors.primary}]} /></View>
            </View>
            <View style={styles.controls}><AppIcon name={videoEnded ? 'replay' : 'play'} size={15} color="#FFFFFF" /><View style={styles.videoTrack}><View style={[styles.videoFill, {backgroundColor: colors.primary, width: videoEnded ? '100%' : '0%'}]} />{videoEnded ? <View style={[styles.videoThumb, {left: '98%'}]} /> : null}</View><Text style={styles.videoTime}>{videoEnded && videoDuration ? formatVideoTime(videoDuration) : '00:00'} / {videoDuration ? formatVideoTime(videoDuration) : lesson.duration}</Text><AppIcon name="fullscreen" size={16} color="#FFFFFF" /></View>
          </View> : null}

          {!playing && !videoError ? <Pressable accessibilityRole="button" accessibilityLabel={videoEnded ? '重新播放课程视频' : '播放课程视频'} style={styles.playButton} onPress={startVideo}><AppIcon name={videoEnded ? 'replay' : 'play'} size={26} color="#FFFFFF" /></Pressable> : null}
          {playing && videoLoading ? <View style={styles.buffering} pointerEvents="none"><ActivityIndicator color="#FFFFFF" size="large" /><Text style={styles.videoMessageText}>视频加载中…</Text></View> : null}
          {videoError ? <View style={styles.videoMessage}><AppIcon name="alert-circle-outline" size={32} color="#FFFFFF" /><Text style={styles.videoMessageTitle}>视频加载失败</Text><Pressable accessibilityRole="button" accessibilityLabel="重试播放课程视频" onPress={retryVideo} style={[styles.retryButton, {backgroundColor: colors.primary}]}><AppIcon name="reload" size={15} color="#FFFFFF" /><Text style={styles.retryText}>重新播放</Text></Pressable></View> : null}
        </View> : <View style={[styles.articleHero, {backgroundColor: course.color}]}><AppIcon name="file-document-outline" size={44} color={course.accent} /><Text style={styles.articleLabel}>离线图文课时</Text></View>}

        <View style={[styles.heading, {backgroundColor: colors.surface}]}>
          <Text style={[styles.chapter, {color: colors.text}]}>{currentChapter?.title ?? course.title}</Text>
          <Text style={[styles.title, {color: colors.text}]}>{lesson.title}</Text>
          <View style={styles.metaRow}><Text style={[styles.meta, {color: colors.textMuted}]}>{lesson.type === 'video' ? `播放 ${formatVideoTime(videoPosition)} / ${videoDuration ? formatVideoTime(videoDuration) : lesson.duration}` : `本地图文 · ${lesson.duration}`}</Text><Text style={[styles.done, {color: isLessonComplete(lesson.id) ? colors.success : colors.textMuted}]}>{isLessonComplete(lesson.id) ? '已完成' : '未完成'}</Text></View>
          <View style={styles.courseProgress}><Text style={[styles.courseProgressText, {color: colors.textMuted}]}>课程进度</Text><Text style={[styles.courseProgressText, {color: colors.primary}]}>{getCourseProgress(course.id)}%</Text></View>
          <ProgressBar value={getCourseProgress(course.id)} height={5} />
        </View>

        <View style={[styles.tabs, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
          {[{id: 'catalog', label: '目录'}, {id: 'notes', label: '笔记'}].map(item => {
            const active = tab === item.id;
            return <Pressable key={item.id} onPress={() => setTab(item.id as typeof tab)} style={[styles.tab, active && {borderBottomColor: colors.primary}]}><Text style={[styles.tabText, {color: active ? colors.primary : colors.text}]}>{item.label}</Text></Pressable>;
          })}
        </View>

        {tab === 'catalog' ? <View style={[styles.catalog, {backgroundColor: colors.surface}]}>
          {course.chapters.map(chapter => <View key={chapter.id}>
            <View style={styles.chapterHeader}><Text style={[styles.chapterHeaderText, {color: colors.text}]}>{chapter.title}</Text><AppIcon name="chevron-up" size={17} color={colors.textMuted} /></View>
            {chapter.lessons.map(item => {
              const itemIndex = lessons.findIndex(entry => entry.id === item.id);
              const active = item.id === lesson.id;
              const complete = isLessonComplete(item.id);
              return <Pressable key={item.id} onPress={() => navigation.replace('Lesson', {courseId: course.id, lessonId: item.id})} style={styles.catalogRow}>
                <View style={styles.timeline}><AppIcon name={active ? 'play-circle' : complete ? 'check-circle-outline' : 'circle-outline'} size={15} color={active ? colors.primary : colors.textMuted} />{itemIndex < lessons.length - 1 ? <View style={[styles.timelineLine, {backgroundColor: colors.border}]} /> : null}</View>
                <Text numberOfLines={1} style={[styles.catalogTitle, {color: active ? colors.primary : colors.text}]}>{item.title}</Text>
                <Text style={[styles.catalogMeta, {color: colors.textMuted}]}>{item.duration}</Text>
                {!complete && !active ? <AppIcon name="lock-outline" size={13} color={colors.textMuted} /> : null}
              </Pressable>;
            })}
          </View>)}
          <View style={[styles.offlineArticle, {backgroundColor: colors.surfaceMuted}]}><View style={styles.offlineTitleRow}><AppIcon name="file-document-check-outline" size={18} color={colors.success} /><Text style={[styles.offlineTitle, {color: colors.text}]}>本节离线图文摘要</Text></View>{lesson.content.slice(0, 2).map(text => <Text key={text} style={[styles.offlineText, {color: colors.textMuted}]}>• {text}</Text>)}</View>
        </View> : null}

        {tab === 'notes' ? <View style={[styles.notes, {backgroundColor: colors.surface}]}><Text style={[styles.notesTitle, {color: colors.text}]}>本课笔记</Text><TextInput value={note} onChangeText={setNote} multiline placeholder="记录关键知识点、问题或行动项……" placeholderTextColor={colors.textMuted} textAlignVertical="top" style={[styles.noteInput, {backgroundColor: colors.background, borderColor: colors.border, color: colors.text}]} /><AppButton label={saved ? '已保存' : '保存笔记'} onPress={saveNote} variant={saved ? 'secondary' : 'primary'} /></View> : null}
      </ScrollView>
      <View style={[styles.footer, {backgroundColor: colors.surface, borderTopColor: colors.border}]}><AppButton label={nextLesson ? '完成并学习下一课' : '完成课程并开始测验'} onPress={completeAndContinue} /></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  scroll: {flex: 1},
  content: {paddingBottom: 70},
  video: {height: 184, backgroundColor: '#08101D', overflow: 'hidden'},
  videoPoster: {...StyleSheet.absoluteFillObject, backgroundColor: '#08101D'},
  editorTop: {height: 20, backgroundColor: '#121B29', flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 10},
  editorDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: '#EF695E'},
  editorBody: {position: 'absolute', left: 0, right: 0, top: 20, bottom: 29, flexDirection: 'row'},
  codePane: {flex: 1, padding: 15, gap: 9},
  codeLine: {height: 4, borderRadius: 2, opacity: 0.8},
  phone: {width: 62, height: 106, borderRadius: 10, borderWidth: 3, borderColor: '#E9EEF5', backgroundColor: '#FFFFFF', marginTop: 9, marginRight: 24, padding: 7},
  phoneNotch: {width: 20, height: 3, borderRadius: 2, backgroundColor: '#17243A', alignSelf: 'center', marginBottom: 8},
  phoneCard: {height: 21, borderRadius: 4, backgroundColor: '#EAF0F7', marginBottom: 6},
  phoneButton: {height: 10, borderRadius: 3, marginTop: 2},
  playButton: {position: 'absolute', left: '50%', top: 69, width: 44, height: 44, marginLeft: -22, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.52)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center'},
  controls: {position: 'absolute', left: 9, right: 9, bottom: 5, height: 21, flexDirection: 'row', alignItems: 'center', gap: 7},
  videoTrack: {flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.38)'},
  videoFill: {width: '45%', height: 3, borderRadius: 2},
  videoThumb: {position: 'absolute', left: '44%', top: -2, width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFFFFF'},
  videoTime: {fontSize: 7, color: '#FFFFFF'},
  videoMessage: {...StyleSheet.absoluteFillObject, backgroundColor: '#08101D', alignItems: 'center', justifyContent: 'center', gap: 7},
  videoMessageTitle: {fontSize: 12, lineHeight: 17, fontWeight: '800', color: '#FFFFFF'},
  videoMessageText: {fontSize: 9, lineHeight: 14, color: 'rgba(255,255,255,0.72)'},
  buffering: {position: 'absolute', alignSelf: 'center', top: 61, minWidth: 106, height: 66, borderRadius: 9, backgroundColor: 'rgba(0,0,0,0.64)', alignItems: 'center', justifyContent: 'center', gap: 4},
  retryButton: {height: 30, borderRadius: 15, paddingHorizontal: 13, marginTop: 3, flexDirection: 'row', alignItems: 'center', gap: 5},
  retryText: {fontSize: 10, fontWeight: '800', color: '#FFFFFF'},
  articleHero: {height: 145, alignItems: 'center', justifyContent: 'center'},
  articleLabel: {color: 'rgba(255,255,255,0.78)', fontSize: 10, marginTop: 6},
  heading: {paddingHorizontal: 13, paddingTop: 12, paddingBottom: 11},
  chapter: {fontSize: 10, fontWeight: '800'},
  title: {fontSize: 16, lineHeight: 22, fontWeight: '900', marginTop: 7},
  metaRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 7},
  meta: {fontSize: 8},
  done: {fontSize: 8, fontWeight: '700'},
  courseProgress: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 5},
  courseProgressText: {fontSize: 8, fontWeight: '700'},
  tabs: {height: 44, flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12},
  tab: {flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent'},
  tabText: {fontSize: 11, fontWeight: '800'},
  catalog: {paddingHorizontal: 13, paddingBottom: 14},
  chapterHeader: {height: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  chapterHeaderText: {fontSize: 10, fontWeight: '800'},
  catalogRow: {height: 38, flexDirection: 'row', alignItems: 'center'},
  timeline: {width: 25, height: 38, alignItems: 'center', paddingTop: 11},
  timelineLine: {position: 'absolute', width: 1, height: 23, top: 25},
  catalogTitle: {flex: 1, fontSize: 9},
  catalogMeta: {fontSize: 8, marginRight: 5},
  offlineArticle: {borderRadius: 8, padding: 10, marginTop: 10},
  offlineTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  offlineTitle: {fontSize: 10, fontWeight: '800'},
  offlineText: {fontSize: 8, lineHeight: 14, marginTop: 5},
  notes: {padding: 14},
  notesTitle: {fontSize: 13, fontWeight: '800', marginBottom: 9},
  noteInput: {minHeight: 170, borderWidth: 1, borderRadius: 8, padding: 11, fontSize: 11, lineHeight: 18, marginBottom: 10},
  footer: {position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth},
});
