// Node.js 에서 지원하는 Error 객체를 인터페이스를 상속받아서 클래스 작성
class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'CustomError';
  }
}

export default CustomError;
