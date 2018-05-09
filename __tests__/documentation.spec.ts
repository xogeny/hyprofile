import * as hyprofile from "../src";
import { MemoryWriter } from "../src/generator";

jest.setTimeout(200000);

describe("Test Documentation Generation", () => {
    it("should generate documentation for sample profile", async () => {
        let profile = hyprofile.Samples.sample1;
        let generator = new MemoryWriter("outputDirectory");
        let eprofile = await hyprofile.elaborate(profile);
        await generator.writeFile("profile.json", JSON.stringify(profile, null, 4));
        await hyprofile.generateDocumentation(eprofile, generator);
        await hyprofile.generateCode(eprofile, generator);
        await hyprofile.generateSchemas(eprofile, generator);
        expect(generator.files).toMatchSnapshot();
    });
});
