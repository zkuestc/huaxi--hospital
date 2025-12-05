import React, { useState } from 'react';
import TopicListPage from './TopicListPage';
import TopicEditPage from './TopicEditPage';
import type { ResearchTopic } from '../../types/data';

type PageMode = 'list' | 'edit' | 'new';

const InspirationDiscoveryPage: React.FC = () => {
  const [mode, setMode] = useState<PageMode>('list');
  const [currentTopicId, setCurrentTopicId] = useState<string | undefined>();
  const [topics, setTopics] = useState<ResearchTopic[]>([
    {
      id: '1',
      name: '肿瘤相关治疗',
      description: '包含指标:TNM-疾病分期(9)、肺癌手术治疗-胸部手术术式(4)、患者阳性分子检测结果(6)、治疗方案-该方案使用药物(8)',
      indicators: [],
      createdAt: '2025.03.17',
      updatedAt: '2025.03.17',
      isRecommended: true,
    },
  ]);

  const handleNewTopic = () => {
    setCurrentTopicId(undefined);
    setMode('new');
  };

  const handleEditTopic = (topicId: string) => {
    setCurrentTopicId(topicId);
    setMode('edit');
  };

  const handleBack = () => {
    setMode('list');
    setCurrentTopicId(undefined);
  };

  const handleSave = (topic: ResearchTopic) => {
    if (mode === 'new') {
      setTopics(prev => [...prev, topic]);
    } else {
      setTopics(prev => prev.map(t => t.id === topic.id ? topic : t));
    }
    handleBack();
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
  };

  const handleCopyTopic = (topic: ResearchTopic) => {
    const newTopic: ResearchTopic = {
      ...topic,
      id: `topic_${Date.now()}`,
      name: `${topic.name} (副本)`,
      createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      updatedAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      isRecommended: false,
    };
    setTopics(prev => [...prev, newTopic]);
  };

  const handleSetRecommended = (topicId: string) => {
    setTopics(prev => prev.map(t => 
      t.id === topicId ? { ...t, isRecommended: !t.isRecommended } : t
    ));
  };

  const handleViewConditionTree = (topicId: string) => {
    // TODO: 实现查看条件树功能
    console.log('查看条件树:', topicId);
  };

  if (mode === 'list') {
    return (
      <TopicListPage
        topics={topics}
        onNewTopic={handleNewTopic}
        onEditTopic={handleEditTopic}
        onViewConditionTree={handleViewConditionTree}
        onDeleteTopic={handleDeleteTopic}
        onCopyTopic={handleCopyTopic}
        onSetRecommended={handleSetRecommended}
      />
    );
  }

  const currentTopic = currentTopicId ? topics.find(t => t.id === currentTopicId) : undefined;

  return (
    <TopicEditPage
      topicId={currentTopicId}
      topic={currentTopic}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
};

export default InspirationDiscoveryPage;
