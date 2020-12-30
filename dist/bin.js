#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const fs_1 = require("fs");
const glob_1 = require("glob");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const yargs = __importStar(require("yargs"));
const index_1 = require("./index");
const debug = debug_1.default('devcert');
yargs
    .command('certificate-for <domain>', 'generate certificate for domain', (yargs) => yargs
    .positional('domain', {
    describe: 'domain certificate'
})
    .option('skip-hosts-file', {
    describe: "If present will skip adding domain to hosts file if it doesn't exists",
    type: 'boolean'
})
    .option('copy-to-yoshi', {
    describe: 'output keys to yoshi project',
    type: 'boolean'
})
    .option('copy-to-santa', {
    describe: 'output keys to santa config',
    type: 'boolean'
}), (argv) => __awaiter(this, void 0, void 0, function* () {
    const { key, cert } = yield index_1.certificateFor(argv.domain, {
        skipHostsFile: argv.skipHostFile
    });
    if (argv.copyToYoshi) {
        const root = '{../node_modules,node_modules}/{yoshi,yoshi-flow-legacy}';
        glob_1.sync(`${root}/**/cert.pem`)
            .forEach((filePath) => {
            debug(`Copied cert to ${filePath}`);
            fs_1.writeFileSync(filePath, cert, { encoding: 'utf8' });
        });
        glob_1.sync(`${root}/**/key.pem`)
            .forEach((filePath) => {
            debug(`Copied key to ${filePath}`);
            fs_1.writeFileSync(filePath, key, { encoding: 'utf8' });
        });
    }
    if (argv.copyToSanta) {
        const dirPath = path_1.join(process.env.HOME, '.config/configstore', 'santa', 'sslcert');
        mkdirp_1.default.sync(dirPath);
        fs_1.writeFileSync(path_1.join(dirPath, 'cert.pem'), cert, { encoding: 'utf8' });
        fs_1.writeFileSync(path_1.join(dirPath, 'key.pem'), key, { encoding: 'utf8' });
        debug('copied to santa');
    }
}))
    .usage('$0 <command>').argv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsiYmluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLGtEQUFnQztBQUNoQywyQkFBbUM7QUFDbkMsK0JBQTRCO0FBQzVCLG9EQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsNkNBQStCO0FBRS9CLG1DQUF5QztBQUd6QyxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFckMsS0FBSztLQUNGLE9BQU8sQ0FDTiwwQkFBMEIsRUFDMUIsaUNBQWlDLEVBQ2pDLENBQUMsS0FBVyxFQUFFLEVBQUUsQ0FDZCxLQUFLO0tBQ0YsVUFBVSxDQUFDLFFBQVEsRUFBRTtJQUNwQixRQUFRLEVBQUUsb0JBQW9CO0NBQy9CLENBQUM7S0FDRCxNQUFNLENBQUMsaUJBQWlCLEVBQUU7SUFDekIsUUFBUSxFQUNOLHVFQUF1RTtJQUN6RSxJQUFJLEVBQUUsU0FBUztDQUNoQixDQUFDO0tBQ0QsTUFBTSxDQUFDLGVBQWUsRUFBRTtJQUN2QixRQUFRLEVBQUUsOEJBQThCO0lBQ3hDLElBQUksRUFBRSxTQUFTO0NBQ2hCLENBQUM7S0FDRCxNQUFNLENBQUMsZUFBZSxFQUFFO0lBQ3ZCLFFBQVEsRUFBRSw2QkFBNkI7SUFDdkMsSUFBSSxFQUFFLFNBQVM7Q0FDaEIsQ0FBQyxFQUNOLENBQU8sSUFBZSxFQUFFLEVBQUU7SUFDeEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUN0RCxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7S0FDakMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxJQUFJLEdBQUcsMERBQTBELENBQUM7UUFDeEUsV0FBSSxDQUFDLEdBQUcsSUFBSSxjQUFjLENBQUM7YUFDeEIsT0FBTyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFO1lBQzVCLEtBQUssQ0FBQyxrQkFBa0IsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNwQyxrQkFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNMLFdBQUksQ0FBQyxHQUFHLElBQUksYUFBYSxDQUFDO2FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtZQUM1QixLQUFLLENBQUMsaUJBQWlCLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbkMsa0JBQWEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxPQUFPLEdBQUcsV0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNsRixnQkFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNwQixrQkFBYSxDQUFDLFdBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDckUsa0JBQWEsQ0FBQyxXQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRW5FLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBRTFCLENBQUM7QUFFSCxDQUFDLENBQUEsQ0FDRjtLQUNBLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgeyB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgc3luYyB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgQXJndW1lbnRzLCBBcmd2IH0gZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgY2VydGlmaWNhdGVGb3IgfSBmcm9tICcuL2luZGV4JztcblxuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZURlYnVnKCdkZXZjZXJ0Jyk7XG5cbnlhcmdzXG4gIC5jb21tYW5kKFxuICAgICdjZXJ0aWZpY2F0ZS1mb3IgPGRvbWFpbj4nLFxuICAgICdnZW5lcmF0ZSBjZXJ0aWZpY2F0ZSBmb3IgZG9tYWluJyxcbiAgICAoeWFyZ3M6IEFyZ3YpID0+XG4gICAgICB5YXJnc1xuICAgICAgICAucG9zaXRpb25hbCgnZG9tYWluJywge1xuICAgICAgICAgIGRlc2NyaWJlOiAnZG9tYWluIGNlcnRpZmljYXRlJ1xuICAgICAgICB9KVxuICAgICAgICAub3B0aW9uKCdza2lwLWhvc3RzLWZpbGUnLCB7XG4gICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICBcIklmIHByZXNlbnQgd2lsbCBza2lwIGFkZGluZyBkb21haW4gdG8gaG9zdHMgZmlsZSBpZiBpdCBkb2Vzbid0IGV4aXN0c1wiLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICB9KVxuICAgICAgICAub3B0aW9uKCdjb3B5LXRvLXlvc2hpJywge1xuICAgICAgICAgIGRlc2NyaWJlOiAnb3V0cHV0IGtleXMgdG8geW9zaGkgcHJvamVjdCcsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIH0pXG4gICAgICAgIC5vcHRpb24oJ2NvcHktdG8tc2FudGEnLCB7XG4gICAgICAgICAgZGVzY3JpYmU6ICdvdXRwdXQga2V5cyB0byBzYW50YSBjb25maWcnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICB9KSxcbiAgICBhc3luYyAoYXJndjogQXJndW1lbnRzKSA9PiB7XG4gICAgICBjb25zdCB7IGtleSwgY2VydCB9ID0gYXdhaXQgY2VydGlmaWNhdGVGb3IoYXJndi5kb21haW4sIHtcbiAgICAgICAgc2tpcEhvc3RzRmlsZTogYXJndi5za2lwSG9zdEZpbGVcbiAgICAgIH0pO1xuICAgICAgaWYgKGFyZ3YuY29weVRvWW9zaGkpIHtcbiAgICAgICAgY29uc3Qgcm9vdCA9ICd7Li4vbm9kZV9tb2R1bGVzLG5vZGVfbW9kdWxlc30ve3lvc2hpLHlvc2hpLWZsb3ctbGVnYWN5fSc7XG4gICAgICAgIHN5bmMoYCR7cm9vdH0vKiovY2VydC5wZW1gKVxuICAgICAgICAgIC5mb3JFYWNoKChmaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZyhgQ29waWVkIGNlcnQgdG8gJHtmaWxlUGF0aH1gKTtcbiAgICAgICAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIGNlcnQsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgc3luYyhgJHtyb290fS8qKi9rZXkucGVtYClcbiAgICAgICAgICAuZm9yRWFjaCgoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgZGVidWcoYENvcGllZCBrZXkgdG8gJHtmaWxlUGF0aH1gKTtcbiAgICAgICAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIGtleSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3YuY29weVRvU2FudGEpIHtcbiAgICAgICAgY29uc3QgZGlyUGF0aCA9IGpvaW4ocHJvY2Vzcy5lbnYuSE9NRSwgJy5jb25maWcvY29uZmlnc3RvcmUnLCAnc2FudGEnLCAnc3NsY2VydCcpO1xuICAgICAgICBta2RpcnAuc3luYyhkaXJQYXRoKVxuICAgICAgICB3cml0ZUZpbGVTeW5jKGpvaW4oZGlyUGF0aCwgJ2NlcnQucGVtJyksIGNlcnQsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICAgICAgd3JpdGVGaWxlU3luYyhqb2luKGRpclBhdGgsICdrZXkucGVtJyksIGtleSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuXG4gICAgICAgIGRlYnVnKCdjb3BpZWQgdG8gc2FudGEnKVxuXG4gICAgICB9XG5cbiAgICB9XG4gIClcbiAgLnVzYWdlKCckMCA8Y29tbWFuZD4nKS5hcmd2O1xuIl19