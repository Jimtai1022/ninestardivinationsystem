import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Consultation,
  CastSession,
  PalaceReading,
  FollowUpItem,
  PlayingCard,
} from '../types';
import {
  initialConsultations,
  defaultMarcusCastSession,
  defaultMarcusPalaces,
  initialFollowUps,
} from '../lib/dummyData';
import { computeHexagrams, getMarcusTanDefaultCards, shuffle36Deck } from '../lib/cardEngine';
import { db, collection, doc, setDoc, getDocs, handleFirestoreError, OperationType } from '../lib/firebase';

interface ConsultationContextType {
  consultations: Consultation[];
  activeConsultation: Consultation | null;
  setActiveConsultationId: (id: string) => void;
  castSession: CastSession | null;
  palaces: Record<string, PalaceReading>;
  followUps: FollowUpItem[];
  submitConsultation: (name: string, phone: string, question: string) => Promise<string>;
  castCardsForConsultation: (consultationId: string, cards: PlayingCard[], masterNotes?: string) => void;
  shuffleCurrentCards: () => void;
  approveConsultation: (consultationId: string, masterNotes?: string) => void;
  upgradeToPaid: (consultationId: string) => void;
  submitFollowUp: (consultationId: string, question: string, userName: string, uid: string) => void;
  answerFollowUp: (followUpId: string, answer: string) => void;
  resetDatabase: () => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem('nine_star_consultations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialConsultations;
      }
    }
    return initialConsultations;
  });

  const [activeConsultationId, setActiveConsultationId] = useState<string>('NS-20250518-882');

  const [castSession, setCastSession] = useState<CastSession | null>(() => {
    const saved = localStorage.getItem('nine_star_cast_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultMarcusCastSession;
      }
    }
    return defaultMarcusCastSession;
  });

  const [palaces, setPalaces] = useState<Record<string, PalaceReading>>(() => {
    const saved = localStorage.getItem('nine_star_palaces');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultMarcusPalaces;
      }
    }
    return defaultMarcusPalaces;
  });

  const [followUps, setFollowUps] = useState<FollowUpItem[]>(() => {
    const saved = localStorage.getItem('nine_star_followups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialFollowUps;
      }
    }
    return initialFollowUps;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nine_star_consultations', JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    if (castSession) {
      localStorage.setItem('nine_star_cast_session', JSON.stringify(castSession));
    }
  }, [castSession]);

  useEffect(() => {
    localStorage.setItem('nine_star_palaces', JSON.stringify(palaces));
  }, [palaces]);

  useEffect(() => {
    localStorage.setItem('nine_star_followups', JSON.stringify(followUps));
  }, [followUps]);

  const activeConsultation =
    consultations.find((c) => c.id === activeConsultationId) || consultations[0] || null;

  // Classify Question based on natural language keywords (PRD Section 2)
  const classifyQuestion = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('合伙') || lower.includes('事业') || lower.includes('创业') || lower.includes('公司') || lower.includes('项目') || lower.includes('工作')) {
      return { primary: '事业宫 (Career)', secondary: ['财富宫', '组织心法'] };
    }
    if (lower.includes('财') || lower.includes('投资') || lower.includes('资金') || lower.includes('现金') || lower.includes('买房') || lower.includes('收入')) {
      return { primary: '财富宫 (Wealth)', secondary: ['事业宫', '官禄宫'] };
    }
    if (lower.includes('婚') || lower.includes('恋') || lower.includes('感情') || lower.includes('桃花') || lower.includes('妻子') || lower.includes('丈夫')) {
      return { primary: '感情宫 (Romance)', secondary: ['家庭宫', '交际宫'] };
    }
    if (lower.includes('团队') || lower.includes('管理') || lower.includes('员工') || lower.includes('组织') || lower.includes('股东')) {
      return { primary: '组织宫 (Mind & Strategy)', secondary: ['事业宫', '官禄宫'] };
    }
    if (lower.includes('家') || lower.includes('父母') || lower.includes('风水') || lower.includes('搬迁')) {
      return { primary: '家庭宫 (Family)', secondary: ['财富宫', '儿女宫'] };
    }
    return { primary: '事业宫 (Career)', secondary: ['财富宫', '组织心法'] };
  };

  // Submit new 3-field intake consultation (Shuffles cards for every new question!)
  const submitConsultation = async (name: string, phone: string, question: string): Promise<string> => {
    const dateNum = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(100 + Math.random() * 900);
    const newId = `NS-${dateNum}-${randNum}`;

    const { primary, secondary } = classifyQuestion(question);

    // CRITICAL: Every new question shuffles the 36-card deck!
    const shuffledCards = shuffle36Deck();
    const hexagramSlice = shuffledCards.slice(29);
    const { benGua, bianGua, movingLineIndex } = computeHexagrams(hexagramSlice);
    const card36 = shuffledCards[35];
    const annualCard = shuffledCards[0];

    const annualScore = 72 + ((movingLineIndex * 7 + question.length) % 23);

    const newCase: Consultation = {
      id: newId,
      uid: 'current-user',
      name,
      phone,
      question,
      status: 'published',
      primaryPalace: primary,
      secondaryPalaces: secondary,
      publicSummary: `“求测诉求已入盘，主宫归入【${primary}】。流年基石牌显现【${annualCard.nameZh}】，卦象起于【${benGua.nameZh}】，应期动爻变入【${bianGua.nameZh}】。${benGua.summaryZh}，宜顺应时空干支择期推进。”`,
      annualScore,
      annualVerdict: annualScore >= 85 ? '大有可为 · 顺风扬帆' : annualScore >= 75 ? '先劳后逸 · 动中有获' : '守正出奇 · 稳中求胜',
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
      updatedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
      isVip: false,
    };

    const newCastSession: CastSession = {
      id: `cast-${newId}`,
      consultationId: newId,
      castBy: 'master-lin-01',
      castByName: '林清泉 驻堂督导',
      castAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
      lunarDateZh: '乙巳流年（农历）· 时空奇门卦局',
      lunarDateEn: 'Year of Yi-Si (Lunar) · Space-Time Qi Men Chart',
      cards: shuffledCards,
      benGua,
      bianGua,
      movingLineIndex,
      movingCard: card36,
      governingStarsZh: ['【天医星】解困', '【生气星】转机'],
      masterNotesZh: `依时空所起 36 牌开盘：本卦为【${benGua.nameZh}】，第 ${movingLineIndex} 爻动变【${bianGua.nameZh}】。Card 36 [${card36.label}] 临门，顺应时令，先理权责法务，后图资本落地。`,
      masterNotesEn: `Authentic spread cast: Primary ${benGua.nameEn} to ${bianGua.nameEn}. Line ${movingLineIndex} moving.`,
      engineVersion: 'NineStarEngine-v1.2-Deterministic',
    };

    setConsultations((prev) => [newCase, ...prev]);
    setActiveConsultationId(newId);
    setCastSession(newCastSession);

    // Try saving to Firestore
    try {
      await setDoc(doc(db, 'consultations', newId), newCase);
    } catch (e) {
      console.warn('Firestore offline fallback used for new consultation');
    }

    return newId;
  };

  // Re-shuffle current cards on demand
  const shuffleCurrentCards = () => {
    if (!activeConsultation) return;
    const shuffledCards = shuffle36Deck();
    const hexagramSlice = shuffledCards.slice(29);
    const { benGua, bianGua, movingLineIndex } = computeHexagrams(hexagramSlice);
    const card36 = shuffledCards[35];

    const updatedSession: CastSession = {
      id: `cast-${activeConsultation.id}-${Date.now()}`,
      consultationId: activeConsultation.id,
      castBy: 'master-lin-01',
      castByName: '林清泉 驻堂督导',
      castAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
      lunarDateZh: '乙巳流年（农历）· 时空奇门卦局',
      lunarDateEn: 'Year of Yi-Si (Lunar) · Space-Time Qi Men Chart',
      cards: shuffledCards,
      benGua,
      bianGua,
      movingLineIndex,
      movingCard: card36,
      governingStarsZh: ['【天医星】解困', '【生气星】转机'],
      masterNotesZh: `大师重新洗牌排定 36 牌阵：起卦【${benGua.nameZh}】，变卦【${bianGua.nameZh}】（第 ${movingLineIndex} 爻动，Card 36 [${card36.label}] 定势）。`,
      masterNotesEn: `Re-shuffled spread: ${benGua.nameEn} to ${bianGua.nameEn}.`,
      engineVersion: 'NineStarEngine-v1.2-Deterministic',
    };

    setCastSession(updatedSession);
  };

  // Editor action: Cast 36 cards
  const castCardsForConsultation = (
    consultationId: string,
    cards: PlayingCard[],
    masterNotes?: string
  ) => {
    const hexagramSlice = cards.slice(29);
    const { benGua, bianGua, movingLineIndex } = computeHexagrams(hexagramSlice);

    const newCastSession: CastSession = {
      id: `cast-${consultationId}`,
      consultationId,
      castBy: 'master-lin-01',
      castByName: '林清泉 驻堂督导',
      castAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
      lunarDateZh: '乙巳流年（农历）· 时空奇门卦局',
      lunarDateEn: 'Year of Yi-Si (Lunar) · Space-Time Qi Men Chart',
      cards,
      benGua,
      bianGua,
      movingLineIndex,
      movingCard: cards[35],
      governingStarsZh: ['【天医星】解困', '【生气星】转机'],
      masterNotesZh:
        masterNotes ||
        `卦象昭示：${benGua.nameZh}转${bianGua.nameZh}。动爻在第${movingLineIndex}爻，顺势而为，法务前置可化险为夷。`,
      masterNotesEn: `Transformation: ${benGua.nameEn} to ${bianGua.nameEn}. Line ${movingLineIndex} moves. Focus on legal clarity.`,
      engineVersion: 'NineStarEngine-v1.2-Deterministic',
    };

    setCastSession(newCastSession);

    // Update consultation status to pending_review
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId
          ? {
              ...c,
              status: 'pending_review',
              castSessionId: newCastSession.id,
              updatedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
            }
          : c
      )
    );
  };

  // Editor action: Approve & Publish
  const approveConsultation = (consultationId: string, masterNotes?: string) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId
          ? {
              ...c,
              status: 'published',
              updatedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
            }
          : c
      )
    );
    if (masterNotes && castSession) {
      setCastSession({ ...castSession, masterNotesZh: masterNotes });
    }
  };

  // Paid upgrade action: Unlocks all 8 palaces for this reading
  const upgradeToPaid = (consultationId: string) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === consultationId ? { ...c, isVip: true } : c))
    );

    // Unlock all palaces
    setPalaces((prev) => {
      const updated: Record<string, PalaceReading> = {};
      for (const [key, palace] of Object.entries(prev)) {
        updated[key] = { ...palace, unlocked: true };
      }
      return updated;
    });
  };

  // Follow-up interaction
  const submitFollowUp = (
    consultationId: string,
    question: string,
    userName: string,
    uid: string
  ) => {
    const newItem: FollowUpItem = {
      id: `f-${Date.now()}`,
      consultationId,
      uid,
      userName,
      question,
      status: 'pending',
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
    };
    setFollowUps((prev) => [newItem, ...prev]);
  };

  const answerFollowUp = (followUpId: string, answer: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === followUpId
          ? {
              ...f,
              answer,
              status: 'answered',
              answeredAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }) + ' GMT+8',
            }
          : f
      )
    );
  };

  const resetDatabase = () => {
    setConsultations(initialConsultations);
    setActiveConsultationId('NS-20250518-882');
    setCastSession(defaultMarcusCastSession);
    setPalaces(defaultMarcusPalaces);
    setFollowUps(initialFollowUps);
    localStorage.removeItem('nine_star_consultations');
    localStorage.removeItem('nine_star_cast_session');
    localStorage.removeItem('nine_star_palaces');
    localStorage.removeItem('nine_star_followups');
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        activeConsultation,
        setActiveConsultationId,
        castSession,
        palaces,
        followUps,
        submitConsultation,
        castCardsForConsultation,
        shuffleCurrentCards,
        approveConsultation,
        upgradeToPaid,
        submitFollowUp,
        answerFollowUp,
        resetDatabase,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
};
