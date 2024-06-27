import { getGameSession } from '../../session/game.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const locationUpdateHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId, x, y } = payload;
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    // gameSession 은 Game 클래스이므로 Game 클래스의 메서드를 사용할 수 있다.
    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    // 유저의 위치를 업데이트 한다, user 는 User 클래스이므로 User 클래스의 메서드를 사용할 수 있다.
    user.updatePosition(x, y);

    // 완료된 패킷을 보낸다.
    const packet = gameSession.getAllLocation();

    // 모든 유저의 위치 정보를 보낸다.
    socket.write(packet);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default locationUpdateHandler;
