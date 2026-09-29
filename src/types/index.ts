export type UserRole = 'customer' | 'paid' | 'editor' | 'admin';

export type Language = 'zh' | 'en';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string;
  role: UserRole;
  locale: Language;
  createdAt: string;
  consultationCount?: number;
}

export interface AdminSlotConfig {
  isClaimed: boolean;
  slotCapacity: number;
  adminUid?: string | null;
  adminEmail?: string | null;
  adminName?: string | null;
  adminPhone?: string | null;
  claimedAt?: string | null;
}

export type ConsultationStatus =
  | 'submitted'
  | 'analyzing'
  | 'awaiting_cast'
  | 'pending_review'
  | 'published'
  | 'needs_clarification';

export interface Consultation {
  id: string;
  uid: string;
  name: string;
  phone: string;
  question: string;
  status: ConsultationStatus;
  primaryPalace: string;
  secondaryPalaces: string[];
  castSessionId?: string;
  publicSummary: string;
  annualScore: number;
  annualVerdict: string;
  createdAt: string;
  updatedAt: string;
  isVip?: boolean;
}

export interface PlayingCard {
  position: number; // 1 to 36
  suit: 'spade' | 'heart' | 'club' | 'diamond'; // ♠ ♥ ♣ ♦
  rank: '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
  label: string; // e.g. "♠ A"
  nameZh: string; // e.g. "黑桃 A"
  nameEn: string; // e.g. "Ace of Spades"
  roleTitleZh?: string; // e.g. "流年牌", "春季", "正月"
  roleTitleEn?: string;
  meaningZh?: string;
  meaningEn?: string;
}

export interface HexagramData {
  number?: number;
  nameZh: string;
  nameEn: string;
  upperTrigramZh: string;
  lowerTrigramZh: string;
  lines: boolean[]; // true = yang (方块/红心), false = yin (黑桃/梅花). index 0 = line 1 (初爻)
  summaryZh: string;
  summaryEn: string;
  guaCiZh?: string;
  coreMottoZh?: string;
  verdictZh?: string;
  businessAdviceZh?: string;
  employeeAdviceZh?: string;
  affairsZh?: string;
  loveZh?: string;
  careerZh?: string;
  masterAdviceZh?: string;
}

export interface CastSession {
  id: string;
  consultationId: string;
  castBy: string;
  castByName: string;
  castAt: string;
  lunarDateZh: string;
  lunarDateEn: string;
  cards: PlayingCard[];
  benGua: HexagramData;
  bianGua: HexagramData;
  movingLineIndex: number; // 1 to 6
  movingCard: PlayingCard;
  governingStarsZh: string[];
  masterNotesZh: string;
  masterNotesEn: string;
  engineVersion: string;
}

export interface PalaceReading {
  palaceId: string;
  nameZh: string;
  nameEn: string;
  tagZh: string;
  tagEn: string;
  icon: string;
  unlocked: boolean;
  contentZh: string;
  contentEn: string;
  keyActionPointsZh?: string[];
  keyActionPointsEn?: string[];
  metricLabelZh?: string;
  metricLabelEn?: string;
  metricValue?: string;
  metricProgress?: number;
  associatedStarZh?: string;
  associatedCardZh?: string;
  badgeTextZh?: string;
  badgeTextEn?: string;
}

export interface FullReadingReport {
  consultationId: string;
  language: Language;
  enStatus: 'draft' | 'reviewed';
  palaces: Record<string, PalaceReading>;
  approvedBy: string;
  approvedByName: string;
  approvedAt: string;
}

export interface FollowUpItem {
  id: string;
  consultationId: string;
  uid: string;
  userName: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  createdAt: string;
  answeredAt?: string;
}
