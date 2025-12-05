import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 确保安装 'uuid' 库
import type { ConditionItem, PatientRecord, QueryParams, SearchField } from '../types/data';
// 假设这是您的 API 服务
// import { searchPatientsApi } from '../api/dataService'; 

// 模拟的字段字典 (实际应从后端获取)
const mockSearchFields: SearchField[] = [
  { key: 'gender', name: '性别', type: 'select', options: [{ label: '男', value: 'M' }, { label: '女', value: 'F' }] },
  { key: 'age', name: '年龄', type: 'number' },
  { key: 'noduleSize', name: '结节最大径(mm)', type: 'number' },
  { key: 'diagnosisDate', name: '诊断日期', type: 'date' },
];

export const useConditionSearch = () => {
  // 核心状态管理
  const [conditions, setConditions] = useState<ConditionItem[]>([]);
  const [patientData, setPatientData] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  // 1. 添加/删除条件
  const addCondition = useCallback(() => {
    setConditions(prev => [
      ...prev,
      // 默认新增一个条件，使用第一个字段作为默认值
      { id: uuidv4(), fieldKey: mockSearchFields[0].key, operator: '=', value: undefined },
    ]);
  }, []);

  const removeCondition = useCallback((id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  }, []);

  // 2. 更新单个条件项
  const updateCondition = useCallback((id: string, updates: Partial<ConditionItem>) => {
    setConditions(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  // 3. 执行搜索操作
  const handleSearch = useCallback(async (page = 1, pageSize = pagination.pageSize) => {
    if (conditions.length === 0) return;

    // 构建查询参数（实际项目中会发送给后端）
    const query: QueryParams = {
      logic: 'AND', // 简化处理，假设条件间默认是 AND 关系
      conditions: conditions.filter(c => c.fieldKey && c.operator && c.value !== undefined),
      page,
      pageSize,
    };
    // 真实代码：const result = await searchPatientsApi(query);
    void query; // 标记 query 会在真实代码中使用

    setLoading(true);
    try {
      // 模拟后端返回的数据
      const mockResult = {
        list: Array.from({ length: pageSize }).map((_, index) => ({
          patientId: `P${(page - 1) * pageSize + index + 1}`,
          name: `患者${(page - 1) * pageSize + index + 1}`,
          gender: (index % 2 === 0 ? 'M' : 'F') as 'M' | 'F',
          age: Math.floor(Math.random() * 50) + 30,
          noduleCount: Math.floor(Math.random() * 5) + 1,
          lastVisitDate: `2024-0${Math.floor(Math.random() * 9) + 1}-20`,
          isStarred: Math.random() > 0.8,
        })),
        total: 155, // 模拟总数
      };

      setPatientData(mockResult.list);
      setPagination(prev => ({ ...prev, page, total: mockResult.total }));
    } catch (error) {
      console.error('搜索失败:', error);
      // 提示用户错误信息
    } finally {
      setLoading(false);
    }
  }, [conditions, pagination.pageSize]); // 依赖 conditions 确保条件变化时搜索结果刷新

  // 重置条件
  const handleReset = useCallback(() => {
    setConditions([]);
    setPatientData([]);
    setPagination({ page: 1, pageSize: 10, total: 0 });
  }, []);

  // 暴露给组件使用的值和方法
  return {
    conditions,
    patientData,
    loading,
    pagination,
    searchFields: mockSearchFields,
    addCondition,
    removeCondition,
    updateCondition,
    handleSearch,
    handleReset,
    setPagination,
  };
};

