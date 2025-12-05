// 定义一个搜索字段的结构
export interface SearchField {
  key: string;      // 字段的唯一标识 (例如: 'age', 'gender', 'noduleSize')
  name: string;     // 字段的显示名称 (例如: '年龄', '性别', '结节最大径')
  type: 'string' | 'number' | 'date' | 'select'; // 字段类型，用于渲染不同输入组件
  options?: Array<{ label: string, value: string | number }>; // 如果是 select 类型
}

// 定义单个搜索条件项
export interface ConditionItem {
  id: string;             // 唯一ID，用于React列表渲染和删除
  fieldKey: string;       // 选中的字段key
  operator: string;       // 运算符 (例如: '=', '>', 'IN', 'CONTAINS')
  value: any;             // 字段值
}

// 定义查询参数发送给后端
export interface QueryParams {
  logic: 'AND' | 'OR';        // 条件组之间的逻辑关系
  conditions: ConditionItem[]; // 具体的条件列表
  page: number;
  pageSize: number;
}

// 定义患者（搜索结果）结构
export interface PatientRecord {
  patientId: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  noduleCount: number;
  lastVisitDate: string;
  isStarred: boolean; // 是否已收藏
}

// 数据字典相关类型定义
export interface DictionaryCategory {
  id: string;
  name: string;
  type: 'patient' | 'visit' | 'examination';
  color: string;
  children?: DictionaryCategory[];
}

export interface FieldQualityStats {
  validValue: { count: number; percentage: number };
  defaultValue: { count: number; percentage: number };
  missingValue: { count: number; percentage: number };
  mode?: string; // 众数
  mean?: string; // 均值
  stdDev?: string; // 标准差
  median?: string; // 中位数
  quartiles?: { lower: string; upper: string }; // 四分位数
  topValues?: Array<{ value: string; count: number; percentage: number }>; // TOP10 取值范围
}

export interface DictionaryField {
  id: string;
  name: string; // 字段名
  description: string; // 字段说明
  valueRange: string; // 值域
  dataType: string; // 数据类型
  extractionRule: string; // 数据提取规则
  valueSource: string; // 取值来源
  qualityStats?: FieldQualityStats; // 字段质量分布统计
}

export type DisplayMode = 'list' | 'card'; // 显示模式：列表或卡片

// 科研灵感发现相关类型定义
export interface Indicator {
  id: string;
  name: string; // 指标名称
  type: 'qualitative' | 'quantitative'; // 定性或定量
  category: string; // 指标分类
  description?: string; // 指标描述
  options?: Array<{ label: string; value: string | number }>; // 选项（用于定性指标）
  min?: number; // 最小值（用于定量指标）
  max?: number; // 最大值（用于定量指标）
  unit?: string; // 单位
}

export interface IndicatorValueRange {
  indicatorId: string;
  indicatorName: string;
  type: 'qualitative' | 'quantitative';
  selectedValues?: (string | number)[]; // 定性指标：选中的值
  minValue?: number; // 定量指标：最小值
  maxValue?: number; // 定量指标：最大值
}

export interface ResearchTopic {
  id: string;
  name: string; // 主题名称
  description?: string; // 备注描述
  indicators: IndicatorValueRange[]; // 已选指标及其值域
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  isRecommended?: boolean; // 是否推荐
  sankeyData?: SankeyData; // 桑基图数据
}

export interface SankeyNode {
  id: string;
  name: string;
  category: string; // 所属指标分类
  value?: number; // 节点值（人数）
}

export interface SankeyLink {
  source: string; // 源节点ID
  target: string; // 目标节点ID
  value: number; // 流量值（人数）
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// 简单搜索相关类型定义
export interface SimpleSearchParams {
  keyword: string; // 搜索关键词（诊断标准化）
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
  gender?: 'M' | 'F'; // 性别
  visitType?: 'outpatient' | 'inpatient'; // 就诊类型：门诊/住院
  departments?: string[]; // 就诊科室列表
  inclusionCriteria?: string[]; // 纳入条件ID列表
  exclusionCriteria?: string[]; // 排除条件ID列表
  page: number;
  pageSize: number;
}

// 科研热点相关类型定义
export interface ResearchHotspot {
  id: string;
  name: string; // 热点名称，如"非小细胞肺癌"
  inclusionCriteria: InclusionCriterion[]; // 常见纳入条件
  exclusionCriteria: ExclusionCriterion[]; // 常见排除条件
}

export interface InclusionCriterion {
  id: string;
  text: string; // 条件文本
  count: number; // 符合条件的患者数量
  checked?: boolean; // 是否选中
}

export interface ExclusionCriterion {
  id: string;
  text: string; // 条件文本
  count: number; // 符合条件的患者数量
  checked?: boolean; // 是否选中
}

// 就诊科室类型
export interface Department {
  id: string;
  name: string; // 科室名称
  selected?: boolean; // 是否选中
}

