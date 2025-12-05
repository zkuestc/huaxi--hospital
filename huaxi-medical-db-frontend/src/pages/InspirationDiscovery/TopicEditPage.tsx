import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Space, 
  InputNumber, 
  Checkbox, 
  message,
  Breadcrumb,
  Divider,
  Empty
} from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  CheckOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { Indicator, IndicatorValueRange, ResearchTopic, SankeyData } from '../../types/data';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface TopicEditPageProps {
  topicId?: string; // 如果存在则是编辑，否则是新建
  topic?: ResearchTopic; // 编辑时的主题数据
  onBack: () => void;
  onSave: (topic: ResearchTopic) => void;
}

// 模拟指标库数据
const mockIndicators: Indicator[] = [
  // 定性推荐指标
  { id: 'tnm_staging', name: 'TNM-疾病分期', type: 'qualitative', category: '定性推荐指标', 
    options: [
      { label: 'IA', value: 'IA' },
      { label: 'IB', value: 'IB' },
      { label: 'IIA', value: 'IIA' },
      { label: 'IIB', value: 'IIB' },
      { label: 'IIIA', value: 'IIIA' },
      { label: 'IIIB', value: 'IIIB' },
      { label: 'IVA', value: 'IVA' },
      { label: 'IVB', value: 'IVB' },
      { label: 'IV', value: 'IV' },
    ]
  },
  { id: 'surgery_type', name: '肺癌手术治疗-胸部手术术式', type: 'qualitative', category: '定性推荐指标',
    options: [
      { label: '肺叶切除术', value: 'lobectomy' },
      { label: '楔形切除术', value: 'wedge' },
      { label: '肺段切除术', value: 'segmentectomy' },
      { label: '袖式切除术', value: 'sleeve' },
    ]
  },
  { id: 'molecular_test', name: '患者阳性分子检测结果', type: 'qualitative', category: '定性推荐指标',
    options: [
      { label: 'EGFR', value: 'EGFR' },
      { label: 'ALK', value: 'ALK' },
      { label: 'MET (C-MET)', value: 'MET' },
      { label: 'ROS1', value: 'ROS1' },
      { label: 'HER2 (ERBB2)', value: 'HER2' },
      { label: 'PD-L1', value: 'PD-L1' },
    ]
  },
  { id: 'treatment_drug', name: '治疗方案-该方案使用药物', type: 'qualitative', category: '定性推荐指标',
    options: [
      { label: '顺铂', value: 'cisplatin' },
      { label: '培美曲塞', value: 'pemetrexed' },
      { label: '卡铂', value: 'carboplatin' },
      { label: '吉西他滨', value: 'gemcitabine' },
      { label: '埃克替尼', value: 'icotinib' },
      { label: '恩度', value: 'endostar' },
      { label: '多西他赛', value: 'docetaxel' },
      { label: '克唑替尼', value: 'crizotinib' },
    ]
  },
  // 定量推荐指标
  { id: 'age', name: '年龄', type: 'quantitative', category: '定量推荐指标', min: 0, max: 120, unit: '岁' },
  { id: 'nodule_size', name: '结节最大径', type: 'quantitative', category: '定量推荐指标', min: 0, max: 100, unit: 'mm' },
];

const TopicEditPage: React.FC<TopicEditPageProps> = ({ topicId, topic, onBack, onSave }) => {
  const [form] = Form.useForm();
  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorValueRange[]>([]);
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = !!topicId;

  // 加载编辑时的数据
  useEffect(() => {
    if (topic) {
      form.setFieldsValue({
        name: topic.name,
        description: topic.description,
      });
      setSelectedIndicators(topic.indicators || []);
      setSankeyData(topic.sankeyData || null);
    } else {
      form.resetFields();
      setSelectedIndicators([]);
      setSankeyData(null);
    }
  }, [topic, form]);

  // 按分类分组指标
  const indicatorsByCategory = useMemo(() => {
    const qualitative = mockIndicators.filter(i => i.type === 'qualitative');
    const quantitative = mockIndicators.filter(i => i.type === 'quantitative');
    return {
      qualitative,
      quantitative,
    };
  }, []);

  // 处理指标选择
  const handleIndicatorSelect = (indicator: Indicator) => {
    const existing = selectedIndicators.find(s => s.indicatorId === indicator.id);
    if (existing) {
      message.warning('该指标已添加');
      return;
    }

    const newIndicator: IndicatorValueRange = {
      indicatorId: indicator.id,
      indicatorName: indicator.name,
      type: indicator.type,
      selectedValues: indicator.type === 'qualitative' ? [] : undefined,
      minValue: indicator.type === 'quantitative' ? indicator.min : undefined,
      maxValue: indicator.type === 'quantitative' ? indicator.max : undefined,
    };

    setSelectedIndicators(prev => [...prev, newIndicator]);
  };

  // 删除指标
  const handleRemoveIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev => prev.filter(s => s.indicatorId !== indicatorId));
    setSankeyData(null);
  };

  // 更新指标值域
  const handleUpdateIndicatorRange = (indicatorId: string, updates: Partial<IndicatorValueRange>) => {
    setSelectedIndicators(prev => prev.map(s => 
      s.indicatorId === indicatorId ? { ...s, ...updates } : s
    ));
    setSankeyData(null);
  };

  // 生成桑基图数据
  const generateSankeyData = () => {
    if (selectedIndicators.length < 2) {
      message.warning('至少需要选择2个指标才能生成桑基图');
      return;
    }

    // 检查所有指标是否都设置了值域
    const incompleteIndicators = selectedIndicators.filter(ind => {
      if (ind.type === 'qualitative') {
        return !ind.selectedValues || ind.selectedValues.length === 0;
      } else {
        return ind.minValue === undefined || ind.maxValue === undefined;
      }
    });

    if (incompleteIndicators.length > 0) {
      message.warning('请为所有指标设置值域');
      return;
    }

    setLoading(true);

    // 模拟生成桑基图数据
    setTimeout(() => {
      const nodes: SankeyData['nodes'] = [];
      const links: SankeyData['links'] = [];

      selectedIndicators.forEach((indicator) => {
        const indicatorData = mockIndicators.find(i => i.id === indicator.indicatorId);
        if (!indicatorData) return;

        if (indicator.type === 'qualitative' && indicator.selectedValues) {
          indicator.selectedValues.forEach(value => {
            const option = indicatorData.options?.find(o => o.value === value);
            if (option) {
              nodes.push({
                id: `${indicator.indicatorId}_${value}`,
                name: option.label,
                category: indicator.indicatorName,
                value: Math.floor(Math.random() * 300) + 1,
              });
            }
          });
        } else if (indicator.type === 'quantitative') {
          // 定量指标简化为几个区间
          const ranges = [
            { label: '低', min: indicator.minValue!, max: (indicator.minValue! + indicator.maxValue!) / 2 },
            { label: '高', min: (indicator.minValue! + indicator.maxValue!) / 2, max: indicator.maxValue! },
          ];
          ranges.forEach(range => {
            nodes.push({
              id: `${indicator.indicatorId}_${range.label}`,
              name: `${range.label}(${range.min}-${range.max}${indicatorData.unit})`,
              category: indicator.indicatorName,
              value: Math.floor(Math.random() * 200) + 1,
            });
          });
        }
      });

      // 生成连接（简化处理，实际应从后端获取）
      for (let i = 0; i < nodes.length - 1; i++) {
        const currentNode = nodes[i];
        const nextCategoryNodes = nodes.filter(n => 
          n.category !== currentNode.category && 
          nodes.indexOf(n) > i
        );
        
        if (nextCategoryNodes.length > 0) {
          const target = nextCategoryNodes[Math.floor(Math.random() * nextCategoryNodes.length)];
          links.push({
            source: currentNode.id,
            target: target.id,
            value: Math.floor(Math.random() * 100) + 1,
          });
        }
      }

      setSankeyData({ nodes, links });
      setLoading(false);
      message.success('桑基图生成成功');
    }, 1000);
  };

  // 保存主题
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const savedTopic: ResearchTopic = {
        id: topicId || `topic_${Date.now()}`,
        name: values.name,
        description: values.description,
        indicators: selectedIndicators,
        createdAt: isEdit && topic ? topic.createdAt : dayjs().format('YYYY.MM.DD'),
        updatedAt: dayjs().format('YYYY.MM.DD'),
        isRecommended: isEdit && topic ? topic.isRecommended : false,
        sankeyData: sankeyData || undefined,
      };
      onSave(savedTopic);
      message.success(isEdit ? '主题已更新' : '主题已创建');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Button type="link" onClick={onBack} icon={<ArrowLeftOutlined />}>
            灵感发现
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{isEdit ? '编辑主题' : '新建主题'}</Breadcrumb.Item>
      </Breadcrumb>

      <Card 
        title={isEdit ? '4.3.2 编辑主题' : '4.3.1 新建主题'}
        extra={
          <Space>
            <Button onClick={onBack}>取消</Button>
            <Button type="primary" onClick={handleSave}>
              确定
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16, color: '#666' }}>
          {isEdit 
            ? '在主题列表中，针对目标主题，点击该主题进入编辑页面，支持进行主题名称修改，添加或删除指标，或修改已选指标的值域，以适应最新研究需求。'
            : '平台支持用户根据自身的研究需求创建和编辑主题,以便更好地组织和分析数据。点击"+新建主题"进行科研主题创建,明确主题名称和备注描述。'
          }
        </div>

        <Form form={form} layout="vertical" initialValues={{ name: '', description: '' }}>
          <Form.Item
            label="主题名称"
            name="name"
            rules={[{ required: true, message: '请输入主题名称' }]}
          >
            <Input placeholder="请输入主题名称" maxLength={20} showCount />
          </Form.Item>

          <Form.Item
            label="备注"
            name="description"
          >
            <TextArea 
              placeholder="请输入备注描述" 
              rows={4} 
              maxLength={60} 
              showCount 
            />
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ display: 'flex', gap: 24 }}>
          {/* 左侧：指标选择 */}
          <div style={{ width: 300, borderRight: '1px solid #f0f0f0', paddingRight: 24 }}>
            <div style={{ marginBottom: 16, fontWeight: 'bold' }}>
              选择指标
              <Button 
                type="link" 
                icon={<PlusOutlined />} 
                size="small"
                style={{ padding: 0, marginLeft: 8 }}
              >
                添加
              </Button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, color: '#666' }}>定性推荐指标</div>
              {indicatorsByCategory.qualitative.map(indicator => (
                <div 
                  key={indicator.id}
                  style={{ 
                    padding: '8px 12px', 
                    marginBottom: 8, 
                    background: selectedIndicators.find(s => s.indicatorId === indicator.id) ? '#e6f7ff' : '#fafafa',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleIndicatorSelect(indicator)}
                >
                  <Space>
                    {selectedIndicators.find(s => s.indicatorId === indicator.id) && (
                      <CheckOutlined style={{ color: '#1890ff' }} />
                    )}
                    <span>{indicator.name}</span>
                  </Space>
                </div>
              ))}
            </div>

            <div>
              <div style={{ marginBottom: 8, color: '#666' }}>定量推荐指标</div>
              {indicatorsByCategory.quantitative.map(indicator => (
                <div 
                  key={indicator.id}
                  style={{ 
                    padding: '8px 12px', 
                    marginBottom: 8, 
                    background: selectedIndicators.find(s => s.indicatorId === indicator.id) ? '#e6f7ff' : '#fafafa',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleIndicatorSelect(indicator)}
                >
                  <Space>
                    {selectedIndicators.find(s => s.indicatorId === indicator.id) && (
                      <CheckOutlined style={{ color: '#1890ff' }} />
                    )}
                    <span>{indicator.name}</span>
                  </Space>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：已选指标和值域设置 */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span>已添加{selectedIndicators.length}项指标</span>
              </div>
              <Space>
                <Button onClick={() => {
                  setSelectedIndicators([]);
                  setSankeyData(null);
                }}>
                  清空指标
                </Button>
                <Button>查看条件树</Button>
                <Button 
                  type="primary" 
                  onClick={generateSankeyData}
                  loading={loading}
                  disabled={selectedIndicators.length < 2}
                >
                  生成桑基图
                </Button>
              </Space>
            </div>

            {selectedIndicators.length === 0 ? (
              <Empty 
                description="当前指标为空,请点击左侧选择推荐指标"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div>
                {selectedIndicators.map(indicator => {
                  const indicatorData = mockIndicators.find(i => i.id === indicator.indicatorId);
                  if (!indicatorData) return null;

                  return (
                    <Card 
                      key={indicator.indicatorId}
                      size="small"
                      style={{ marginBottom: 16 }}
                      title={indicator.indicatorName}
                      extra={
                        <Button 
                          type="link" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveIndicator(indicator.indicatorId)}
                        >
                          删除
                        </Button>
                      }
                    >
                      {indicator.type === 'qualitative' ? (
                        <Checkbox.Group
                          value={indicator.selectedValues}
                          onChange={(values) => handleUpdateIndicatorRange(
                            indicator.indicatorId,
                            { selectedValues: values as (string | number)[] }
                          )}
                        >
                          <Space direction="vertical">
                            {indicatorData.options?.map(option => (
                              <Checkbox key={option.value} value={option.value}>
                                {option.label}
                              </Checkbox>
                            ))}
                          </Space>
                        </Checkbox.Group>
                      ) : (
                        <Space>
                          <InputNumber
                            placeholder="最小值"
                            value={indicator.minValue}
                            onChange={(value) => handleUpdateIndicatorRange(
                              indicator.indicatorId,
                              { minValue: value || undefined }
                            )}
                            min={indicatorData.min}
                            max={indicatorData.max}
                            addonAfter={indicatorData.unit}
                          />
                          <span>~</span>
                          <InputNumber
                            placeholder="最大值"
                            value={indicator.maxValue}
                            onChange={(value) => handleUpdateIndicatorRange(
                              indicator.indicatorId,
                              { maxValue: value || undefined }
                            )}
                            min={indicatorData.min}
                            max={indicatorData.max}
                            addonAfter={indicatorData.unit}
                          />
                        </Space>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {/* 桑基图展示 */}
            {sankeyData && (
              <Card title="桑基图" style={{ marginTop: 24 }}>
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'item',
                      triggerOn: 'mousemove'
                    },
                    series: [{
                      type: 'sankey',
                      data: sankeyData.nodes.map(n => ({ name: n.name })),
                      links: sankeyData.links.map(l => ({
                        source: sankeyData.nodes.find(n => n.id === l.source)?.name || '',
                        target: sankeyData.nodes.find(n => n.id === l.target)?.name || '',
                        value: l.value
                      })),
                      emphasis: {
                        focus: 'adjacency'
                      },
                      lineStyle: {
                        color: 'gradient',
                        curveness: 0.5
                      }
                    }]
                  }}
                  style={{ height: 600 }}
                />
              </Card>
            )}

            {!sankeyData && selectedIndicators.length >= 2 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <div>当前暂未生成桑基图</div>
                <Button 
                  type="primary" 
                  onClick={generateSankeyData}
                  loading={loading}
                  style={{ marginTop: 16 }}
                >
                  生成桑基图
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TopicEditPage;
