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
}), (argv) => __awaiter(this, void 0, void 0, function* () {
    const { key, cert } = yield index_1.certificateFor(argv.domain, {
        skipHostsFile: argv.skipHostFile
    });
    if (argv.copyToYoshi) {
        const root = '{..,}/node_modules/yoshi';
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
}))
    .usage('$0 <command>').argv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsiYmluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLGtEQUFnQztBQUNoQywyQkFBbUM7QUFDbkMsK0JBQTRCO0FBQzVCLDZDQUErQjtBQUUvQixtQ0FBeUM7QUFFekMsTUFBTSxLQUFLLEdBQUcsZUFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXJDLEtBQUs7S0FDRixPQUFPLENBQ04sMEJBQTBCLEVBQzFCLGlDQUFpQyxFQUNqQyxDQUFDLEtBQVcsRUFBRSxFQUFFLENBQ2QsS0FBSztLQUNGLFVBQVUsQ0FBQyxRQUFRLEVBQUU7SUFDcEIsUUFBUSxFQUFFLG9CQUFvQjtDQUMvQixDQUFDO0tBQ0QsTUFBTSxDQUFDLGlCQUFpQixFQUFFO0lBQ3pCLFFBQVEsRUFDTix1RUFBdUU7SUFDekUsSUFBSSxFQUFFLFNBQVM7Q0FDaEIsQ0FBQztLQUNELE1BQU0sQ0FBQyxlQUFlLEVBQUU7SUFDdkIsUUFBUSxFQUFFLDhCQUE4QjtJQUN4QyxJQUFJLEVBQUUsU0FBUztDQUNoQixDQUFDLEVBQ04sQ0FBTyxJQUFlLEVBQUUsRUFBRTtJQUN4QixNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sc0JBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ3RELGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWTtLQUNqQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLElBQUksR0FBRywwQkFBMEIsQ0FBQztRQUN4QyxXQUFJLENBQUMsR0FBRyxJQUFJLGNBQWMsQ0FBQzthQUN4QixPQUFPLENBQUMsQ0FBQyxRQUFnQixFQUFFLEVBQUU7WUFDNUIsS0FBSyxDQUFDLGtCQUFrQixRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLGtCQUFhLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ0wsV0FBSSxDQUFDLEdBQUcsSUFBSSxhQUFhLENBQUM7YUFDdkIsT0FBTyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFO1lBQzVCLEtBQUssQ0FBQyxpQkFBaUIsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNuQyxrQkFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7QUFDSCxDQUFDLENBQUEsQ0FDRjtLQUNBLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgeyB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgc3luYyB9IGZyb20gJ2dsb2InO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgQXJndW1lbnRzLCBBcmd2IH0gZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgY2VydGlmaWNhdGVGb3IgfSBmcm9tICcuL2luZGV4JztcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnZGV2Y2VydCcpO1xuXG55YXJnc1xuICAuY29tbWFuZChcbiAgICAnY2VydGlmaWNhdGUtZm9yIDxkb21haW4+JyxcbiAgICAnZ2VuZXJhdGUgY2VydGlmaWNhdGUgZm9yIGRvbWFpbicsXG4gICAgKHlhcmdzOiBBcmd2KSA9PlxuICAgICAgeWFyZ3NcbiAgICAgICAgLnBvc2l0aW9uYWwoJ2RvbWFpbicsIHtcbiAgICAgICAgICBkZXNjcmliZTogJ2RvbWFpbiBjZXJ0aWZpY2F0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgLm9wdGlvbignc2tpcC1ob3N0cy1maWxlJywge1xuICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgXCJJZiBwcmVzZW50IHdpbGwgc2tpcCBhZGRpbmcgZG9tYWluIHRvIGhvc3RzIGZpbGUgaWYgaXQgZG9lc24ndCBleGlzdHNcIixcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgfSlcbiAgICAgICAgLm9wdGlvbignY29weS10by15b3NoaScsIHtcbiAgICAgICAgICBkZXNjcmliZTogJ291dHB1dCBrZXlzIHRvIHlvc2hpIHByb2plY3QnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICB9KSxcbiAgICBhc3luYyAoYXJndjogQXJndW1lbnRzKSA9PiB7XG4gICAgICBjb25zdCB7IGtleSwgY2VydCB9ID0gYXdhaXQgY2VydGlmaWNhdGVGb3IoYXJndi5kb21haW4sIHtcbiAgICAgICAgc2tpcEhvc3RzRmlsZTogYXJndi5za2lwSG9zdEZpbGVcbiAgICAgIH0pO1xuICAgICAgaWYgKGFyZ3YuY29weVRvWW9zaGkpIHtcbiAgICAgICAgY29uc3Qgcm9vdCA9ICd7Li4sfS9ub2RlX21vZHVsZXMveW9zaGknO1xuICAgICAgICBzeW5jKGAke3Jvb3R9LyoqL2NlcnQucGVtYClcbiAgICAgICAgICAuZm9yRWFjaCgoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgZGVidWcoYENvcGllZCBjZXJ0IHRvICR7ZmlsZVBhdGh9YCk7XG4gICAgICAgICAgICB3cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBjZXJ0LCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHN5bmMoYCR7cm9vdH0vKiova2V5LnBlbWApXG4gICAgICAgICAgLmZvckVhY2goKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGRlYnVnKGBDb3BpZWQga2V5IHRvICR7ZmlsZVBhdGh9YCk7XG4gICAgICAgICAgICB3cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBrZXksIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIClcbiAgLnVzYWdlKCckMCA8Y29tbWFuZD4nKS5hcmd2O1xuIl19