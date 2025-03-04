import {
    describe as mochaDescribe,
    it as mochaIt,
    before as mochaBefore,
    after as mochaAfter,
    beforeEach as mochaBeforeEach,
    afterEach as mochaAfterEach,
} from "mocha";
import { TestFramework } from "./TestFramework";
import { UserTestInterface } from "./UserTestInterface";

export class MochaAdapter implements UserTestInterface {
    name = TestFramework.Mocha;

    describe(name: string, fn: () => void) {
        mochaDescribe(name, fn);
    }

    it(name: string, fn: () => void) {
        mochaIt(name, fn);
    }

    before(fn: () => void) {
        mochaBefore(fn);
    }

    after(fn: () => void) {
        mochaAfter(fn);
    }

    beforeEach(fn: () => void) {
        mochaBeforeEach(fn);
    }

    afterEach(fn: () => void) {
        mochaAfterEach(fn);
    }
}
