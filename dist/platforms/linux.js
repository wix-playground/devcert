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
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const debug_1 = __importDefault(require("debug"));
const command_exists_1 = require("command-exists");
const shared_1 = require("./shared");
const utils_1 = require("../utils");
const user_interface_1 = __importDefault(require("../user-interface"));
const debug = debug_1.default('devcert:platforms:linux');
class LinuxPlatform {
    constructor() {
        this.FIREFOX_NSS_DIR = path_1.default.join(process.env.HOME, '.mozilla/firefox/*');
        this.CHROME_NSS_DIR = path_1.default.join(process.env.HOME, '.pki/nssdb');
        this.FIREFOX_BIN_PATH = '/usr/bin/firefox';
        this.CHROME_BIN_PATH = '/usr/bin/google-chrome';
        this.HOST_FILE_PATH = '/etc/hosts';
    }
    /**
     * Linux is surprisingly difficult. There seems to be multiple system-wide
     * repositories for certs, so we copy ours to each. However, Firefox does it's
     * usual separate trust store. Plus Chrome relies on the NSS tooling (like
     * Firefox), but uses the user's NSS database, unlike Firefox (which uses a
     * separate Mozilla one). And since Chrome doesn't prompt the user with a GUI
     * flow when opening certs, if we can't use certutil to install our certificate
     * into the user's NSS database, we're out of luck.
     */
    addToTrustStores(certificatePath, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Adding devcert root CA to Linux system-wide trust stores');
            // run(`sudo cp ${ certificatePath } /etc/ssl/certs/devcert.crt`);
            utils_1.run(`sudo cp ${certificatePath} /usr/local/share/ca-certificates/devcert.crt`);
            // run(`sudo bash -c "cat ${ certificatePath } >> /etc/ssl/certs/ca-certificates.crt"`);
            utils_1.run(`sudo update-ca-certificates`);
            if (this.isFirefoxInstalled()) {
                // Firefox
                debug('Firefox install detected: adding devcert root CA to Firefox-specific trust stores ...');
                if (!command_exists_1.sync('certutil')) {
                    if (options.skipCertutilInstall) {
                        debug('NSS tooling is not already installed, and `skipCertutil` is true, so falling back to manual certificate install for Firefox');
                        shared_1.openCertificateInFirefox(this.FIREFOX_BIN_PATH, certificatePath);
                    }
                    else {
                        debug('NSS tooling is not already installed. Trying to install NSS tooling now with `apt install`');
                        utils_1.run('sudo apt install libnss3-tools');
                        debug('Installing certificate into Firefox trust stores using NSS tooling');
                        yield shared_1.closeFirefox();
                        yield shared_1.addCertificateToNSSCertDB(this.FIREFOX_NSS_DIR, certificatePath, 'certutil');
                    }
                }
            }
            else {
                debug('Firefox does not appear to be installed, skipping Firefox-specific steps...');
            }
            if (this.isChromeInstalled()) {
                debug('Chrome install detected: adding devcert root CA to Chrome trust store ...');
                if (!command_exists_1.sync('certutil')) {
                    user_interface_1.default.warnChromeOnLinuxWithoutCertutil();
                }
                else {
                    yield shared_1.closeFirefox();
                    yield shared_1.addCertificateToNSSCertDB(this.CHROME_NSS_DIR, certificatePath, 'certutil');
                }
            }
            else {
                debug('Chrome does not appear to be installed, skipping Chrome-specific steps...');
            }
        });
    }
    addDomainToHostFileIfMissing(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            let hostsFileContents = fs_1.readFileSync(this.HOST_FILE_PATH, 'utf8');
            if (!hostsFileContents.includes(domain)) {
                utils_1.run(`echo '127.0.0.1  ${domain}' | sudo tee -a "${this.HOST_FILE_PATH}" > /dev/null`);
            }
        });
    }
    readProtectedFile(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield utils_1.run(`sudo cat ${filepath}`)).toString().trim();
        });
    }
    writeProtectedFile(filepath, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs_1.existsSync(filepath)) {
                yield utils_1.run(`sudo rm "${filepath}"`);
            }
            fs_1.writeFileSync(filepath, contents);
            yield utils_1.run(`sudo chown 0 "${filepath}"`);
            yield utils_1.run(`sudo chmod 600 "${filepath}"`);
        });
    }
    isFirefoxInstalled() {
        return fs_1.existsSync(this.FIREFOX_BIN_PATH);
    }
    isChromeInstalled() {
        return fs_1.existsSync(this.CHROME_BIN_PATH);
    }
}
exports.default = LinuxPlatform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJwbGF0Zm9ybXMvbGludXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUF3QjtBQUN4QiwyQkFBNEY7QUFDNUYsa0RBQWdDO0FBQ2hDLG1EQUF1RDtBQUN2RCxxQ0FBNkY7QUFDN0Ysb0NBQStCO0FBRS9CLHVFQUFtQztBQUduQyxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUVyRDtJQUFBO1FBRVUsb0JBQWUsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDcEUsbUJBQWMsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzNELHFCQUFnQixHQUFHLGtCQUFrQixDQUFDO1FBQ3RDLG9CQUFlLEdBQUcsd0JBQXdCLENBQUM7UUFFM0MsbUJBQWMsR0FBRyxZQUFZLENBQUM7SUFnRnhDLENBQUM7SUE5RUM7Ozs7Ozs7O09BUUc7SUFDRyxnQkFBZ0IsQ0FBQyxlQUF1QixFQUFFLFVBQW1CLEVBQUU7O1lBRW5FLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBQ2xFLGtFQUFrRTtZQUNsRSxXQUFHLENBQUMsV0FBWSxlQUFnQiwrQ0FBK0MsQ0FBQyxDQUFDO1lBQ2pGLHdGQUF3RjtZQUN4RixXQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLFVBQVU7Z0JBQ1YsS0FBSyxDQUFDLHVGQUF1RixDQUFDLENBQUM7Z0JBQy9GLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQWEsQ0FBQyxVQUFVLENB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YXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhpc3RzU3luYyBhcyBleGlzdHMsIHJlYWRGaWxlU3luYyBhcyByZWFkLCB3cml0ZUZpbGVTeW5jIGFzIHdyaXRlRmlsZSB9IGZyb20gJ2ZzJztcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgeyBzeW5jIGFzIGNvbW1hbmRFeGlzdHMgfSBmcm9tICdjb21tYW5kLWV4aXN0cyc7XG5pbXBvcnQgeyBhZGRDZXJ0aWZpY2F0ZVRvTlNTQ2VydERCLCBvcGVuQ2VydGlmaWNhdGVJbkZpcmVmb3gsIGNsb3NlRmlyZWZveCB9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7IHJ1biB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgVUkgZnJvbSAnLi4vdXNlci1pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICcuJztcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnZGV2Y2VydDpwbGF0Zm9ybXM6bGludXgnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludXhQbGF0Zm9ybSBpbXBsZW1lbnRzIFBsYXRmb3JtIHtcblxuICBwcml2YXRlIEZJUkVGT1hfTlNTX0RJUiA9IHBhdGguam9pbihwcm9jZXNzLmVudi5IT01FLCAnLm1vemlsbGEvZmlyZWZveC8qJyk7XG4gIHByaXZhdGUgQ0hST01FX05TU19ESVIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuSE9NRSwgJy5wa2kvbnNzZGInKTtcbiAgcHJpdmF0ZSBGSVJFRk9YX0JJTl9QQVRIID0gJy91c3IvYmluL2ZpcmVmb3gnO1xuICBwcml2YXRlIENIUk9NRV9CSU5fUEFUSCA9ICcvdXNyL2Jpbi9nb29nbGUtY2hyb21lJztcblxuICBwcml2YXRlIEhPU1RfRklMRV9QQVRIID0gJy9ldGMvaG9zdHMnO1xuXG4gIC8qKlxuICAgKiBMaW51eCBpcyBzdXJwcmlzaW5nbHkgZGlmZmljdWx0LiBUaGVyZSBzZWVtcyB0byBiZSBtdWx0aXBsZSBzeXN0ZW0td2lkZVxuICAgKiByZXBvc2l0b3JpZXMgZm9yIGNlcnRzLCBzbyB3ZSBjb3B5IG91cnMgdG8gZWFjaC4gSG93ZXZlciwgRmlyZWZveCBkb2VzIGl0J3NcbiAgICogdXN1YWwgc2VwYXJhdGUgdHJ1c3Qgc3RvcmUuIFBsdXMgQ2hyb21lIHJlbGllcyBvbiB0aGUgTlNTIHRvb2xpbmcgKGxpa2VcbiAgICogRmlyZWZveCksIGJ1dCB1c2VzIHRoZSB1c2VyJ3MgTlNTIGRhdGFiYXNlLCB1bmxpa2UgRmlyZWZveCAod2hpY2ggdXNlcyBhXG4gICAqIHNlcGFyYXRlIE1vemlsbGEgb25lKS4gQW5kIHNpbmNlIENocm9tZSBkb2Vzbid0IHByb21wdCB0aGUgdXNlciB3aXRoIGEgR1VJXG4gICAqIGZsb3cgd2hlbiBvcGVuaW5nIGNlcnRzLCBpZiB3ZSBjYW4ndCB1c2UgY2VydHV0aWwgdG8gaW5zdGFsbCBvdXIgY2VydGlmaWNhdGVcbiAgICogaW50byB0aGUgdXNlcidzIE5TUyBkYXRhYmFzZSwgd2UncmUgb3V0IG9mIGx1Y2suXG4gICAqL1xuICBhc3luYyBhZGRUb1RydXN0U3RvcmVzKGNlcnRpZmljYXRlUGF0aDogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgIGRlYnVnKCdBZGRpbmcgZGV2Y2VydCByb290IENBIHRvIExpbnV4IHN5c3RlbS13aWRlIHRydXN0IHN0b3JlcycpO1xuICAgIC8vIHJ1bihgc3VkbyBjcCAkeyBjZXJ0aWZpY2F0ZVBhdGggfSAvZXRjL3NzbC9jZXJ0cy9kZXZjZXJ0LmNydGApO1xuICAgIHJ1bihgc3VkbyBjcCAkeyBjZXJ0aWZpY2F0ZVBhdGggfSAvdXNyL2xvY2FsL3NoYXJlL2NhLWNlcnRpZmljYXRlcy9kZXZjZXJ0LmNydGApO1xuICAgIC8vIHJ1bihgc3VkbyBiYXNoIC1jIFwiY2F0ICR7IGNlcnRpZmljYXRlUGF0aCB9ID4+IC9ldGMvc3NsL2NlcnRzL2NhLWNlcnRpZmljYXRlcy5jcnRcImApO1xuICAgIHJ1bihgc3VkbyB1cGRhdGUtY2EtY2VydGlmaWNhdGVzYCk7XG5cbiAgICBpZiAodGhpcy5pc0ZpcmVmb3hJbnN0YWxsZWQoKSkge1xuICAgICAgLy8gRmlyZWZveFxuICAgICAgZGVidWcoJ0ZpcmVmb3ggaW5zdGFsbCBkZXRlY3RlZDogYWRkaW5nIGRldmNlcnQgcm9vdCBDQSB0byBGaXJlZm94LXNwZWNpZmljIHRydXN0IHN0b3JlcyAuLi4nKTtcbiAgICAgIGlmICghY29tbWFuZEV4aXN0cygnY2VydHV0aWwnKSkge1xuICAgICAgICBpZiAob3B0aW9ucy5za2lwQ2VydHV0aWxJbnN0YWxsKSB7XG4gICAgICAgICAgZGVidWcoJ05TUyB0b29saW5nIGlzIG5vdCBhbHJlYWR5IGluc3RhbGxlZCwgYW5kIGBza2lwQ2VydHV0aWxgIGlzIHRydWUsIHNvIGZhbGxpbmcgYmFjayB0byBtYW51YWwgY2VydGlmaWNhdGUgaW5zdGFsbCBmb3IgRmlyZWZveCcpO1xuICAgICAgICAgIG9wZW5DZXJ0aWZpY2F0ZUluRmlyZWZveCh0aGlzLkZJUkVGT1hfQklOX1BBVEgsIGNlcnRpZmljYXRlUGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVidWcoJ05TUyB0b29saW5nIGlzIG5vdCBhbHJlYWR5IGluc3RhbGxlZC4gVHJ5aW5nIHRvIGluc3RhbGwgTlNTIHRvb2xpbmcgbm93IHdpdGggYGFwdCBpbnN0YWxsYCcpO1xuICAgICAgICAgIHJ1bignc3VkbyBhcHQgaW5zdGFsbCBsaWJuc3MzLXRvb2xzJyk7XG4gICAgICAgICAgZGVidWcoJ0luc3RhbGxpbmcgY2VydGlmaWNhdGUgaW50byBGaXJlZm94IHRydXN0IHN0b3JlcyB1c2luZyBOU1MgdG9vbGluZycpO1xuICAgICAgICAgIGF3YWl0IGNsb3NlRmlyZWZveCgpO1xuICAgICAgICAgIGF3YWl0IGFkZENlcnRpZmljYXRlVG9OU1NDZXJ0REIodGhpcy5GSVJFRk9YX05TU19ESVIsIGNlcnRpZmljYXRlUGF0aCwgJ2NlcnR1dGlsJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWcoJ0ZpcmVmb3ggZG9lcyBub3QgYXBwZWFyIHRvIGJlIGluc3RhbGxlZCwgc2tpcHBpbmcgRmlyZWZveC1zcGVjaWZpYyBzdGVwcy4uLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQ2hyb21lSW5zdGFsbGVkKCkpIHtcbiAgICAgIGRlYnVnKCdDaHJvbWUgaW5zdGFsbCBkZXRlY3RlZDogYWRkaW5nIGRldmNlcnQgcm9vdCBDQSB0byBDaHJvbWUgdHJ1c3Qgc3RvcmUgLi4uJyk7XG4gICAgICBpZiAoIWNvbW1hbmRFeGlzdHMoJ2NlcnR1dGlsJykpIHtcbiAgICAgICAgVUkud2FybkNocm9tZU9uTGludXhXaXRob3V0Q2VydHV0aWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGNsb3NlRmlyZWZveCgpO1xuICAgICAgICBhd2FpdCBhZGRDZXJ0aWZpY2F0ZVRvTlNTQ2VydERCKHRoaXMuQ0hST01FX05TU19ESVIsIGNlcnRpZmljYXRlUGF0aCwgJ2NlcnR1dGlsJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnKCdDaHJvbWUgZG9lcyBub3QgYXBwZWFyIHRvIGJlIGluc3RhbGxlZCwgc2tpcHBpbmcgQ2hyb21lLXNwZWNpZmljIHN0ZXBzLi4uJyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWRkRG9tYWluVG9Ib3N0RmlsZUlmTWlzc2luZyhkb21haW46IHN0cmluZykge1xuICAgIGxldCBob3N0c0ZpbGVDb250ZW50cyA9IHJlYWQodGhpcy5IT1NUX0ZJTEVfUEFUSCwgJ3V0ZjgnKTtcbiAgICBpZiAoIWhvc3RzRmlsZUNvbnRlbnRzLmluY2x1ZGVzKGRvbWFpbikpIHtcbiAgICAgIHJ1bihgZWNobyAnMTI3LjAuMC4xICAkeyBkb21haW4gfScgfCBzdWRvIHRlZSAtYSBcIiR7IHRoaXMuSE9TVF9GSUxFX1BBVEggfVwiID4gL2Rldi9udWxsYCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVhZFByb3RlY3RlZEZpbGUoZmlsZXBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiAoYXdhaXQgcnVuKGBzdWRvIGNhdCAke2ZpbGVwYXRofWApKS50b1N0cmluZygpLnRyaW0oKTtcbiAgfVxuXG4gIGFzeW5jIHdyaXRlUHJvdGVjdGVkRmlsZShmaWxlcGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKSB7XG4gICAgaWYgKGV4aXN0cyhmaWxlcGF0aCkpIHtcbiAgICAgIGF3YWl0IHJ1bihgc3VkbyBybSBcIiR7ZmlsZXBhdGh9XCJgKTtcbiAgICB9XG4gICAgd3JpdGVGaWxlKGZpbGVwYXRoLCBjb250ZW50cyk7XG4gICAgYXdhaXQgcnVuKGBzdWRvIGNob3duIDAgXCIke2ZpbGVwYXRofVwiYCk7XG4gICAgYXdhaXQgcnVuKGBzdWRvIGNobW9kIDYwMCBcIiR7ZmlsZXBhdGh9XCJgKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBpc0ZpcmVmb3hJbnN0YWxsZWQoKSB7XG4gICAgcmV0dXJuIGV4aXN0cyh0aGlzLkZJUkVGT1hfQklOX1BBVEgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Nocm9tZUluc3RhbGxlZCgpIHtcbiAgICByZXR1cm4gZXhpc3RzKHRoaXMuQ0hST01FX0JJTl9QQVRIKTtcbiAgfVxuXG59Il19