import { useState, useCallback } from 'react';
import type { SimpleSearchParams, PatientRecord, ResearchHotspot, Department } from '../types/data';

// 模拟的科研热点数据
const mockResearchHotspots: ResearchHotspot[] = [
  {
    id: 'nslc',
    name: '非小细胞肺癌',
    inclusionCriteria: [
      { id: 'inc1', text: '组织学或细胞学确诊非小细胞肺癌', count: 936 },
      { id: 'inc2', text: '年龄≥18岁且≤75岁', count: 929 },
      { id: 'inc3', text: '未经过手术治疗', count: 591 },
      { id: 'inc4', text: '胸部CT检查示合并胸腔积液', count: 506 },
      { id: 'inc5', text: '无EGFR基因突变、ALK基因突变', count: 400 },
      { id: 'inc6', text: 'TNM分期为IIIb~IV期', count: 235 },
      { id: 'inc7', text: 'TNM标准诊断的III期', count: 169 },
    ],
    exclusionCriteria: [
      { id: 'exc1', text: '有淋巴结转移或远处转移', count: 432 },
      { id: 'exc2', text: '糖尿病患者', count: 78 },
      { id: 'exc3', text: '有脑转移的患者', count: 56 },
    ],
  },
];

// 模拟的科室列表
const mockDepartments: Department[] = [
  { id: 'dept1', name: '胸部肿瘤外科' },
  { id: 'dept2', name: '肿瘤内科' },
  { id: 'dept3', name: '化疗科' },
  { id: 'dept4', name: '中医科' },
  { id: 'dept5', name: '外科' },
  { id: 'dept6', name: '胸部放射治疗科' },
  { id: 'dept7', name: '方便门诊' },
  { id: 'dept8', name: '放疗科' },
  { id: 'dept9', name: '放射治疗科' },
  { id: 'dept10', name: '中西医结合肿瘤科' },
  { id: 'dept11', name: '妇科肿瘤' },
  { id: 'dept12', name: '头颈肿瘤外科' },
  { id: 'dept13', name: '急诊室' },
  { id: 'dept14', name: '泌尿肿瘤外科' },
  { id: 'dept15', name: '腹部肿瘤外科' },
  { id: 'dept16', name: '综合科室' },
  { id: 'dept17', name: '乳腺肿瘤外科' },
  { id: 'dept18', name: '内镜中心' },
  { id: 'dept19', name: '头颈放射治疗科' },
  { id: 'dept20', name: '核医学科' },
  { id: 'dept21', name: '院前科室' },
  { id: 'dept22', name: '综合肿瘤内科(头颈、泌尿、骨软、神经等)' },
  { id: 'dept23', name: '超声微创门诊' },
  { id: 'dept24', name: '乳腺骨软神经外科' },
  { id: 'dept25', name: '静脉治疗护理门诊' },
  { id: 'dept26', name: '妇科' },
  { id: 'dept27', name: '疼痛科' },
  { id: 'dept28', name: '内镜微创诊疗' },
  { id: 'dept29', name: '介入科' },
  { id: 'dept30', name: '结、直肠肿瘤外科' },
  { id: 'dept31', name: '中医膏方义诊' },
  { id: 'dept32', name: '介入' },
  { id: 'dept33', name: '神经肿瘤外科' },
  { id: 'dept34', name: '腹部肿瘤内科' },
  { id: 'dept35', name: '骨软组织肿瘤外科' },
  { id: 'dept36', name: '麻醉门诊' },
  { id: 'dept37', name: '112病区' },
  { id: 'dept38', name: '腹部放射治疗科' },
  { id: 'dept39', name: '门诊介入科' },
  { id: 'dept40', name: '209东病区' },
  { id: 'dept41', name: '905病区' },
  { id: 'dept42', name: '病理诊断门诊' },
  { id: 'dept43', name: '肿瘤代谢营养门诊' },
  { id: 'dept44', name: '防癌体检' },
  { id: 'dept45', name: '113病区' },
  { id: 'dept46', name: '206东病区' },
  { id: 'dept47', name: '211西病区' },
  { id: 'dept48', name: '未提及' },
  { id: 'dept49', name: '十三病区' },
  { id: 'dept50', name: '放射诊断门诊' },
  { id: 'dept51', name: '消化内科' },
  { id: 'dept52', name: '淋巴瘤内科' },
  { id: 'dept53', name: '综合组' },
  { id: 'dept54', name: '造口门诊' },
  { id: 'dept55', name: '门诊各科' },
];

export const useSimpleSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [gender, setGender] = useState<'M' | 'F' | undefined>();
  const [visitType, setVisitType] = useState<'outpatient' | 'inpatient' | undefined>();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [researchHotspots, setResearchHotspots] = useState<ResearchHotspot[]>(mockResearchHotspots);
  const [patientData, setPatientData] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  // 切换科室选中状态
  const toggleDepartment = useCallback((departmentId: string) => {
    setDepartments(prev =>
      prev.map(dept => (dept.id === departmentId ? { ...dept, selected: !dept.selected } : dept))
    );
  }, []);

  // 切换纳入条件选中状态
  const toggleInclusionCriterion = useCallback((hotspotId: string, criterionId: string) => {
    setResearchHotspots(prev =>
      prev.map(hotspot =>
        hotspot.id === hotspotId
          ? {
              ...hotspot,
              inclusionCriteria: hotspot.inclusionCriteria.map(criterion =>
                criterion.id === criterionId
                  ? { ...criterion, checked: !criterion.checked }
                  : criterion
              ),
            }
          : hotspot
      )
    );
  }, []);

  // 切换排除条件选中状态
  const toggleExclusionCriterion = useCallback((hotspotId: string, criterionId: string) => {
    setResearchHotspots(prev =>
      prev.map(hotspot =>
        hotspot.id === hotspotId
          ? {
              ...hotspot,
              exclusionCriteria: hotspot.exclusionCriteria.map(criterion =>
                criterion.id === criterionId
                  ? { ...criterion, checked: !criterion.checked }
                  : criterion
              ),
            }
          : hotspot
      )
    );
  }, []);

  // 执行搜索
  const handleSearch = useCallback(
    async (page = 1, pageSize = pagination.pageSize) => {
      if (!keyword.trim()) {
        return;
      }

      const selectedDepartments = departments.filter(d => d.selected).map(d => d.id);
      const selectedHotspot = researchHotspots[0]; // 简化处理，使用第一个热点
      const selectedInclusion = selectedHotspot?.inclusionCriteria
        .filter(c => c.checked)
        .map(c => c.id) || [];
      const selectedExclusion = selectedHotspot?.exclusionCriteria
        .filter(c => c.checked)
        .map(c => c.id) || [];

      const params: SimpleSearchParams = {
        keyword,
        startDate,
        endDate,
        gender,
        visitType,
        departments: selectedDepartments,
        inclusionCriteria: selectedInclusion,
        exclusionCriteria: selectedExclusion,
        page,
        pageSize,
      };

      // 真实代码：const result = await searchPatientsApi(params);
      void params; // 标记 params 会在真实代码中使用

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
      } finally {
        setLoading(false);
      }
    },
    [keyword, startDate, endDate, gender, visitType, departments, researchHotspots, pagination.pageSize]
  );

  // 重置所有条件
  const handleReset = useCallback(() => {
    setKeyword('');
    setStartDate(undefined);
    setEndDate(undefined);
    setGender(undefined);
    setVisitType(undefined);
    setDepartments(prev => prev.map(dept => ({ ...dept, selected: false })));
    setResearchHotspots(prev =>
      prev.map(hotspot => ({
        ...hotspot,
        inclusionCriteria: hotspot.inclusionCriteria.map(c => ({ ...c, checked: false })),
        exclusionCriteria: hotspot.exclusionCriteria.map(c => ({ ...c, checked: false })),
      }))
    );
    setPatientData([]);
    setPagination({ page: 1, pageSize: 10, total: 0 });
  }, []);

  return {
    keyword,
    setKeyword,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    gender,
    setGender,
    visitType,
    setVisitType,
    departments,
    researchHotspots,
    patientData,
    loading,
    pagination,
    toggleDepartment,
    toggleInclusionCriterion,
    toggleExclusionCriterion,
    handleSearch,
    handleReset,
    setPagination,
  };
};

