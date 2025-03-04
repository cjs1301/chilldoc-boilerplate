type FIELD_TYPES = string | number | boolean | object | Record<string, unknown> | FIELD_TYPES[];

/**
 * DSL Field 인터페이스
 * - example은 값 또는 값 검증 함수일 수 있습니다.
 */
export interface DSLField<T extends FIELD_TYPES = FIELD_TYPES> {
  readonly description: string;
  readonly example: T | ((value: T) => void);
}

/**
 * DSL Helper Functions
 * - DSLField 생성 함수
 * @param description
 * @param example
 * @example
 */
export const field = <T extends FIELD_TYPES>(
  description: string,
  example: T | ((value: T) => void),
): DSLField<T> => ({ description, example });
