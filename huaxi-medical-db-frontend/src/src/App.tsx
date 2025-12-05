// src/App.tsx

import React, { useState, useMemo } from 'react';
import 'antd/dist/reset.css'; // 导入 Ant Design 样式

// 导入布局和页面组件
import BasicLayout from '../layouts/BasicLayout';
import DataOverviewPage from '../pages/DataOverview/DataOverviewPage';
import ConditionSearchPage from '../pages/SmartSearch/ConditionSearchPage';

// 模拟所有页面的映射
const RouteMap: { [key: string]: React.FC } = {
  '/overview': DataOverviewPage,
  '/search/condition': ConditionSearchPage,
  // 其它页面（如数据字典、导出审批）可以在这里添加
};

const App: React.FC = () => {
  // 模拟当前路由路径
  const [currentPath, setCurrentPath] = useState<string>('/overview'); 

  // 根据当前路径渲染对应的页面组件
  const CurrentComponent = useMemo(() => {
    // 优先匹配精确路径
    if (RouteMap[currentPath]) {
      return RouteMap[currentPath];
    }
    // 如果是子路径，例如 /search/simple，可以统一显示一个通用页面
    return () => (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <h2>功能开发中...</h2>
        <p>当前路径：{currentPath}</p>
      </div>
    );
  }, [currentPath]);

  return (
    <BasicLayout 
      onMenuClick={setCurrentPath} 
      currentPath={currentPath}
    >
      <CurrentComponent />
    </BasicLayout>
  );
};

export default App;
