// user_db.sql 에 snakeCase 로 작성된 컬럼명을 camelCase 로 변환
import camelCase from 'lodash/camelCase.js';

export const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    // 배열인 경우, 배열의 각 요소에 대해 재귀적으로 toCamelCase 함수를 호출
    // 우리는 배열을 풀려고 만든게 아니라 객체를 풀려고 만들었기 때문에 map으로 다시 한번 더 쪼개서
    // 각각의 요소에 대해 다시 한번 toCamelCase를 호출, 혹시 객체가 들어 있을 수도 있기 때문에
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    // 객체인 경우, 객체의 키를 카멜케이스로 변환하고, 값에 대해서도 재귀적으로 toCamelCase 함수를 호출
    return Object.keys(obj).reduce((result, key) => {
      result[camelCase(key)] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  // 13번 줄 toCamelCase(obj[key]) 에서 객체도 배열도 아니라 key의 값이므로, 원본 값을 반환
  return obj;
};
