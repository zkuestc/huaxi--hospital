import React, { useMemo } from 'react';
import { Card, Button, Table, Space, Popconfirm, message, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined, 
  EyeOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import type { ResearchTopic } from '../../types/data';

interface TopicListPageProps {
  topics: ResearchTopic[];
  onNewTopic: () => void;
  onEditTopic: (topicId: string) => void;
  onViewConditionTree: (topicId: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onCopyTopic: (topic: ResearchTopic) => void;
  onSetRecommended: (topicId: string) => void;
}

const TopicListPage: React.FC<TopicListPageProps> = ({ 
  topics,
  onNewTopic, 
  onEditTopic, 
  onViewConditionTree,
  onDeleteTopic,
  onCopyTopic,
  onSetRecommended,
}) => {
  const handleDelete = (topicId: string) => {
    onDeleteTopic(topicId);
    message.success('主题已删除');
  };

  const handleCopy = (topic: ResearchTopic) => {
    onCopyTopic(topic);
    message.success('主题已复制');
  };

  const handleSetRecommended = (topicId: string) => {
    onSetRecommended(topicId);
    message.success('推荐状态已更新');
  };

  const columns = useMemo(() => [
    {
      title: '主题名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ResearchTopic) => (
        <Space>
          <Button 
            type="link" 
            onClick={() => onEditTopic(record.id)}
            style={{ padding: 0 }}
          >
            {text}
          </Button>
          {record.isRecommended && (
            <Tag color="blue">推荐</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '包含指标',
      key: 'indicators',
      render: (_: any, record: ResearchTopic) => 
        record.indicators.length > 0 
          ? `${record.indicators.length}项指标`
          : '未添加指标',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ResearchTopic) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => onViewConditionTree(record.id)}
          >
            查看条件树
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEditTopic(record.id)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
          >
            复制
          </Button>
          <Button 
            type="link" 
            icon={record.isRecommended ? <StarFilled /> : <StarOutlined />}
            onClick={() => handleSetRecommended(record.id)}
          >
            {record.isRecommended ? '取消推荐' : '设置为推荐'}
          </Button>
          <Popconfirm
            title="确认删除该主题吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [onEditTopic, onViewConditionTree]);

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title="4.3 科研灵感发现"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onNewTopic}
          >
            新建主题
          </Button>
        }
      >
        <div style={{ marginBottom: 16, color: '#666' }}>
          平台支持通过灵感发现帮助科研人员通过可视化的方式,快速发现科研灵感,并深入挖掘各科研课题中的数据分布和走向。
        </div>
        <Table
          columns={columns}
          dataSource={topics}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default TopicListPage;
