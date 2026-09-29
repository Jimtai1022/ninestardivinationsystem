import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';

export const Footer: React.FC = () => {
  const { language } = useAuth();
  const t = getTranslation(language);

  return (
    <footer className="w-full bg-[#e7f6ff] border-t border-[#bec8cb]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#006673] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[22px]">stars</span>
              </div>
              <span className="text-[20px] font-bold text-[#0d1e25] tracking-tight">
                {t.brandName}
              </span>
            </div>
            <p className="text-[14px] text-[#3e484b] mb-6 pr-4 leading-relaxed">
              融汇奇门遁甲、九星八宫与现代数智决策模型。去除迷信繁复，以客观严谨的东方数理逻辑，为企业决策、资产筹划与人生关键拐点提供清晰指引。
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dff1fb] text-[12px] font-medium text-[#3f6376] border border-[#bec8cb]/30">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Malaysian PDPA 2010 隐私合规体系保护</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[15px] font-bold text-[#0d1e25] mb-1">问测服务</h3>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              企业战略测算
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              个人八字运盘
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              时空奇门择吉
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              九星决策咨询
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[15px] font-bold text-[#0d1e25] mb-1">八宫解析</h3>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              坎一宫・坎水深潜
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              离九宫・离火昭显
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              震三与巽四宫分析
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              九宫排盘工具库
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[15px] font-bold text-[#0d1e25] mb-1">法律与合规</h3>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              PDPA 隐私声明
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              服务协议
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              数据加密标准
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              免责与参考条款
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[15px] font-bold text-[#0d1e25] mb-1">联系大师</h3>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              预约一对一问测
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              大师堂资质简介
            </a>
            <a href="#" className="text-[13px] text-[#3e484b] hover:text-[#006673] transition-colors">
              企业专案联络
            </a>
            <span className="text-[12px] text-[#6e797b] mt-1">服务时区: GMT+8 (MYT/SGT)</span>
          </div>
        </div>

        <div className="mt-12 pt-8 bg-[#d9ebf5]/40 rounded-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left border border-[#bec8cb]/20">
          <p className="text-[12px] text-[#3e484b]">
            {t.footerCopyright}
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[#3e484b]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#006673]">lock</span>
              全链路端到端保护
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#006673]">public</span>
              东南亚区域服务
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
