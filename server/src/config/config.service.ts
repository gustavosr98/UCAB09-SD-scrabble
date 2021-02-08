import * as fs from 'fs';
import { parse } from 'dotenv';

export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        const envFilePath: string = __dirname + '/../../.env';
        const exist: boolean = fs.existsSync(envFilePath);
        if (exist) {
            this.envConfig = parse(fs.readFileSync(envFilePath));
        } else {
            process.exit(0);
        }
    }

    get(key: string): string {
      console.log(key)
        return this.envConfig[key];
    }
}
