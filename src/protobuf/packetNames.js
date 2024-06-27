// 프로토 패킷의 이름들을 자바스크립트에서 자유롭기 쓰기위해서
// 문자열 안에 들어가는 이름은 ‘[package].[packet name]’ 의 형태이어야 합니다.
export const packetNames = {
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping',
  },
  initial: {
    InitialPacket: 'initial.InitialPacket',
  },
  game: {
    CreateGamePayload: 'game.CreateGamePayload',
    JoinGamePayload: 'game.JoinGamePayload',
    LocationUpdatePayload: 'game.LocationUpdatePayload',
  },
  response: {
    Response: 'response.Response',
  },
  gameNotification: {
    Start: 'gameNotification.Start',
    LocationUpdate: 'gameNotification.LocationUpdate',
  },
};
