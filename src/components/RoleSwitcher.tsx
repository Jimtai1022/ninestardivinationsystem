import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  currentView: 'landing' | 'reading' | 'master';
  setCurrentView: (view: 'landing' | 'reading' | 'master') => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentView, setCurrentView }) => {
  const { user, updateRole, signInDemoUser, signOut } = useAuth();
  const { resetDatabase } = useConsultation();
  const [collapsed, setCollapsed] = useState(false);

  const roles: { role: UserRole; labelZh: string; labelEn: string; desc: string }[] = [
    {
      role: 'customer',
      labelZh: '① 标准客户 (Free)',
      labelEn: 'Standard Customer',
      desc: '提交3字段问测，查看流年总览及事业/财富宫，其余6宫及动爻锁定',
    },
    {
      role: 'paid',
      labelZh: '② 付费专席 (Paid VIP)',
      labelEn: 'Paid VIP Customer',
      desc: '解锁完整8宫深度解读、36牌阵、12流月推演、动爻避坑与追问特权',
    },
    {
      role: 'editor',
      labelZh: '③ 驻堂督导/大师 (Master)',
      labelEn: 'Master Editor (林清泉)',
      desc: '大师工作台，开盘亲抽36牌阵，AI图谱逐段研判，签章发布案卷',
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0d1e25] text-white text-[12px] shadow-xl hover:bg-[#22333a] border border-white/20 transition-all cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#7ed3e3] animate-pulse"></span>
          <span className="font-semibold">角色测试切换器</span>
          <span className="text-[#9eefff] font-mono">[{user?.role || 'Guest'}]</span>
        </button>
      ) : (
        <div className="w-80 md:w-96 rounded-2xl bg-[#0d1e25]/95 backdrop-blur-xl border border-white/15 text-white p-4 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7ed3e3] text-[20px]">switch_account</span>
              <span className="text-[13px] font-bold text-white tracking-wide">
                多角色权限测试控制台
              </span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-white/60 hover:text-white p-1 rounded-md text-[16px] leading-none"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-white/70 leading-relaxed">
            PRD 明确要求支持 3 种角色权限测试。一键切换角色以验证各角色的独特界面与权限边界：
          </p>

          <div className="flex flex-col gap-2">
            {roles.map((r) => {
              const active = user?.role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    signInDemoUser(r.role);
                    if (r.role === 'editor') {
                      setCurrentView('master');
                    } else if (currentView === 'master') {
                      setCurrentView('reading');
                    }
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex flex-col gap-0.5 border cursor-pointer ${
                    active
                      ? 'bg-[#006673] border-[#7ed3e3] text-white shadow-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{r.labelZh}</span>
                    {active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7ed3e3] text-[#001f24] font-bold">
                        当前身份
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-white/70">{r.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                resetDatabase();
                alert('已成功重置为官方标准测试卦例（#NS-20250518-882 张子涵合伙问测案卷）');
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <span>重置测试数据</span>
            </button>

            <button
              onClick={() => {
                if (currentView === 'landing') setCurrentView('reading');
                else if (currentView === 'reading') setCurrentView('master');
                else setCurrentView('landing');
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-[#7ed3e3]/20 hover:bg-[#7ed3e3]/30 text-[#9eefff] text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              <span>切换视图 ({currentView})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
