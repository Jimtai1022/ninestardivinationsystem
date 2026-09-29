import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';
import { PlayingCard, Consultation } from '../types';
import { getMarcusTanDefaultCards, computeHexagrams, shuffle36Deck } from '../lib/cardEngine';
import { NineStar36CardBoard } from './NineStar36CardBoard';

export const MasterConsole: React.FC = () => {
  const { user } = useAuth();
  const {
    consultations,
    activeConsultation,
    setActiveConsultationId,
    castSession,
    castCardsForConsultation,
    approveConsultation,
    followUps,
    answerFollowUp,
  } = useConsultation();

  const [activeTab, setActiveTab] = useState<'queue' | 'cast' | 'followup' | 'users'>('queue');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    activeConsultation?.id || consultations[0]?.id || ''
  );

  // Cast console state
  const [castCards, setCastCards] = useState<PlayingCard[]>(() => {
    return castSession?.cards || getMarcusTanDefaultCards();
  });
  const [masterNotes, setMasterNotes] = useState<string>(
    castSession?.masterNotesZh ||
      '雷天大壮卦象刚烈，合伙人多方各有企图。变卦归妹主张“先客后主，依约成事”，切忌以口头默契替代权责法约。'
  );
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});

  const selectedCase =
    consultations.find((c) => c.id === selectedCaseId) || consultations[0];

  const { benGua, bianGua, movingLineIndex } = computeHexagrams(castCards.slice(29));

  const handleShuffleAndCast = () => {
    // Generate fresh shuffled 36-card spread
    const fresh = shuffle36Deck();
    setCastCards(fresh);
    castCardsForConsultation(selectedCase.id, fresh, masterNotes);
    alert(`已为案卷 #${selectedCase.id} 成功开盘排定 36 牌密阵并推衍本变二卦！`);
  };

  const handleApprove = () => {
    approveConsultation(selectedCase.id, masterNotes);
    alert(`案卷 #${selectedCase.id} 已由林清泉大师亲自签章发布至求测人专席！`);
  };

  const handleAnswerSubmit = (followUpId: string) => {
    const text = answerTexts[followUpId];
    if (!text || !text.trim()) {
      alert('请输入回复内容');
      return;
    }
    answerFollowUp(followUpId, text);
    setAnswerTexts((prev) => ({ ...prev, [followUpId]: '' }));
    alert('已成功答复客户追问！');
  };

  return (
    <div className="w-full bg-[#f4faff] pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Master Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#006673] text-white flex items-center justify-center font-bold text-[22px] shadow-sm">
              林
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-[#0d1e25]">
                  林清泉 驻堂督导 · 大师工作台
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#006673] text-white text-[11px] font-bold">
                  MASTER EDITOR
                </span>
              </div>
              <p className="text-[13px] text-[#3e484b] mt-0.5">
                马来西亚易经学会特聘顾问 · 负责 36 牌阵开盘排定、六十四卦爻动研判与逐案签章发布
              </p>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#dff1fb] rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === 'queue'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#3e484b] hover:text-[#0d1e25]'
              }`}
            >
              案卷审阅队列 ({consultations.length})
            </button>
            <button
              onClick={() => setActiveTab('cast')}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === 'cast'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#3e484b] hover:text-[#0d1e25]'
              }`}
            >
              36 牌开盘控制台
            </button>
            <button
              onClick={() => setActiveTab('followup')}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === 'followup'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#3e484b] hover:text-[#0d1e25]'
              }`}
            >
              追问答复 ({followUps.filter((f) => f.status === 'pending').length})
            </button>
          </div>
        </div>

        {/* Tab 1: Queue */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20">
              <h2 className="text-[18px] font-bold text-[#0d1e25] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006673]">inbox</span>
                <span>当前受理问测案卷列表</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-[#bec8cb]/20 text-[#575d5f] text-[12px] uppercase">
                      <th className="py-3 px-4 font-semibold">案卷号</th>
                      <th className="py-3 px-4 font-semibold">求测人</th>
                      <th className="py-3 px-4 font-semibold">联络电话</th>
                      <th className="py-3 px-4 font-semibold">主归八宫</th>
                      <th className="py-3 px-4 font-semibold">当前状态</th>
                      <th className="py-3 px-4 font-semibold">提交时间</th>
                      <th className="py-3 px-4 font-semibold text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bec8cb]/15">
                    {consultations.map((c) => {
                      const isCurrent = c.id === selectedCaseId;
                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-[#f4faff] transition-colors ${
                            isCurrent ? 'bg-[#e7f6ff]/60' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#006673]">
                            #{c.id}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#0d1e25]">{c.name}</td>
                          <td className="py-3.5 px-4 text-[#3e484b]">{c.phone}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#dff1fb] text-[#006673] text-[12px] font-semibold">
                              {c.primaryPalace}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {c.status === 'published' && (
                              <span className="inline-flex items-center gap-1 text-[12px] text-[#006673] font-semibold">
                                <span className="w-2 h-2 rounded-full bg-[#006673]"></span>
                                已签发发布
                              </span>
                            )}
                            {c.status === 'pending_review' && (
                              <span className="inline-flex items-center gap-1 text-[12px] text-[#3f6376] font-semibold">
                                <span className="w-2 h-2 rounded-full bg-[#3f6376] animate-pulse"></span>
                                待大师复核
                              </span>
                            )}
                            {c.status === 'submitted' && (
                              <span className="inline-flex items-center gap-1 text-[12px] text-[#ba1a1a] font-semibold">
                                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                                待开盘排位
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[12px] text-[#575d5f]">{c.createdAt}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedCaseId(c.id);
                                setActiveConsultationId(c.id);
                                setActiveTab('cast');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#006673] hover:bg-[#1d808f] text-white text-[12px] font-semibold transition-colors shadow-sm"
                            >
                              开盘/督导
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 36 Card Cast Console */}
        {activeTab === 'cast' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#bec8cb]/15 mb-6 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] px-2 py-0.5 rounded bg-[#c3e8ff] text-[#006673] font-bold">
                      案卷 #{selectedCase.id}
                    </span>
                    <h2 className="text-[20px] font-bold text-[#0d1e25]">
                      求测人：{selectedCase.name} ({selectedCase.phone})
                    </h2>
                  </div>
                  <p className="text-[13px] text-[#3e484b] mt-1 italic">
                    “{selectedCase.question}”
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShuffleAndCast}
                    className="px-4 py-2.5 rounded-xl bg-[#dff1fb] hover:bg-[#c3e8ff] text-[#006673] text-[13px] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">casino</span>
                    <span>重新摇签排定 36 牌</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-5 py-2.5 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white text-[13px] font-bold transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>大师亲笔签章发布</span>
                  </button>
                </div>
              </div>

              {/* Spread Visualizer: Exact 36-Card Diagram Layout */}
              <div className="mb-6">
                <NineStar36CardBoard
                  cards={castCards}
                  benGua={benGua}
                  bianGua={bianGua}
                  movingLineIndex={movingLineIndex}
                  onShuffle={handleShuffleAndCast}
                />
              </div>

              {/* Master Notation Editor */}
              <div className="p-4 bg-[#f4faff] rounded-xl border border-[#bec8cb]/20">
                <label className="block text-[14px] font-bold text-[#0d1e25] mb-1.5">
                  林清泉大师亲笔批注与战略心法定音
                </label>
                <textarea
                  rows={3}
                  value={masterNotes}
                  onChange={(e) => setMasterNotes(e.target.value)}
                  className="w-full p-3 bg-white border border-[#bec8cb]/40 rounded-xl text-[14px] text-[#0d1e25] outline-none focus:border-[#006673]"
                ></textarea>
                <div className="flex justify-between items-center mt-2 text-[12px] text-[#575d5f]">
                  <span>按 PRD 要求：所有 AI 初拟段落必须由大师逐段注疏校正后方可呈交客户。</span>
                  <button
                    onClick={() => alert('批注已临时存盘')}
                    className="text-[#006673] font-bold hover:underline"
                  >
                    保存批注草稿
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Follow Up Questions */}
        {activeTab === 'followup' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20">
            <h2 className="text-[18px] font-bold text-[#0d1e25] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006673]">forum</span>
              <span>求测人深度追问处理中心</span>
            </h2>

            {followUps.length === 0 ? (
              <p className="text-[14px] text-[#575d5f] py-8 text-center">暂无待处理追问事项。</p>
            ) : (
              <div className="space-y-4">
                {followUps.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-[#f4faff] border border-[#bec8cb]/20">
                    <div className="flex items-center justify-between text-[12px] text-[#575d5f] mb-2">
                      <span className="font-semibold text-[#0d1e25]">
                        案卷 #{item.consultationId} · {item.userName}
                      </span>
                      <span>提交于：{item.createdAt}</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-[#bec8cb]/20 text-[14px] text-[#0d1e25] mb-3">
                      “{item.question}”
                    </div>

                    {item.answer ? (
                      <div className="p-3 bg-[#e7f6ff] rounded-lg border border-[#c3e8ff] text-[13px] text-[#006673]">
                        <span className="font-bold">已答复：</span> {item.answer}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="撰写大师答复..."
                          value={answerTexts[item.id] || ''}
                          onChange={(e) =>
                            setAnswerTexts((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          className="w-full p-2.5 bg-white border border-[#bec8cb]/40 rounded-lg text-[13px] text-[#0d1e25] outline-none focus:border-[#006673]"
                        ></textarea>
                        <button
                          onClick={() => handleAnswerSubmit(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#006673] hover:bg-[#1d808f] text-white text-[12px] font-semibold"
                        >
                          提交大师回复
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
