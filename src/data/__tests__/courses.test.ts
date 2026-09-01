import {courses, getAllLessons, getCourse} from '../courses';
import {courseQuizzes, getCourseQuiz} from '../quizzes';

describe('课程资源', () => {
  it('提供完整的课程目录和主课程课时', () => {
    expect(courses).toHaveLength(6);
    expect(getAllLessons(getCourse('rn-101'))).toHaveLength(9);
  });

  it('课程与课时标识保持唯一', () => {
    const courseIds = courses.map(course => course.id);
    const lessonIds = courses.flatMap(course => getAllLessons(course).map(lesson => lesson.id));
    expect(new Set(courseIds).size).toBe(courseIds.length);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });

  it('每门课程提供五道独立且可评分的本地测验题', () => {
    expect(Object.keys(courseQuizzes).sort()).toEqual(courses.map(course => course.id).sort());
    const firstPrompts = new Set<string>();
    courses.forEach(course => {
      const quiz = getCourseQuiz(course.id);
      expect(quiz).toHaveLength(5);
      firstPrompts.add(quiz[0].prompt);
      quiz.forEach(question => {
        expect(question.id.startsWith(course.id.split('-')[0])).toBe(true);
        expect(question.options).toHaveLength(4);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
        expect(question.explanation.length).toBeGreaterThan(5);
      });
    });
    expect(firstPrompts.size).toBe(courses.length);
  });

  it('每个视频课时都绑定本地课程视频', () => {
    const videoLessons = courses.flatMap(course => getAllLessons(course)).filter(lesson => lesson.type === 'video');
    expect(videoLessons).toHaveLength(8);
    videoLessons.forEach(lesson => expect(lesson.videoSource).toBeDefined());
  });
});
