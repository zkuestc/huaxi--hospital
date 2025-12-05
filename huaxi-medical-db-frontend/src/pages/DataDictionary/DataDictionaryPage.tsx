import React, { useState, useMemo } from 'react';
import { Layout, Menu, Table, Card, Tag, Space, Button, Tooltip, Row, Col, Statistic, Progress, Typography, Divider } from 'antd';
import { 
  UnorderedListOutlined, 
  AppstoreOutlined, 
  PlusOutlined, 
  MinusOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import type { DictionaryCategory, DictionaryField, DisplayMode } from '../../types/data';

const { Sider, Content } = Layout;
const { Text, Paragraph } = Typography;

// 模拟数据字典分类数据
const mockCategories: DictionaryCategory[] = [
  {
    id: 'patient',
    name: '患者',
    type: 'patient',
    color: '#722ed1',
    children: [
      { id: 'patient-demo', name: '患者人口学信息', type: 'patient', color: '#722ed1' },
      { id: 'patient-lung', name: '肺癌关键字段', type: 'patient', color: '#722ed1' },
      { id: 'patient-gene', name: '基因检测', type: 'patient', color: '#722ed1' },
      { id: 'patient-radiation', name: '放射治疗', type: 'patient', color: '#722ed1' },
      { id: 'patient-drug-detail', name: '药物详情', type: 'patient', color: '#722ed1' },
      { id: 'patient-drug-treatment', name: '药物治疗', type: 'patient', color: '#722ed1' },
    ]
  },
  {
    id: 'visit',
    name: '就诊',
    type: 'visit',
    color: '#1890ff',
    children: [
      { id: 'visit-summary', name: '就诊概要', type: 'visit', color: '#1890ff' },
      { id: 'visit-homepage', name: '病案首页', type: 'visit', color: '#1890ff' },
      { id: 'visit-record', name: '就诊记录', type: 'visit', color: '#1890ff' },
    ]
  },
  {
    id: 'examination',
    name: '检查',
    type: 'examination',
    color: '#52c41a',
    children: [
      { id: 'exam-diagnosis', name: '诊断', type: 'examination', color: '#52c41a' },
      { id: 'exam-ct', name: '胸部CT报告', type: 'examination', color: '#52c41a' },
      { id: 'exam-bronchoscopy', name: '肺纤支镜', type: 'examination', color: '#52c41a' },
      { id: 'exam-lung-function', name: '肺功能', type: 'examination', color: '#52c41a' },
      { id: 'exam-mri', name: '颅脑MRI', type: 'examination', color: '#52c41a' },
      { id: 'exam-ecg', name: '心电图报告', type: 'examination', color: '#52c41a' },
      { id: 'exam-pathology', name: '病理报告', type: 'examination', color: '#52c41a' },
      { id: 'exam-surgery', name: '手术记录', type: 'examination', color: '#52c41a' },
    ]
  },
];

// 模拟字段数据
const mockFields: Record<string, DictionaryField[]> = {
  'patient-lung': [
    {
      id: 'field-1',
      name: '是否确诊原发肺恶性肿瘤',
      description: '是否确诊为原发性肺部恶性肿瘤，用于标识患者是否被确诊患有原发性肺部恶性肿瘤',
      valueRange: '未定义',
      dataType: '浮点型',
      extractionRule: '单来源映射',
      valueSource: '入院记录-现病史;出院记录-诊疗经过;病理报告-病理结论',
      qualityStats: {
        validValue: { count: 962, percentage: 100.00 },
        defaultValue: { count: 0, percentage: 0.00 },
        missingValue: { count: 0, percentage: 0.00 },
        mode: '是',
        topValues: [
          { value: '是', count: 962, percentage: 100.00 }
        ]
      }
    },
    {
      id: 'field-2',
      name: '首次病理诊断肺恶性肿瘤时间',
      description: '患者首次被病理确诊为肺恶性肿瘤的时间',
      valueRange: '未定义',
      dataType: '日期',
      extractionRule: '单来源映射',
      valueSource: '入院记录-现病史;出院记录-诊疗经过;病理报告-病理结论',
      qualityStats: {
        validValue: { count: 942, percentage: 100.00 },
        defaultValue: { count: 0, percentage: 0.00 },
        missingValue: { count: 0, percentage: 0.00 },
        mean: '72.46',
        stdDev: '122.3',
        median: '2003',
        quartiles: { lower: '1.00', upper: 'Min' }
      }
    },
    {
      id: 'field-3',
      name: 'TNM-分期时间',
      description: '肺癌患者TNM分期评估的时间',
      valueRange: '1970~2021',
      dataType: '日期',
      extractionRule: '单来源映射',
      valueSource: '入院记录-现病史;出院记录-诊疗经过;病理报告-病理结论',
    },
    {
      id: 'field-4',
      name: 'TNM-分期类型',
      description: '肺癌TNM分期系统中的分期类型',
      valueRange: '临床分期 (c), 病理分期 (p)',
      dataType: '文本',
      extractionRule: '单来源映射',
      valueSource: '入院记录-现病史;出院记录-诊疗经过;病理报告-病理结论',
    },
    {
      id: 'field-5',
      name: 'TNM-分期-T',
      description: '肿瘤的大小和/或是否已经侵犯周围组织',
      valueRange: 'Tx, T0, Tis, T1, T2, T3, T4',
      dataType: '文本',
      extractionRule: '单来源映射',
      valueSource: '影像检查-影像所见;影像检查-影像结论',
    },
    {
      id: 'field-6',
      name: 'TNM-分期-N',
      description: '淋巴结受累程度，表示肿瘤是否已扩散到淋巴结',
      valueRange: 'Nx, N0, N1, N2, N3',
      dataType: '文本',
      extractionRule: '单来源映射',
      valueSource: '影像检查-影像结论;病理报告-病理结论',
    },
    {
      id: 'field-7',
      name: 'TNM-分期-M',
      description: '表示肿瘤是否有远处转移',
      valueRange: 'Mx, M0, M1, M1a, M1b, M1c',
      dataType: '文本',
      extractionRule: '单来源映射',
      valueSource: '影像检查-影像结论',
    },
    {
      id: 'field-8',
      name: 'TNM-疾病分期',
      description: '根据TNM系统，对肺癌患者进行疾病分期',
      valueRange: 'I, IA, IA1, IA2, IA3, IB, IIA, IIB, IIIA, IIIB, IV, IVA, IVB',
      dataType: '文本',
      extractionRule: '单来源映射',
      valueSource: '入院记录-现病史;出院记录-诊疗经过',
      qualityStats: {
        validValue: { count: 1000, percentage: 100.00 },
        defaultValue: { count: 0, percentage: 0.00 },
        missingValue: { count: 0, percentage: 0.00 },
        mode: 'IV',
        topValues: [
          { value: 'IV', count: 387, percentage: 38.69 },
          { value: 'IIIA', count: 161, percentage: 16.12 },
          { value: '不详', count: 124, percentage: 12.39 },
          { value: 'IA', count: 64, percentage: 6.41 },
          { value: 'IIA', count: 50, percentage: 4.99 },
          { value: 'IB', count: 45, percentage: 4.50 },
          { value: 'IIB', count: 42, percentage: 4.16 },
          { value: 'IIIB', count: 40, percentage: 4.04 },
          { value: 'IVA', count: 26, percentage: 2.56 },
          { value: 'IVB', count: 22, percentage: 2.22 },
        ]
      }
    },
  ],
};

// 展开行组件 - 显示字段质量统计
const ExpandedRow: React.FC<{ field: DictionaryField }> = ({ field }) => {
  if (!field.qualityStats) return null;

  const stats = field.qualityStats;

  return (
    <div style={{ padding: '24px', background: '#fafafa' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic
            title="有效值"
            value={stats.validValue.count}
            suffix={`${stats.validValue.percentage}%`}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="默认值"
            value={stats.defaultValue.count}
            suffix={`${stats.defaultValue.percentage}%`}
            valueStyle={{ color: '#8c8c8c' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="缺失值"
            value={stats.missingValue.count}
            suffix={`${stats.missingValue.percentage}%`}
            valueStyle={{ color: '#ff7875' }}
          />
        </Col>
      </Row>

      {stats.mode && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>众数：</Text>
          <Text>{stats.mode}</Text>
        </div>
      )}

      {stats.mean && stats.stdDev && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>均值±标准差：</Text>
          <Text>{stats.mean}±{stats.stdDev}</Text>
        </div>
      )}

      {stats.median && stats.quartiles && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>中位数 (下四分位数-上四分位数)：</Text>
          <Text>{stats.median}({stats.quartiles.lower}-{stats.quartiles.upper})</Text>
        </div>
      )}

      {stats.topValues && stats.topValues.length > 0 && (
        <div>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>取值范围TOP10：</Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            {stats.topValues.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>{item.value}</Text>
                <div style={{ width: '60%' }}>
                  <Progress 
                    percent={item.percentage} 
                    showInfo={false}
                    strokeColor="#1890ff"
                    size="small"
                  />
                </div>
                <Text>{item.percentage}%</Text>
              </div>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

// 卡片模式组件
const CardView: React.FC<{ fields: DictionaryField[] }> = ({ fields }) => {
  return (
    <Row gutter={[16, 16]}>
      {fields.map((field) => (
        <Col key={field.id} xs={24} sm={12} lg={8}>
          <Card
            title={
              <Space>
                <Text strong>{field.name}</Text>
                <Tooltip
                  title={
                    <div>
                      <div><strong>取值来源：</strong>{field.valueSource}</div>
                      <div><strong>数据提取规则：</strong>{field.extractionRule}</div>
                    </div>
                  }
                >
                  <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
                </Tooltip>
              </Space>
            }
            extra={
              field.qualityStats && (
                <Tag color="blue">有统计</Tag>
              )
            }
            style={{ height: '100%' }}
          >
            <Paragraph ellipsis={{ rows: 2 }}>{field.description}</Paragraph>
            
            <Divider style={{ margin: '12px 0' }} />
            
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div>
                <Text type="secondary">值域：</Text>
                <Text>{field.valueRange}</Text>
              </div>
              <div>
                <Text type="secondary">数据类型：</Text>
                <Text>{field.dataType}</Text>
              </div>
              <div>
                <Text type="secondary">数据提取规则：</Text>
                <Text>{field.extractionRule}</Text>
              </div>
            </Space>

            {field.qualityStats && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={8}>
                  <Col span={8}>
                    <Statistic
                      value={field.qualityStats.validValue.count}
                      suffix={`${field.qualityStats.validValue.percentage}%`}
                      valueStyle={{ fontSize: 14, color: '#1890ff' }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>有效值</Text>
                  </Col>
                  <Col span={8}>
                    <Statistic
                      value={field.qualityStats.defaultValue.count}
                      suffix={`${field.qualityStats.defaultValue.percentage}%`}
                      valueStyle={{ fontSize: 14, color: '#8c8c8c' }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>默认值</Text>
                  </Col>
                  <Col span={8}>
                    <Statistic
                      value={field.qualityStats.missingValue.count}
                      suffix={`${field.qualityStats.missingValue.percentage}%`}
                      valueStyle={{ fontSize: 14, color: '#ff7875' }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>缺失值</Text>
                  </Col>
                </Row>

                {field.qualityStats.mode && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>众数：</Text>
                    <Text strong>{field.qualityStats.mode}</Text>
                  </div>
                )}

                {field.qualityStats.topValues && field.qualityStats.topValues.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                      取值范围TOP10：
                    </Text>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {field.qualityStats.topValues.slice(0, 5).map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: 12 }}>{item.value}</Text>
                          <div style={{ width: '50%', margin: '0 8px' }}>
                            <Progress 
                              percent={item.percentage} 
                              showInfo={false}
                              strokeColor="#1890ff"
                              size="small"
                            />
                          </div>
                          <Text style={{ fontSize: 12 }}>{item.percentage}%</Text>
                        </div>
                      ))}
                    </Space>
                  </div>
                )}
              </>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const DataDictionaryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('patient-lung');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // 获取当前分类的字段列表
  const currentFields = useMemo(() => {
    return mockFields[selectedCategory] || [];
  }, [selectedCategory]);

  // 构建菜单项
  const menuItems = useMemo(() => {
    return mockCategories.map(category => ({
      key: category.id,
      label: category.name,
      type: 'group' as const,
      children: category.children?.map(child => ({
        key: child.id,
        label: (
          <Space>
            <Tag color={child.color} style={{ margin: 0 }}>
              {category.name}
            </Tag>
            {child.name}
          </Space>
        ),
      })),
    }));
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: DictionaryField) => (
        <Space>
          {record.qualityStats && (
            <Button
              type="text"
              size="small"
              icon={expandedRows.has(record.id) ? <MinusOutlined /> : <PlusOutlined />}
              onClick={() => {
                const newExpanded = new Set(expandedRows);
                if (newExpanded.has(record.id)) {
                  newExpanded.delete(record.id);
                } else {
                  newExpanded.add(record.id);
                }
                setExpandedRows(newExpanded);
              }}
            />
          )}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '字段说明',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: '值域',
      dataIndex: 'valueRange',
      key: 'valueRange',
      width: 200,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 120,
    },
    {
      title: '数据提取规则',
      dataIndex: 'extractionRule',
      key: 'extractionRule',
      width: 150,
    },
    {
      title: '取值来源',
      dataIndex: 'valueSource',
      key: 'valueSource',
      ellipsis: true,
    },
  ];

  // 获取当前选中的分类名称
  const currentCategoryName = useMemo(() => {
    for (const category of mockCategories) {
      const found = category.children?.find(c => c.id === selectedCategory);
      if (found) return found.name;
    }
    return '数据字典';
  }, [selectedCategory]);

  return (
    <Layout style={{ background: '#fff', minHeight: 'calc(100vh - 112px)' }}>
      <Sider
        width={280}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          overflow: 'auto',
          height: 'calc(100vh - 112px)',
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Text strong style={{ fontSize: 16 }}>数据字典</Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedCategory]}
          items={menuItems}
          onClick={({ key }) => setSelectedCategory(key as string)}
          style={{ borderRight: 'none' }}
        />
      </Sider>
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: 18 }}>{currentCategoryName}</Text>
          <Space>
            <Button
              type={displayMode === 'list' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              onClick={() => setDisplayMode('list')}
            >
              列表模式
            </Button>
            <Button
              type={displayMode === 'card' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setDisplayMode('card')}
            >
              卡片模式
            </Button>
          </Space>
        </div>

        {displayMode === 'list' ? (
          <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12, marginBottom: 16 }}>
            文字列表模式:数据字典默认展示文字列表模式,点击"+号"可展开查看字段质量分布统计。
          </div>
        ) : (
          <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12, marginBottom: 16 }}>
            图文可视化模式:点击右上角的卡片模式可切换至图文可视化模式。鼠标悬浮在字段旁的图标上可查看字段取值说明。
          </div>
        )}

        {displayMode === 'list' ? (
          <Table
            columns={columns}
            dataSource={currentFields}
            rowKey="id"
            pagination={false}
            expandable={{
              expandedRowRender: (record) => <ExpandedRow field={record} />,
              expandedRowKeys: Array.from(expandedRows),
              onExpandedRowsChange: (expandedKeys) => {
                setExpandedRows(new Set(expandedKeys as string[]));
              },
            }}
          />
        ) : (
          <CardView fields={currentFields} />
        )}
      </Content>
    </Layout>
  );
};

export default DataDictionaryPage;

