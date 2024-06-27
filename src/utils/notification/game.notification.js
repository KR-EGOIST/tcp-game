// 게임 내에서 모든 알림을 담당하는 파일
// 서버에서 유저에게 보낼 알림이 있을 때 사용
import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

// 범용적으로 다른 notification들에게도 사용할 예정
const makeNotification = (message, type) => {
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, message]);
};

// 유저의 위치 업데이트 패킷 생성 함수
// 유저들에 대한 위치정보를 그냥 배열로 쭉 받아가지고 그거를 Payload 에 묶어서 보냅니다.
export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const Location = protoMessages.gameNotification.LocationUpdate;

  const payload = { users };
  // proto 에서 create 는 인자로 받은 payload 를 객체(메시지) 형식으로 변환해준다.
  const message = Location.create(payload);
  // proto 에서 encode 는 인자로 받은 message 를 버퍼 형식으로 변환해준다.
  const locationPacket = Location.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};

// 게임 시작하는 패킷 생성 함수
// 유저들에 대한 위치정보를 그냥 배열로 쭉 받아가지고 그거를 Payload 에 묶어서 보냅니다.
export const gameStartNotification = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Start = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp };
  // proto 에서 create 는 인자로 받은 payload 를 객체(메시지) 형식으로 변환해준다.
  const message = Start.create(payload);
  // proto 에서 encode 는 인자로 받은 message 를 버퍼 형식으로 변환해준다.
  const startPacket = Start.encode(message).finish();
  return makeNotification(startPacket, PACKET_TYPE.GAME_START);
};

// 핑패킷을 만들어주는 함수
export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  const payload = { timestamp };
  // proto 에서 create 는 인자로 받은 payload 를 객체(메시지) 형식으로 변환해준다.
  const message = ping.create(payload);
  // proto 에서 encode 는 인자로 받은 message 를 버퍼 형식으로 변환해준다.
  const pingPacket = ping.encode(message).finish();
  return makeNotification(pingPacket, PACKET_TYPE.PING);
};
