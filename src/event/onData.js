import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById } from '../session/user.session.js';
import { handlerError } from '../utils/error/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';

export const onData = (socket) => async (data) => {
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

      try {
        switch (packetType) {
          case PACKET_TYPE.PING:
            break;
          case PACKET_TYPE.NORMAL:
            const { handlerId, userId, payload, sequence } = packetParser(packet);

            const user = getUserById(userId);
            // 유저가 접속해 있는 상황에서 시퀀스 검증, 시퀀스는 호출 횟수
            if (user && user.sequence !== sequence) {
              throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
            }

            const handler = getHandlerById(handlerId);

            await handler({
              socket,
              userId,
              payload,
            });
        }
      } catch (err) {
        handlerError(socket, err);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;
    }
  }
};
