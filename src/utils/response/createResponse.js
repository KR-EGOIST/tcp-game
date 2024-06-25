import { getProtoMessages } from '../../init/loadProtos.js';
import { getNextSequence } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (handlerId, responseCode, data = null, userId) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages.response.Response;

  const responsePayload = {
    handlerId,
    responseCode,
    timestamp: Date.now(), // 끝나는 시점
    data: data ? Buffer.from(JSON.stringify(data)) : null, // 데이터가 있으면 버퍼 객체 안에 넣어서 보낸다.
    sequence: userId ? getNextSequence(userId) : 0, // sequence 호출 수를 체크 안하는 것도 있을 수 있다라고 가정
  };

  // finish를 꼭 써줘야 한다. 사용방법이라서
  const buffer = Response.encode(responsePayload).finish();

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  ); // 패킷 길이에 타입 바이트 포함

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, buffer]);
};
