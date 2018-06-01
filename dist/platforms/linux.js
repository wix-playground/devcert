"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const debug_1 = tslib_1.__importDefault(require("debug"));
const command_exists_1 = require("command-exists");
const shared_1 = require("./shared");
const utils_1 = require("../utils");
const user_interface_1 = tslib_1.__importDefault(require("../user-interface"));
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let hostsFileContents = fs_1.readFileSync(this.HOST_FILE_PATH, 'utf8');
            if (!hostsFileContents.includes(domain)) {
                utils_1.run(`echo '127.0.0.1  ${domain}' | sudo tee -a "${this.HOST_FILE_PATH}" > /dev/null`);
            }
        });
    }
    readProtectedFile(filepath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield utils_1.run(`sudo cat ${filepath}`)).toString().trim();
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
        return fs_1.existsSync(this.FIREFOX_BIN_PATH);
    }
    isChromeInstalled() {
        return fs_1.existsSync(this.CHROME_BIN_PATH);
    }
}
exports.default = LinuxPlatform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJwbGF0Zm9ybXMvbGludXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0RBQXdCO0FBQ3hCLDJCQUE0RjtBQUM1RiwwREFBZ0M7QUFDaEMsbURBQXVEO0FBQ3ZELHFDQUE2RjtBQUM3RixvQ0FBK0I7QUFFL0IsK0VBQW1DO0FBR25DLE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRXJEO0lBQUE7UUFFVSxvQkFBZSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNwRSxtQkFBYyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDM0QscUJBQWdCLEdBQUcsa0JBQWtCLENBQUM7UUFDdEMsb0JBQWUsR0FBRyx3QkFBd0IsQ0FBQztRQUUzQyxtQkFBYyxHQUFHLFlBQVksQ0FBQztJQWdGeEMsQ0FBQztJQTlFQzs7Ozs7Ozs7T0FRRztJQUNHLGdCQUFnQixDQUFDLGVBQXVCLEVBQUUsVUFBbUIsRUFBRTs7WUFFbkUsS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7WUFDbEUsa0VBQWtFO1lBQ2xFLFdBQUcsQ0FBQyxXQUFZLGVBQWdCLCtDQUErQyxDQUFDLENBQUM7WUFDakYsd0ZBQXdGO1lBQ3hGLFdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBRW5DLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUU7Z0JBQzdCLFVBQVU7Z0JBQ1YsS0FBSyxDQUFDLHVGQUF1RixDQUFDLENBQUM7Z0JBQy9GLElBQUksQ0FBQyxxQkFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUM5QixJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTt3QkFDL0IsS0FBSyxDQUFDLDZIQUE2SCxDQUFDLENBQUM7d0JBQ3JJLGlDQUF3QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQztxQkFDbEU7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLDRGQUE0RixDQUFDLENBQUM7d0JBQ3BHLFdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO3dCQUN0QyxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQzt3QkFDNUUsTUFBTSxxQkFBWSxFQUFFLENBQUM7d0JBQ3JCLE1BQU0sa0NBQXlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7cUJBQ3BGO2lCQUNGO2FBQ0Y7aUJBQU07Z0JBQ0wsS0FBSyxDQUFDLDZFQUE2RSxDQUFDLENBQUM7YUFDdEY7WUFFRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO2dCQUM1QixLQUFLLENBQUMsMkVBQTJFLENBQUMsQ0FBQztnQkFDbkYsSUFBSSxDQUFDLHFCQUFhLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQzlCLHdCQUFFLENBQUMsZ0NBQWdDLEVBQUUsQ0FBQztpQkFDdkM7cUJBQU07b0JBQ0wsTUFBTSxxQkFBWSxFQUFFLENBQUM7b0JBQ3JCLE1BQU0sa0NBQXlCLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ25GO2FBQ0Y7aUJBQU07Z0JBQ0wsS0FBSyxDQUFDLDJFQUEyRSxDQUFDLENBQUM7YUFDcEY7UUFDSCxDQUFDO0tBQUE7SUFFSyw0QkFBNEIsQ0FBQyxNQUFjOztZQUMvQyxJQUFJLGlCQUFpQixHQUFHLGlCQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN2QyxXQUFHLENBQUMsb0JBQXFCLE1BQU8sb0JBQXFCLElBQUksQ0FBQyxjQUFlLGVBQWUsQ0FBQyxDQUFDO2FBQzNGO1FBQ0gsQ0FBQztLQUFBO0lBRUssaUJBQWlCLENBQUMsUUFBZ0I7O1lBQ3RDLE9BQU8sQ0FBQyxNQUFNLFdBQUcsQ0FBQyxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvRCxDQUFDO0tBQUE7SUFFSyxrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLFFBQWdCOztZQUN6RCxJQUFJLGVBQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxXQUFHLENBQUMsWUFBWSxRQUFRLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO1lBQ0Qsa0JBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUIsTUFBTSxXQUFHLENBQUMsaUJBQWlCLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDeEMsTUFBTSxXQUFHLENBQUMsbUJBQW1CLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBR08sa0JBQWtCO1FBQ3hCLE9BQU8sZUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsT0FBTyxlQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FFRjtBQXZGRCxnQ0F1RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMgYXMgZXhpc3RzLCByZWFkRmlsZVN5bmMgYXMgcmVhZCwgd3JpdGVGaWxlU3luYyBhcyB3cml0ZUZpbGUgfSBmcm9tICdmcyc7XG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHsgc3luYyBhcyBjb21tYW5kRXhpc3RzIH0gZnJvbSAnY29tbWFuZC1leGlzdHMnO1xuaW1wb3J0IHsgYWRkQ2VydGlmaWNhdGVUb05TU0NlcnREQiwgb3BlbkNlcnRpZmljYXRlSW5GaXJlZm94LCBjbG9zZUZpcmVmb3ggfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQgeyBydW4gfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IFVJIGZyb20gJy4uL3VzZXItaW50ZXJmYWNlJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnLic7XG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2RldmNlcnQ6cGxhdGZvcm1zOmxpbnV4Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnV4UGxhdGZvcm0gaW1wbGVtZW50cyBQbGF0Zm9ybSB7XG5cbiAgcHJpdmF0ZSBGSVJFRk9YX05TU19ESVIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuSE9NRSwgJy5tb3ppbGxhL2ZpcmVmb3gvKicpO1xuICBwcml2YXRlIENIUk9NRV9OU1NfRElSID0gcGF0aC5qb2luKHByb2Nlc3MuZW52LkhPTUUsICcucGtpL25zc2RiJyk7XG4gIHByaXZhdGUgRklSRUZPWF9CSU5fUEFUSCA9ICcvdXNyL2Jpbi9maXJlZm94JztcbiAgcHJpdmF0ZSBDSFJPTUVfQklOX1BBVEggPSAnL3Vzci9iaW4vZ29vZ2xlLWNocm9tZSc7XG5cbiAgcHJpdmF0ZSBIT1NUX0ZJTEVfUEFUSCA9ICcvZXRjL2hvc3RzJztcblxuICAvKipcbiAgICogTGludXggaXMgc3VycHJpc2luZ2x5IGRpZmZpY3VsdC4gVGhlcmUgc2VlbXMgdG8gYmUgbXVsdGlwbGUgc3lzdGVtLXdpZGVcbiAgICogcmVwb3NpdG9yaWVzIGZvciBjZXJ0cywgc28gd2UgY29weSBvdXJzIHRvIGVhY2guIEhvd2V2ZXIsIEZpcmVmb3ggZG9lcyBpdCdzXG4gICAqIHVzdWFsIHNlcGFyYXRlIHRydXN0IHN0b3JlLiBQbHVzIENocm9tZSByZWxpZXMgb24gdGhlIE5TUyB0b29saW5nIChsaWtlXG4gICAqIEZpcmVmb3gpLCBidXQgdXNlcyB0aGUgdXNlcidzIE5TUyBkYXRhYmFzZSwgdW5saWtlIEZpcmVmb3ggKHdoaWNoIHVzZXMgYVxuICAgKiBzZXBhcmF0ZSBNb3ppbGxhIG9uZSkuIEFuZCBzaW5jZSBDaHJvbWUgZG9lc24ndCBwcm9tcHQgdGhlIHVzZXIgd2l0aCBhIEdVSVxuICAgKiBmbG93IHdoZW4gb3BlbmluZyBjZXJ0cywgaWYgd2UgY2FuJ3QgdXNlIGNlcnR1dGlsIHRvIGluc3RhbGwgb3VyIGNlcnRpZmljYXRlXG4gICAqIGludG8gdGhlIHVzZXIncyBOU1MgZGF0YWJhc2UsIHdlJ3JlIG91dCBvZiBsdWNrLlxuICAgKi9cbiAgYXN5bmMgYWRkVG9UcnVzdFN0b3JlcyhjZXJ0aWZpY2F0ZVBhdGg6IHN0cmluZywgb3B0aW9uczogT3B0aW9ucyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICBkZWJ1ZygnQWRkaW5nIGRldmNlcnQgcm9vdCBDQSB0byBMaW51eCBzeXN0ZW0td2lkZSB0cnVzdCBzdG9yZXMnKTtcbiAgICAvLyBydW4oYHN1ZG8gY3AgJHsgY2VydGlmaWNhdGVQYXRoIH0gL2V0Yy9zc2wvY2VydHMvZGV2Y2VydC5jcnRgKTtcbiAgICBydW4oYHN1ZG8gY3AgJHsgY2VydGlmaWNhdGVQYXRoIH0gL3Vzci9sb2NhbC9zaGFyZS9jYS1jZXJ0aWZpY2F0ZXMvZGV2Y2VydC5jcnRgKTtcbiAgICAvLyBydW4oYHN1ZG8gYmFzaCAtYyBcImNhdCAkeyBjZXJ0aWZpY2F0ZVBhdGggfSA+PiAvZXRjL3NzbC9jZXJ0cy9jYS1jZXJ0aWZpY2F0ZXMuY3J0XCJgKTtcbiAgICBydW4oYHN1ZG8gdXBkYXRlLWNhLWNlcnRpZmljYXRlc2ApO1xuXG4gICAgaWYgKHRoaXMuaXNGaXJlZm94SW5zdGFsbGVkKCkpIHtcbiAgICAgIC8vIEZpcmVmb3hcbiAgICAgIGRlYnVnKCdGaXJlZm94IGluc3RhbGwgZGV0ZWN0ZWQ6IGFkZGluZyBkZXZjZXJ0IHJvb3QgQ0EgdG8gRmlyZWZveC1zcGVjaWZpYyB0cnVzdCBzdG9yZXMgLi4uJyk7XG4gICAgICBpZiAoIWNvbW1hbmRFeGlzdHMoJ2NlcnR1dGlsJykpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2tpcENlcnR1dGlsSW5zdGFsbCkge1xuICAgICAgICAgIGRlYnVnKCdOU1MgdG9vbGluZyBpcyBub3QgYWxyZWFkeSBpbnN0YWxsZWQsIGFuZCBgc2tpcENlcnR1dGlsYCBpcyB0cnVlLCBzbyBmYWxsaW5nIGJhY2sgdG8gbWFudWFsIGNlcnRpZmljYXRlIGluc3RhbGwgZm9yIEZpcmVmb3gnKTtcbiAgICAgICAgICBvcGVuQ2VydGlmaWNhdGVJbkZpcmVmb3godGhpcy5GSVJFRk9YX0JJTl9QQVRILCBjZXJ0aWZpY2F0ZVBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlYnVnKCdOU1MgdG9vbGluZyBpcyBub3QgYWxyZWFkeSBpbnN0YWxsZWQuIFRyeWluZyB0byBpbnN0YWxsIE5TUyB0b29saW5nIG5vdyB3aXRoIGBhcHQgaW5zdGFsbGAnKTtcbiAgICAgICAgICBydW4oJ3N1ZG8gYXB0IGluc3RhbGwgbGlibnNzMy10b29scycpO1xuICAgICAgICAgIGRlYnVnKCdJbnN0YWxsaW5nIGNlcnRpZmljYXRlIGludG8gRmlyZWZveCB0cnVzdCBzdG9yZXMgdXNpbmcgTlNTIHRvb2xpbmcnKTtcbiAgICAgICAgICBhd2FpdCBjbG9zZUZpcmVmb3goKTtcbiAgICAgICAgICBhd2FpdCBhZGRDZXJ0aWZpY2F0ZVRvTlNTQ2VydERCKHRoaXMuRklSRUZPWF9OU1NfRElSLCBjZXJ0aWZpY2F0ZVBhdGgsICdjZXJ0dXRpbCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnKCdGaXJlZm94IGRvZXMgbm90IGFwcGVhciB0byBiZSBpbnN0YWxsZWQsIHNraXBwaW5nIEZpcmVmb3gtc3BlY2lmaWMgc3RlcHMuLi4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0Nocm9tZUluc3RhbGxlZCgpKSB7XG4gICAgICBkZWJ1ZygnQ2hyb21lIGluc3RhbGwgZGV0ZWN0ZWQ6IGFkZGluZyBkZXZjZXJ0IHJvb3QgQ0EgdG8gQ2hyb21lIHRydXN0IHN0b3JlIC4uLicpO1xuICAgICAgaWYgKCFjb21tYW5kRXhpc3RzKCdjZXJ0dXRpbCcpKSB7XG4gICAgICAgIFVJLndhcm5DaHJvbWVPbkxpbnV4V2l0aG91dENlcnR1dGlsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBjbG9zZUZpcmVmb3goKTtcbiAgICAgICAgYXdhaXQgYWRkQ2VydGlmaWNhdGVUb05TU0NlcnREQih0aGlzLkNIUk9NRV9OU1NfRElSLCBjZXJ0aWZpY2F0ZVBhdGgsICdjZXJ0dXRpbCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1ZygnQ2hyb21lIGRvZXMgbm90IGFwcGVhciB0byBiZSBpbnN0YWxsZWQsIHNraXBwaW5nIENocm9tZS1zcGVjaWZpYyBzdGVwcy4uLicpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFkZERvbWFpblRvSG9zdEZpbGVJZk1pc3NpbmcoZG9tYWluOiBzdHJpbmcpIHtcbiAgICBsZXQgaG9zdHNGaWxlQ29udGVudHMgPSByZWFkKHRoaXMuSE9TVF9GSUxFX1BBVEgsICd1dGY4Jyk7XG4gICAgaWYgKCFob3N0c0ZpbGVDb250ZW50cy5pbmNsdWRlcyhkb21haW4pKSB7XG4gICAgICBydW4oYGVjaG8gJzEyNy4wLjAuMSAgJHsgZG9tYWluIH0nIHwgc3VkbyB0ZWUgLWEgXCIkeyB0aGlzLkhPU1RfRklMRV9QQVRIIH1cIiA+IC9kZXYvbnVsbGApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlYWRQcm90ZWN0ZWRGaWxlKGZpbGVwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gKGF3YWl0IHJ1bihgc3VkbyBjYXQgJHtmaWxlcGF0aH1gKSkudG9TdHJpbmcoKS50cmltKCk7XG4gIH1cblxuICBhc3luYyB3cml0ZVByb3RlY3RlZEZpbGUoZmlsZXBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAgIGlmIChleGlzdHMoZmlsZXBhdGgpKSB7XG4gICAgICBhd2FpdCBydW4oYHN1ZG8gcm0gXCIke2ZpbGVwYXRofVwiYCk7XG4gICAgfVxuICAgIHdyaXRlRmlsZShmaWxlcGF0aCwgY29udGVudHMpO1xuICAgIGF3YWl0IHJ1bihgc3VkbyBjaG93biAwIFwiJHtmaWxlcGF0aH1cImApO1xuICAgIGF3YWl0IHJ1bihgc3VkbyBjaG1vZCA2MDAgXCIke2ZpbGVwYXRofVwiYCk7XG4gIH1cblxuXG4gIHByaXZhdGUgaXNGaXJlZm94SW5zdGFsbGVkKCkge1xuICAgIHJldHVybiBleGlzdHModGhpcy5GSVJFRk9YX0JJTl9QQVRIKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNDaHJvbWVJbnN0YWxsZWQoKSB7XG4gICAgcmV0dXJuIGV4aXN0cyh0aGlzLkNIUk9NRV9CSU5fUEFUSCk7XG4gIH1cblxufSJdfQ==