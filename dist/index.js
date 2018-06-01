"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_exists_1 = require("command-exists");
const debug_1 = tslib_1.__importDefault(require("debug"));
const fs_1 = require("fs");
const read_1 = tslib_1.__importDefault(require("read"));
const rimraf_1 = tslib_1.__importDefault(require("rimraf"));
const util = tslib_1.__importStar(require("util"));
const certificate_authority_1 = tslib_1.__importDefault(require("./certificate-authority"));
const certificates_1 = tslib_1.__importDefault(require("./certificates"));
const constants_1 = require("./constants");
const platforms_1 = tslib_1.__importDefault(require("./platforms"));
const user_interface_1 = tslib_1.__importDefault(require("./user-interface"));
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBdUQ7QUFDdkQsMERBQWdDO0FBQ2hDLDJCQUlZO0FBQ1osd0RBQTBCO0FBQzFCLDREQUE0QjtBQUM1QixtREFBNkI7QUFDN0IsNEZBQWtFO0FBQ2xFLDBFQUF1RDtBQUN2RCwyQ0FPcUI7QUFDckIsb0VBQTBDO0FBQzFDLDhFQUFxRDtBQUVyRCxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFrQixDQUFDLENBQUM7QUFTaEQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCx3QkFBcUMsTUFBYyxFQUFFLFVBQW1CLEVBQUU7O1FBQ3hFLEtBQUssQ0FDSCw2QkFBNkIsTUFBTSxnQ0FBZ0MsT0FBTyxDQUN4RSxPQUFPLENBQUMsbUJBQW1CLENBQzVCLDBCQUEwQixPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQzVELENBQUM7UUFFRixJQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUU7WUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLHdCQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLGlCQUFLLElBQUksQ0FBQyxtQkFBTyxJQUFJLENBQUMscUJBQVMsRUFBRTtZQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztTQUNsRTtRQUVELElBQUksQ0FBQyxxQkFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQ2IsNEhBQTRILENBQzdILENBQUM7U0FDSDtRQUVELElBQUksYUFBYSxHQUFHLHlCQUFhLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDN0QsSUFBSSxjQUFjLEdBQUcseUJBQWEsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUU5RCxJQUFJLENBQUMsZUFBTSxDQUFDLHlCQUFhLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDckIsT0FBTyxDQUFDLFFBQVEsR0FBRyxNQUFNLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xEO1lBQ0QsS0FBSyxDQUNILG1GQUFtRixDQUNwRixDQUFDO1lBQ0YsTUFBTSwrQkFBMkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QztRQUVELElBQUksQ0FBQyxlQUFNLENBQUMseUJBQWEsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO1lBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNyQixPQUFPLENBQUMsUUFBUSxHQUFHLE1BQU0saUJBQWlCLEVBQUUsQ0FBQzthQUM5QztZQUNELEtBQUssQ0FDSCxtQ0FBbUMsTUFBTSx5Q0FBeUMsTUFBTSw4QkFBOEIsQ0FDdkgsQ0FBQztZQUNGLE1BQU0sc0JBQXlCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7WUFDMUIsTUFBTSxtQkFBZSxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVEO1FBRUQsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDdEMsT0FBTztZQUNMLEdBQUcsRUFBRSxpQkFBUSxDQUFDLGFBQWEsQ0FBQztZQUM1QixJQUFJLEVBQUUsaUJBQVEsQ0FBQyxjQUFjLENBQUM7U0FDL0IsQ0FBQztJQUNKLENBQUM7Q0FBQTtBQXJERCx3Q0FxREM7QUFFRCwyQkFBa0MsTUFBYztJQUM5QyxPQUFPLGVBQU0sQ0FBQyx5QkFBYSxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELDhDQUVDO0FBRUQ7SUFDRSxPQUFPLGdCQUFPLENBQUMsc0JBQVUsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFGRCw4Q0FFQztBQUVELHNCQUE2QixNQUFjO0lBQ3pDLE9BQU8sZ0JBQU0sQ0FBQyxJQUFJLENBQUMseUJBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFGRCxvQ0FFQztBQUVELDJCQUFpQyxPQUFPLEdBQUcsS0FBSzs7UUFDOUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDN0IsSUFBSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUM7WUFDeEIsTUFBTSxFQUFFLCtCQUErQjtZQUN2QyxNQUFNLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFDNUMsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDO2dCQUNwQixNQUFNLEVBQUUsZ0RBQWdEO2FBQ3pELENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxPQUFPLEVBQUU7WUFDWCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQztnQkFDekIsTUFBTSxFQUFFLGdDQUFnQztnQkFDeEMsTUFBTSxFQUFFLElBQUk7YUFDYixDQUFDLENBQUM7WUFDSCxJQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQzthQUNoRDtTQUNGO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3luYyBhcyBjb21tYW5kRXhpc3RzIH0gZnJvbSAnY29tbWFuZC1leGlzdHMnO1xuaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7XG4gIGV4aXN0c1N5bmMgYXMgZXhpc3RzLFxuICByZWFkZGlyU3luYyBhcyByZWFkZGlyLFxuICByZWFkRmlsZVN5bmMgYXMgcmVhZEZpbGVcbn0gZnJvbSAnZnMnO1xuaW1wb3J0IHJlYWRDYiBmcm9tICdyZWFkJztcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgaW5zdGFsbENlcnRpZmljYXRlQXV0aG9yaXR5IGZyb20gJy4vY2VydGlmaWNhdGUtYXV0aG9yaXR5JztcbmltcG9ydCBnZW5lcmF0ZURvbWFpbkNlcnRpZmljYXRlIGZyb20gJy4vY2VydGlmaWNhdGVzJztcbmltcG9ydCB7XG4gIGRvbWFpbnNEaXIsXG4gIGlzTGludXgsXG4gIGlzTWFjLFxuICBpc1dpbmRvd3MsXG4gIHBhdGhGb3JEb21haW4sXG4gIHJvb3RDQUtleVBhdGhcbn0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IGN1cnJlbnRQbGF0Zm9ybSBmcm9tICcuL3BsYXRmb3Jtcyc7XG5pbXBvcnQgVUksIHsgVXNlckludGVyZmFjZSB9IGZyb20gJy4vdXNlci1pbnRlcmZhY2UnO1xuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZURlYnVnKCdkZXZjZXJ0Jyk7XG5jb25zdCByZWFkID0gdXRpbC5wcm9taXNpZnkocmVhZENiIGFzIEZ1bmN0aW9uKTtcblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcbiAgc2tpcENlcnR1dGlsSW5zdGFsbD86IHRydWU7XG4gIHNraXBIb3N0c0ZpbGU/OiB0cnVlO1xuICB1aT86IFVzZXJJbnRlcmZhY2U7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcXVlc3QgYW4gU1NMIGNlcnRpZmljYXRlIGZvciB0aGUgZ2l2ZW4gYXBwIG5hbWUgc2lnbmVkIGJ5IHRoZSBkZXZjZXJ0IHJvb3RcbiAqIGNlcnRpZmljYXRlIGF1dGhvcml0eS4gSWYgZGV2Y2VydCBoYXMgcHJldmlvdXNseSBnZW5lcmF0ZWQgYSBjZXJ0aWZpY2F0ZSBmb3JcbiAqIHRoYXQgYXBwIG5hbWUgb24gdGhpcyBtYWNoaW5lLCBpdCB3aWxsIHJldXNlIHRoYXQgY2VydGlmaWNhdGUuXG4gKlxuICogSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBkZXZjZXJ0IGlzIGJlaW5nIHJ1biBvbiB0aGlzIG1hY2hpbmUsIGl0IHdpbGxcbiAqIGdlbmVyYXRlIGFuZCBhdHRlbXB0IHRvIGluc3RhbGwgYSByb290IGNlcnRpZmljYXRlIGF1dGhvcml0eS5cbiAqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggeyBrZXksIGNlcnQgfSwgd2hlcmUgYGtleWAgYW5kIGBjZXJ0YFxuICogYXJlIEJ1ZmZlcnMgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGNlcnRpZmljYXRlIHByaXZhdGUga2V5IGFuZCBjZXJ0aWZpY2F0ZVxuICogZmlsZSwgcmVzcGVjdGl2ZWx5XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjZXJ0aWZpY2F0ZUZvcihkb21haW46IHN0cmluZywgb3B0aW9uczogT3B0aW9ucyA9IHt9KSB7XG4gIGRlYnVnKFxuICAgIGBDZXJ0aWZpY2F0ZSByZXF1ZXN0ZWQgZm9yICR7ZG9tYWlufS4gU2tpcHBpbmcgY2VydHV0aWwgaW5zdGFsbDogJHtCb29sZWFuKFxuICAgICAgb3B0aW9ucy5za2lwQ2VydHV0aWxJbnN0YWxsXG4gICAgKX0uIFNraXBwaW5nIGhvc3RzIGZpbGU6ICR7Qm9vbGVhbihvcHRpb25zLnNraXBIb3N0c0ZpbGUpfWBcbiAgKTtcblxuICBpZiAob3B0aW9ucy51aSkge1xuICAgIE9iamVjdC5hc3NpZ24oVUksIG9wdGlvbnMudWkpO1xuICB9XG5cbiAgaWYgKCFpc01hYyAmJiAhaXNMaW51eCAmJiAhaXNXaW5kb3dzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQbGF0Zm9ybSBub3Qgc3VwcG9ydGVkOiBcIiR7cHJvY2Vzcy5wbGF0Zm9ybX1cImApO1xuICB9XG5cbiAgaWYgKCFjb21tYW5kRXhpc3RzKCdvcGVuc3NsJykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnT3BlblNTTCBub3QgZm91bmQ6IE9wZW5TU0wgaXMgcmVxdWlyZWQgdG8gZ2VuZXJhdGUgU1NMIGNlcnRpZmljYXRlcyAtIG1ha2Ugc3VyZSBpdCBpcyBpbnN0YWxsZWQgYW5kIGF2YWlsYWJsZSBpbiB5b3VyIFBBVEgnXG4gICAgKTtcbiAgfVxuXG4gIGxldCBkb21haW5LZXlQYXRoID0gcGF0aEZvckRvbWFpbihkb21haW4sIGBwcml2YXRlLWtleS5rZXlgKTtcbiAgbGV0IGRvbWFpbkNlcnRQYXRoID0gcGF0aEZvckRvbWFpbihkb21haW4sIGBjZXJ0aWZpY2F0ZS5jcnRgKTtcblxuICBpZiAoIWV4aXN0cyhyb290Q0FLZXlQYXRoKSkge1xuICAgIGlmICghb3B0aW9ucy5wYXNzd29yZCkge1xuICAgICAgb3B0aW9ucy5wYXNzd29yZCA9IGF3YWl0IGdldFJvb3RDYVBhc3N3b3JkKHRydWUpO1xuICAgIH1cbiAgICBkZWJ1ZyhcbiAgICAgICdSb290IENBIGlzIG5vdCBpbnN0YWxsZWQgeWV0LCBzbyBpdCBtdXN0IGJlIG91ciBmaXJzdCBydW4uIEluc3RhbGxpbmcgcm9vdCBDQSAuLi4nXG4gICAgKTtcbiAgICBhd2FpdCBpbnN0YWxsQ2VydGlmaWNhdGVBdXRob3JpdHkob3B0aW9ucyk7XG4gIH1cblxuICBpZiAoIWV4aXN0cyhwYXRoRm9yRG9tYWluKGRvbWFpbiwgYGNlcnRpZmljYXRlLmNydGApKSkge1xuICAgIGlmICghb3B0aW9ucy5wYXNzd29yZCkge1xuICAgICAgb3B0aW9ucy5wYXNzd29yZCA9IGF3YWl0IGdldFJvb3RDYVBhc3N3b3JkKCk7XG4gICAgfVxuICAgIGRlYnVnKFxuICAgICAgYENhbid0IGZpbmQgY2VydGlmaWNhdGUgZmlsZSBmb3IgJHtkb21haW59LCBzbyBpdCBtdXN0IGJlIHRoZSBmaXJzdCByZXF1ZXN0IGZvciAke2RvbWFpbn0uIEdlbmVyYXRpbmcgYW5kIGNhY2hpbmcgLi4uYFxuICAgICk7XG4gICAgYXdhaXQgZ2VuZXJhdGVEb21haW5DZXJ0aWZpY2F0ZShkb21haW4sIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLnNraXBIb3N0c0ZpbGUpIHtcbiAgICBhd2FpdCBjdXJyZW50UGxhdGZvcm0uYWRkRG9tYWluVG9Ib3N0RmlsZUlmTWlzc2luZyhkb21haW4pO1xuICB9XG5cbiAgZGVidWcoYFJldHVybmluZyBkb21haW4gY2VydGlmaWNhdGVgKTtcbiAgcmV0dXJuIHtcbiAgICBrZXk6IHJlYWRGaWxlKGRvbWFpbktleVBhdGgpLFxuICAgIGNlcnQ6IHJlYWRGaWxlKGRvbWFpbkNlcnRQYXRoKVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzQ2VydGlmaWNhdGVGb3IoZG9tYWluOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGV4aXN0cyhwYXRoRm9yRG9tYWluKGRvbWFpbiwgYGNlcnRpZmljYXRlLmNydGApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZWREb21haW5zKCkge1xuICByZXR1cm4gcmVhZGRpcihkb21haW5zRGlyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURvbWFpbihkb21haW46IHN0cmluZykge1xuICByZXR1cm4gcmltcmFmLnN5bmMocGF0aEZvckRvbWFpbihkb21haW4pKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Um9vdENhUGFzc3dvcmQoY29uZmlybSA9IGZhbHNlKSB7XG4gIGRlYnVnKCdSZXF1ZXN0aW5nIHBhc3N3b3JkJyk7XG4gIGxldCBwYXNzd29yZCA9IGF3YWl0IHJlYWQoe1xuICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBSb290IENBIHBhc3N3b3JkJyxcbiAgICBzaWxlbnQ6IHRydWVcbiAgfSk7XG4gIGlmICghcGFzc3dvcmQgfHwgcGFzc3dvcmQubGVuZ3RoIDwgKGF3YWl0IDQpKSB7XG4gICAgcGFzc3dvcmQgPSBhd2FpdCByZWFkKHtcbiAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBSb290IENBIHBhc3N3b3JkLiBNaW5pbXVtIDQgY2hhcnMnXG4gICAgfSk7XG4gIH1cbiAgaWYgKGNvbmZpcm0pIHtcbiAgICBjb25zdCBjb25maXJtID0gYXdhaXQgcmVhZCh7XG4gICAgICBwcm9tcHQ6ICdQbGVhc2UgcmVwZWF0IFJvb3QgQ0EgcGFzc3dvcmQnLFxuICAgICAgc2lsZW50OiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKHBhc3N3b3JkICE9PSBjb25maXJtKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3VyIHBhc3N3b3JkIGRvZXNuJ3QgbWF0Y2hcIik7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXNzd29yZDtcbn1cbiJdfQ==