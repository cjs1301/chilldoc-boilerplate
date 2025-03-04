import { TestFramework } from "./TestFramework";
import { MochaAdapter } from "./MochaAdapter";
import { JestAdapter } from "./JestAdapter";
import type { UserTestInterface } from "./UserTestInterface";

/**
 * 테스트 프레임워크를 자동으로 감지하는 함수
 * @returns {TestFramework} 감지된 테스트 프레임워크
 * @example
 * ```typescript
 * const framework = detectTestFramework();
 * // Returns TestFramework.Jest or TestFramework.Mocha
 * ```
 */
function detectTestFramework(): TestFramework {
    // Jest 감지: 전역 jest 객체나 expect 메서드 확인
    interface GlobalWithJest {
        jest?: unknown;
        expect?: (value: unknown) => { toBe: unknown };
    }
    const globalObj = global as GlobalWithJest;

    if (typeof globalObj.jest !== "undefined") {
        return TestFramework.Jest;
    }
    if (typeof globalObj.expect === "function" && typeof globalObj.expect(1).toBe === "function") {
        return TestFramework.Jest;
    }

    // Mocha 감지: 실행 인자에서 확인
    if (process.argv.some((arg) => arg.toLowerCase().includes("mocha"))) {
        return TestFramework.Mocha;
    }

    // 기본값으로 Mocha 사용
    return TestFramework.Mocha;
}

/**
 * 테스트 어댑터를 동기적으로 초기화하는 함수
 * @returns {UserTestInterface} 초기화된 테스트 어댑터
 * @example
 * ```typescript
 * const adapter = initializeAdapterSync();
 * adapter.describe('Test Suite', () => {
 *   adapter.it('should work', () => {
 *     // test code
 *   });
 * });
 * ```
 * @throws Error 지원하지 않는 테스트 프레임워크일 경우 발생
 */
function initializeAdapterSync(): UserTestInterface {
    const framework = detectTestFramework();

    switch (framework) {
        case TestFramework.Jest: {
            // Jest는 사용 시점에 동적으로 import
            const adapter = new JestAdapter();
            return {
                name: TestFramework.Jest,
                describe: adapter.describe.bind(adapter),
                it: adapter.it.bind(adapter),
                before: adapter.before.bind(adapter),
                after: adapter.after.bind(adapter),
                beforeEach: adapter.beforeEach.bind(adapter),
                afterEach: adapter.afterEach.bind(adapter),
            };
        }
        case TestFramework.Mocha: {
            const adapter = new MochaAdapter();
            return {
                name: TestFramework.Mocha,
                describe: adapter.describe.bind(adapter),
                it: adapter.it.bind(adapter),
                before: adapter.before.bind(adapter),
                after: adapter.after.bind(adapter),
                beforeEach: adapter.beforeEach.bind(adapter),
                afterEach: adapter.afterEach.bind(adapter),
            };
        }
        default:
            throw new Error("지원하지 않는 테스트 프레임워크입니다.");
    }
}

// 싱글톤 인스턴스
let testAdapter: UserTestInterface | null = null;

/**
 * 테스트 어댑터 메서드들을 가져오는 함수
 * @returns {UserTestInterface} 테스트 어댑터 인터페이스
 * @example
 * ```typescript
 * const { describe, it } = getTestAdapterExports();
 * describe('Test Suite', () => {
 *   it('should work', () => {
 *     // test code
 *   });
 * });
 * ```
 */
export const getTestAdapterExports = (): UserTestInterface => {
    if (!testAdapter) {
        testAdapter = initializeAdapterSync();
    }
    return testAdapter;
};
