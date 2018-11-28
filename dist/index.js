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
const command_exists_1 = require("command-exists");
const debug_1 = __importDefault(require("debug"));
const fs_1 = require("fs");
const read_1 = __importDefault(require("read"));
const rimraf_1 = __importDefault(require("rimraf"));
const util = __importStar(require("util"));
const certificate_authority_1 = __importDefault(require("./certificate-authority"));
const certificates_1 = __importDefault(require("./certificates"));
const constants_1 = require("./constants");
const platforms_1 = __importDefault(require("./platforms"));
const user_interface_1 = __importDefault(require("./user-interface"));
const debug = debug_1.default('devcert');
const read = util.promisify(read_1.default);
/**
 * Request an SSL certificate for the given app name signed by the devcert root
 * certificate authority. If devcert has previously generated a certificate for
 * that app name on this machine, it will reuse that certificate.
 *
 * If this is the first time devcert is being run on this machine, it will
 * generate and attempt to install a root certificate authority.
 *
 * Returns a promise that resolves with { key, cert }, where `key` and `cert`
 * are Buffers with the contents of the certificate private key and certificate
 * file, respectively
 */
function certificateFor(domain, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`Certificate requested for ${domain}. Skipping certutil install: ${Boolean(options.skipCertutilInstall)}. Skipping hosts file: ${Boolean(options.skipHostsFile)}`);
        if (options.ui) {
            Object.assign(user_interface_1.default, options.ui);
        }
        if (!constants_1.isMac && !constants_1.isLinux && !constants_1.isWindows) {
            throw new Error(`Platform not supported: "${process.platform}"`);
        }
        if (!command_exists_1.sync('openssl')) {
            throw new Error('OpenSSL not found: OpenSSL is required to generate SSL certificates - make sure it is installed and available in your PATH');
        }
        let domainKeyPath = constants_1.pathForDomain(domain, `private-key.key`);
        let domainCertPath = constants_1.pathForDomain(domain, `certificate.crt`);
        if (!fs_1.existsSync(constants_1.rootCAKeyPath)) {
            if (!options.password) {
                options.password = yield getRootCaPassword(true);
            }
            debug('Root CA is not installed yet, so it must be our first run. Installing root CA ...');
            yield certificate_authority_1.default(options);
        }
        if (!fs_1.existsSync(constants_1.pathForDomain(domain, `certificate.crt`))) {
            if (!options.password) {
                options.password = yield getRootCaPassword();
            }
            debug(`Can't find certificate file for ${domain}, so it must be the first request for ${domain}. Generating and caching ...`);
            yield certificates_1.default(domain, options);
        }
        if (!options.skipHostsFile) {
            yield platforms_1.default.addDomainToHostFileIfMissing(domain);
        }
        debug(`Returning domain certificate`);
        return {
            key: fs_1.readFileSync(domainKeyPath),
            cert: fs_1.readFileSync(domainCertPath)
        };
    });
}
exports.certificateFor = certificateFor;
function hasCertificateFor(domain) {
    return fs_1.existsSync(constants_1.pathForDomain(domain, `certificate.crt`));
}
exports.hasCertificateFor = hasCertificateFor;
function configuredDomains() {
    return fs_1.readdirSync(constants_1.domainsDir);
}
exports.configuredDomains = configuredDomains;
function removeDomain(domain) {
    return rimraf_1.default.sync(constants_1.pathForDomain(domain));
}
exports.removeDomain = removeDomain;
function getRootCaPassword(confirm = false) {
    return __awaiter(this, void 0, void 0, function* () {
        debug('Requesting password');
        let password = yield read({
            prompt: 'Please enter Root CA password',
            silent: true
        });
        if (!password || password.length < (yield 4)) {
            password = yield read({
                prompt: 'Please enter Root CA password. Minimum 4 chars'
            });
        }
        if (confirm) {
            const confirm = yield read({
                prompt: 'Please repeat Root CA password',
                silent: true
            });
            if (password !== confirm) {
                throw new Error("Your password doesn't match");
            }
        }
        return password;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1EQUF1RDtBQUN2RCxrREFBZ0M7QUFDaEMsMkJBSVk7QUFDWixnREFBMEI7QUFDMUIsb0RBQTRCO0FBQzVCLDJDQUE2QjtBQUM3QixvRkFBa0U7QUFDbEUsa0VBQXVEO0FBQ3ZELDJDQU9xQjtBQUNyQiw0REFBMEM7QUFDMUMsc0VBQXFEO0FBRXJELE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWtCLENBQUMsQ0FBQztBQVNoRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILHdCQUFxQyxNQUFjLEVBQUUsVUFBbUIsRUFBRTs7UUFDeEUsS0FBSyxDQUNILDZCQUE2QixNQUFNLGdDQUFnQyxPQUFPLENBQ3hFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FDNUIsMEJBQTBCLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FDNUQsQ0FBQztRQUVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBSyxJQUFJLENBQUMsbUJBQU8sSUFBSSxDQUFDLHFCQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lB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QUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ2pELENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzeW5jIGFzIGNvbW1hbmRFeGlzdHMgfSBmcm9tICdjb21tYW5kLWV4aXN0cyc7XG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHtcbiAgZXhpc3RzU3luYyBhcyBleGlzdHMsXG4gIHJlYWRkaXJTeW5jIGFzIHJlYWRkaXIsXG4gIHJlYWRGaWxlU3luYyBhcyByZWFkRmlsZVxufSBmcm9tICdmcyc7XG5pbXBvcnQgcmVhZENiIGZyb20gJ3JlYWQnO1xuaW1wb3J0IHJpbXJhZiBmcm9tICdyaW1yYWYnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICd1dGlsJztcbmltcG9ydCBpbnN0YWxsQ2VydGlmaWNhdGVBdXRob3JpdHkgZnJvbSAnLi9jZXJ0aWZpY2F0ZS1hdXRob3JpdHknO1xuaW1wb3J0IGdlbmVyYXRlRG9tYWluQ2VydGlmaWNhdGUgZnJvbSAnLi9jZXJ0aWZpY2F0ZXMnO1xuaW1wb3J0IHtcbiAgZG9tYWluc0RpcixcbiAgaXNMaW51eCxcbiAgaXNNYWMsXG4gIGlzV2luZG93cyxcbiAgcGF0aEZvckRvbWFpbixcbiAgcm9vdENBS2V5UGF0aFxufSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgY3VycmVudFBsYXRmb3JtIGZyb20gJy4vcGxhdGZvcm1zJztcbmltcG9ydCBVSSwgeyBVc2VySW50ZXJmYWNlIH0gZnJvbSAnLi91c2VyLWludGVyZmFjZSc7XG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2RldmNlcnQnKTtcbmNvbnN0IHJlYWQgPSB1dGlsLnByb21pc2lmeShyZWFkQ2IgYXMgRnVuY3Rpb24pO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xuICBza2lwQ2VydHV0aWxJbnN0YWxsPzogdHJ1ZTtcbiAgc2tpcEhvc3RzRmlsZT86IHRydWU7XG4gIHVpPzogVXNlckludGVyZmFjZTtcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmVxdWVzdCBhbiBTU0wgY2VydGlmaWNhdGUgZm9yIHRoZSBnaXZlbiBhcHAgbmFtZSBzaWduZWQgYnkgdGhlIGRldmNlcnQgcm9vdFxuICogY2VydGlmaWNhdGUgYXV0aG9yaXR5LiBJZiBkZXZjZXJ0IGhhcyBwcmV2aW91c2x5IGdlbmVyYXRlZCBhIGNlcnRpZmljYXRlIGZvclxuICogdGhhdCBhcHAgbmFtZSBvbiB0aGlzIG1hY2hpbmUsIGl0IHdpbGwgcmV1c2UgdGhhdCBjZXJ0aWZpY2F0ZS5cbiAqXG4gKiBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGRldmNlcnQgaXMgYmVpbmcgcnVuIG9uIHRoaXMgbWFjaGluZSwgaXQgd2lsbFxuICogZ2VuZXJhdGUgYW5kIGF0dGVtcHQgdG8gaW5zdGFsbCBhIHJvb3QgY2VydGlmaWNhdGUgYXV0aG9yaXR5LlxuICpcbiAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB7IGtleSwgY2VydCB9LCB3aGVyZSBga2V5YCBhbmQgYGNlcnRgXG4gKiBhcmUgQnVmZmVycyB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgY2VydGlmaWNhdGUgcHJpdmF0ZSBrZXkgYW5kIGNlcnRpZmljYXRlXG4gKiBmaWxlLCByZXNwZWN0aXZlbHlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNlcnRpZmljYXRlRm9yKGRvbWFpbjogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zID0ge30pIHtcbiAgZGVidWcoXG4gICAgYENlcnRpZmljYXRlIHJlcXVlc3RlZCBmb3IgJHtkb21haW59LiBTa2lwcGluZyBjZXJ0dXRpbCBpbnN0YWxsOiAke0Jvb2xlYW4oXG4gICAgICBvcHRpb25zLnNraXBDZXJ0dXRpbEluc3RhbGxcbiAgICApfS4gU2tpcHBpbmcgaG9zdHMgZmlsZTogJHtCb29sZWFuKG9wdGlvbnMuc2tpcEhvc3RzRmlsZSl9YFxuICApO1xuXG4gIGlmIChvcHRpb25zLnVpKSB7XG4gICAgT2JqZWN0LmFzc2lnbihVSSwgb3B0aW9ucy51aSk7XG4gIH1cblxuICBpZiAoIWlzTWFjICYmICFpc0xpbnV4ICYmICFpc1dpbmRvd3MpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFBsYXRmb3JtIG5vdCBzdXBwb3J0ZWQ6IFwiJHtwcm9jZXNzLnBsYXRmb3JtfVwiYCk7XG4gIH1cblxuICBpZiAoIWNvbW1hbmRFeGlzdHMoJ29wZW5zc2wnKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdPcGVuU1NMIG5vdCBmb3VuZDogT3BlblNTTCBpcyByZXF1aXJlZCB0byBnZW5lcmF0ZSBTU0wgY2VydGlmaWNhdGVzIC0gbWFrZSBzdXJlIGl0IGlzIGluc3RhbGxlZCBhbmQgYXZhaWxhYmxlIGluIHlvdXIgUEFUSCdcbiAgICApO1xuICB9XG5cbiAgbGV0IGRvbWFpbktleVBhdGggPSBwYXRoRm9yRG9tYWluKGRvbWFpbiwgYHByaXZhdGUta2V5LmtleWApO1xuICBsZXQgZG9tYWluQ2VydFBhdGggPSBwYXRoRm9yRG9tYWluKGRvbWFpbiwgYGNlcnRpZmljYXRlLmNydGApO1xuXG4gIGlmICghZXhpc3RzKHJvb3RDQUtleVBhdGgpKSB7XG4gICAgaWYgKCFvcHRpb25zLnBhc3N3b3JkKSB7XG4gICAgICBvcHRpb25zLnBhc3N3b3JkID0gYXdhaXQgZ2V0Um9vdENhUGFzc3dvcmQodHJ1ZSk7XG4gICAgfVxuICAgIGRlYnVnKFxuICAgICAgJ1Jvb3QgQ0EgaXMgbm90IGluc3RhbGxlZCB5ZXQsIHNvIGl0IG11c3QgYmUgb3VyIGZpcnN0IHJ1bi4gSW5zdGFsbGluZyByb290IENBIC4uLidcbiAgICApO1xuICAgIGF3YWl0IGluc3RhbGxDZXJ0aWZpY2F0ZUF1dGhvcml0eShvcHRpb25zKTtcbiAgfVxuXG4gIGlmICghZXhpc3RzKHBhdGhGb3JEb21haW4oZG9tYWluLCBgY2VydGlmaWNhdGUuY3J0YCkpKSB7XG4gICAgaWYgKCFvcHRpb25zLnBhc3N3b3JkKSB7XG4gICAgICBvcHRpb25zLnBhc3N3b3JkID0gYXdhaXQgZ2V0Um9vdENhUGFzc3dvcmQoKTtcbiAgICB9XG4gICAgZGVidWcoXG4gICAgICBgQ2FuJ3QgZmluZCBjZXJ0aWZpY2F0ZSBmaWxlIGZvciAke2RvbWFpbn0sIHNvIGl0IG11c3QgYmUgdGhlIGZpcnN0IHJlcXVlc3QgZm9yICR7ZG9tYWlufS4gR2VuZXJhdGluZyBhbmQgY2FjaGluZyAuLi5gXG4gICAgKTtcbiAgICBhd2FpdCBnZW5lcmF0ZURvbWFpbkNlcnRpZmljYXRlKGRvbWFpbiwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuc2tpcEhvc3RzRmlsZSkge1xuICAgIGF3YWl0IGN1cnJlbnRQbGF0Zm9ybS5hZGREb21haW5Ub0hvc3RGaWxlSWZNaXNzaW5nKGRvbWFpbik7XG4gIH1cblxuICBkZWJ1ZyhgUmV0dXJuaW5nIGRvbWFpbiBjZXJ0aWZpY2F0ZWApO1xuICByZXR1cm4ge1xuICAgIGtleTogcmVhZEZpbGUoZG9tYWluS2V5UGF0aCksXG4gICAgY2VydDogcmVhZEZpbGUoZG9tYWluQ2VydFBhdGgpXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDZXJ0aWZpY2F0ZUZvcihkb21haW46IHN0cmluZykge1xuICByZXR1cm4gZXhpc3RzKHBhdGhGb3JEb21haW4oZG9tYWluLCBgY2VydGlmaWNhdGUuY3J0YCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlZERvbWFpbnMoKSB7XG4gIHJldHVybiByZWFkZGlyKGRvbWFpbnNEaXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRG9tYWluKGRvbWFpbjogc3RyaW5nKSB7XG4gIHJldHVybiByaW1yYWYuc3luYyhwYXRoRm9yRG9tYWluKGRvbWFpbikpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRSb290Q2FQYXNzd29yZChjb25maXJtID0gZmFsc2UpIHtcbiAgZGVidWcoJ1JlcXVlc3RpbmcgcGFzc3dvcmQnKTtcbiAgbGV0IHBhc3N3b3JkID0gYXdhaXQgcmVhZCh7XG4gICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIFJvb3QgQ0EgcGFzc3dvcmQnLFxuICAgIHNpbGVudDogdHJ1ZVxuICB9KTtcbiAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPCAoYXdhaXQgNCkpIHtcbiAgICBwYXNzd29yZCA9IGF3YWl0IHJlYWQoe1xuICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIFJvb3QgQ0EgcGFzc3dvcmQuIE1pbmltdW0gNCBjaGFycydcbiAgICB9KTtcbiAgfVxuICBpZiAoY29uZmlybSkge1xuICAgIGNvbnN0IGNvbmZpcm0gPSBhd2FpdCByZWFkKHtcbiAgICAgIHByb21wdDogJ1BsZWFzZSByZXBlYXQgUm9vdCBDQSBwYXNzd29yZCcsXG4gICAgICBzaWxlbnQ6IHRydWVcbiAgICB9KTtcbiAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdXIgcGFzc3dvcmQgZG9lc24ndCBtYXRjaFwiKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhc3N3b3JkO1xufVxuIl19