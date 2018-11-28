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
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const rimraf_1 = require("rimraf");
const certificates_1 = require("./certificates");
const constants_1 = require("./constants");
const platforms_1 = __importDefault(require("./platforms"));
const utils_1 = require("./utils");
const debug = debug_1.default('devcert:certificate-authority');
/**
 * Install the once-per-machine trusted root CA. We'll use this CA to sign
 * per-app certs.
 */
function installCertificateAuthority(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password } = options;
        debug(`Checking if older devcert install is present`);
        scrubOldInsecureVersions();
        debug(`Generating a root certificate authority`);
        let rootKeyPath = utils_1.mktmp();
        let rootCertPath = utils_1.mktmp();
        debug(`Generating the OpenSSL configuration needed to setup the certificate authority`);
        seedConfigFiles();
        debug(`Generating a private key`);
        certificates_1.generateKey(rootKeyPath, { password });
        debug(`Generating a CA certificate`);
        utils_1.openssl(`req -new -x509 -config "${constants_1.caSelfSignConfig}" -key "${rootKeyPath}" -out "${rootCertPath}" -passin pass:${password}`);
        debug('Saving certificate authority credentials');
        yield saveCertificateAuthorityCredentials(rootKeyPath, rootCertPath);
        debug(`Adding the root certificate authority to trust stores`);
        yield platforms_1.default.addToTrustStores(rootCertPath, options);
    });
}
exports.default = installCertificateAuthority;
/**
 * Older versions of devcert left the root certificate keys unguarded and
 * accessible by userland processes. Here, we check for evidence of this older
 * version, and if found, we delete the root certificate keys to remove the
 * attack vector.
 */
function scrubOldInsecureVersions() {
    // Use the old verion's logic for determining config directory
    let configDir;
    if (constants_1.isWindows && process.env.LOCALAPPDATA) {
        configDir = path_1.default.join(process.env.LOCALAPPDATA, 'devcert', 'config');
    }
    else {
        let uid = process.getuid && process.getuid();
        let userHome = constants_1.isLinux && uid === 0
            ? path_1.default.resolve('/usr/local/share')
            : require('os').homedir();
        configDir = path_1.default.join(userHome, '.config', 'devcert');
    }
    // Delete the root certificate keys, as well as the generated app certificates
    debug(`Checking ${configDir} for legacy files ...`);
    [
        path_1.default.join(configDir, 'openssl.conf'),
        path_1.default.join(configDir, 'devcert-ca-root.key'),
        path_1.default.join(configDir, 'devcert-ca-root.crt'),
        path_1.default.join(configDir, 'devcert-ca-version'),
        path_1.default.join(configDir, 'certs')
    ].forEach((filepath) => {
        if (fs_1.existsSync(filepath)) {
            debug(`Removing legacy file: ${filepath}`);
            rimraf_1.sync(filepath);
        }
    });
}
/**
 * Initializes the files OpenSSL needs to sign certificates as a certificate
 * authority, as well as our CA setup version
 */
function seedConfigFiles() {
    // This is v2 of the devcert certificate authority setup
    fs_1.writeFileSync(constants_1.caVersionFile, '2');
    // OpenSSL CA files
    fs_1.writeFileSync(constants_1.opensslDatabaseFilePath, '');
    fs_1.writeFileSync(constants_1.opensslSerialFilePath, '01');
}
function withCertificateAuthorityCredentials(cb) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`Retrieving devcert's certificate authority credentials`);
        let tmpCAKeyPath = utils_1.mktmp();
        let tmpCACertPath = utils_1.mktmp();
        let caKey = yield platforms_1.default.readProtectedFile(constants_1.rootCAKeyPath);
        let caCert = yield platforms_1.default.readProtectedFile(constants_1.rootCACertPath);
        fs_1.writeFileSync(tmpCAKeyPath, caKey);
        fs_1.writeFileSync(tmpCACertPath, caCert);
        yield cb({ caKeyPath: tmpCAKeyPath, caCertPath: tmpCACertPath });
        fs_1.unlinkSync(tmpCAKeyPath);
        fs_1.unlinkSync(tmpCACertPath);
    });
}
exports.withCertificateAuthorityCredentials = withCertificateAuthorityCredentials;
function saveCertificateAuthorityCredentials(keypath, certpath) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`Saving devcert's certificate authority credentials`);
        let key = fs_1.readFileSync(keypath, 'utf-8');
        let cert = fs_1.readFileSync(certpath, 'utf-8');
        yield platforms_1.default.writeProtectedFile(constants_1.rootCAKeyPath, key);
        yield platforms_1.default.writeProtectedFile(constants_1.rootCACertPath, cert);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGUtYXV0aG9yaXR5LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsiY2VydGlmaWNhdGUtYXV0aG9yaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBZ0M7QUFDaEMsMkJBS1k7QUFDWixnREFBd0I7QUFDeEIsbUNBQXdDO0FBQ3hDLGlEQUE2QztBQUU3QywyQ0FTcUI7QUFFckIsNERBQTBDO0FBQzFDLG1DQUF5QztBQUV6QyxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUUzRDs7O0dBR0c7QUFDSCxxQ0FDRSxVQUFtQixFQUFFOztRQUVyQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQzdCLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQ3RELHdCQUF3QixFQUFFLENBQUM7UUFFM0IsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDakQsSUFBSSxXQUFXLEdBQUcsYUFBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxZQUFZLEdBQUcsYUFBSyxFQUFFLENBQUM7UUFFM0IsS0FBSyxDQUNILGdGQUFnRixDQUNqRixDQUFDO1FBQ0YsZUFBZSxFQUFFLENBQUM7UUFFbEIsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFFbEMsMEJBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRXZDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3JDLGVBQU8sQ0FDTCwyQkFBMkIsNEJBQWdCLFdBQVcsV0FBVyxXQUFXLFlBQVksa0JBQWtCLFFBQVEsRUFBRSxDQUNySCxDQUFDO1FBRUYsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxtQ0FBbUMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDckUsS0FBSyxDQUFD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QUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FBQTtBQVhELGtGQVdDO0FBRUQsNkNBQ0UsT0FBZSxFQUNmLFFBQWdCOztRQUVoQixLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztRQUM1RCxJQUFJLEdBQUcsR0FBRyxpQkFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNyQyxJQUFJLElBQUksR0FBRyxpQkFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxNQUFNLG1CQUFlLENBQUMsa0JBQWtCLENBQUMseUJBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3RCxNQUFNLG1CQUFlLENBQUMsa0JBQWtCLENBQUMsMEJBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHtcbiAgZXhpc3RzU3luYyBhcyBleGlzdHMsXG4gIHJlYWRGaWxlU3luYyBhcyByZWFkRmlsZSxcbiAgdW5saW5rU3luYyBhcyBybSxcbiAgd3JpdGVGaWxlU3luYyBhcyB3cml0ZUZpbGVcbn0gZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBzeW5jIGFzIHJpbXJhZiB9IGZyb20gJ3JpbXJhZic7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4vY2VydGlmaWNhdGVzJztcblxuaW1wb3J0IHtcbiAgY2FTZWxmU2lnbkNvbmZpZyxcbiAgY2FWZXJzaW9uRmlsZSxcbiAgaXNMaW51eCxcbiAgaXNXaW5kb3dzLFxuICBvcGVuc3NsRGF0YWJhc2VGaWxlUGF0aCxcbiAgb3BlbnNzbFNlcmlhbEZpbGVQYXRoLFxuICByb290Q0FDZXJ0UGF0aCxcbiAgcm9vdENBS2V5UGF0aFxufSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgY3VycmVudFBsYXRmb3JtIGZyb20gJy4vcGxhdGZvcm1zJztcbmltcG9ydCB7IG1rdG1wLCBvcGVuc3NsIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2RldmNlcnQ6Y2VydGlmaWNhdGUtYXV0aG9yaXR5Jyk7XG5cbi8qKlxuICogSW5zdGFsbCB0aGUgb25jZS1wZXItbWFjaGluZSB0cnVzdGVkIHJvb3QgQ0EuIFdlJ2xsIHVzZSB0aGlzIENBIHRvIHNpZ25cbiAqIHBlci1hcHAgY2VydHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGluc3RhbGxDZXJ0aWZpY2F0ZUF1dGhvcml0eShcbiAgb3B0aW9uczogT3B0aW9ucyA9IHt9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyBwYXNzd29yZCB9ID0gb3B0aW9ucztcbiAgZGVidWcoYENoZWNraW5nIGlmIG9sZGVyIGRldmNlcnQgaW5zdGFsbCBpcyBwcmVzZW50YCk7XG4gIHNjcnViT2xkSW5zZWN1cmVWZXJzaW9ucygpO1xuXG4gIGRlYnVnKGBHZW5lcmF0aW5nIGEgcm9vdCBjZXJ0aWZpY2F0ZSBhdXRob3JpdHlgKTtcbiAgbGV0IHJvb3RLZXlQYXRoID0gbWt0bXAoKTtcbiAgbGV0IHJvb3RDZXJ0UGF0aCA9IG1rdG1wKCk7XG5cbiAgZGVidWcoXG4gICAgYEdlbmVyYXRpbmcgdGhlIE9wZW5TU0wgY29uZmlndXJhdGlvbiBuZWVkZWQgdG8gc2V0dXAgdGhlIGNlcnRpZmljYXRlIGF1dGhvcml0eWBcbiAgKTtcbiAgc2VlZENvbmZpZ0ZpbGVzKCk7XG5cbiAgZGVidWcoYEdlbmVyYXRpbmcgYSBwcml2YXRlIGtleWApO1xuXG4gIGdlbmVyYXRlS2V5KHJvb3RLZXlQYXRoLCB7IHBhc3N3b3JkIH0pO1xuXG4gIGRlYnVnKGBHZW5lcmF0aW5nIGEgQ0EgY2VydGlmaWNhdGVgKTtcbiAgb3BlbnNzbChcbiAgICBgcmVxIC1uZXcgLXg1MDkgLWNvbmZpZyBcIiR7Y2FTZWxmU2lnbkNvbmZpZ31cIiAta2V5IFwiJHtyb290S2V5UGF0aH1cIiAtb3V0IFwiJHtyb290Q2VydFBhdGh9XCIgLXBhc3NpbiBwYXNzOiR7cGFzc3dvcmR9YFxuICApO1xuXG4gIGRlYnVnKCdTYXZpbmcgY2VydGlmaWNhdGUgYXV0aG9yaXR5IGNyZWRlbnRpYWxzJyk7XG4gIGF3YWl0IHNhdmVDZXJ0aWZpY2F0ZUF1dGhvcml0eUNyZWRlbnRpYWxzKHJvb3RLZXlQYXRoLCByb290Q2VydFBhdGgpO1xuICBkZWJ1ZyhgQWRkaW5nIHRoZSByb290IGNlcnRpZmljYXRlIGF1dGhvcml0eSB0byB0cnVzdCBzdG9yZXNgKTtcbiAgYXdhaXQgY3VycmVudFBsYXRmb3JtLmFkZFRvVHJ1c3RTdG9yZXMocm9vdENlcnRQYXRoLCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBPbGRlciB2ZXJzaW9ucyBvZiBkZXZjZXJ0IGxlZnQgdGhlIHJvb3QgY2VydGlmaWNhdGUga2V5cyB1bmd1YXJkZWQgYW5kXG4gKiBhY2Nlc3NpYmxlIGJ5IHVzZXJsYW5kIHByb2Nlc3Nlcy4gSGVyZSwgd2UgY2hlY2sgZm9yIGV2aWRlbmNlIG9mIHRoaXMgb2xkZXJcbiAqIHZlcnNpb24sIGFuZCBpZiBmb3VuZCwgd2UgZGVsZXRlIHRoZSByb290IGNlcnRpZmljYXRlIGtleXMgdG8gcmVtb3ZlIHRoZVxuICogYXR0YWNrIHZlY3Rvci5cbiAqL1xuZnVuY3Rpb24gc2NydWJPbGRJbnNlY3VyZVZlcnNpb25zKCkge1xuICAvLyBVc2UgdGhlIG9sZCB2ZXJpb24ncyBsb2dpYyBmb3IgZGV0ZXJtaW5pbmcgY29uZmlnIGRpcmVjdG9yeVxuICBsZXQgY29uZmlnRGlyOiBzdHJpbmc7XG4gIGlmIChpc1dpbmRvd3MgJiYgcHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBKSB7XG4gICAgY29uZmlnRGlyID0gcGF0aC5qb2luKHByb2Nlc3MuZW52LkxPQ0FMQVBQREFUQSwgJ2RldmNlcnQnLCAnY29uZmlnJyk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHVpZCA9IHByb2Nlc3MuZ2V0dWlkICYmIHByb2Nlc3MuZ2V0dWlkKCk7XG4gICAgbGV0IHVzZXJIb21lID1cbiAgICAgIGlzTGludXggJiYgdWlkID09PSAwXG4gICAgICAgID8gcGF0aC5yZXNvbHZlKCcvdXNyL2xvY2FsL3NoYXJlJylcbiAgICAgICAgOiByZXF1aXJlKCdvcycpLmhvbWVkaXIoKTtcbiAgICBjb25maWdEaXIgPSBwYXRoLmpvaW4odXNlckhvbWUsICcuY29uZmlnJywgJ2RldmNlcnQnKTtcbiAgfVxuXG4gIC8vIERlbGV0ZSB0aGUgcm9vdCBjZXJ0aWZpY2F0ZSBrZXlzLCBhcyB3ZWxsIGFzIHRoZSBnZW5lcmF0ZWQgYXBwIGNlcnRpZmljYXRlc1xuICBkZWJ1ZyhgQ2hlY2tpbmcgJHtjb25maWdEaXJ9IGZvciBsZWdhY3kgZmlsZXMgLi4uYCk7XG4gIFtcbiAgICBwYXRoLmpvaW4oY29uZmlnRGlyLCAnb3BlbnNzbC5jb25mJyksXG4gICAgcGF0aC5qb2luKGNvbmZpZ0RpciwgJ2RldmNlcnQtY2Etcm9vdC5rZXknKSxcbiAgICBwYXRoLmpvaW4oY29uZmlnRGlyLCAnZGV2Y2VydC1jYS1yb290LmNydCcpLFxuICAgIHBhdGguam9pbihjb25maWdEaXIsICdkZXZjZXJ0LWNhLXZlcnNpb24nKSxcbiAgICBwYXRoLmpvaW4oY29uZmlnRGlyLCAnY2VydHMnKVxuICBdLmZvckVhY2goKGZpbGVwYXRoKSA9PiB7XG4gICAgaWYgKGV4aXN0cyhmaWxlcGF0aCkpIHtcbiAgICAgIGRlYnVnKGBSZW1vdmluZyBsZWdhY3kgZmlsZTogJHtmaWxlcGF0aH1gKTtcbiAgICAgIHJpbXJhZihmaWxlcGF0aCk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgZmlsZXMgT3BlblNTTCBuZWVkcyB0byBzaWduIGNlcnRpZmljYXRlcyBhcyBhIGNlcnRpZmljYXRlXG4gKiBhdXRob3JpdHksIGFzIHdlbGwgYXMgb3VyIENBIHNldHVwIHZlcnNpb25cbiAqL1xuZnVuY3Rpb24gc2VlZENvbmZpZ0ZpbGVzKCkge1xuICAvLyBUaGlzIGlzIHYyIG9mIHRoZSBkZXZjZXJ0IGNlcnRpZmljYXRlIGF1dGhvcml0eSBzZXR1cFxuICB3cml0ZUZpbGUoY2FWZXJzaW9uRmlsZSwgJzInKTtcbiAgLy8gT3BlblNTTCBDQSBmaWxlc1xuICB3cml0ZUZpbGUob3BlbnNzbERhdGFiYXNlRmlsZVBhdGgsICcnKTtcbiAgd3JpdGVGaWxlKG9wZW5zc2xTZXJpYWxGaWxlUGF0aCwgJzAxJyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aXRoQ2VydGlmaWNhdGVBdXRob3JpdHlDcmVkZW50aWFscyhjYjogKHsgY2FLZXlQYXRoLCBjYUNlcnRQYXRoIH06IHsgY2FLZXlQYXRoOiBzdHJpbmcsIGNhQ2VydFBhdGg6IHN0cmluZyB9KSA9PiBQcm9taXNlPHZvaWQ+IHwgdm9pZCkge1xuICBkZWJ1ZyhgUmV0cmlldmluZyBkZXZjZXJ0J3MgY2VydGlmaWNhdGUgYXV0aG9yaXR5IGNyZWRlbnRpYWxzYCk7XG4gIGxldCB0bXBDQUtleVBhdGggPSBta3RtcCgpO1xuICBsZXQgdG1wQ0FDZXJ0UGF0aCA9IG1rdG1wKCk7XG4gIGxldCBjYUtleSA9IGF3YWl0IGN1cnJlbnRQbGF0Zm9ybS5yZWFkUHJvdGVjdGVkRmlsZShyb290Q0FLZXlQYXRoKTtcbiAgbGV0IGNhQ2VydCA9IGF3YWl0IGN1cnJlbnRQbGF0Zm9ybS5yZWFkUHJvdGVjdGVkRmlsZShyb290Q0FDZXJ0UGF0aCk7XG4gIHdyaXRlRmlsZSh0bXBDQUtleVBhdGgsIGNhS2V5KTtcbiAgd3JpdGVGaWxlKHRtcENBQ2VydFBhdGgsIGNhQ2VydCk7XG4gIGF3YWl0IGNiKHsgY2FLZXlQYXRoOiB0bXBDQUtleVBhdGgsIGNhQ2VydFBhdGg6IHRtcENBQ2VydFBhdGggfSk7XG4gIHJtKHRtcENBS2V5UGF0aCk7XG4gIHJtKHRtcENBQ2VydFBhdGgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlQ2VydGlmaWNhdGVBdXRob3JpdHlDcmVkZW50aWFscyhcbiAga2V5cGF0aDogc3RyaW5nLFxuICBjZXJ0cGF0aDogc3RyaW5nXG4pIHtcbiAgZGVidWcoYFNhdmluZyBkZXZjZXJ0J3MgY2VydGlmaWNhdGUgYXV0aG9yaXR5IGNyZWRlbnRpYWxzYCk7XG4gIGxldCBrZXkgPSByZWFkRmlsZShrZXlwYXRoLCAndXRmLTgnKTtcbiAgbGV0IGNlcnQgPSByZWFkRmlsZShjZXJ0cGF0aCwgJ3V0Zi04Jyk7XG4gIGF3YWl0IGN1cnJlbnRQbGF0Zm9ybS53cml0ZVByb3RlY3RlZEZpbGUocm9vdENBS2V5UGF0aCwga2V5KTtcbiAgYXdhaXQgY3VycmVudFBsYXRmb3JtLndyaXRlUHJvdGVjdGVkRmlsZShyb290Q0FDZXJ0UGF0aCwgY2VydCk7XG59XG4iXX0=