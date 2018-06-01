#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const fs_1 = require("fs");
const shelljs = tslib_1.__importStar(require("shelljs"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const index_1 = require("./index");
const debug = debug_1.default('devcert');
yargs_1.default
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
}), (argv) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const { key, cert } = yield index_1.certificateFor(argv.domain, {
        skipHostsFile: argv.skipHostFile
    });
    if (argv.copyToYoshi) {
        shelljs
            .find('node_modules/yoshi/**/cert.pem')
            .forEach((filePath) => {
            debug(`Copied cert to ${filePath}`);
            fs_1.writeFileSync(filePath, cert, { encoding: 'utf8' });
        });
        shelljs
            .find('node_modules/yoshi/**/key.pem')
            .forEach((filePath) => {
            debug(`Copied key to ${filePath}`);
            fs_1.writeFileSync(filePath, key, { encoding: 'utf8' });
        });
    }
}))
    .usage('$0 <command>').argv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsiYmluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSwwREFBZ0M7QUFDaEMsMkJBQW1DO0FBQ25DLHlEQUFtQztBQUNuQywwREFBK0M7QUFDL0MsbUNBQXlDO0FBRXpDLE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUVyQyxlQUFLO0tBQ0YsT0FBTyxDQUNOLDBCQUEwQixFQUMxQixpQ0FBaUMsRUFDakMsQ0FBQyxLQUFXLEVBQUUsRUFBRSxDQUNkLEtBQUs7S0FDRixVQUFVLENBQUMsUUFBUSxFQUFFO0lBQ3BCLFFBQVEsRUFBRSxvQkFBb0I7Q0FDL0IsQ0FBQztLQUNELE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtJQUN6QixRQUFRLEVBQ04sdUVBQXVFO0lBQ3pFLElBQUksRUFBRSxTQUFTO0NBQ2hCLENBQUM7S0FDRCxNQUFNLENBQUMsZUFBZSxFQUFFO0lBQ3ZCLFFBQVEsRUFBRSw4QkFBOEI7SUFDeEMsSUFBSSxFQUFFLFNBQVM7Q0FDaEIsQ0FBQyxFQUNOLENBQU8sSUFBZSxFQUFFLEVBQUU7SUFDeEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUN0RCxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7S0FDakMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ3BCLE9BQU87YUFDSixJQUFJLENBQUMsZ0NBQWdDLENBQUM7YUFDdEMsT0FBTyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFO1lBQzVCLEtBQUssQ0FBQyxrQkFBa0IsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNwQyxrQkFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNMLE9BQU87YUFDSixJQUFJLENBQUMsK0JBQStCLENBQUM7YUFDckMsT0FBTyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFO1lBQzVCLEtBQUssQ0FBQyxpQkFBaUIsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNuQyxrQkFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztLQUNOO0FBQ0gsQ0FBQyxDQUFBLENBQ0Y7S0FDQSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHsgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHNoZWxsanMgZnJvbSAnc2hlbGxqcyc7XG5pbXBvcnQgeWFyZ3MsIHsgQXJndW1lbnRzLCBBcmd2IH0gZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgY2VydGlmaWNhdGVGb3IgfSBmcm9tICcuL2luZGV4JztcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnZGV2Y2VydCcpO1xuXG55YXJnc1xuICAuY29tbWFuZChcbiAgICAnY2VydGlmaWNhdGUtZm9yIDxkb21haW4+JyxcbiAgICAnZ2VuZXJhdGUgY2VydGlmaWNhdGUgZm9yIGRvbWFpbicsXG4gICAgKHlhcmdzOiBBcmd2KSA9PlxuICAgICAgeWFyZ3NcbiAgICAgICAgLnBvc2l0aW9uYWwoJ2RvbWFpbicsIHtcbiAgICAgICAgICBkZXNjcmliZTogJ2RvbWFpbiBjZXJ0aWZpY2F0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgLm9wdGlvbignc2tpcC1ob3N0cy1maWxlJywge1xuICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgXCJJZiBwcmVzZW50IHdpbGwgc2tpcCBhZGRpbmcgZG9tYWluIHRvIGhvc3RzIGZpbGUgaWYgaXQgZG9lc24ndCBleGlzdHNcIixcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgfSlcbiAgICAgICAgLm9wdGlvbignY29weS10by15b3NoaScsIHtcbiAgICAgICAgICBkZXNjcmliZTogJ291dHB1dCBrZXlzIHRvIHlvc2hpIHByb2plY3QnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICB9KSxcbiAgICBhc3luYyAoYXJndjogQXJndW1lbnRzKSA9PiB7XG4gICAgICBjb25zdCB7IGtleSwgY2VydCB9ID0gYXdhaXQgY2VydGlmaWNhdGVGb3IoYXJndi5kb21haW4sIHtcbiAgICAgICAgc2tpcEhvc3RzRmlsZTogYXJndi5za2lwSG9zdEZpbGVcbiAgICAgIH0pO1xuICAgICAgaWYgKGFyZ3YuY29weVRvWW9zaGkpIHtcbiAgICAgICAgc2hlbGxqc1xuICAgICAgICAgIC5maW5kKCdub2RlX21vZHVsZXMveW9zaGkvKiovY2VydC5wZW0nKVxuICAgICAgICAgIC5mb3JFYWNoKChmaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZyhgQ29waWVkIGNlcnQgdG8gJHtmaWxlUGF0aH1gKTtcbiAgICAgICAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIGNlcnQsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgc2hlbGxqc1xuICAgICAgICAgIC5maW5kKCdub2RlX21vZHVsZXMveW9zaGkvKiova2V5LnBlbScpXG4gICAgICAgICAgLmZvckVhY2goKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGRlYnVnKGBDb3BpZWQga2V5IHRvICR7ZmlsZVBhdGh9YCk7XG4gICAgICAgICAgICB3cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBrZXksIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIClcbiAgLnVzYWdlKCckMCA8Y29tbWFuZD4nKS5hcmd2O1xuIl19