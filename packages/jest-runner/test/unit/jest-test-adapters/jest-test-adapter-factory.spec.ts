import { testInjector } from '@stryker-mutator/test-helpers';
import { expect } from 'chai';

import { JestTestAdapter, jestTestAdapterFactory } from '../../../src/jest-test-adapters';
import JestGreaterThan25Adapter from '../../../src/jest-test-adapters/jest-greater-than-25-adapter';
import JestLessThan25Adapter from '../../../src/jest-test-adapters/jest-less-than-25-adapter';
import { jestVersionToken } from '../../../src/plugin-tokens';

describe(jestTestAdapterFactory.name, () => {
  let jestVersion: string;

  function act(): JestTestAdapter {
    return testInjector.injector.provideValue(jestVersionToken, jestVersion).injectFunction(jestTestAdapterFactory);
  }

  it('should return a JestGreaterThan25Adapter when the Jest version is higher or equal to 25.0.0', () => {
    jestVersion = '25.0.0';
    const testAdapter = act();

    expect(testAdapter).instanceOf(JestGreaterThan25Adapter);
  });
  it('should return a JestLessThan25Adapter when the Jest version is higher or equal to 22.0.0, but less then 25', () => {
    jestVersion = '22.0.0';
    const testAdapter = act();

    expect(testAdapter).instanceOf(JestLessThan25Adapter);
  });

  it('should throw an error when the Jest version is lower than 22.0.0', () => {
    jestVersion = '21.0.0';

    expect(() => act()).to.throw(Error, 'You need Jest version >= 22.0.0 to use Stryker');
    expect(testInjector.logger.debug).calledWith('Detected Jest below 22.0.0: %s', jestVersion);
  });
});
