export type VariantType =
  | 'default' // 默认颜色（text-foreground、bg-background等）
  | 'red' // 团灭、死刑级伤害、标点A、标点1、BOSS名称、进攻职业
  | 'orange' // DotInfo
  | 'amber'
  | 'yellow' // 不超血量上限的伤害、中等威胁的伤害、通常的技能名、MechanicSection、标点B、标点2
  | 'lime' // SolutionSection
  | 'green' // 低威胁的伤害、治疗职业
  | 'emerald' // 不涉及伤害的信息标签（如45°、8m直线）
  | 'teal'
  | 'cyan' // NoteSection、高亮色
  | 'sky' // 标点C、标点3
  | 'blue' // 防护职业
  | 'indigo'
  | 'violet' // “|”（或连接符）
  | 'purple' // 标点D、标点4
  | 'fuchsia' // 狂暴（狂暴不等于团灭）
  | 'pink' // 超血量上限的高威胁的非死刑伤害（但不至于团灭）
  | 'rose' // 小怪名称
  | 'slate'
  | 'gray'
  | 'zinc' // 低重要性的信息（如场地复原、BOSS目标圈变为无身位状态等）
  | 'neutral'
  | 'stone'
