"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const tmp_1 = __importDefault(require("tmp"));
const debug_1 = __importDefault(require("debug"));
const path_1 = __importDefault(require("path"));
const sudo_prompt_1 = __importDefault(require("sudo-prompt"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGlEQUEwRDtBQUMxRCw4Q0FBc0I7QUFDdEIsa0RBQWdDO0FBQ2hDLGdEQUF3QjtBQUN4Qiw4REFBcUM7QUFFckMsMkNBQXlDO0FBRXpDLE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUUxQyxpQkFBd0IsR0FBVztJQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxFQUFFLEVBQUU7UUFDM0IsS0FBSyxFQUFFLE1BQU07UUFDYixHQUFHLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FDaEI7WUFDRSxRQUFRLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxzQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDLEVBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FDWjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFWRCwwQkFVQztBQUVELGFBQW9CLEdBQVcsRUFBRSxVQUEyQixFQUFFO0lBQzVELEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDMUIsTUFBTSxDQUFDLHdCQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFIRCxrQkFHQztBQUVEO0lBQ0UsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBTEQsa0NBS0M7QUFFRCx5QkFBZ0MsT0FBZTtJQUM3QyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQ2QsR0FBRyxPQUFPLHNHQUFzRyxDQUNqSCxDQUFDO0FBQ0osQ0FBQztBQUpELDBDQUlDO0FBRUQ7SUFDRSx5RkFBeUY7SUFDekYsdURBQXVEO0lBQ3ZELE1BQU0sQ0FBQyxhQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDeEQsQ0FBQztBQUpELHNCQUlDO0FBRUQsY0FBcUIsR0FBVztJQUM5QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMscUJBQVUsQ0FBQyxJQUFJLENBQ2IsR0FBRyxFQUNILEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUNuQixDQUFDLEdBQWlCLEVBQUUsTUFBcUIsRUFBRSxNQUFxQixFQUFFLEVBQUU7WUFDbEUsSUFBSSxLQUFLLEdBQ1AsR0FBRztnQkFDSCxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVE7b0JBQ3pCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztvQkFDeEIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2QixLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBZkQsb0JBZUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjU3luYywgRXhlY1N5bmNPcHRpb25zIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgdG1wIGZyb20gJ3RtcCc7XG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgc3Vkb1Byb21wdCBmcm9tICdzdWRvLXByb21wdCc7XG5cbmltcG9ydCB7IGNvbmZpZ1BhdGggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2RldmNlcnQ6dXRpbCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlbnNzbChjbWQ6IHN0cmluZykge1xuICByZXR1cm4gcnVuKGBvcGVuc3NsICR7Y21kfWAsIHtcbiAgICBzdGRpbzogJ3BpcGUnLFxuICAgIGVudjogT2JqZWN0LmFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgUkFOREZJTEU6IHBhdGguam9pbihjb25maWdQYXRoKCcucm5kJykpXG4gICAgICB9LFxuICAgICAgcHJvY2Vzcy5lbnZcbiAgICApXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVuKGNtZDogc3RyaW5nLCBvcHRpb25zOiBFeGVjU3luY09wdGlvbnMgPSB7fSkge1xuICBkZWJ1ZyhgZXhlYzogXFxgJHtjbWR9XFxgYCk7XG4gIHJldHVybiBleGVjU3luYyhjbWQsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FpdEZvclVzZXIoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHByb2Nlc3Muc3RkaW4ucmVzdW1lKCk7XG4gICAgcHJvY2Vzcy5zdGRpbi5vbignZGF0YScsIHJlc29sdmUpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcG9ydGFibGVFcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICBgJHttZXNzYWdlfSB8IFRoaXMgaXMgYSBidWcgaW4gZGV2Y2VydCwgcGxlYXNlIHJlcG9ydCB0aGUgaXNzdWUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2RhdmV3YXNtZXIvZGV2Y2VydC9pc3N1ZXNgXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBta3RtcCgpIHtcbiAgLy8gZGlzY2FyZERlc2NyaXB0b3IgYmVjYXVzZSB3aW5kb3dzIGNvbXBsYWlucyB0aGUgZmlsZSBpcyBpbiB1c2UgaWYgd2UgY3JlYXRlIGEgdG1wIGZpbGVcbiAgLy8gYW5kIHRoZW4gc2hlbGwgb3V0IHRvIGEgcHJvY2VzcyB0aGF0IHRyaWVzIHRvIHVzZSBpdFxuICByZXR1cm4gdG1wLmZpbGVTeW5jKHsgZGlzY2FyZERlc2NyaXB0b3I6IHRydWUgfSkubmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1ZG8oY21kOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBzdWRvUHJvbXB0LmV4ZWMoXG4gICAgICBjbWQsXG4gICAgICB7IG5hbWU6ICdkZXZjZXJ0JyB9LFxuICAgICAgKGVycjogRXJyb3IgfCBudWxsLCBzdGRvdXQ6IHN0cmluZyB8IG51bGwsIHN0ZGVycjogc3RyaW5nIHwgbnVsbCkgPT4ge1xuICAgICAgICBsZXQgZXJyb3IgPVxuICAgICAgICAgIGVyciB8fFxuICAgICAgICAgICh0eXBlb2Ygc3RkZXJyID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgc3RkZXJyLnRyaW0oKS5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBuZXcgRXJyb3Ioc3RkZXJyKSk7XG4gICAgICAgIGVycm9yID8gcmVqZWN0KGVycm9yKSA6IHJlc29sdmUoc3Rkb3V0KTtcbiAgICAgIH1cbiAgICApO1xuICB9KTtcbn1cbiJdfQ==