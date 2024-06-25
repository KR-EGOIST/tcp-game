import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => (data) => {
  // 기존 버퍼에 새로 수신된 데이터를 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 총 헤더 길이 (패킷 길이 정보 + 타입 정보)
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    // 1. 패킷 길이 정보 수신 (4바이트)
    const length = socket.buffer.readUInt32BE(0);

    // 2. 패킷 타입 정보 수신 (1바이트)
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    // 3. 패킷 전체 길이 확인 후 데이터 수신
    if (socket.buffer.length >= length) {
      // 패킷 데이터를 자르고 버퍼에서 제거
      const packet = socket.buffer.slice(totalHeaderLength, length);
      // 남아있는 데이터는 다시 socket.buffer에 넣어라
      socket.buffer = socket.buffer.slice(length);

      console.log(`length: ${length}, packetType: ${packetType}`);
      console.log(`packet: ${packet}`);

      switch (packetType) {
        case PACKET_TYPE.PING:
          break;
        case PACKET_TYPE.NORMAL:
          const { handlerId, userId, payload, sequence } = packetParser(packet);

          console.log(`handlerId: ${handlerId}`);
          console.log(`userId: ${userId}`);
          console.log(`payload: ${payload}`);
          console.log(`sequence: ${sequence}`);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;
    }
  }
};
