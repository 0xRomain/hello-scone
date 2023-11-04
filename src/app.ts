import * as fs from "fs/promises";
import figlet from "figlet";

const iexecOut: string | undefined = process.env.IEXEC_OUT;
const iexecIn: string | undefined = process.env.IEXEC_IN;

(async () => {
    try {
        // Write hello to fs
        let text: string =
            process.argv.length > 2
                ? `Hello, ${process.argv[2]}!`
                : "Hello, World";
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
