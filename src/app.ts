import * as fs from "fs/promises";
import figlet from "figlet";
import { extractNameFromZipFile } from "./utils";

const iexecOut: string | undefined = process.env.IEXEC_OUT;
const iexecIn: string | undefined = process.env.IEXEC_IN;
const dataFileName: string | undefined = (process.env.IEXEC_DATASET_FILENAME =
    "protectedData.zip");

(async () => {
    try {
        // const name = await extractNameFromZipFile(`${iexecIn}/${dataFileName}`);
        const name = "romain";

        // Write hello to fs
        let text: string =
            process.argv.length > 2
                ? `Hello, ${process.argv[2]}! it's ${name}!`
                : `Hello, World! it's ${name}!`;
        text = `${figlet.textSync(text)}\n${text}`; // Let's add some art for e.g.

        // Append some results
        if (!iexecOut) {
            throw new Error("Environment variable IEXEC_OUT is not set.");
        }

        await fs.writeFile(`${iexecOut}/result.txt`, text);
        console.log(text);
        // Declare everything is computed
        const computedJsonObj = {
            "deterministic-output-path": `${iexecOut}/result.txt`,
        };
        await fs.writeFile(
            `${iexecOut}/computed.json`,
            JSON.stringify(computedJsonObj)
        );
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
