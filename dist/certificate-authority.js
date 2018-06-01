"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const rimraf_1 = require("rimraf");
const certificates_1 = require("./certificates");
const constants_1 = require("./constants");
const platforms_1 = tslib_1.__importDefault(require("./platforms"));
const utils_1 = require("./utils");
const debug = debug_1.default('devcert:certificate-authority');
/**
 * Install the once-per-machine trusted root CA. We'll use this CA to sign
 * per-app certs.
 */
function installCertificateAuthority(options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        debug(`Saving devcert's certificate authority credentials`);
        let key = fs_1.readFileSync(keypath, 'utf-8');
        let cert = fs_1.readFileSync(certpath, 'utf-8');
        yield platforms_1.default.writeProtectedFile(constants_1.rootCAKeyPath, key);
        yield platforms_1.default.writeProtectedFile(constants_1.rootCACertPath, cert);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGUtYXV0aG9yaXR5LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsiY2VydGlmaWNhdGUtYXV0aG9yaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBEQUFnQztBQUNoQywyQkFLWTtBQUNaLHdEQUF3QjtBQUN4QixtQ0FBd0M7QUFDeEMsaURBQTZDO0FBRTdDLDJDQVNxQjtBQUVyQixvRUFBMEM7QUFDMUMsbUNBQXlDO0FBRXpDLE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBRTNEOzs7R0FHRztBQUNILHFDQUNFLFVBQW1CLEVBQUU7O1FBRXJCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDN0IsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFDdEQsd0JBQXdCLEVBQUUsQ0FBQztRQUUzQixLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUNqRCxJQUFJLFdBQVcsR0FBRyxhQUFLLEVBQUUsQ0FBQztRQUMxQixJQUFJLFlBQVksR0FBRyxhQUFLLEVBQUUsQ0FBQztRQUUzQixLQUFLLENBQ0gsZ0ZBQWdGLENBQ2pGLENBQUM7UUFDRixlQUFlLEVBQUUsQ0FBQztRQUVsQixLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUVsQywwQkFBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFdkMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDckMsZUFBTyxDQUNMLDJCQUEyQiw0QkFBZ0IsV0FBVyxXQUFXLFdBQVcsWUFBWSxrQkFBa0IsUUFBUSxFQUFFLENBQ3JILENBQUM7UUFFRixLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUNsRCxNQUFNLG1DQUFtQyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNyRSxLQUFLLENBQUMsdURBQXVELENB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S0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7UUFDNUQsSUFBSSxHQUFHLEdBQUcsaUJBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxJQUFJLEdBQUcsaUJBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkMsTUFBTSxtQkFBZSxDQUFDLGtCQUFrQixDQUFDLHlCQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0QsTUFBTSxtQkFBZSxDQUFDLGtCQUFrQixDQUFDLDBCQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakUsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7XG4gIGV4aXN0c1N5bmMgYXMgZXhpc3RzLFxuICByZWFkRmlsZVN5bmMgYXMgcmVhZEZpbGUsXG4gIHVubGlua1N5bmMgYXMgcm0sXG4gIHdyaXRlRmlsZVN5bmMgYXMgd3JpdGVGaWxlXG59IGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgc3luYyBhcyByaW1yYWYgfSBmcm9tICdyaW1yYWYnO1xuaW1wb3J0IHsgZ2VuZXJhdGVLZXkgfSBmcm9tICcuL2NlcnRpZmljYXRlcyc7XG5cbmltcG9ydCB7XG4gIGNhU2VsZlNpZ25Db25maWcsXG4gIGNhVmVyc2lvbkZpbGUsXG4gIGlzTGludXgsXG4gIGlzV2luZG93cyxcbiAgb3BlbnNzbERhdGFiYXNlRmlsZVBhdGgsXG4gIG9wZW5zc2xTZXJpYWxGaWxlUGF0aCxcbiAgcm9vdENBQ2VydFBhdGgsXG4gIHJvb3RDQUtleVBhdGhcbn0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgT3B0aW9ucyB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IGN1cnJlbnRQbGF0Zm9ybSBmcm9tICcuL3BsYXRmb3Jtcyc7XG5pbXBvcnQgeyBta3RtcCwgb3BlbnNzbCB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZURlYnVnKCdkZXZjZXJ0OmNlcnRpZmljYXRlLWF1dGhvcml0eScpO1xuXG4vKipcbiAqIEluc3RhbGwgdGhlIG9uY2UtcGVyLW1hY2hpbmUgdHJ1c3RlZCByb290IENBLiBXZSdsbCB1c2UgdGhpcyBDQSB0byBzaWduXG4gKiBwZXItYXBwIGNlcnRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBpbnN0YWxsQ2VydGlmaWNhdGVBdXRob3JpdHkoXG4gIG9wdGlvbnM6IE9wdGlvbnMgPSB7fVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgcGFzc3dvcmQgfSA9IG9wdGlvbnM7XG4gIGRlYnVnKGBDaGVja2luZyBpZiBvbGRlciBkZXZjZXJ0IGluc3RhbGwgaXMgcHJlc2VudGApO1xuICBzY3J1Yk9sZEluc2VjdXJlVmVyc2lvbnMoKTtcblxuICBkZWJ1ZyhgR2VuZXJhdGluZyBhIHJvb3QgY2VydGlmaWNhdGUgYXV0aG9yaXR5YCk7XG4gIGxldCByb290S2V5UGF0aCA9IG1rdG1wKCk7XG4gIGxldCByb290Q2VydFBhdGggPSBta3RtcCgpO1xuXG4gIGRlYnVnKFxuICAgIGBHZW5lcmF0aW5nIHRoZSBPcGVuU1NMIGNvbmZpZ3VyYXRpb24gbmVlZGVkIHRvIHNldHVwIHRoZSBjZXJ0aWZpY2F0ZSBhdXRob3JpdHlgXG4gICk7XG4gIHNlZWRDb25maWdGaWxlcygpO1xuXG4gIGRlYnVnKGBHZW5lcmF0aW5nIGEgcHJpdmF0ZSBrZXlgKTtcblxuICBnZW5lcmF0ZUtleShyb290S2V5UGF0aCwgeyBwYXNzd29yZCB9KTtcblxuICBkZWJ1ZyhgR2VuZXJhdGluZyBhIENBIGNlcnRpZmljYXRlYCk7XG4gIG9wZW5zc2woXG4gICAgYHJlcSAtbmV3IC14NTA5IC1jb25maWcgXCIke2NhU2VsZlNpZ25Db25maWd9XCIgLWtleSBcIiR7cm9vdEtleVBhdGh9XCIgLW91dCBcIiR7cm9vdENlcnRQYXRofVwiIC1wYXNzaW4gcGFzczoke3Bhc3N3b3JkfWBcbiAgKTtcblxuICBkZWJ1ZygnU2F2aW5nIGNlcnRpZmljYXRlIGF1dGhvcml0eSBjcmVkZW50aWFscycpO1xuICBhd2FpdCBzYXZlQ2VydGlmaWNhdGVBdXRob3JpdHlDcmVkZW50aWFscyhyb290S2V5UGF0aCwgcm9vdENlcnRQYXRoKTtcbiAgZGVidWcoYEFkZGluZyB0aGUgcm9vdCBjZXJ0aWZpY2F0ZSBhdXRob3JpdHkgdG8gdHJ1c3Qgc3RvcmVzYCk7XG4gIGF3YWl0IGN1cnJlbnRQbGF0Zm9ybS5hZGRUb1RydXN0U3RvcmVzKHJvb3RDZXJ0UGF0aCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogT2xkZXIgdmVyc2lvbnMgb2YgZGV2Y2VydCBsZWZ0IHRoZSByb290IGNlcnRpZmljYXRlIGtleXMgdW5ndWFyZGVkIGFuZFxuICogYWNjZXNzaWJsZSBieSB1c2VybGFuZCBwcm9jZXNzZXMuIEhlcmUsIHdlIGNoZWNrIGZvciBldmlkZW5jZSBvZiB0aGlzIG9sZGVyXG4gKiB2ZXJzaW9uLCBhbmQgaWYgZm91bmQsIHdlIGRlbGV0ZSB0aGUgcm9vdCBjZXJ0aWZpY2F0ZSBrZXlzIHRvIHJlbW92ZSB0aGVcbiAqIGF0dGFjayB2ZWN0b3IuXG4gKi9cbmZ1bmN0aW9uIHNjcnViT2xkSW5zZWN1cmVWZXJzaW9ucygpIHtcbiAgLy8gVXNlIHRoZSBvbGQgdmVyaW9uJ3MgbG9naWMgZm9yIGRldGVybWluaW5nIGNvbmZpZyBkaXJlY3RvcnlcbiAgbGV0IGNvbmZpZ0Rpcjogc3RyaW5nO1xuICBpZiAoaXNXaW5kb3dzICYmIHByb2Nlc3MuZW52LkxPQ0FMQVBQREFUQSkge1xuICAgIGNvbmZpZ0RpciA9IHBhdGguam9pbihwcm9jZXNzLmVudi5MT0NBTEFQUERBVEEsICdkZXZjZXJ0JywgJ2NvbmZpZycpO1xuICB9IGVsc2Uge1xuICAgIGxldCB1aWQgPSBwcm9jZXNzLmdldHVpZCAmJiBwcm9jZXNzLmdldHVpZCgpO1xuICAgIGxldCB1c2VySG9tZSA9XG4gICAgICBpc0xpbnV4ICYmIHVpZCA9PT0gMFxuICAgICAgICA/IHBhdGgucmVzb2x2ZSgnL3Vzci9sb2NhbC9zaGFyZScpXG4gICAgICAgIDogcmVxdWlyZSgnb3MnKS5ob21lZGlyKCk7XG4gICAgY29uZmlnRGlyID0gcGF0aC5qb2luKHVzZXJIb21lLCAnLmNvbmZpZycsICdkZXZjZXJ0Jyk7XG4gIH1cblxuICAvLyBEZWxldGUgdGhlIHJvb3QgY2VydGlmaWNhdGUga2V5cywgYXMgd2VsbCBhcyB0aGUgZ2VuZXJhdGVkIGFwcCBjZXJ0aWZpY2F0ZXNcbiAgZGVidWcoYENoZWNraW5nICR7Y29uZmlnRGlyfSBmb3IgbGVnYWN5IGZpbGVzIC4uLmApO1xuICBbXG4gICAgcGF0aC5qb2luKGNvbmZpZ0RpciwgJ29wZW5zc2wuY29uZicpLFxuICAgIHBhdGguam9pbihjb25maWdEaXIsICdkZXZjZXJ0LWNhLXJvb3Qua2V5JyksXG4gICAgcGF0aC5qb2luKGNvbmZpZ0RpciwgJ2RldmNlcnQtY2Etcm9vdC5jcnQnKSxcbiAgICBwYXRoLmpvaW4oY29uZmlnRGlyLCAnZGV2Y2VydC1jYS12ZXJzaW9uJyksXG4gICAgcGF0aC5qb2luKGNvbmZpZ0RpciwgJ2NlcnRzJylcbiAgXS5mb3JFYWNoKChmaWxlcGF0aCkgPT4ge1xuICAgIGlmIChleGlzdHMoZmlsZXBhdGgpKSB7XG4gICAgICBkZWJ1ZyhgUmVtb3ZpbmcgbGVnYWN5IGZpbGU6ICR7ZmlsZXBhdGh9YCk7XG4gICAgICByaW1yYWYoZmlsZXBhdGgpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIGZpbGVzIE9wZW5TU0wgbmVlZHMgdG8gc2lnbiBjZXJ0aWZpY2F0ZXMgYXMgYSBjZXJ0aWZpY2F0ZVxuICogYXV0aG9yaXR5LCBhcyB3ZWxsIGFzIG91ciBDQSBzZXR1cCB2ZXJzaW9uXG4gKi9cbmZ1bmN0aW9uIHNlZWRDb25maWdGaWxlcygpIHtcbiAgLy8gVGhpcyBpcyB2MiBvZiB0aGUgZGV2Y2VydCBjZXJ0aWZpY2F0ZSBhdXRob3JpdHkgc2V0dXBcbiAgd3JpdGVGaWxlKGNhVmVyc2lvbkZpbGUsICcyJyk7XG4gIC8vIE9wZW5TU0wgQ0EgZmlsZXNcbiAgd3JpdGVGaWxlKG9wZW5zc2xEYXRhYmFzZUZpbGVQYXRoLCAnJyk7XG4gIHdyaXRlRmlsZShvcGVuc3NsU2VyaWFsRmlsZVBhdGgsICcwMScpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2l0aENlcnRpZmljYXRlQXV0aG9yaXR5Q3JlZGVudGlhbHMoY2I6ICh7IGNhS2V5UGF0aCwgY2FDZXJ0UGF0aCB9OiB7IGNhS2V5UGF0aDogc3RyaW5nLCBjYUNlcnRQYXRoOiBzdHJpbmcgfSkgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWQpIHtcbiAgZGVidWcoYFJldHJpZXZpbmcgZGV2Y2VydCdzIGNlcnRpZmljYXRlIGF1dGhvcml0eSBjcmVkZW50aWFsc2ApO1xuICBsZXQgdG1wQ0FLZXlQYXRoID0gbWt0bXAoKTtcbiAgbGV0IHRtcENBQ2VydFBhdGggPSBta3RtcCgpO1xuICBsZXQgY2FLZXkgPSBhd2FpdCBjdXJyZW50UGxhdGZvcm0ucmVhZFByb3RlY3RlZEZpbGUocm9vdENBS2V5UGF0aCk7XG4gIGxldCBjYUNlcnQgPSBhd2FpdCBjdXJyZW50UGxhdGZvcm0ucmVhZFByb3RlY3RlZEZpbGUocm9vdENBQ2VydFBhdGgpO1xuICB3cml0ZUZpbGUodG1wQ0FLZXlQYXRoLCBjYUtleSk7XG4gIHdyaXRlRmlsZSh0bXBDQUNlcnRQYXRoLCBjYUNlcnQpO1xuICBhd2FpdCBjYih7IGNhS2V5UGF0aDogdG1wQ0FLZXlQYXRoLCBjYUNlcnRQYXRoOiB0bXBDQUNlcnRQYXRoIH0pO1xuICBybSh0bXBDQUtleVBhdGgpO1xuICBybSh0bXBDQUNlcnRQYXRoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZUNlcnRpZmljYXRlQXV0aG9yaXR5Q3JlZGVudGlhbHMoXG4gIGtleXBhdGg6IHN0cmluZyxcbiAgY2VydHBhdGg6IHN0cmluZ1xuKSB7XG4gIGRlYnVnKGBTYXZpbmcgZGV2Y2VydCdzIGNlcnRpZmljYXRlIGF1dGhvcml0eSBjcmVkZW50aWFsc2ApO1xuICBsZXQga2V5ID0gcmVhZEZpbGUoa2V5cGF0aCwgJ3V0Zi04Jyk7XG4gIGxldCBjZXJ0ID0gcmVhZEZpbGUoY2VydHBhdGgsICd1dGYtOCcpO1xuICBhd2FpdCBjdXJyZW50UGxhdGZvcm0ud3JpdGVQcm90ZWN0ZWRGaWxlKHJvb3RDQUtleVBhdGgsIGtleSk7XG4gIGF3YWl0IGN1cnJlbnRQbGF0Zm9ybS53cml0ZVByb3RlY3RlZEZpbGUocm9vdENBQ2VydFBhdGgsIGNlcnQpO1xufVxuIl19