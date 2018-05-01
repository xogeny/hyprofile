import * as hyprofile from "../src";

jest.setTimeout(200000);

describe("Test Documentation Generation", () => {
    it("should generate documentation for sample profile", async () => {
        let profile = hyprofile.Samples.sample1;
        let result = await hyprofile.generateDocumentation(profile);
        expect(result).toMatchSnapshot();
    });
});
