import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

// 해당 id의 게임을 추가한다.
export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);
  return session; // session을 반환해 어떤 게임이 만들어졌다를 알린다.
};

// 해당 id의 게임을 삭제한다.
export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0]; // 삭제된 게임이 어떤 게임인지 반환해서 알린다.
  }
};

// 해당 id의 게임을 찾는다.
export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

// 총 활성화된 게임이 몇 개인지
export const getAllGameSessions = () => {
  return gameSessions;
};
