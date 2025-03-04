/**
 * 지원하는 테스트 프레임워크 타입
 */
export type TestFramework = "Unknown" | "Jest" | "Mocha";

/**
 * 테스트 프레임워크 상수
 */
export const TestFramework = {
    Unknown: "Unknown" as const,
    Jest: "Jest" as const,
    Mocha: "Mocha" as const,
} as const;
