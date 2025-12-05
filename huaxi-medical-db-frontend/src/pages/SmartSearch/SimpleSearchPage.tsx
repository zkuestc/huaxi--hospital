import React, { useMemo } from 'react';
import {
  Card,
  Input,
  Button,
  DatePicker,
  Radio,
  Space,
  Table,
  Tag,
  Checkbox,
  Row,
  Col,
  message,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  ReadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useSimpleSearch } from '../../hooks/useSimpleSearch';
import type { PatientRecord } from '../../types/data';
import dayjs, { type Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

// 搜索导航组件
const SearchNavigation: React.FC<{
  currentType: string;
  onTypeChange: (type: string) => void;
}> = ({ currentType, onTypeChange }) => {
  const navItems = [
    { key: 'simple', label: '简单搜索', icon: '🔍', color: '#1890ff' },
    { key: 'condition', label: '条件搜索', icon: '📋', color: '#1890ff' },
    { key: 'event', label: '事件时间搜索', icon: '⏰', color: '#13c2c2' },
    { key: 'id', label: 'ID搜索', icon: '👤', color: '#fa8c16' },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>4.4.1 搜索导航</h2>
      <p style={{ marginBottom: 16, color: '#666' }}>
        搜索导航位于筛选页左上方，点击对应按钮可快速切换至所需搜索区域。
      </p>
      <Space size="middle">
        {navItems.map(item => (
          <Button
            key={item.key}
            type={currentType === item.key ? 'primary' : 'default'}
            icon={<span style={{ marginRight: 4 }}>{item.icon}</span>}
            onClick={() => onTypeChange(item.key)}
            style={{
              borderRadius: 8,
              height: 40,
              padding: '0 20px',
              borderColor: currentType === item.key ? item.color : undefined,
            }}
          >
            {item.label}
          </Button>
        ))}
      </Space>
    </div>
  );
};

// 简单搜索页面主组件
const SimpleSearchPage: React.FC = () => {
  const {
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
  } = useSimpleSearch();

  // 处理日期范围变化
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setStartDate(dates[0].format('YYYY-MM-DD'));
      setEndDate(dates[1].format('YYYY-MM-DD'));
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  // 处理搜索导航切换（简化处理，实际应该通过路由）
  const handleNavTypeChange = (type: string) => {
    if (type === 'condition') {
      // 这里应该通过路由跳转，暂时用 message 提示
      message.info('切换到条件搜索');
    } else if (type === 'event') {
      message.info('切换到事件时间搜索');
    } else if (type === 'id') {
      message.info('切换到ID搜索');
    }
  };

  // 患者列表列定义
  const columns = useMemo(
    () => [
      { title: '患者ID', dataIndex: 'patientId', key: 'patientId', fixed: 'left' as const },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (g: string) => <Tag color={g === 'M' ? 'blue' : 'pink'}>{g === 'M' ? '男' : '女'}</Tag>,
      },
      { title: '年龄', dataIndex: 'age', key: 'age', sorter: true },
      { title: '结节数', dataIndex: 'noduleCount', key: 'noduleCount', sorter: true },
      { title: '最近就诊', dataIndex: 'lastVisitDate', key: 'lastVisitDate', sorter: true },
      {
        title: '操作',
        key: 'action',
        fixed: 'right' as const,
        render: (_text: string, record: PatientRecord) => (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => message.info(`查看患者详情: ${record.patientId}`)}
            >
              <ReadOutlined /> 详情
            </Button>
            <Button
              type="link"
              icon={<StarOutlined />}
              onClick={() => message.success(`已收藏患者: ${record.patientId}`)}
            >
              收藏
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  // 处理分页变化
  const handleTableChange = (p: any, _filters: any, _sorter: any) => {
    setPagination(prev => ({ ...prev, page: p.current, pageSize: p.pageSize }));
    handleSearch(p.current, p.pageSize);
  };

  const selectedHotspot = researchHotspots[0]; // 简化处理，使用第一个热点

  return (
    <div style={{ padding: 24 }}>
      {/* 搜索导航 */}
      <SearchNavigation currentType="simple" onTypeChange={handleNavTypeChange} />

      {/* 简单搜索主卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>简单搜索</span>
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={24}>
          {/* 左侧：搜索和筛选条件 */}
          <Col span={16}>
            {/* 搜索输入框 */}
            <div style={{ marginBottom: 24 }}>
              <Input
                placeholder="输入诊断关键词，如：肺癌"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                suffix={
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => handleSearch(1)}
                    loading={loading}
                    disabled={!keyword.trim()}
                  >
                    搜索
                  </Button>
                }
                style={{ height: 40 }}
                onPressEnter={() => handleSearch(1)}
              />
              {keyword && (
                <div style={{ marginTop: 8, color: '#1890ff', fontSize: 12 }}>
                  {keyword} [诊断标准化]
                </div>
              )}
            </div>

            {/* 筛选条件 */}
            <Card title="筛选条件" size="small" style={{ marginBottom: 24 }}>
              {/* 就诊时间 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>就诊时间</div>
                <RangePicker
                  value={
                    startDate && endDate
                      ? [dayjs(startDate), dayjs(endDate)]
                      : null
                  }
                  onChange={handleDateRangeChange}
                  style={{ width: '100%' }}
                />
              </div>

              {/* 性别 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>性别</div>
                <Radio.Group value={gender} onChange={e => setGender(e.target.value)}>
                  <Radio value="F">女</Radio>
                  <Radio value="M">男</Radio>
                </Radio.Group>
              </div>

              {/* 就诊类型 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>就诊类型</div>
                <Radio.Group value={visitType} onChange={e => setVisitType(e.target.value)}>
                  <Radio value="outpatient">门诊</Radio>
                  <Radio value="inpatient">住院</Radio>
                </Radio.Group>
              </div>

              {/* 就诊科室 */}
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>就诊科室</div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {departments.map(dept => (
                    <Tag
                      key={dept.id}
                      color={dept.selected ? 'blue' : 'default'}
                      onClick={() => toggleDepartment(dept.id)}
                      style={{ cursor: 'pointer', marginBottom: 4 }}
                    >
                      {dept.name}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>

          {/* 右侧：科研热点 */}
          <Col span={8}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>科研热点</span>
                  <Button type="text" size="small" icon={<EditOutlined />}>
                    编辑
                  </Button>
                </div>
              }
              size="small"
            >
              {selectedHotspot && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#e6f7ff',
                      padding: 8,
                      borderRadius: 4,
                      marginBottom: 16,
                      fontWeight: 500,
                    }}
                  >
                    {selectedHotspot.name}
                  </div>

                  {/* 常见纳入条件 */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>常见纳入条件</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedHotspot.inclusionCriteria.map(criterion => (
                        <Checkbox
                          key={criterion.id}
                          checked={criterion.checked}
                          onChange={() => toggleInclusionCriterion(selectedHotspot.id, criterion.id)}
                        >
                          {criterion.text}({criterion.count})
                        </Checkbox>
                      ))}
                    </div>
                  </div>

                  {/* 常见排除条件 */}
                  <div>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>常见排除条件</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedHotspot.exclusionCriteria.map(criterion => (
                        <Checkbox
                          key={criterion.id}
                          checked={criterion.checked}
                          onChange={() => toggleExclusionCriterion(selectedHotspot.id, criterion.id)}
                        >
                          {criterion.text}({criterion.count})
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 搜索结果 */}
      {patientData.length > 0 && (
        <Card title={`患者列表 (共 ${pagination.total} 条记录)`}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button>恢复历史筛选</Button>
              <Button type="primary">导出数据</Button>
            </Space>
          </div>
          <Table<PatientRecord>
            columns={columns}
            dataSource={patientData}
            rowKey="patientId"
            loading={loading}
            scroll={{ x: 1300 }}
            pagination={{
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
            onChange={handleTableChange}
            rowSelection={{ type: 'checkbox' }}
          />
        </Card>
      )}
    </div>
  );
};

export default SimpleSearchPage;

