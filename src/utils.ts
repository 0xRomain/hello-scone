import * as fs from "fs/promises";
import JSZip from "jszip";

export async function extractNameFromZipFile(zipPath: string) {
    const buffer = await fs.readFile(zipPath);
    const zip = new JSZip();
    await zip.loadAsync(buffer);
    let name;
    zip.forEach((relativePath, file) => {
        if (!file.dir && relativePath.includes("name")) {
            name = file.async("string");
        }
    });
    if (!name) {
        throw new Error("No name file was found in the zip.");
    }
    return name;
}
