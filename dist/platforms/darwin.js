"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const debug_1 = tslib_1.__importDefault(require("debug"));
const command_exists_1 = require("command-exists");
const utils_1 = require("../utils");
const shared_1 = require("./shared");
const debug = debug_1.default('devcert:platforms:macos');
class MacOSPlatform {
    constructor() {
        this.FIREFOX_BUNDLE_PATH = '/Applications/Firefox.app';
        this.FIREFOX_BIN_PATH = path_1.default.join(this.FIREFOX_BUNDLE_PATH, 'Contents/MacOS/firefox');
        this.FIREFOX_NSS_DIR = path_1.default.join(process.env.HOME, 'Library/Application Support/Firefox/Profiles/*');
        this.HOST_FILE_PATH = '/etc/hosts';
    }
    /**
     * macOS is pretty simple - just add the certificate to the system keychain,
     * and most applications will delegate to that for determining trusted
     * certificates. Firefox, of course, does it's own thing. We can try to
     * automatically install the cert with Firefox if we can use certutil via the
     * `nss` Homebrew package, otherwise we go manual with user-facing prompts.
     */
    addToTrustStores(certificatePath, options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Chrome, Safari, system utils
            debug('Adding devcert root CA to macOS system keychain');
            utils_1.run(`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain -p ssl -p basic "${certificatePath}"`);
            if (this.isFirefoxInstalled()) {
                // Try to use certutil to install the cert automatically
                debug('Firefox install detected. Adding devcert root CA to Firefox trust store');
                if (!this.isNSSInstalled()) {
                    if (!options.skipCertutilInstall) {
                        if (command_exists_1.sync('brew')) {
                            debug(`certutil is not already installed, but Homebrew is detected. Trying to install certutil via Homebrew...`);
                            utils_1.run('brew install nss');
                        }
                        else {
                            debug(`Homebrew isn't installed, so we can't try to install certutil. Falling back to manual certificate install`);
                            return yield shared_1.openCertificateInFirefox(this.FIREFOX_BIN_PATH, certificatePath);
                        }
                    }
                    else {
                        debug(`certutil is not already installed, and skipCertutilInstall is true, so we have to fall back to a manual install`);
                        return yield shared_1.openCertificateInFirefox(this.FIREFOX_BIN_PATH, certificatePath);
                    }
                }
                let certutilPath = path_1.default.join(utils_1.run('brew --prefix nss').toString().trim(), 'bin', 'certutil');
                yield shared_1.closeFirefox();
                yield shared_1.addCertificateToNSSCertDB(this.FIREFOX_NSS_DIR, certificatePath, certutilPath);
            }
            else {
                debug('Firefox does not appear to be installed, skipping Firefox-specific steps...');
            }
        });
    }
    addDomainToHostFileIfMissing(domain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let hostsFileContents = fs_1.readFileSync(this.HOST_FILE_PATH, 'utf8');
            if (!hostsFileContents.includes(domain)) {
                utils_1.run(`echo '127.0.0.1  ${domain}' | sudo tee -a "${this.HOST_FILE_PATH}" > /dev/null`);
            }
        });
    }
    readProtectedFile(filepath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield utils_1.run(`sudo cat "${filepath}"`)).toString().trim();
        });
    }
    writeProtectedFile(filepath, contents) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fs_1.existsSync(filepath)) {
                yield utils_1.run(`sudo rm "${filepath}"`);
            }
            fs_1.writeFileSync(filepath, contents);
            yield utils_1.run(`sudo chown 0 "${filepath}"`);
            yield utils_1.run(`sudo chmod 600 "${filepath}"`);
        });
    }
    isFirefoxInstalled() {
        return fs_1.existsSync(this.FIREFOX_BUNDLE_PATH);
    }
    isNSSInstalled() {
        try {
            return utils_1.run('brew list').toString().indexOf('nss') > -1;
        }
        catch (e) {
            return false;
        }
    }
}
exports.default = MacOSPlatform;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFyd2luLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsicGxhdGZvcm1zL2Rhcndpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3REFBd0I7QUFDeEIsMkJBQTRGO0FBQzVGLDBEQUFnQztBQUNoQyxtREFBdUQ7QUFDdkQsb0NBQStCO0FBRS9CLHFDQUE2RjtBQUc3RixNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUdyRDtJQUFBO1FBRVUsd0JBQW1CLEdBQUcsMkJBQTJCLENBQUM7UUFDbEQscUJBQWdCLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUNqRixvQkFBZSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztRQUVoRyxtQkFBYyxHQUFHLFlBQVksQ0FBQztJQXdFeEMsQ0FBQztJQXRFQzs7Ozs7O09BTUc7SUFDRyxnQkFBZ0IsQ0FBQyxlQUF1QixFQUFFLFVBQW1CLEVBQUU7O1lBRW5FLCtCQUErQjtZQUMvQixLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztZQUN6RCxXQUFHLENBQUMseUdBQTBHLGVBQWdCLEdBQUcsQ0FBQyxDQUFDO1lBRW5JLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUU7Z0JBQzdCLHdEQUF3RDtnQkFDeEQsS0FBSyxDQUFDLHlFQUF5RSxDQUFDLENBQUM7Z0JBQ2pGLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUU7d0JBQ2hDLElBQUkscUJBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRTs0QkFDekIsS0FBSyxDQUFDLHlHQUF5RyxDQUFDLENBQUM7NEJBQ2pILFdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO3lCQUN6Qjs2QkFBTTs0QkFDTCxLQUFLLENBQUMsMkdBQTJHLENBQUMsQ0FBQzs0QkFDbkgsT0FBTyxNQUFNLGlDQUF3QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQzt5QkFDL0U7cUJBQ0Y7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLGlIQUFpSCxDQUFDLENBQUE7d0JBQ3hILE9BQU8sTUFBTSxpQ0FBd0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLENBQUM7cUJBQy9FO2lCQUNGO2dCQUNELElBQUksWUFBWSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM1RixNQUFNLHFCQUFZLEVBQUUsQ0FBQztnQkFDckIsTUFBTSxrQ0FBeUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQzthQUN0RjtpQkFBTTtnQkFDTCxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQzthQUN0RjtRQUNILENBQUM7S0FBQTtJQUVLLDRCQUE0QixDQUFDLE1BQWM7O1lBQy9DLElBQUksaUJBQWlCLEdBQUcsaUJBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3ZDLFdBQUcsQ0FBQyxvQkFBcUIsTUFBTyxvQkFBcUIsSUFBSSxDQUFDLGNBQWUsZUFBZSxDQUFDLENBQUM7YUFDM0Y7UUFDSCxDQUFDO0tBQUE7SUFFSyxpQkFBaUIsQ0FBQyxRQUFnQjs7WUFDdEMsT0FBTyxDQUFDLE1BQU0sV0FBRyxDQUFDLGFBQWEsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pFLENBQUM7S0FBQTtJQUVLLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7O1lBQ3pELElBQUksZUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNwQixNQUFNLFdBQUcsQ0FBQyxZQUFZLFFBQVEsR0FBRyxDQUFDLENBQUM7YUFDcEM7WUFDRCxrQkFBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM5QixNQUFNLFdBQUcsQ0FBQyxpQkFBaUIsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN4QyxNQUFNLFdBQUcsQ0FBQyxtQkFBbUIsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFTyxrQkFBa0I7UUFDeEIsT0FBTyxlQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVPLGNBQWM7UUFDcEIsSUFBSTtZQUNGLE9BQU8sV0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN4RDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxLQUFLLENBQUM7U0FDZDtJQUNILENBQUM7Q0FFRjtBQTlFRCxnQ0E4RUM7QUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB3cml0ZUZpbGVTeW5jIGFzIHdyaXRlRmlsZSwgZXhpc3RzU3luYyBhcyBleGlzdHMsIHJlYWRGaWxlU3luYyBhcyByZWFkIH0gZnJvbSAnZnMnO1xuaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7IHN5bmMgYXMgY29tbWFuZEV4aXN0cyB9IGZyb20gJ2NvbW1hbmQtZXhpc3RzJztcbmltcG9ydCB7IHJ1biB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBhZGRDZXJ0aWZpY2F0ZVRvTlNTQ2VydERCLCBvcGVuQ2VydGlmaWNhdGVJbkZpcmVmb3gsIGNsb3NlRmlyZWZveCB9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnLic7XG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2RldmNlcnQ6cGxhdGZvcm1zOm1hY29zJyk7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFjT1NQbGF0Zm9ybSBpbXBsZW1lbnRzIFBsYXRmb3JtIHtcblxuICBwcml2YXRlIEZJUkVGT1hfQlVORExFX1BBVEggPSAnL0FwcGxpY2F0aW9ucy9GaXJlZm94LmFwcCc7XG4gIHByaXZhdGUgRklSRUZPWF9CSU5fUEFUSCA9IHBhdGguam9pbih0aGlzLkZJUkVGT1hfQlVORExFX1BBVEgsICdDb250ZW50cy9NYWNPUy9maXJlZm94Jyk7XG4gIHByaXZhdGUgRklSRUZPWF9OU1NfRElSID0gcGF0aC5qb2luKHByb2Nlc3MuZW52LkhPTUUsICdMaWJyYXJ5L0FwcGxpY2F0aW9uIFN1cHBvcnQvRmlyZWZveC9Qcm9maWxlcy8qJyk7XG5cbiAgcHJpdmF0ZSBIT1NUX0ZJTEVfUEFUSCA9ICcvZXRjL2hvc3RzJztcblxuICAvKipcbiAgICogbWFjT1MgaXMgcHJldHR5IHNpbXBsZSAtIGp1c3QgYWRkIHRoZSBjZXJ0aWZpY2F0ZSB0byB0aGUgc3lzdGVtIGtleWNoYWluLFxuICAgKiBhbmQgbW9zdCBhcHBsaWNhdGlvbnMgd2lsbCBkZWxlZ2F0ZSB0byB0aGF0IGZvciBkZXRlcm1pbmluZyB0cnVzdGVkXG4gICAqIGNlcnRpZmljYXRlcy4gRmlyZWZveCwgb2YgY291cnNlLCBkb2VzIGl0J3Mgb3duIHRoaW5nLiBXZSBjYW4gdHJ5IHRvXG4gICAqIGF1dG9tYXRpY2FsbHkgaW5zdGFsbCB0aGUgY2VydCB3aXRoIEZpcmVmb3ggaWYgd2UgY2FuIHVzZSBjZXJ0dXRpbCB2aWEgdGhlXG4gICAqIGBuc3NgIEhvbWVicmV3IHBhY2thZ2UsIG90aGVyd2lzZSB3ZSBnbyBtYW51YWwgd2l0aCB1c2VyLWZhY2luZyBwcm9tcHRzLlxuICAgKi9cbiAgYXN5bmMgYWRkVG9UcnVzdFN0b3JlcyhjZXJ0aWZpY2F0ZVBhdGg6IHN0cmluZywgb3B0aW9uczogT3B0aW9ucyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAvLyBDaHJvbWUsIFNhZmFyaSwgc3lzdGVtIHV0aWxzXG4gICAgZGVidWcoJ0FkZGluZyBkZXZjZXJ0IHJvb3QgQ0EgdG8gbWFjT1Mgc3lzdGVtIGtleWNoYWluJyk7XG4gICAgcnVuKGBzdWRvIHNlY3VyaXR5IGFkZC10cnVzdGVkLWNlcnQgLWQgLXIgdHJ1c3RSb290IC1rIC9MaWJyYXJ5L0tleWNoYWlucy9TeXN0ZW0ua2V5Y2hhaW4gLXAgc3NsIC1wIGJhc2ljIFwiJHsgY2VydGlmaWNhdGVQYXRoIH1cImApO1xuXG4gICAgaWYgKHRoaXMuaXNGaXJlZm94SW5zdGFsbGVkKCkpIHtcbiAgICAgIC8vIFRyeSB0byB1c2UgY2VydHV0aWwgdG8gaW5zdGFsbCB0aGUgY2VydCBhdXRvbWF0aWNhbGx5XG4gICAgICBkZWJ1ZygnRmlyZWZveCBpbnN0YWxsIGRldGVjdGVkLiBBZGRpbmcgZGV2Y2VydCByb290IENBIHRvIEZpcmVmb3ggdHJ1c3Qgc3RvcmUnKTtcbiAgICAgIGlmICghdGhpcy5pc05TU0luc3RhbGxlZCgpKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5za2lwQ2VydHV0aWxJbnN0YWxsKSB7XG4gICAgICAgICAgaWYgKGNvbW1hbmRFeGlzdHMoJ2JyZXcnKSkge1xuICAgICAgICAgICAgZGVidWcoYGNlcnR1dGlsIGlzIG5vdCBhbHJlYWR5IGluc3RhbGxlZCwgYnV0IEhvbWVicmV3IGlzIGRldGVjdGVkLiBUcnlpbmcgdG8gaW5zdGFsbCBjZXJ0dXRpbCB2aWEgSG9tZWJyZXcuLi5gKTtcbiAgICAgICAgICAgIHJ1bignYnJldyBpbnN0YWxsIG5zcycpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWJ1ZyhgSG9tZWJyZXcgaXNuJ3QgaW5zdGFsbGVkLCBzbyB3ZSBjYW4ndCB0cnkgdG8gaW5zdGFsbCBjZXJ0dXRpbC4gRmFsbGluZyBiYWNrIHRvIG1hbnVhbCBjZXJ0aWZpY2F0ZSBpbnN0YWxsYCk7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgb3BlbkNlcnRpZmljYXRlSW5GaXJlZm94KHRoaXMuRklSRUZPWF9CSU5fUEFUSCwgY2VydGlmaWNhdGVQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVidWcoYGNlcnR1dGlsIGlzIG5vdCBhbHJlYWR5IGluc3RhbGxlZCwgYW5kIHNraXBDZXJ0dXRpbEluc3RhbGwgaXMgdHJ1ZSwgc28gd2UgaGF2ZSB0byBmYWxsIGJhY2sgdG8gYSBtYW51YWwgaW5zdGFsbGApXG4gICAgICAgICAgcmV0dXJuIGF3YWl0IG9wZW5DZXJ0aWZpY2F0ZUluRmlyZWZveCh0aGlzLkZJUkVGT1hfQklOX1BBVEgsIGNlcnRpZmljYXRlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBjZXJ0dXRpbFBhdGggPSBwYXRoLmpvaW4ocnVuKCdicmV3IC0tcHJlZml4IG5zcycpLnRvU3RyaW5nKCkudHJpbSgpLCAnYmluJywgJ2NlcnR1dGlsJyk7XG4gICAgICBhd2FpdCBjbG9zZUZpcmVmb3goKTtcbiAgICAgIGF3YWl0IGFkZENlcnRpZmljYXRlVG9OU1NDZXJ0REIodGhpcy5GSVJFRk9YX05TU19ESVIsIGNlcnRpZmljYXRlUGF0aCwgY2VydHV0aWxQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWcoJ0ZpcmVmb3ggZG9lcyBub3QgYXBwZWFyIHRvIGJlIGluc3RhbGxlZCwgc2tpcHBpbmcgRmlyZWZveC1zcGVjaWZpYyBzdGVwcy4uLicpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFkZERvbWFpblRvSG9zdEZpbGVJZk1pc3NpbmcoZG9tYWluOiBzdHJpbmcpIHtcbiAgICBsZXQgaG9zdHNGaWxlQ29udGVudHMgPSByZWFkKHRoaXMuSE9TVF9GSUxFX1BBVEgsICd1dGY4Jyk7XG4gICAgaWYgKCFob3N0c0ZpbGVDb250ZW50cy5pbmNsdWRlcyhkb21haW4pKSB7XG4gICAgICBydW4oYGVjaG8gJzEyNy4wLjAuMSAgJHsgZG9tYWluIH0nIHwgc3VkbyB0ZWUgLWEgXCIkeyB0aGlzLkhPU1RfRklMRV9QQVRIIH1cIiA+IC9kZXYvbnVsbGApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlYWRQcm90ZWN0ZWRGaWxlKGZpbGVwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gKGF3YWl0IHJ1bihgc3VkbyBjYXQgXCIke2ZpbGVwYXRofVwiYCkpLnRvU3RyaW5nKCkudHJpbSgpO1xuICB9XG5cbiAgYXN5bmMgd3JpdGVQcm90ZWN0ZWRGaWxlKGZpbGVwYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpIHtcbiAgICBpZiAoZXhpc3RzKGZpbGVwYXRoKSkge1xuICAgICAgYXdhaXQgcnVuKGBzdWRvIHJtIFwiJHtmaWxlcGF0aH1cImApO1xuICAgIH1cbiAgICB3cml0ZUZpbGUoZmlsZXBhdGgsIGNvbnRlbnRzKTtcbiAgICBhd2FpdCBydW4oYHN1ZG8gY2hvd24gMCBcIiR7ZmlsZXBhdGh9XCJgKTtcbiAgICBhd2FpdCBydW4oYHN1ZG8gY2htb2QgNjAwIFwiJHtmaWxlcGF0aH1cImApO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0ZpcmVmb3hJbnN0YWxsZWQoKSB7XG4gICAgcmV0dXJuIGV4aXN0cyh0aGlzLkZJUkVGT1hfQlVORExFX1BBVEgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc05TU0luc3RhbGxlZCgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHJ1bignYnJldyBsaXN0JykudG9TdHJpbmcoKS5pbmRleE9mKCduc3MnKSA+IC0xO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxufTsiXX0=