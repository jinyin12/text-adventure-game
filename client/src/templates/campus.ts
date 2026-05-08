import type { GameTemplate } from '../types'

export const campusTemplate: GameTemplate = {
  key: 'campus',
  name: '校园时光',
  icon: '🎓',
  desc: '从踏入大学校门的那一刻起，四年时光在你面前展开。学业、社团、恋爱、考研...每一个选择都通向不同的人生。',
  worldSetting: `2025年9月，你来到了东海大学，一所普通的一本院校。校园里梧桐树成荫，湖边的图书馆是网红打卡地。

东海大学位于沿海城市，经济发达但生活成本也高。学校以工科见长，你的专业是计算机科学与技术。

你住在四人寝室，室友来自天南海北。学校有上百个社团，学生会势力强大。考研率30%，就业率85%。

大学四年，你将面临：选课的博弈、期末的焦虑、社团的活动、实习的竞争、考研还是就业的抉择、以及那些可能改变一生的偶遇。`,
  stages: ['大一上学期', '大一下学期', '大二上学期', '大二下学期', '大三上学期', '大三下学期', '大四上学期', '大四下学期'],
  attributes: [
    { name: '智力', key: 'zhili', icon: '🧠', initial: 50, min: 0, max: 100 },
    { name: '社交', key: 'shejiao', icon: '💬', initial: 40, min: 0, max: 100 },
    { name: '体能', key: 'tineng', icon: '💪', initial: 60, min: 0, max: 100 },
    { name: '魅力', key: 'meili', icon: '❤️', initial: 45, min: 0, max: 100 },
    { name: '学分', key: 'xuefen', icon: '📚', initial: 0, min: 0, max: 200 },
    { name: '心态', key: 'xintai', icon: '😊', initial: 80, min: 0, max: 100 },
  ],
}
