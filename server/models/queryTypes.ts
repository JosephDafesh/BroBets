export type userRow = {
  user_id: number;
  username: string;
  password: string;
};

export type userQueryRes = {
  rows: userRow[];
};

export type eventRow = {
  event_id: number;
  event_title: string;
  created_at: Date;
  final_bets_in: Date;
  admin: number;
  total_points: number;
};

export type eventQueryRes = {
  rows: eventRow[];
};

export type betRow = {
  bet_id: number;
  event_id: number;
  type: 'multiple choice' | 'player input' | 'check multiple';
  correct_answer: string | null;
  question: string;
  points: number;
};

export type betQueryRes = {
  rows: betRow[];
};

export type answerRow = {
  question_id: number;
  answer: number;
  user_id: number;
};

export type answerQueryRes = {
  rows: answerRow[];
};

export type scoreRow = {
  user_id: number;
  event_id: number;
  score: number;
  place: number | null;
};
