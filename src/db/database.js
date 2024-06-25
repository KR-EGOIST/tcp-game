import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFormatter.js';

const { databases } = config;

// 데이터베이스 커넥션 풀 생성 함수
const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    // 커넥션 풀이 10개인데 10개의 요청이 들어와서 커넥션 풀이 가득 찼을 경우 그 다음 들어오는 요청은 어떻게 처리할까라는 의미
    // waitFor 이므로 이미 있는 10개 요청 중 어느 하나가 끝날 때까지 해당 요청은 대기열에서 기다리겠다.
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // queueLimit는 waitFor 에 몇 개까지 대기시킬 수 있는가? 하는 의미 , 0일 경우 무제한 대기열
  });

  const originalQuery = pool.query;

  // pool.query 오버라이딩
  pool.query = (sql, params) => {
    const date = new Date();
    // 쿼리 실행시 로그
    console.log(
      `[${formatDate(date)}] 실행중인 쿼리: ${sql} ${params ? `, ${JSON.stringify(params)}` : ``}`,
    );
    return originalQuery.call(pool, sql, params);
  };

  return pool;
};

// 여러 데이터베이스 커넥션 풀 생성
const pools = {
  GAME_DB: createPool(databases.GAME_DB),
  USER_DB: createPool(databases.USER_DB),
};

export default pools;
