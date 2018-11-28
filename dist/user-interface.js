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
const password_prompt_1 = __importDefault(require("password-prompt"));
const utils_1 = require("./utils");
const DefaultUI = {
    getWindowsEncryptionPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield password_prompt_1.default('devcert password (http://bit.ly/devcert-what-password?):');
        });
    },
    warnChromeOnLinuxWithoutCertutil() {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn(`
      WARNING: It looks like you have Chrome installed, but you specified
      'skipCertutilInstall: true'. Unfortunately, without installing
      certutil, it's impossible get Chrome to trust devcert's certificates
      The certificates will work, but Chrome will continue to warn you that
      they are untrusted.
    `);
        });
    },
    closeFirefoxBeforeContinuing() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Please close Firefox before continuing');
        });
    },
    startFirefoxWizard(certificateHost) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`
      devcert was unable to automatically configure Firefox. You'll need to
      complete this process manually. Don't worry though - Firefox will walk
      you through it.

      When you're ready, hit any key to continue. Firefox will launch and
      display a wizard to walk you through how to trust the devcert
      certificate. When you are finished, come back here and we'll finish up.

      (If Firefox doesn't start, go ahead and start it and navigate to
      ${certificateHost} in a new tab.)

      If you are curious about why all this is necessary, check out
      https://github.com/davewasmer/devcert#how-it-works

      <Press any key to launch Firefox wizard>
    `);
            yield utils_1.waitForUser();
        });
    },
    firefoxWizardPromptPage(certificateURL) {
        return __awaiter(this, void 0, void 0, function* () {
            return `
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url="${certificateURL}" />
        </head>
      </html>
    `;
        });
    },
    waitForFirefoxWizard() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`
      Launching Firefox ...

      Great! Once you've finished the Firefox wizard for adding the devcert
      certificate, just hit any key here again and we'll wrap up.

      <Press any key to continue>
    `);
            yield utils_1.waitForUser();
        });
    }
};
exports.default = DefaultUI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJ1c2VyLWludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQTZDO0FBQzdDLG1DQUFzQztBQVd0QyxNQUFNLFNBQVMsR0FBa0I7SUFDekIsNEJBQTRCOztZQUNoQyxNQUFNLENBQUMsTUFBTSx5QkFBYyxDQUN6QiwwREFBMEQsQ0FDM0QsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUNLLGdDQUFnQzs7WUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQzs7Ozs7O0tBTVosQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBQ0ssNEJBQTRCOztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDeEQsQ0FBQztLQUFBO0lBQ0ssa0JBQWtCLENBQUMsZUFBZTs7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7Ozs7Ozs7OztRQVVSLGVBQWU7Ozs7OztLQU1sQixDQUFDLENBQUM7WUFDSCxNQUFNLG1CQUFXLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFDSyx1QkFBdUIsQ0FBQyxjQUFzQjs7WUFDbEQsTUFBTSxDQUFDOzs7d0RBRzZDLGNBQWM7OztLQUdqRSxDQUFDO1FBQ0osQ0FBQztLQUFBO0lBQ0ssb0JBQW9COztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDOzs7Ozs7O0tBT1gsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxtQkFBVyxFQUFFLENBQUM7UUFDdEIsQ0FBQztLQUFBO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLFNBQVMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXNzd29yZFByb21wdCBmcm9tICdwYXNzd29yZC1wcm9tcHQnO1xuaW1wb3J0IHsgd2FpdEZvclVzZXIgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBVc2VySW50ZXJmYWNlIHtcbiAgZ2V0V2luZG93c0VuY3J5cHRpb25QYXNzd29yZCgpOiBQcm9taXNlPHN0cmluZz47XG4gIHdhcm5DaHJvbWVPbkxpbnV4V2l0aG91dENlcnR1dGlsKCk6IFByb21pc2U8dm9pZD47XG4gIGNsb3NlRmlyZWZveEJlZm9yZUNvbnRpbnVpbmcoKTogUHJvbWlzZTx2b2lkPjtcbiAgc3RhcnRGaXJlZm94V2l6YXJkKGNlcnRpZmljYXRlSG9zdDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbiAgZmlyZWZveFdpemFyZFByb21wdFBhZ2UoY2VydGlmaWNhdGVVUkw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPjtcbiAgd2FpdEZvckZpcmVmb3hXaXphcmQoKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuY29uc3QgRGVmYXVsdFVJOiBVc2VySW50ZXJmYWNlID0ge1xuICBhc3luYyBnZXRXaW5kb3dzRW5jcnlwdGlvblBhc3N3b3JkKCkge1xuICAgIHJldHVybiBhd2FpdCBwYXNzd29yZFByb21wdChcbiAgICAgICdkZXZjZXJ0IHBhc3N3b3JkIChodHRwOi8vYml0Lmx5L2RldmNlcnQtd2hhdC1wYXNzd29yZD8pOidcbiAgICApO1xuICB9LFxuICBhc3luYyB3YXJuQ2hyb21lT25MaW51eFdpdGhvdXRDZXJ0dXRpbCgpIHtcbiAgICBjb25zb2xlLndhcm4oYFxuICAgICAgV0FSTklORzogSXQgbG9va3MgbGlrZSB5b3UgaGF2ZSBDaHJvbWUgaW5zdGFsbGVkLCBidXQgeW91IHNwZWNpZmllZFxuICAgICAgJ3NraXBDZXJ0dXRpbEluc3RhbGw6IHRydWUnLiBVbmZvcnR1bmF0ZWx5LCB3aXRob3V0IGluc3RhbGxpbmdcbiAgICAgIGNlcnR1dGlsLCBpdCdzIGltcG9zc2libGUgZ2V0IENocm9tZSB0byB0cnVzdCBkZXZjZXJ0J3MgY2VydGlmaWNhdGVzXG4gICAgICBUaGUgY2VydGlmaWNhdGVzIHdpbGwgd29yaywgYnV0IENocm9tZSB3aWxsIGNvbnRpbnVlIHRvIHdhcm4geW91IHRoYXRcbiAgICAgIHRoZXkgYXJlIHVudHJ1c3RlZC5cbiAgICBgKTtcbiAgfSxcbiAgYXN5bmMgY2xvc2VGaXJlZm94QmVmb3JlQ29udGludWluZygpIHtcbiAgICBjb25zb2xlLmxvZygnUGxlYXNlIGNsb3NlIEZpcmVmb3ggYmVmb3JlIGNvbnRpbnVpbmcnKTtcbiAgfSxcbiAgYXN5bmMgc3RhcnRGaXJlZm94V2l6YXJkKGNlcnRpZmljYXRlSG9zdCkge1xuICAgIGNvbnNvbGUubG9nKGBcbiAgICAgIGRldmNlcnQgd2FzIHVuYWJsZSB0byBhdXRvbWF0aWNhbGx5IGNvbmZpZ3VyZSBGaXJlZm94LiBZb3UnbGwgbmVlZCB0b1xuICAgICAgY29tcGxldGUgdGhpcyBwcm9jZXNzIG1hbnVhbGx5LiBEb24ndCB3b3JyeSB0aG91Z2ggLSBGaXJlZm94IHdpbGwgd2Fsa1xuICAgICAgeW91IHRocm91Z2ggaXQuXG5cbiAgICAgIFdoZW4geW91J3JlIHJlYWR5LCBoaXQgYW55IGtleSB0byBjb250aW51ZS4gRmlyZWZveCB3aWxsIGxhdW5jaCBhbmRcbiAgICAgIGRpc3BsYXkgYSB3aXphcmQgdG8gd2FsayB5b3UgdGhyb3VnaCBob3cgdG8gdHJ1c3QgdGhlIGRldmNlcnRcbiAgICAgIGNlcnRpZmljYXRlLiBXaGVuIHlvdSBhcmUgZmluaXNoZWQsIGNvbWUgYmFjayBoZXJlIGFuZCB3ZSdsbCBmaW5pc2ggdXAuXG5cbiAgICAgIChJZiBGaXJlZm94IGRvZXNuJ3Qgc3RhcnQsIGdvIGFoZWFkIGFuZCBzdGFydCBpdCBhbmQgbmF2aWdhdGUgdG9cbiAgICAgICR7Y2VydGlmaWNhdGVIb3N0fSBpbiBhIG5ldyB0YWIuKVxuXG4gICAgICBJZiB5b3UgYXJlIGN1cmlvdXMgYWJvdXQgd2h5IGFsbCB0aGlzIGlzIG5lY2Vzc2FyeSwgY2hlY2sgb3V0XG4gICAgICBodHRwczovL2dpdGh1Yi5jb20vZGF2ZXdhc21lci9kZXZjZXJ0I2hvdy1pdC13b3Jrc1xuXG4gICAgICA8UHJlc3MgYW55IGtleSB0byBsYXVuY2ggRmlyZWZveCB3aXphcmQ+XG4gICAgYCk7XG4gICAgYXdhaXQgd2FpdEZvclVzZXIoKTtcbiAgfSxcbiAgYXN5bmMgZmlyZWZveFdpemFyZFByb21wdFBhZ2UoY2VydGlmaWNhdGVVUkw6IHN0cmluZykge1xuICAgIHJldHVybiBgXG4gICAgICA8aHRtbD5cbiAgICAgICAgPGhlYWQ+XG4gICAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj1cInJlZnJlc2hcIiBjb250ZW50PVwiMDsgdXJsPVwiJHtjZXJ0aWZpY2F0ZVVSTH1cIiAvPlxuICAgICAgICA8L2hlYWQ+XG4gICAgICA8L2h0bWw+XG4gICAgYDtcbiAgfSxcbiAgYXN5bmMgd2FpdEZvckZpcmVmb3hXaXphcmQoKSB7XG4gICAgY29uc29sZS5sb2coYFxuICAgICAgTGF1bmNoaW5nIEZpcmVmb3ggLi4uXG5cbiAgICAgIEdyZWF0ISBPbmNlIHlvdSd2ZSBmaW5pc2hlZCB0aGUgRmlyZWZveCB3aXphcmQgZm9yIGFkZGluZyB0aGUgZGV2Y2VydFxuICAgICAgY2VydGlmaWNhdGUsIGp1c3QgaGl0IGFueSBrZXkgaGVyZSBhZ2FpbiBhbmQgd2UnbGwgd3JhcCB1cC5cblxuICAgICAgPFByZXNzIGFueSBrZXkgdG8gY29udGludWU+XG4gICAgYCk7XG4gICAgYXdhaXQgd2FpdEZvclVzZXIoKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdFVJO1xuIl19