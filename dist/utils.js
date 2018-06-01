"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const tmp_1 = tslib_1.__importDefault(require("tmp"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const path_1 = tslib_1.__importDefault(require("path"));
const sudo_prompt_1 = tslib_1.__importDefault(require("sudo-prompt"));
const constants_1 = require("./constants");
const debug = debug_1.default('devcert:util');
function openssl(cmd) {
    return run(`openssl ${cmd}`, {
        stdio: 'pipe',
        env: Object.assign({
            RANDFILE: path_1.default.join(constants_1.configPath('.rnd'))
        }, process.env)
    });
}
exports.openssl = openssl;
function run(cmd, options = {}) {
    debug(`exec: \`${cmd}\``);
    return child_process_1.execSync(cmd, options);
}
exports.run = run;
function waitForUser() {
    return new Promise((resolve) => {
        process.stdin.resume();
        process.stdin.on('data', resolve);
    });
}
exports.waitForUser = waitForUser;
function reportableError(message) {
    return new Error(`${message} | This is a bug in devcert, please report the issue at https://github.com/davewasmer/devcert/issues`);
}
exports.reportableError = reportableError;
function mktmp() {
    // discardDescriptor because windows complains the file is in use if we create a tmp file
    // and then shell out to a process that tries to use it
    return tmp_1.default.fileSync({ discardDescriptor: true }).name;
}
exports.mktmp = mktmp;
function sudo(cmd) {
    return new Promise((resolve, reject) => {
        sudo_prompt_1.default.exec(cmd, { name: 'devcert' }, (err, stdout, stderr) => {
            let error = err ||
                (typeof stderr === 'string' &&
                    stderr.trim().length > 0 &&
                    new Error(stderr));
            error ? reject(error) : resolve(stdout);
        });
    });
}
exports.sudo = sudo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBMEQ7QUFDMUQsc0RBQXNCO0FBQ3RCLDBEQUFnQztBQUNoQyx3REFBd0I7QUFDeEIsc0VBQXFDO0FBRXJDLDJDQUF5QztBQUV6QyxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFMUMsaUJBQXdCLEdBQVc7SUFDakMsT0FBTyxHQUFHLENBQUMsV0FBVyxHQUFHLEVBQUUsRUFBRTtRQUMzQixLQUFLLEVBQUUsTUFBTTtRQUNiLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUNoQjtZQUNFLFFBQVEsRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEMsRUFDRCxPQUFPLENBQUMsR0FBRyxDQUNaO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVZELDBCQVVDO0FBRUQsYUFBb0IsR0FBVyxFQUFFLFVBQTJCLEVBQUU7SUFDNUQsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMxQixPQUFPLHdCQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFIRCxrQkFHQztBQUVEO0lBQ0UsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUxELGtDQUtDO0FBRUQseUJBQWdDLE9BQWU7SUFDN0MsT0FBTyxJQUFJLEtBQUssQ0FDZCxHQUFHLE9BQU8sc0dBQXNHLENBQ2pILENBQUM7QUFDSixDQUFDO0FBSkQsMENBSUM7QUFFRDtJQUNFLHlGQUF5RjtJQUN6Rix1REFBdUQ7SUFDdkQsT0FBTyxhQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDeEQsQ0FBQztBQUpELHNCQUlDO0FBRUQsY0FBcUIsR0FBVztJQUM5QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLHFCQUFVLENBQUMsSUFBSSxDQUNiLEdBQUcsRUFDSCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsRUFDbkIsQ0FBQyxHQUFpQixFQUFFLE1BQXFCLEVBQUUsTUFBcUIsRUFBRSxFQUFFO1lBQ2xFLElBQUksS0FBSyxHQUNQLEdBQUc7Z0JBQ0gsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRO29CQUN6QixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUM7b0JBQ3hCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdkIsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWZELG9CQWVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlY1N5bmMsIEV4ZWNTeW5jT3B0aW9ucyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHRtcCBmcm9tICd0bXAnO1xuaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHN1ZG9Qcm9tcHQgZnJvbSAnc3Vkby1wcm9tcHQnO1xuXG5pbXBvcnQgeyBjb25maWdQYXRoIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZURlYnVnKCdkZXZjZXJ0OnV0aWwnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5zc2woY21kOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJ1bihgb3BlbnNzbCAke2NtZH1gLCB7XG4gICAgc3RkaW86ICdwaXBlJyxcbiAgICBlbnY6IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIFJBTkRGSUxFOiBwYXRoLmpvaW4oY29uZmlnUGF0aCgnLnJuZCcpKVxuICAgICAgfSxcbiAgICAgIHByb2Nlc3MuZW52XG4gICAgKVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bihjbWQ6IHN0cmluZywgb3B0aW9uczogRXhlY1N5bmNPcHRpb25zID0ge30pIHtcbiAgZGVidWcoYGV4ZWM6IFxcYCR7Y21kfVxcYGApO1xuICByZXR1cm4gZXhlY1N5bmMoY21kLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3JVc2VyKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBwcm9jZXNzLnN0ZGluLnJlc3VtZSgpO1xuICAgIHByb2Nlc3Muc3RkaW4ub24oJ2RhdGEnLCByZXNvbHZlKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBvcnRhYmxlRXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoXG4gICAgYCR7bWVzc2FnZX0gfCBUaGlzIGlzIGEgYnVnIGluIGRldmNlcnQsIHBsZWFzZSByZXBvcnQgdGhlIGlzc3VlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZld2FzbWVyL2RldmNlcnQvaXNzdWVzYFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWt0bXAoKSB7XG4gIC8vIGRpc2NhcmREZXNjcmlwdG9yIGJlY2F1c2Ugd2luZG93cyBjb21wbGFpbnMgdGhlIGZpbGUgaXMgaW4gdXNlIGlmIHdlIGNyZWF0ZSBhIHRtcCBmaWxlXG4gIC8vIGFuZCB0aGVuIHNoZWxsIG91dCB0byBhIHByb2Nlc3MgdGhhdCB0cmllcyB0byB1c2UgaXRcbiAgcmV0dXJuIHRtcC5maWxlU3luYyh7IGRpc2NhcmREZXNjcmlwdG9yOiB0cnVlIH0pLm5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWRvKGNtZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc3Vkb1Byb21wdC5leGVjKFxuICAgICAgY21kLFxuICAgICAgeyBuYW1lOiAnZGV2Y2VydCcgfSxcbiAgICAgIChlcnI6IEVycm9yIHwgbnVsbCwgc3Rkb3V0OiBzdHJpbmcgfCBudWxsLCBzdGRlcnI6IHN0cmluZyB8IG51bGwpID0+IHtcbiAgICAgICAgbGV0IGVycm9yID1cbiAgICAgICAgICBlcnIgfHxcbiAgICAgICAgICAodHlwZW9mIHN0ZGVyciA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICAgIHN0ZGVyci50cmltKCkubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgbmV3IEVycm9yKHN0ZGVycikpO1xuICAgICAgICBlcnJvciA/IHJlamVjdChlcnJvcikgOiByZXNvbHZlKHN0ZG91dCk7XG4gICAgICB9XG4gICAgKTtcbiAgfSk7XG59XG4iXX0=