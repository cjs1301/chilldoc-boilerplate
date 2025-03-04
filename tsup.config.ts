import { defineConfig } from "tsup";

export default defineConfig({
    // 진입점 설정
    // src/index.ts 파일을 시작으로 의존성 그래프를 구성
    entry: ["src/index.ts"],

    // 출력 형식 설정
    // ESM과 CommonJS 두 가지 형식으로 번들 생성
    format: ["esm", "cjs"],

    // TypeScript 타입 정의 파일 생성
    dts: true,

    // 디버깅을 위한 소스맵 생성
    sourcemap: true,

    // 빌드 전 dist 디렉토리 정리
    clean: true,

    // 번들에서 제외할 외부 의존성
    // express와 supertest는 런타임 의존성으로 처리
    external: ["express", "supertest"],

    // 번들 출력 디렉토리
    outDir: "dist",

    // 대상 Node.js 버전 (20.x)
    target: "node20",

    // 실행 환경 설정
    platform: "node",

    // 코드 분할 비활성화
    // 단일 진입점 사용으로 불필요
    splitting: false,

    // 트리쉐이킹 활성화
    // 사용하지 않는 코드 제거
    treeshake: true,

    // 코드 최소화 비활성화
    // 개발 편의성 및 빌드 속도 개선
    minify: false,

    // 빌드 메타데이터 생성 비활성화
    metafile: false,

    // 항상 번들에 포함할 패키지
    // supports-color: 터미널 색상 지원을 위해 포함
    noExternal: ["supports-color"],

    // 환경 변수 설정
    env: {
        NODE_ENV: process.env.NODE_ENV || "development",
    },
});
