import * as hyprofile from "../src";

describe("Sample", () => {
    it("should fail", async () => {
        let profile = hyprofile.Samples.sample1;
        let results = await hyprofile.generateTypes(profile);
        console.log("results = ", results);
        expect(results).toMatchSnapshot();
    });
});
