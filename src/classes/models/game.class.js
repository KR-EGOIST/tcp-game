import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
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

  startGame() {
    this.state = 'inProgress';
  }
}

export default Game;
