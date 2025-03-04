/**
 * 응답 객체의 구조와 값을 검증하는 함수
 * @description
 * 예상되는 응답 구조와 실제 응답을 재귀적으로 비교하여 검증합니다.
 * 배열, 객체, 기본 타입에 대한 검증을 수행하며, DSL Field도 지원합니다.
 * @param expectedObj - 예상되는 응답 객체
 * @param actualObj - 실제 응답 객체
 * @param path - 현재 검증 중인 객체 경로 (기본값: '')
 * @throws {Error} 검증 실패 시 에러를 발생시킵니다.
 * @example
 * ```typescript
 * const expected = { name: 'John', age: 30 };
 * const actual = { name: 'John', age: 30 };
 * validateResponse(expected, actual);
 * // 성공: 객체가 일치함
 *
 * const invalidActual = { name: 'John', age: 25 };
 * validateResponse(expected, invalidActual);
 * // 에러: Expected response body[age] to be 30 but got 25
 * ```
 */
export const validateResponse = (
    expectedObj: Record<string, unknown> | unknown[],
    actualObj: unknown,
    path = "",
): void => {
    // 배열 검증
    if (Array.isArray(expectedObj)) {
        validateArray(expectedObj, actualObj, path);
        return;
    }

    // 객체 검증
    validateObject(expectedObj, actualObj, path);
};

/**
 * 배열 타입의 응답을 검증하는 함수
 * @description
 * 배열의 길이와 각 요소를 순서대로 비교합니다.
 * @param expected - 예상되는 배열
 * @param actual - 실제 응답 값
 * @param path - 현재 검증 중인 객체 경로
 * @throws {Error} 검증 실패 시 에러를 발생시킵니다.
 * @example
 * ```typescript
 * const expected = [1, 2, 3];
 * const actual = [1, 2, 3];
 * validateArray(expected, actual, 'numbers');
 * ```
 */
const validateArray = (expected: unknown[], actual: unknown, path: string): void => {
    if (!Array.isArray(actual)) {
        throw new Error(`Expected response body[${path}] to be an array but got ${typeof actual}`);
    }

    if (expected.length !== actual.length) {
        throw new Error(
            `Expected response body[${path}] to have length ${expected.length} but got ${actual.length}`,
        );
    }

    expected.forEach((expectedElem, index) => {
        const currentPath = path ? `${path}[${index}]` : `[${index}]`;
        validateValue(expectedElem, actual[index], currentPath);
    });
};

/**
 * 객체 타입의 응답을 검증하는 함수
 * @description
 * 객체의 각 프로퍼티를 재귀적으로 검증합니다.
 * @param expected - 예상되는 객체
 * @param actual - 실제 응답 값
 * @param path - 현재 검증 중인 객체 경로
 * @throws {Error} 검증 실패 시 에러를 발생시킵니다.
 * @example
 * ```typescript
 * const expected = { user: { name: 'John' } };
 * const actual = { user: { name: 'John' } };
 * validateObject(expected, actual, 'response');
 * ```
 */
const validateObject = (expected: Record<string, unknown>, actual: unknown, path: string): void => {
    if (!actual || typeof actual !== "object" || Array.isArray(actual)) {
        throw new Error(`Expected response body[${path}] to be an object but got ${typeof actual}`);
    }

    Object.entries(expected).forEach(([key, expectedVal]) => {
        const currentPath = path ? `${path}.${key}` : key;
        const actualVal = (actual as Record<string, unknown>)[key];

        validateValue(expectedVal, actualVal, currentPath);
    });
};

/**
 * 단일 값을 검증하는 함수
 * @description
 * 값의 타입에 따라 적절한 검증을 수행합니다.
 * @param expected - 예상되는 값
 * @param actual - 실제 값
 * @param path - 현재 검증 중인 경로
 * @throws {Error} 검증 실패 시 에러를 발생시킵니다.
 * @example
 * ```typescript
 * validateValue(42, 42, 'response.age');
 * ```
 */
const validateValue = (expected: unknown, actual: unknown, path: string): void => {
    // DSL Field 검증
    if (isField(expected)) {
        validateField(expected, actual, path);
        return;
    }

    // 배열 검증
    if (Array.isArray(expected)) {
        validateArray(expected, actual, path);
        return;
    }

    // 객체 검증
    if (expected && typeof expected === "object") {
        validateObject(expected as Record<string, unknown>, actual, path);
        return;
    }

    // 기본 타입 검증
    if (actual !== expected) {
        throw new Error(`Expected response body[${path}] to be ${expected} but got ${actual}`);
    }
};

/**
 * DSL Field 타입 가드
 * @description
 * 값이 DSL Field 타입인지 확인합니다.
 * @param value - 검사할 값
 * @returns DSL Field 여부
 * @example
 * ```typescript
 * if (isField(value)) {
 *   // value는 DSL Field 타입
 * }
 * ```
 */
const isField = (value: unknown): value is { example: unknown } => {
    return Boolean(value && typeof value === "object" && "example" in value);
};

/**
 * DSL Field 값을 검증하는 함수
 * @description
 * Field의 example 값을 사용하여 검증을 수행합니다.
 * @param field - DSL Field 객체
 * @param field.example
 * @param actual - 실제 값
 * @param path - 현재 검증 중인 경로
 * @throws {Error} 검증 실패 시 에러를 발생시킵니다.
 * @example
 * ```typescript
 * const field = { example: (value) => value > 0 };
 * validateField(field, 42, 'response.age');
 * ```
 */
const validateField = (field: { example: unknown }, actual: unknown, path: string): void => {
    const expected = field.example;

    if (typeof expected === "function") {
        console.log(`Validating field "${path}" with value:`, actual);
        expected(actual);
    } else if (actual !== expected) {
        throw new Error(`Expected response body[${path}] to be ${expected} but got ${actual}`);
    }
};
