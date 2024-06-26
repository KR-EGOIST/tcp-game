class BaseManager {
  constructor() {
    if (new.target === BaseManager) {
      throw new TypeError('BaseManager 인스턴스를 직접 생성할 수 없습니다.');
    }
  }

  addPlayer(playerId, ...args) {
    throw new Error('addPlayer 메소드를 구현해야 합니다.');
  }

  removePlayer(playerId) {
    throw new Error('RemovePlayer 메소드를 구현해야 합니다.');
  }

  clearAll() {
    throw new Error('ClearAll 메소드를 구현해야 합니다.');
  }
}

export default BaseManager;
