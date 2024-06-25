import { handlerError } from '../utils/error/errorHandler.js';
import CustomError from '../utils/error/customError.js';
import { removeUser } from '../session/user.session.js';

export const onError = (socket) => (err) => {
  console.log('소켓 오류: ', err);
  handlerError(socket, new CustomError(500, `소캣 오류: ${err.message}`));

  // 세션에서 유저 삭제
  removeUser(socket);
};
