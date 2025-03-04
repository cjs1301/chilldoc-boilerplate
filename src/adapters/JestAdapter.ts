import { TestFramework } from "./TestFramework";
import { UserTestInterface } from "./UserTestInterface";

export class JestAdapter implements UserTestInterface {
    name = TestFramework.Jest;

    describe(name: string, fn: () => void): void {
        global.describe(name, fn);
    }

    it(name: string, fn: () => void | Promise<void>): void {
        global.it(name, fn);
    }

    before(fn: () => void | Promise<void>): void {
        global.beforeAll(fn);
    }

    after(fn: () => void | Promise<void>): void {
        global.afterAll(fn);
    }

    beforeEach(fn: () => void | Promise<void>): void {
        global.beforeEach(fn);
    }

    afterEach(fn: () => void | Promise<void>): void {
        global.afterEach(fn);
    }
}
