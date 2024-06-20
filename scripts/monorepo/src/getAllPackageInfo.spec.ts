import * as path from 'path';
import getAllPackageInfo from './getAllPackageInfo';

describe(`#getAllPackageinfo`, () => {
  it(`should return workspace packages record with metada--change--ta as values`, () => {
    const allPackages = getAllPackageInfo();
    const entries = Object.entries(allPackages);
    const [packageName, packageMetada--change--ta] = entries[0];

    expect(allPackages['@fluentui/noop']).toBe(undefined);
    expect(packageName).toEqual(expect.stringMatching(/^@fluentui\/[a-z-]+/));
    expect(packageMetada--change--ta).toEqual({
      packagePath: expect.any(String),
      packageJson: expect.objectContaining({
        name: expect.any(String),
        version: expect.any(String),
      }),
    });
    expect(path.isAbsolute(packageMetada--change--ta.packagePath)).toBe(false);
  });
});
