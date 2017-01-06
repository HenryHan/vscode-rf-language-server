import { FileParser } from "../parser";
import {
  TestDataFile,
  SettingsTable,
  SingleValueSetting,
  Import,
} from "../models";

import * as chai from "chai";

const parser = new FileParser();

function parseAndAssert(stringToParse: string, expected: any) {
  const actual = parser.parse(stringToParse);

  chai.assert.deepEqual(actual, expected);
}

/**
 *
 */
function createSettingsTable(content): TestDataFile {
  const testDataFile = new TestDataFile();

  testDataFile.settingsTable = Object.assign(new SettingsTable(), content);

  return testDataFile;
}

/**
 *
 */
function generateSettingsTableTest(tableDefinition: string, expectedData) {
  const inputData = `*** Settings ***\n${ tableDefinition }`;

  const expected = createSettingsTable(expectedData);

  parseAndAssert(inputData, expected);
}

describe("RF Parser", () => {

  describe("Parsing Settings table", () => {

    it("should recognize a settings table", () => {
      const expected = createSettingsTable({});

      parseAndAssert(`*** Settings ***`, expected);
      parseAndAssert(`*** Settings`, expected);
      parseAndAssert(`*Settings`, expected);
    });

    it("should parse resource imports", () => {
      generateSettingsTableTest(`
Resource   resources/\${ENVIRONMENT}.robot
Resource   resources/smoke_resources.robot
`, {
  imports: [
      new Import("Resource", "resources/\${ENVIRONMENT}.robot"),
      new Import("Resource", "resources/smoke_resources.robot"),
  ]
});
    });

    it("should parse suite setup", () => {
      generateSettingsTableTest(
        `Suite Setup         Open Default Browser`,
        { suiteSetup: new Setting("Suite Setup", "Open Default Browser") }
      );
    });

    it("should parse suite teardown", () => {
      generateSettingsTableTest(
        `Suite Teardown         Open Default Browser`,
        { suiteTeardown: new Setting("Suite Teardown", "Open Default Browser") }
      );
    });

    it("should parse test setup", () => {
      generateSettingsTableTest(
        `Test Setup         Open Default Browser`,
        { testSetup: new Setting("Test Setup", "Open Default Browser") }
      );
    });

    it("should parse test teardown", () => {
      generateSettingsTableTest(
        `Test Teardown         Open Default Browser`,
        { testTeardown: new Setting("Test Teardown", "Open Default Browser") }
      );
    });

  });
});