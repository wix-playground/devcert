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
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = require("fs");
const shared_1 = require("./shared");
const utils_1 = require("../utils");
const user_interface_1 = __importDefault(require("../user-interface"));
const debug = debug_1.default('devcert:platforms:windows');
let encryptionKey;
class WindowsPlatform {
    constructor() {
        this.HOST_FILE_PATH = 'C:\\Windows\\System32\\Drivers\\etc\\hosts';
    }
    /**
     * Windows is at least simple. Like macOS, most applications will delegate to
     * the system trust store, which is updated with the confusingly named
     * `certutil` exe (not the same as the NSS/Mozilla certutil). Firefox does it's
     * own thing as usual, and getting a copy of NSS certutil onto the Windows
     * machine to try updating the Firefox store is basically a nightmare, so we
     * don't even try it - we just bail out to the GUI.
     */
    addToTrustStores(certificatePath, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // IE, Chrome, system utils
            debug('adding devcert root to Windows OS trust store');
            try {
                utils_1.run(`certutil -addstore -user root ${certificatePath}`);
            }
            catch (e) {
                e.output.map((buffer) => {
                    if (buffer) {
                        console.log(buffer.toString());
                    }
                });
            }
            debug('adding devcert root to Firefox trust store');
            // Firefox (don't even try NSS certutil, no easy install for Windows)
            yield shared_1.openCertificateInFirefox('start firefox', certificatePath);
        });
    }
    addDomainToHostFileIfMissing(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            let hostsFileContents = fs_1.readFileSync(this.HOST_FILE_PATH, 'utf8');
            if (!hostsFileContents.includes(domain)) {
                yield utils_1.sudo(`echo 127.0.0.1  ${domain} > ${this.HOST_FILE_PATH}`);
            }
        });
    }
    readProtectedFile(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!encryptionKey) {
                encryptionKey = yield user_interface_1.default.getWindowsEncryptionPassword();
            }
            // Try to decrypt the file
            try {
                return this.decrypt(fs_1.readFileSync(filepath, 'utf8'), encryptionKey);
            }
            catch (e) {
                // If it's a bad password, clear the cached copy and retry
                if (e.message.indexOf('bad decrypt') >= -1) {
                    encryptionKey = null;
                    return yield this.readProtectedFile(filepath);
                }
                throw e;
            }
        });
    }
    writeProtectedFile(filepath, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!encryptionKey) {
                encryptionKey = yield user_interface_1.default.getWindowsEncryptionPassword();
            }
            let encryptedContents = this.encrypt(contents, encryptionKey);
            fs_1.writeFileSync(filepath, encryptedContents);
        });
    }
    encrypt(text, key) {
        let cipher = crypto_1.default.createCipher('aes256', new Buffer(key));
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    }
    decrypt(encrypted, key) {
        let decipher = crypto_1.default.createDecipher('aes256', new Buffer(key));
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    }
}
exports.default = WindowsPlatform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luMzIuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJwbGF0Zm9ybXMvd2luMzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUFnQztBQUNoQyxvREFBNEI7QUFDNUIsMkJBQWtFO0FBRWxFLHFDQUFvRDtBQUVwRCxvQ0FBcUM7QUFDckMsdUVBQW1DO0FBRW5DLE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRXZELElBQUksYUFBcUIsQ0FBQztBQUUxQjtJQUFBO1FBRVUsbUJBQWMsR0FBRyw0Q0FBNEMsQ0FBQztJQXFFeEUsQ0FBQztJQW5FQzs7Ozs7OztPQU9HO0lBQ0csZ0JBQWdCLENBQUMsZUFBdUIsRUFBRSxVQUFtQixFQUFFOztZQUNuRSwyQkFBMkI7WUFDM0IsS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUE7WUFDdEQsSUFBSSxDQUFDO2dCQUNILFdBQUcsQ0FBQyxpQ0FBa0MsZUFBZ0IsRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFjLEVBQUUsRUFBRTtvQkFDOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUNqQyxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUNELEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFBO1lBQ25ELHFFQUFxRTtZQUNyRSxNQUFNLGlDQUF3QixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNuRSxDQUFDO0tBQUE7SUFFSyw0QkFBNEIsQ0FBQyxNQUFjOztZQUMvQyxJQUFJLGlCQUFpQixHQUFHLGlCQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sWUFBSSxDQUFDLG1CQUFvQixNQUFPLE1BQU8sSUFBSSxDQUFDLGNBQWUsRUFBRSxDQUFDLENBQUM7WUFDdkUsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVLLGlCQUFpQixDQUFDLFFBQWdCOztZQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLGFBQWEsR0FBRyxNQUFNLHdCQUFFLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztZQUMxRCxDQUFDO1lBQ0QsMEJBQTBCO1lBQzFCLElBQUksQ0FBQztnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWCwwREFBMEQ7Z0JBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsYUFBYSxHQUFHLElBQUksQ0FBQztvQkFDckIsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxDQUFDO1lBQ1YsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVLLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7O1lBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsYUFBYSxHQUFHLE1BQU0sd0JBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1lBQzFELENBQUM7WUFDRCxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzlELGtCQUFLLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRU8sT0FBTyxDQUFDLElBQVksRUFBRSxHQUFXO1FBQ3ZDLElBQUksTUFBTSxHQUFHLGdCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU8sT0FBTyxDQUFDLFNBQWlCLEVBQUUsR0FBVztRQUM1QyxJQUFJLFFBQVEsR0FBRyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUUsQ0FBQztDQUVGO0FBdkVELGtDQXVFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgeyB3cml0ZUZpbGVTeW5jIGFzIHdyaXRlLCByZWFkRmlsZVN5bmMgYXMgcmVhZCB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBvcGVuQ2VydGlmaWNhdGVJbkZpcmVmb3ggfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJy4nO1xuaW1wb3J0IHsgcnVuLCBzdWRvIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IFVJIGZyb20gJy4uL3VzZXItaW50ZXJmYWNlJztcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnZGV2Y2VydDpwbGF0Zm9ybXM6d2luZG93cycpO1xuXG5sZXQgZW5jcnlwdGlvbktleTogc3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaW5kb3dzUGxhdGZvcm0gaW1wbGVtZW50cyBQbGF0Zm9ybSB7XG5cbiAgcHJpdmF0ZSBIT1NUX0ZJTEVfUEFUSCA9ICdDOlxcXFxXaW5kb3dzXFxcXFN5c3RlbTMyXFxcXERyaXZlcnNcXFxcZXRjXFxcXGhvc3RzJztcblxuICAvKipcbiAgICogV2luZG93cyBpcyBhdCBsZWFzdCBzaW1wbGUuIExpa2UgbWFjT1MsIG1vc3QgYXBwbGljYXRpb25zIHdpbGwgZGVsZWdhdGUgdG9cbiAgICogdGhlIHN5c3RlbSB0cnVzdCBzdG9yZSwgd2hpY2ggaXMgdXBkYXRlZCB3aXRoIHRoZSBjb25mdXNpbmdseSBuYW1lZFxuICAgKiBgY2VydHV0aWxgIGV4ZSAobm90IHRoZSBzYW1lIGFzIHRoZSBOU1MvTW96aWxsYSBjZXJ0dXRpbCkuIEZpcmVmb3ggZG9lcyBpdCdzXG4gICAqIG93biB0aGluZyBhcyB1c3VhbCwgYW5kIGdldHRpbmcgYSBjb3B5IG9mIE5TUyBjZXJ0dXRpbCBvbnRvIHRoZSBXaW5kb3dzXG4gICAqIG1hY2hpbmUgdG8gdHJ5IHVwZGF0aW5nIHRoZSBGaXJlZm94IHN0b3JlIGlzIGJhc2ljYWxseSBhIG5pZ2h0bWFyZSwgc28gd2VcbiAgICogZG9uJ3QgZXZlbiB0cnkgaXQgLSB3ZSBqdXN0IGJhaWwgb3V0IHRvIHRoZSBHVUkuXG4gICAqL1xuICBhc3luYyBhZGRUb1RydXN0U3RvcmVzKGNlcnRpZmljYXRlUGF0aDogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBJRSwgQ2hyb21lLCBzeXN0ZW0gdXRpbHNcbiAgICBkZWJ1ZygnYWRkaW5nIGRldmNlcnQgcm9vdCB0byBXaW5kb3dzIE9TIHRydXN0IHN0b3JlJylcbiAgICB0cnkge1xuICAgICAgcnVuKGBjZXJ0dXRpbCAtYWRkc3RvcmUgLXVzZXIgcm9vdCAkeyBjZXJ0aWZpY2F0ZVBhdGggfWApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUub3V0cHV0Lm1hcCgoYnVmZmVyOiBCdWZmZXIpID0+IHtcbiAgICAgICAgaWYgKGJ1ZmZlcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGJ1ZmZlci50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGRlYnVnKCdhZGRpbmcgZGV2Y2VydCByb290IHRvIEZpcmVmb3ggdHJ1c3Qgc3RvcmUnKVxuICAgIC8vIEZpcmVmb3ggKGRvbid0IGV2ZW4gdHJ5IE5TUyBjZXJ0dXRpbCwgbm8gZWFzeSBpbnN0YWxsIGZvciBXaW5kb3dzKVxuICAgIGF3YWl0IG9wZW5DZXJ0aWZpY2F0ZUluRmlyZWZveCgnc3RhcnQgZmlyZWZveCcsIGNlcnRpZmljYXRlUGF0aCk7XG4gIH1cblxuICBhc3luYyBhZGREb21haW5Ub0hvc3RGaWxlSWZNaXNzaW5nKGRvbWFpbjogc3RyaW5nKSB7XG4gICAgbGV0IGhvc3RzRmlsZUNvbnRlbnRzID0gcmVhZCh0aGlzLkhPU1RfRklMRV9QQVRILCAndXRmOCcpO1xuICAgIGlmICghaG9zdHNGaWxlQ29udGVudHMuaW5jbHVkZXMoZG9tYWluKSkge1xuICAgICAgYXdhaXQgc3VkbyhgZWNobyAxMjcuMC4wLjEgICR7IGRvbWFpbiB9ID4gJHsgdGhpcy5IT1NUX0ZJTEVfUEFUSCB9YCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVhZFByb3RlY3RlZEZpbGUoZmlsZXBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKCFlbmNyeXB0aW9uS2V5KSB7XG4gICAgICBlbmNyeXB0aW9uS2V5ID0gYXdhaXQgVUkuZ2V0V2luZG93c0VuY3J5cHRpb25QYXNzd29yZCgpO1xuICAgIH1cbiAgICAvLyBUcnkgdG8gZGVjcnlwdCB0aGUgZmlsZVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWNyeXB0KHJlYWQoZmlsZXBhdGgsICd1dGY4JyksIGVuY3J5cHRpb25LZXkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIElmIGl0J3MgYSBiYWQgcGFzc3dvcmQsIGNsZWFyIHRoZSBjYWNoZWQgY29weSBhbmQgcmV0cnlcbiAgICAgIGlmIChlLm1lc3NhZ2UuaW5kZXhPZignYmFkIGRlY3J5cHQnKSA+PSAtMSkge1xuICAgICAgICBlbmNyeXB0aW9uS2V5ID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVhZFByb3RlY3RlZEZpbGUoZmlsZXBhdGgpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB3cml0ZVByb3RlY3RlZEZpbGUoZmlsZXBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAgIGlmICghZW5jcnlwdGlvbktleSkge1xuICAgICAgZW5jcnlwdGlvbktleSA9IGF3YWl0IFVJLmdldFdpbmRvd3NFbmNyeXB0aW9uUGFzc3dvcmQoKTtcbiAgICB9XG4gICAgbGV0IGVuY3J5cHRlZENvbnRlbnRzID0gdGhpcy5lbmNyeXB0KGNvbnRlbnRzLCBlbmNyeXB0aW9uS2V5KTtcbiAgICB3cml0ZShmaWxlcGF0aCwgZW5jcnlwdGVkQ29udGVudHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbmNyeXB0KHRleHQ6IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgICBsZXQgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcignYWVzMjU2JywgbmV3IEJ1ZmZlcihrZXkpKTtcbiAgICByZXR1cm4gY2lwaGVyLnVwZGF0ZSh0ZXh0LCAndXRmOCcsICdoZXgnKSArIGNpcGhlci5maW5hbCgnaGV4Jyk7XG4gIH1cblxuICBwcml2YXRlIGRlY3J5cHQoZW5jcnlwdGVkOiBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgbGV0IGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyKCdhZXMyNTYnLCBuZXcgQnVmZmVyKGtleSkpO1xuICAgIHJldHVybiBkZWNpcGhlci51cGRhdGUoZW5jcnlwdGVkLCAnaGV4JywgJ3V0ZjgnKSArIGRlY2lwaGVyLmZpbmFsKCd1dGY4Jyk7XG4gIH1cblxufSJdfQ==