# 평수계산기 (React Native)

가로·세로 길이와 넓이(㎡), 평수를 서로 변환하는 계산기.
Flutter 프로젝트 [plainwater](../plainwater)를 Expo(React Native) + TypeScript로 옮긴 것이다.

## 구조

공유 코드 → features → 앱 계층의 단방향 import만 허용.

```
src/
  utils/           숫자 변환·포맷 (decimal.js 기반 정밀 계산), 문자열 상수
  theme/           Material 3 시드(#2B5CE6) 팔레트, 라이트·다크
  features/calculator/
    types/         칸 정의(CalcField), 화면 상태(CalculatorState)
    stores/        키패드 입력을 상태로 바꾸는 순수 리듀서
    components/    화면과 위젯 (값 패널, 키패드, 커서)
```

계산은 `number`가 아니라 `decimal.js`의 `Decimal`로 한다. `number`는 0.3025를
정확히 표현하지 못해 반올림 결과가 흔들리기 때문이다. 1평 = 400/121㎡이므로
1㎡ = 0.3025평은 근삿값이 아니라 정확한 값이다.

## 실행

```sh
npm install
npm run ios      # 또는 npm run android
```

## 테스트

순수 로직(단위 변환, 리듀서) 테스트. RN 렌더링 테스트는 없다.

```sh
npm test
```
