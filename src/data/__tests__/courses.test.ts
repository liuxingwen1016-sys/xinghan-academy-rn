import {courses, getAllLessons, getCourse, onlineDemoVideoUrl, rnQuiz} from '../courses';

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

  it('提供可评分的五道本地测验题', () => {
    expect(rnQuiz).toHaveLength(5);
    rnQuiz.forEach(question => {
      expect(question.options).toHaveLength(4);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.options.length);
      expect(question.explanation.length).toBeGreaterThan(5);
    });
  });

  it('在线视频地址使用 HTTPS', () => {
    expect(onlineDemoVideoUrl.startsWith('https://')).toBe(true);
  });
});
