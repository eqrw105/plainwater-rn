/** 순수 로직(변환·리듀서) 테스트용 설정. RN 렌더링 테스트는 포함하지 않는다. */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      { tsconfig: { types: ['jest'], jsx: 'react-jsx' } },
    ],
  },
};
