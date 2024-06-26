import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  // 오버라이딩(Overriding)은 상속받은 메서드의 내용만 변경하는 것이다.
  // interval에는 숫자가 들어옵니다. 3초에 한번 5초에 한번 같은 이런 것
  // type은 확장성 때문에 추가했습니다.
  addPlayer(playerId, callback, interval, type = 'user') {
    // this.intervals에 해당 playerId로 등록된 intervals이 있는지 확인
    if (!this.intervals.has(playerId)) {
      // 한 명의 유저가 여러 개의 스케줄러를 등록할 수 있기 때문에 key 는 playerId, value 는 new Map()
      // intervals에 key 값이 playerId가 없으면
      this.intervals.set(playerId, new Map());
    }
    // intervals에 key 값이 playerId가 있으면
    // setInterval 사용 방법은 인자로 콜백함수, 인터벌이 동작할 시간
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  addGame(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'game');
  }

  // interval 초 마다 유저의 위치 정보를 update
  addUpdatePosition(playerId, callback, interval) {
    this.addPlayer(playerId, callback, interval, 'updatePosition');
  }

  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      // 해당 유저의 intervalId 를 전부 삭제한다.
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      // key 값이 playerId인 값을 삭제
      this.intervals.delete(playerId);
    }
  }

  // 해당 유저의 해당 타입의 intervalId를 삭제
  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  // 전부 삭제하는 함수
  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
