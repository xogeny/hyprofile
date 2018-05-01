import * as hyprofile from "../src";

jest.setTimeout(200000);

describe("Sample", () => {
    it("should fail", async () => {
        let profile = hyprofile.Samples.sample1;
        let results = await hyprofile.elaborate(profile);
        console.log("results = ", results);
        expect(results).toMatchSnapshot();
    });
});
