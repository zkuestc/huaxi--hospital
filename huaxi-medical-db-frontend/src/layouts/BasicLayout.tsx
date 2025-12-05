// src/layouts/BasicLayout.tsx

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import { UserOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';
import { TopMenuConfig, UserDropdownMenu } from '../constants/menuConfig';

const { Header, Content } = Layout;

interface BasicLayoutProps {
  children: React.ReactNode;
  onMenuClick: (path: string) => void;
  currentPath: string;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children, onMenuClick, currentPath }) => {
  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: 18, 
            marginRight: 40,
            color: '#1890ff'
          }}>
            华西医院
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[currentPath]}
            items={TopMenuConfig}
            onClick={({ key }) => onMenuClick(key as string)}
            style={{ 
              flex: 1,
              borderBottom: 'none',
              lineHeight: '64px'
            }}
          />
        </div>
        <Space size="middle" style={{ marginLeft: 24 }}>
          <Button 
            type="text" 
            icon={<AppstoreOutlined />}
            onClick={() => onMenuClick('/discipline-screen')}
          >
            学科大屏
          </Button>
          <Button 
            type="text" 
            icon={<SettingOutlined />}
            onClick={() => onMenuClick('/system')}
          >
            系统管理
          </Button>
          <Dropdown menu={{ items: UserDropdownMenu }} placement="bottomRight">
            <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              akkala_admin
            </Button>
          </Dropdown>
        </Space>
      </Header>
      <Content style={{ margin: '24px', padding: 24, background: '#fff', minHeight: 'calc(100vh - 112px)' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default BasicLayout;
