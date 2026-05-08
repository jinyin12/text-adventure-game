import type { GameTemplate } from '../types'

export const cultivationTemplate: GameTemplate = {
  key: 'cultivation',
  name: '修仙世界',
  icon: '🧙',
  desc: '灵气复苏时代，你被检测出灵根，踏入修仙之途。炼气、筑基、金丹...追求大道还是堕入魔道？',
  worldSetting: `这是一个灵气复苏的世界。2025年，全球各地突然出现"灵脉"，部分人类觉醒灵根，世界格局彻底改变。

旧的秩序崩塌，修仙宗门崛起，各国政府建立修真管理局试图维持平衡。散修、宗门、魔道三方势力明争暗斗。

你所在的华夏区是新灵气最浓郁的区域之一，天下第一宗门"太虚宗"坐落于此。修仙者通过修炼提升境界，获取灵石购买丹药法器。

修为体系：炼气期 → 筑基期 → 金丹期 → 元婴期 → 化神期 → 渡劫飞升`,
  stages: ['炼气初期', '炼气中期', '炼气后期', '筑基期', '金丹期', '元婴期', '化神期', '渡劫飞升'],
  attributes: [
    { name: '灵根', key: 'linggen', icon: '🌟', initial: 60, min: 0, max: 100 },
    { name: '修为', key: 'xiuwei', icon: '⚡', initial: 10, min: 0, max: 100 },
    { name: '体力', key: 'tili', icon: '💪', initial: 50, min: 0, max: 100 },
    { name: '神识', key: 'shenshi', icon: '👁️', initial: 30, min: 0, max: 100 },
    { name: '灵石', key: 'lingshi', icon: '💎', initial: 100, min: 0, max: 9999 },
    { name: '道心', key: 'daoxin', icon: '☯️', initial: 70, min: 0, max: 100 },
  ],
}
