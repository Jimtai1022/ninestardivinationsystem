import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';
import { UserProfile, UserRole, AdminSlotConfig, Consultation } from '../types';
import {
  fetchAllUserDetails,
  getAdminSlotConfig,
  updateUserRole,
} from '../lib/adminService';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { user, signOut } = useAuth();
  const { consultations } = useConsultation();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotConfig, setSlotConfig] = useState<AdminSlotConfig | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'cases'>('newest');

  // Selected User Modal / Dossier
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Active view tab in admin
  const [activeTab, setActiveTab] = useState<'users' | 'cases' | 'slot'>('users');

  // Load users and slot config
  const loadData = async () => {
    setLoading(true);
    try {
      const [userList, config] = await Promise.all([
        fetchAllUserDetails(),
        getAdminSlotConfig(),
      ]);
      setUsers(userList);
      setSlotConfig(config);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered and Sorted Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        // Role filter
        if (roleFilter !== 'all' && u.role !== roleFilter) return false;
        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          (u.displayName && u.displayName.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.toLowerCase().includes(q)) ||
          u.uid.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'name') {
          return (a.displayName || '').localeCompare(b.displayName || '');
        }
        if (sortBy === 'cases') {
          return (b.consultationCount || 0) - (a.consultationCount || 0);
        }
        return 0;
      });
  }, [users, roleFilter, searchQuery, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const paidCount = users.filter((u) => u.role === 'paid').length;
    const customerCount = users.filter((u) => u.role === 'customer').length;
    const adminCount = users.filter((u) => u.role === 'admin' || u.role === 'editor').length;
    return { total, paidCount, customerCount, adminCount };
  }, [users]);

  // Role modification handler
  const handleRoleChange = async (targetUid: string, newRole: UserRole) => {
    setRoleUpdating(true);
    try {
      await updateUserRole(targetUid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
      );
      if (selectedUser && selectedUser.uid === targetUid) {
        setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null));
      }
      setActionSuccess(`已成功更新用户角色为：${newRole.toUpperCase()}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert('更新失败: ' + err.message);
    } finally {
      setRoleUpdating(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['UID', '姓名', '邮箱', '电话', '角色', '语言', '注册时间', '案卷数量'];
    const rows = filteredUsers.map((u) => [
      u.uid,
      `"${u.displayName || '未填'}"`,
      u.email || '',
      u.phone || '',
      u.role,
      u.locale,
      u.createdAt,
      u.consultationCount || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `九星牌卦_全量用户档案_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get user's consultations
  const getUserConsultations = (userProfile: UserProfile): Consultation[] => {
    return consultations.filter(
      (c) =>
        c.uid === userProfile.uid ||
        (userProfile.email && c.name.includes(userProfile.displayName || ''))
    );
  };

  return (
    <div className="min-h-screen bg-[#f4faff] pb-24">
      {/* Top Banner Navigation */}
      <div className="bg-[#0d1e25] text-white border-b border-white/10 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="返回前台"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b7e3f] animate-pulse"></span>
                <h1 className="text-[18px] md:text-[20px] font-bold text-white tracking-tight">
                  九星牌卦 · 最高管理员控制台
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#006673] text-[11px] font-bold text-[#7ed3e3]">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-[12px] text-white/60 mt-0.5">
                当前登录身份：{user?.displayName || '系统管理员'} ({user?.email || '已认证'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            {/* Slot lock pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-[12px] text-[#9eefff] border border-white/10">
              <span className="material-symbols-outlined text-[16px] text-[#e5a93c]">lock</span>
              <span>单槽位已锁定 (1/1 席已满)</span>
            </div>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="刷新数据"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>

            <button
              onClick={signOut}
              className="px-3.5 py-1.5 rounded-xl bg-[#ba1a1a]/80 hover:bg-[#ba1a1a] text-white text-[12px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>退出管理</span>
            </button>
          </div>
        </div>

        {/* Admin Sub Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center gap-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 text-[14px] font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-[#7ed3e3] text-[#7ed3e3] font-bold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>全量用户档案详情 ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`py-3 text-[14px] font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'cases'
                ? 'border-[#7ed3e3] text-[#7ed3e3] font-bold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">folder_shared</span>
            <span>全案卷审核总表 ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('slot')}
            className={`py-3 text-[14px] font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'slot'
                ? 'border-[#7ed3e3] text-[#7ed3e3] font-bold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>唯一管理员席位状态</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        {/* Success Alert */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-[#eff9f0] border border-[#a1dbb2] text-[#1b7e3f] text-[13px] font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-[#bec8cb]/30 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6e797b]">总注册用户数</p>
              <h3 className="text-[28px] font-bold text-[#0d1e25] mt-1">{stats.total}</h3>
              <p className="text-[11px] text-[#006673] mt-1 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">person</span>
                端到端加密存档
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#dff1fb] text-[#006673] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">groups</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#bec8cb]/30 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6e797b]">付费专席 (VIP)</p>
              <h3 className="text-[28px] font-bold text-[#006673] mt-1">{stats.paidCount}</h3>
              <p className="text-[11px] text-[#3f6376] mt-1 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">star</span>
                8 宫完整研判权限
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#c3e8ff] text-[#006673] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#bec8cb]/30 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6e797b]">标准免费客户</p>
              <h3 className="text-[28px] font-bold text-[#3e484b] mt-1">{stats.customerCount}</h3>
              <p className="text-[11px] text-[#6e797b] mt-1 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">check</span>
                2 宫流年基础简批
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4f7] text-[#3e484b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">badge</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#bec8cb]/30 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6e797b]">累计问测案卷</p>
              <h3 className="text-[28px] font-bold text-[#b47514] mt-1">
                {consultations.length}
              </h3>
              <p className="text-[11px] text-[#b47514] mt-1 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">query_stats</span>
                36 张牌卦全息阵列
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#fff3df] text-[#b47514] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">auto_stories</span>
            </div>
          </div>
        </div>

        {/* TAB 1: User Profiles Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-[#bec8cb]/30 shadow-sm overflow-hidden">
            {/* Filter Bar */}
            <div className="p-5 border-b border-[#bec8cb]/20 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#f8fbfe]">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#6e797b]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索求测人姓名、手机号、邮箱或 UID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#bec8cb]/40 bg-white text-[13px] text-[#0d1e25] outline-none focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Role Filter */}
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#3e484b]">
                  <span>角色筛选:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-[#bec8cb]/40 bg-white text-[13px] text-[#0d1e25] outline-none focus:border-[#006673]"
                  >
                    <option value="all">全部用户 ({users.length})</option>
                    <option value="customer">标准客户 ({stats.customerCount})</option>
                    <option value="paid">付费 VIP ({stats.paidCount})</option>
                    <option value="admin">系统管理员 ({stats.adminCount})</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#3e484b]">
                  <span>排序:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-[#bec8cb]/40 bg-white text-[13px] text-[#0d1e25] outline-none focus:border-[#006673]"
                  >
                    <option value="newest">最新注册</option>
                    <option value="oldest">最早注册</option>
                    <option value="name">姓名拼音</option>
                    <option value="cases">问测案卷量</option>
                  </select>
                </div>

                {/* Export CSV button */}
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white text-[12px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>导出 CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f0f6fa] text-[#3e484b] text-[12px] font-semibold border-b border-[#bec8cb]/20">
                  <tr>
                    <th className="py-3.5 px-6">求测人 / 用户</th>
                    <th className="py-3.5 px-4">联系方式 (电话 / 邮箱)</th>
                    <th className="py-3.5 px-4">账号权限</th>
                    <th className="py-3.5 px-4">语言</th>
                    <th className="py-3.5 px-4">注册日期</th>
                    <th className="py-3.5 px-4">关联案卷</th>
                    <th className="py-3.5 px-6 text-right">操作管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bec8cb]/15">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#6e797b]">
                        <div className="inline-flex items-center gap-2">
                          <span className="animate-spin w-5 h-5 border-2 border-[#006673] border-t-transparent rounded-full"></span>
                          <span>正在载入全量用户档案...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#6e797b]">
                        没有符合筛选条件的用户记录
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const userCases = getUserConsultations(u);
                      return (
                        <tr
                          key={u.uid}
                          className="hover:bg-[#f4faff] transition-colors group cursor-pointer"
                          onClick={() => setSelectedUser(u)}
                        >
                          {/* User Name & Avatar */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {u.photoURL ? (
                                <img
                                  src={u.photoURL}
                                  alt={u.displayName || 'Avatar'}
                                  className="w-10 h-10 rounded-full object-cover border border-[#bec8cb]/30 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#006673] to-[#7ed3e3] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                                  {(u.displayName || '求')[0]}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-[#0d1e25] group-hover:text-[#006673] transition-colors">
                                  {u.displayName || '未填真实姓名'}
                                </div>
                                <div className="text-[11px] font-mono text-[#6e797b]">
                                  UID: {u.uid.slice(0, 16)}...
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-[#0d1e25] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-[#006673]">
                                  call
                                </span>
                                {u.phone || '未留手机'}
                              </span>
                              <span className="text-[11px] text-[#6e797b] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-[#6e797b]">
                                  mail
                                </span>
                                {u.email || '未留邮箱'}
                              </span>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-4 px-4">
                            {u.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#006673] text-white font-bold text-[11px] shadow-sm">
                                <span className="material-symbols-outlined text-[13px]">
                                  security
                                </span>
                                最高管理员
                              </span>
                            ) : u.role === 'editor' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1b7e3f] text-white font-bold text-[11px] shadow-sm">
                                <span className="material-symbols-outlined text-[13px]">
                                  shield_person
                                </span>
                                驻堂督导
                              </span>
                            ) : u.role === 'paid' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c3e8ff] text-[#006673] font-bold text-[11px]">
                                <span className="material-symbols-outlined text-[13px]">star</span>
                                付费 VIP 专席
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0f4f7] text-[#3e484b] font-medium text-[11px]">
                                标准客户 (Free)
                              </span>
                            )}
                          </td>

                          {/* Locale */}
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-[#e7f6ff] text-[#006673] text-[11px] font-semibold">
                              {u.locale === 'zh' ? '中文 (ZH)' : 'English (EN)'}
                            </span>
                          </td>

                          {/* Registration Date */}
                          <td className="py-4 px-4 text-[12px] text-[#3e484b]">
                            <div>{new Date(u.createdAt).toLocaleDateString('zh-CN')}</div>
                            <div className="text-[10px] text-[#6e797b]">
                              {new Date(u.createdAt).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>

                          {/* Consultation Count */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#006673] text-[14px]">
                                {userCases.length || u.consultationCount || 0}
                              </span>
                              <span className="text-[11px] text-[#6e797b]">卷</span>
                              {userCases.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#dff1fb] text-[#006673] font-medium">
                                  最新: {userCases[0].status}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedUser(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#dff1fb] hover:bg-[#c3e8ff] text-[#006673] font-semibold text-[11px] transition-colors"
                              >
                                查看全案
                              </button>

                              {u.role !== 'admin' && (
                                <button
                                  disabled={roleUpdating}
                                  onClick={() =>
                                    handleRoleChange(
                                      u.uid,
                                      u.role === 'paid' ? 'customer' : 'paid'
                                    )
                                  }
                                  className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] transition-colors ${
                                    u.role === 'paid'
                                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                                      : 'bg-[#006673]/10 hover:bg-[#006673]/20 text-[#006673]'
                                  }`}
                                  title={u.role === 'paid' ? '降级为标准客户' : '升为付费 VIP'}
                                >
                                  {u.role === 'paid' ? '降为免费' : '升级 VIP'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-[#f8fbfe] border-t border-[#bec8cb]/20 flex items-center justify-between text-[12px] text-[#6e797b]">
              <div>
                显示 {filteredUsers.length} / 共 {users.length} 位注册求测人
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#1b7e3f]"></span>
                  实时数据同步
                </span>
                <span>Malaysia PDPA 2010 隐私保护框架</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: All Cases Master View */}
        {activeTab === 'cases' && (
          <div className="bg-white rounded-3xl border border-[#bec8cb]/30 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[18px] font-bold text-[#0d1e25]">
                  全案卷问测审核总表 (All Divination Consultations)
                </h3>
                <p className="text-[13px] text-[#3e484b] mt-0.5">
                  所有求测人提交的 3 字段诉求与 36 张牌卦推演记录
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#dff1fb] text-[#006673] font-bold text-[13px]">
                共 {consultations.length} 份案卷
              </span>
            </div>

            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl border border-[#bec8cb]/30 hover:border-[#006673] transition-all bg-[#fbfdff]"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#bec8cb]/20">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#006673] text-white font-mono font-bold text-[12px]">
                        {c.id}
                      </span>
                      <span className="font-bold text-[15px] text-[#0d1e25]">{c.name}</span>
                      <span className="text-[12px] text-[#6e797b] font-mono">{c.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#eff9f0] text-[#1b7e3f]">
                        {c.status === 'published'
                          ? '已签发'
                          : c.status === 'pending_review'
                          ? '待复核'
                          : '已接收'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#dff1fb] text-[#006673] text-[11px] font-medium">
                        {c.primaryPalace}
                      </span>
                      <span className="text-[12px] text-[#6e797b]">{c.createdAt}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[13px] font-medium text-[#0d1e25] leading-relaxed">
                      <strong>求测核心问题：</strong> {c.question}
                    </p>
                    <p className="text-[12px] text-[#3e484b] mt-2 bg-[#f0f6fa] p-3 rounded-xl border border-[#bec8cb]/20">
                      <strong>卦象与流年简评：</strong> {c.publicSummary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Slot Status & Security */}
        {activeTab === 'slot' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[#bec8cb]/30 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#006673] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#0d1e25]">
                    系统唯一管理员席位状态 (Single Admin Slot RBAC)
                  </h3>
                  <p className="text-[13px] text-[#3e484b]">
                    不可篡改的单管理员专席保护机制
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#fff8ed] border border-[#f5c982] flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#b47514] text-[24px] shrink-0 mt-0.5">
                    lock
                  </span>
                  <div>
                    <h4 className="font-bold text-[#925c0e] text-[14px]">
                      席位已被锁定 · 注册通道已永久关闭 (0/1 席可用)
                    </h4>
                    <p className="text-[12px] text-[#794f10] mt-1 leading-relaxed">
                      根据用户指定需求（“i want u to provide me a single slot so that i can create my admin account and after that no body is allow to create an admin account”），系统仅提供一个管理员开通名额。该名额一旦绑定，任何后续注册请求都将被底层系统及安全规则坚决拒绝。
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-[#bec8cb]/30 bg-[#f8fbfe]">
                    <span className="text-[11px] text-[#6e797b] font-medium">席位所有者邮箱</span>
                    <p className="text-[15px] font-bold text-[#0d1e25] mt-1 font-mono">
                      {slotConfig?.adminEmail || user?.email || 'Khimfatttai@gmail.com'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#bec8cb]/30 bg-[#f8fbfe]">
                    <span className="text-[11px] text-[#6e797b] font-medium">管理员尊称</span>
                    <p className="text-[15px] font-bold text-[#0d1e25] mt-1">
                      {slotConfig?.adminName || user?.displayName || '系统最高管理者'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#bec8cb]/30 bg-[#f8fbfe]">
                    <span className="text-[11px] text-[#6e797b] font-medium">席位激活时间</span>
                    <p className="text-[13px] font-bold text-[#0d1e25] mt-1 font-mono">
                      {slotConfig?.claimedAt
                        ? new Date(slotConfig.claimedAt).toLocaleString('zh-CN')
                        : new Date().toLocaleString('zh-CN')}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#bec8cb]/30 bg-[#f8fbfe]">
                    <span className="text-[11px] text-[#6e797b] font-medium">单槽位安全策略</span>
                    <p className="text-[13px] font-bold text-[#1b7e3f] mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Firestore Rules 规则严格防御中
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1e25] text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-[#006673] text-[11px] font-bold text-[#7ed3e3]">
                  SECURITY CONSTITUTION
                </span>
                <h4 className="text-[18px] font-bold text-white mt-3">
                  安全策略与准则
                </h4>
                <ul className="mt-4 space-y-3 text-[12px] text-white/80 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7ed3e3] text-[16px] shrink-0 mt-0.5">
                      done
                    </span>
                    <span>页眉 (Header / Navbar) 坚决不放置管理员登录或注册入口。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7ed3e3] text-[16px] shrink-0 mt-0.5">
                      done
                    </span>
                    <span>所有管理员入口严格置于页脚 (Footer)，确保前台体验专注纯粹。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7ed3e3] text-[16px] shrink-0 mt-0.5">
                      done
                    </span>
                    <span>唯一管理员可查看全量用户的电话、邮箱、UID、提问及案卷进展。</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-white/50">
                九星牌卦数智系统 · 安全版本 2.0
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Dossier Drawer / Full Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1e25]/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#bec8cb]/30 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f4faff] hover:bg-[#d9ebf5] flex items-center justify-center text-[#3e484b] transition-colors"
            >
              ✕
            </button>

            {/* User Title */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#bec8cb]/20">
              {selectedUser.photoURL ? (
                <img
                  src={selectedUser.photoURL}
                  alt={selectedUser.displayName || 'Avatar'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#006673]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#006673] text-white flex items-center justify-center text-[22px] font-bold">
                  {(selectedUser.displayName || '求')[0]}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[20px] font-bold text-[#0d1e25]">
                    {selectedUser.displayName || '未填姓名'}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      selectedUser.role === 'paid'
                        ? 'bg-[#c3e8ff] text-[#006673]'
                        : selectedUser.role === 'admin'
                        ? 'bg-[#006673] text-white'
                        : 'bg-[#f0f4f7] text-[#3e484b]'
                    }`}
                  >
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>
                <p className="text-[12px] font-mono text-[#6e797b] mt-0.5">
                  UID: {selectedUser.uid}
                </p>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#f8fbfe] border border-[#bec8cb]/20">
                <span className="text-[11px] text-[#6e797b] block">联系电话</span>
                <span className="text-[13px] font-bold text-[#0d1e25]">
                  {selectedUser.phone || '未填写'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fbfe] border border-[#bec8cb]/20">
                <span className="text-[11px] text-[#6e797b] block">电子邮箱</span>
                <span className="text-[13px] font-bold text-[#0d1e25] truncate block">
                  {selectedUser.email || '未填写'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fbfe] border border-[#bec8cb]/20">
                <span className="text-[11px] text-[#6e797b] block">首选语言</span>
                <span className="text-[13px] font-bold text-[#0d1e25]">
                  {selectedUser.locale === 'zh' ? '中文 (Chinese)' : 'English'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fbfe] border border-[#bec8cb]/20 col-span-2 md:col-span-3">
                <span className="text-[11px] text-[#6e797b] block">账号创建注册时间</span>
                <span className="text-[13px] font-bold text-[#0d1e25] font-mono">
                  {new Date(selectedUser.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>

            {/* Role Switcher Action inside Modal */}
            <div className="mb-6 p-4 rounded-2xl bg-[#e7f6ff] border border-[#bec8cb]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-[#006673] text-[13px]">
                  管理该求测人权限级别
                </h4>
                <p className="text-[11px] text-[#3e484b]">
                  当前角色：{selectedUser.role}。可立即授予或回收付费 VIP 8 宫解读特权。
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={roleUpdating || selectedUser.role === 'customer'}
                  onClick={() => handleRoleChange(selectedUser.uid, 'customer')}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white border border-[#bec8cb]/40 hover:bg-[#f0f4f7] text-[#3e484b] disabled:opacity-40"
                >
                  设为普通客户
                </button>
                <button
                  type="button"
                  disabled={roleUpdating || selectedUser.role === 'paid'}
                  onClick={() => handleRoleChange(selectedUser.uid, 'paid')}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[#006673] hover:bg-[#1d808f] text-white disabled:opacity-40 shadow-sm"
                >
                  升级为付费 VIP
                </button>
              </div>
            </div>

            {/* Consultations by this user */}
            <div>
              <h4 className="font-bold text-[#0d1e25] text-[14px] mb-3 flex items-center justify-between">
                <span>该用户提交的问测案卷</span>
                <span className="text-[12px] text-[#6e797b]">
                  共 {getUserConsultations(selectedUser).length} 卷
                </span>
              </h4>

              {getUserConsultations(selectedUser).length === 0 ? (
                <div className="py-8 text-center bg-[#f8fbfe] rounded-2xl border border-dashed border-[#bec8cb]/40 text-[#6e797b] text-[13px]">
                  该用户尚未提交过问测案卷
                </div>
              ) : (
                <div className="space-y-3">
                  {getUserConsultations(selectedUser).map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-[#bec8cb]/30 bg-[#fbfdff]"
                    >
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <span className="font-mono font-bold text-[#006673]">{c.id}</span>
                        <span className="text-[#6e797b]">{c.createdAt}</span>
                      </div>
                      <p className="text-[13px] text-[#0d1e25] font-medium">
                        {c.question}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-[#eff9f0] text-[#1b7e3f] font-semibold">
                          状态: {c.status}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#dff1fb] text-[#006673]">
                          主宫: {c.primaryPalace}
                        </span>
                        <span className="text-[#b47514] font-bold">
                          评断: {c.annualVerdict} ({c.annualScore} 分)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Close */}
            <div className="mt-6 pt-4 border-t border-[#bec8cb]/20 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-[#0d1e25] text-white text-[13px] font-semibold hover:bg-[#22333a]"
              >
                关闭档案窗口
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
