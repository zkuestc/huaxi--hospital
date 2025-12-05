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

