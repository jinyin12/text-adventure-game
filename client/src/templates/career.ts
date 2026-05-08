import type { GameTemplate } from '../types'

export const careerTemplate: GameTemplate = {
  key: 'career',
  name: '职场风云',
  icon: '💼',
  desc: '大学毕业进入职场，从实习生开始在大公司摸爬滚打。你会成为职场精英还是被内卷吞噬？',
  worldSetting: `2025年，经济下行周期，就业市场空前内卷。你从一所普通本科毕业，进入了一家名为"星辰科技"的中型互联网公司。

公司内部部门林立、派系分明。技术部、产品部、运营部各怀心思。老板张总白手起家，性格强势但赏罚分明。

你需要在大厂裁员的阴影下求生存，在同事关系中找平衡，在无数个加班深夜中寻找自己的方向。

职场路径：实习生 → 正式员工 → 项目组长 → 部门经理 → 总监 → VP`,
  stages: ['入职培训', '试用期', '正式员工', '项目组长', '部门经理', '总监', 'VP', '合伙人'],
  attributes: [
    { name: '能力', key: 'nengli', icon: '🧠', initial: 40, min: 0, max: 100 },
    { name: '人脉', key: 'renmai', icon: '🤝', initial: 20, min: 0, max: 100 },
    { name: '声望', key: 'shengwang', icon: '🏆', initial: 10, min: 0, max: 100 },
    { name: '体力', key: 'tili', icon: '💪', initial: 80, min: 0, max: 100 },
    { name: '财富', key: 'caifu', icon: '💰', initial: 30, min: 0, max: 9999 },
    { name: '心态', key: 'xintai', icon: '😊', initial: 70, min: 0, max: 100 },
  ],
}
