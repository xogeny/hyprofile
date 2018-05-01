import fs from "fs";
import path from "path";

export interface Generator {
    writeFile(filename: string, contents: string): Promise<void>;
}

export class FileWriter implements Generator {
    constructor(public directory: string) {}
    writeFile(filename: string, contents: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let file = path.join(this.directory, filename);
            fs.writeFile(file, contents, err => {
                console.log("File " + file + " written: ", err);
                if (err) reject(err);
                else resolve(undefined);
            });
        });
    }
}

export class MemoryWriter implements Generator {
    files: { [name: string]: string } = {};
    writer: Generator | undefined = undefined;
    constructor(directory?: string) {
        if (directory) {
            this.writer = new FileWriter(directory);
        }
    }
    async writeFile(filename: string, contents: string): Promise<void> {
        this.files[filename] = contents;
        if (this.writer) await this.writer.writeFile(filename, contents);
        return undefined;
    }
}
