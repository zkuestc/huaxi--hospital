import React, { useMemo } from 'react';
import { Card, Form, Select, InputNumber, Button, Table, Space, DatePicker, Tag, Result, Popconfirm, message, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SearchOutlined, ReloadOutlined, StarOutlined, ReadOutlined } from '@ant-design/icons';
import { useConditionSearch } from '../../hooks/useConditionSearch';
import type { SearchField, PatientRecord } from '../../types/data';

// 假设我们有一个独立的组件来渲染单个条件项
const ConditionItemRenderer: React.FC<{ 
  item: any; 
  fields: SearchField[]; 
  onUpdate: (updates: any) => void; 
}> = ({ item, fields, onUpdate }) => {
  // 根据当前选中的字段key找到对应的字段配置
  const currentField = fields.find(f => f.key === item.fieldKey);
  
  // 动态渲染值输入框
  const renderValueInput = (field: SearchField) => {
    switch (field.type) {
      case 'number':
        return <InputNumber placeholder="输入数值" onChange={v => onUpdate({ value: v })} value={item.value} style={{ width: 120 }} />;
      case 'date':
        // 这里需要处理 Moment/Dayjs 库的日期对象转换
        return <DatePicker placeholder="选择日期" onChange={(_, dateString) => onUpdate({ value: dateString })} style={{ width: 120 }} />;
      case 'select':
        return (
          <Select 
            placeholder="请选择" 
            options={field.options} 
            onChange={v => onUpdate({ value: v })} 
            value={item.value} 
            style={{ minWidth: 120 }} 
          />
        );
      case 'string':
      default:
        // 默认文本输入，用于名称、ID等
        return <Input placeholder="输入值" onChange={e => onUpdate({ value: e.target.value })} value={item.value} style={{ width: 120 }} />;
    }
  };

  return (
    <Space>
      {/* 1. 字段选择 */}
      <Select 
        placeholder="选择字段" 
        options={fields.map(f => ({ label: f.name, value: f.key }))}
        onChange={fieldKey => onUpdate({ fieldKey: fieldKey, value: undefined, operator: '=' })} // 字段变化时重置值和操作符
        value={item.fieldKey}
        style={{ width: 180 }}
      />
      
      {/* 2. 运算符选择 (简化处理，实际需要根据字段类型动态变化) */}
      <Select 
        placeholder="操作符" 
        options={[{ label: '=', value: '=' }, { label: '>', value: '>' }, { label: '<', value: '<' }]}
        onChange={operator => onUpdate({ operator })} 
        value={item.operator}
        style={{ width: 100 }}
      />
      
      {/* 3. 值输入 */}
      {currentField && renderValueInput(currentField)}
    </Space>
  );
};


// 核心页面组件
const ConditionSearchPage: React.FC = () => {
  const { 
    conditions, 
    patientData, 
    loading, 
    pagination, 
    searchFields,
    addCondition, 
    removeCondition, 
    updateCondition, 
    handleSearch, 
    handleReset, 
    setPagination 
  } = useConditionSearch();

  // 患者列表列定义
  const columns = useMemo(() => [
    { title: '患者ID', dataIndex: 'patientId', key: 'patientId', fixed: 'left' as const },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '性别', dataIndex: 'gender', key: 'gender', render: (g: string) => <Tag color={g === 'M' ? 'blue' : 'pink'}>{g === 'M' ? '男' : '女'}</Tag> },
    { title: '年龄', dataIndex: 'age', key: 'age', sorter: true },
    { title: '结节数', dataIndex: 'noduleCount', key: 'noduleCount', sorter: true },
    { title: '最近就诊', dataIndex: 'lastVisitDate', key: 'lastVisitDate', sorter: true },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right' as const, 
      render: (_text: string, record: PatientRecord) => (
        <Space size="middle">
          <Button type="link" onClick={() => message.info(`查看患者详情: ${record.patientId}`)}>
            <ReadOutlined /> 详情
          </Button>
          <Button type="link" icon={<StarOutlined />} onClick={() => message.success(`已收藏患者: ${record.patientId}`)}>
            收藏
          </Button>
        </Space>
      ),
    },
  ], []);

  // 处理分页/排序变化
  const handleTableChange = (p: any, _filters: any, _sorter: any) => {
    // 实际项目中需要将排序参数传递给 handleSearch
    setPagination(prev => ({ ...prev, page: p.current, pageSize: p.pageSize }));
    handleSearch(p.current, p.pageSize);
  };
  
  return (
    <div style={{ padding: 24 }}>
      {/* 1. 搜索条件卡片 */}
      <Card title="智能条件搜索" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          {conditions.length === 0 ? (
            <Result
              status="info"
              title="请添加检索条件"
              subTitle="点击下方按钮，开始构建您的肺结节数据筛选逻辑。"
            />
          ) : (
            conditions.map((item, index) => (
              <Space key={item.id} style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }} align="baseline">
                {/* 条件分组逻辑（例如：AND/OR 切换，此处简化） */}
                {index > 0 && <span style={{ marginRight: 8, fontWeight: 'bold' }}>AND</span>} 
                
                {/* 单个条件项渲染 */}
                <ConditionItemRenderer 
                  item={item} 
                  fields={searchFields} 
                  onUpdate={(updates) => updateCondition(item.id, updates)} 
                />

                {/* 删除按钮 */}
                <Popconfirm 
                  title="确认删除该条件吗?"
                  onConfirm={() => removeCondition(item.id)}
                  okText="是"
                  cancelText="否"
                >
                  <MinusCircleOutlined style={{ color: 'red', cursor: 'pointer' }} />
                </Popconfirm>
              </Space>
            ))
          )}

          {/* 添加/操作按钮 */}
          <Form.Item style={{ marginTop: 16 }}>
            <Space>
              <Button type="dashed" onClick={addCondition} icon={<PlusOutlined />}>
                添加检索条件
              </Button>
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={() => handleSearch(1)} 
                loading={loading}
                disabled={conditions.length === 0}
              >
                开始搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 2. 搜索结果卡片 */}
      <Card title={`患者列表 (共 ${pagination.total} 条记录)`}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
             <Button>恢复历史筛选 (4.10.4)</Button>
             <Button type="primary">导出数据 (需审批/权限)</Button>
          </Space>
        </div>
        <Table<PatientRecord>
          columns={columns}
          dataSource={patientData}
          rowKey="patientId"
          loading={loading}
          scroll={{ x: 1300 }} // 确保在大数据量时可横向滚动
          pagination={{ 
            current: pagination.page, 
            pageSize: pagination.pageSize, 
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          onChange={handleTableChange}
          // 支持患者多选
          rowSelection={{ type: 'checkbox' }} 
        />
      </Card>
    </div>
  );
};

export default ConditionSearchPage;

