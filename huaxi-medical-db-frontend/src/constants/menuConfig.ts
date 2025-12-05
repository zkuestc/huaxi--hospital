// src/constants/menuConfig.ts

import React from 'react';
import { 
  HomeOutlined, 
  DashboardOutlined, 
  SearchOutlined, 
  FolderOpenOutlined, 
  BarsOutlined,
  UnorderedListOutlined,
  FileAddOutlined,
  ProjectOutlined,
  ExperimentOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

// 定义菜单项类型
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 顶部导航栏主菜单配置
export const TopMenuConfig: MenuItem[] = [
  getItem('首页', '/home', React.createElement(HomeOutlined)),
  getItem('疾病挖掘', '/overview', React.createElement(DashboardOutlined)),
  getItem('数据字典', '/dictionary', React.createElement(FolderOpenOutlined)),
  getItem('灵感发现', '/inspiration', React.createElement(BarsOutlined)),
  getItem('智能搜索', '/search', React.createElement(SearchOutlined), [
    getItem('简单搜索', '/search/simple'),
    getItem('条件搜索', '/search/condition'),
  ]),
  getItem('队列管理', '/queue', React.createElement(UnorderedListOutlined)),
  getItem('数据补录', '/data-entry', React.createElement(FileAddOutlined)),
  getItem('我的项目', '/projects', React.createElement(ProjectOutlined)),
  getItem('科研课题', '/research', React.createElement(ExperimentOutlined)),
  getItem('多模态文件管理', '/multimodal', React.createElement(FileTextOutlined)),
];

// 侧边栏主菜单配置（保留用于兼容）
export const SiderMenuConfig: MenuItem[] = TopMenuConfig;

// 顶部用户下拉菜单配置
export const UserDropdownMenu = [
  { key: 'profile', label: '个人资料' },
  { key: 'settings', label: '系统设置' },
  { type: 'divider' as const },
  { key: 'logout', label: '退出登录' },
];
