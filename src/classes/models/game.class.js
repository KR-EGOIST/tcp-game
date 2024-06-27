import {
  gameStartNotification,
  createLocationPacket,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id; // 유저 id
    this.users = []; // 모든 유저의 정보를 가지는 users
    // 클래스를 통해서 new 키워드를 사용을 하면 인스턴스가 생성 됩니다.
    // 인스턴스는 이미 생성된 객체다 라고 생각하면됩니다.
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting(대기중)', 'inProgress(진행중)'
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    // user.ping.bind(user) 를 하면 user.ping 을 호출할 때 this 는 user 가 된다.
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  // user 가 없으면 undefined 가 반환됨
  // user 가 있을 때만 확인을 해라
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  startGame() {
    this.state = 'inProgress';
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(this.getMaxLatency());

    // 모든 유저에게 게임이 시작되었다는 패킷을 전송한다.
    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  // user 클래스의 각각의 유저 x, y 위치 정보를 하나의 배열로 합치고 패킷으로 변환한다.
  getAllLocation() {
    const maxLatency = this.getMaxLatency(); // 전체 유저의 최대 레이턴시 구하기

    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      return { id: user.id, x, y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;
