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
