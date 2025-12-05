// src/pages/DataOverview/DataOverviewPage.tsx

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { FundOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';

const DataOverviewPage: React.FC = () => {
  return (
    <div>
      <h2>疾病概览 (4.1)</h2>
      <p>这里展示华西医院-肺结节专病数据库的核心统计数据和可视化图表。</p>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="总患者数"
              value={15890}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="结节总数"
              value={32560}
              prefix={<FundOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="已标注数据比例"
              value={85.5}
              precision={1}
              suffix="%"
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Card title="数据分布趋势图" style={{ marginTop: 24 }}>
        <div style={{ height: 300, textAlign: 'center', lineHeight: '300px', background: '#f5f5f5' }}>
          [这里将放置图表组件，如 Echarts 或 AntV G2]
        </div>
      </Card>
    </div>
  );
};

export default DataOverviewPage;
