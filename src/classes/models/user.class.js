import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0; // 호출 횟수
    this.lastUpdateTime = Date.now();
    this.latency = 0;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    // (현재 시간 - 받은 데이터의 시간) / 2
    // 나누기 2 인 이유는 왕복이라서
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  // 본인의 x, y위치는 각 user 클래스마다 가지고 있으므로 각자 계산한 뒤 나중에 모아서 보내면 된다.
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시(ms)를 초(s) 단위로 계산
    const speed = 1; // 속도 고정, 초 당 1씩 움직이는 것이라고 가정
    // distance(거리) = speed(속도) * timeDiff(시간)
    const distance = speed * timeDiff;

    // x, y 축에서 이동한 거리 계산
    // 지금은 x 축으로만 움직인다고 가정
    return {
      x: this.x + distance,
      y: this.y,
    };
  }
}

export default User;
