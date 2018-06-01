"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const password_prompt_1 = tslib_1.__importDefault(require("password-prompt"));
const utils_1 = require("./utils");
const DefaultUI = {
    getWindowsEncryptionPassword() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield password_prompt_1.default('devcert password (http://bit.ly/devcert-what-password?):');
        });
    },
    warnChromeOnLinuxWithoutCertutil() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('Please close Firefox before continuing');
        });
    },
    startFirefoxWizard(certificateHost) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvcGV0ZXJrL3Byb2plY3RzL2RldmNlcnQvIiwic291cmNlcyI6WyJ1c2VyLWludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4RUFBNkM7QUFDN0MsbUNBQXNDO0FBV3RDLE1BQU0sU0FBUyxHQUFrQjtJQUN6Qiw0QkFBNEI7O1lBQ2hDLE9BQU8sTUFBTSx5QkFBYyxDQUN6QiwwREFBMEQsQ0FDM0QsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUNLLGdDQUFnQzs7WUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQzs7Ozs7O0tBTVosQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBQ0ssNEJBQTRCOztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDeEQsQ0FBQztLQUFBO0lBQ0ssa0JBQWtCLENBQUMsZUFBZTs7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7Ozs7Ozs7OztRQVVSLGVBQWU7Ozs7OztLQU1sQixDQUFDLENBQUM7WUFDSCxNQUFNLG1CQUFXLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFDSyx1QkFBdUIsQ0FBQyxjQUFzQjs7WUFDbEQsT0FBTzs7O3dEQUc2QyxjQUFjOzs7S0FHakUsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUNLLG9CQUFvQjs7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7Ozs7OztLQU9YLENBQUMsQ0FBQztZQUNILE1BQU0sbUJBQVcsRUFBRSxDQUFDO1FBQ3RCLENBQUM7S0FBQTtDQUNGLENBQUM7QUFFRixrQkFBZSxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGFzc3dvcmRQcm9tcHQgZnJvbSAncGFzc3dvcmQtcHJvbXB0JztcbmltcG9ydCB7IHdhaXRGb3JVc2VyIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlckludGVyZmFjZSB7XG4gIGdldFdpbmRvd3NFbmNyeXB0aW9uUGFzc3dvcmQoKTogUHJvbWlzZTxzdHJpbmc+O1xuICB3YXJuQ2hyb21lT25MaW51eFdpdGhvdXRDZXJ0dXRpbCgpOiBQcm9taXNlPHZvaWQ+O1xuICBjbG9zZUZpcmVmb3hCZWZvcmVDb250aW51aW5nKCk6IFByb21pc2U8dm9pZD47XG4gIHN0YXJ0RmlyZWZveFdpemFyZChjZXJ0aWZpY2F0ZUhvc3Q6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG4gIGZpcmVmb3hXaXphcmRQcm9tcHRQYWdlKGNlcnRpZmljYXRlVVJMOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz47XG4gIHdhaXRGb3JGaXJlZm94V2l6YXJkKCk6IFByb21pc2U8dm9pZD47XG59XG5cbmNvbnN0IERlZmF1bHRVSTogVXNlckludGVyZmFjZSA9IHtcbiAgYXN5bmMgZ2V0V2luZG93c0VuY3J5cHRpb25QYXNzd29yZCgpIHtcbiAgICByZXR1cm4gYXdhaXQgcGFzc3dvcmRQcm9tcHQoXG4gICAgICAnZGV2Y2VydCBwYXNzd29yZCAoaHR0cDovL2JpdC5seS9kZXZjZXJ0LXdoYXQtcGFzc3dvcmQ/KTonXG4gICAgKTtcbiAgfSxcbiAgYXN5bmMgd2FybkNocm9tZU9uTGludXhXaXRob3V0Q2VydHV0aWwoKSB7XG4gICAgY29uc29sZS53YXJuKGBcbiAgICAgIFdBUk5JTkc6IEl0IGxvb2tzIGxpa2UgeW91IGhhdmUgQ2hyb21lIGluc3RhbGxlZCwgYnV0IHlvdSBzcGVjaWZpZWRcbiAgICAgICdza2lwQ2VydHV0aWxJbnN0YWxsOiB0cnVlJy4gVW5mb3J0dW5hdGVseSwgd2l0aG91dCBpbnN0YWxsaW5nXG4gICAgICBjZXJ0dXRpbCwgaXQncyBpbXBvc3NpYmxlIGdldCBDaHJvbWUgdG8gdHJ1c3QgZGV2Y2VydCdzIGNlcnRpZmljYXRlc1xuICAgICAgVGhlIGNlcnRpZmljYXRlcyB3aWxsIHdvcmssIGJ1dCBDaHJvbWUgd2lsbCBjb250aW51ZSB0byB3YXJuIHlvdSB0aGF0XG4gICAgICB0aGV5IGFyZSB1bnRydXN0ZWQuXG4gICAgYCk7XG4gIH0sXG4gIGFzeW5jIGNsb3NlRmlyZWZveEJlZm9yZUNvbnRpbnVpbmcoKSB7XG4gICAgY29uc29sZS5sb2coJ1BsZWFzZSBjbG9zZSBGaXJlZm94IGJlZm9yZSBjb250aW51aW5nJyk7XG4gIH0sXG4gIGFzeW5jIHN0YXJ0RmlyZWZveFdpemFyZChjZXJ0aWZpY2F0ZUhvc3QpIHtcbiAgICBjb25zb2xlLmxvZyhgXG4gICAgICBkZXZjZXJ0IHdhcyB1bmFibGUgdG8gYXV0b21hdGljYWxseSBjb25maWd1cmUgRmlyZWZveC4gWW91J2xsIG5lZWQgdG9cbiAgICAgIGNvbXBsZXRlIHRoaXMgcHJvY2VzcyBtYW51YWxseS4gRG9uJ3Qgd29ycnkgdGhvdWdoIC0gRmlyZWZveCB3aWxsIHdhbGtcbiAgICAgIHlvdSB0aHJvdWdoIGl0LlxuXG4gICAgICBXaGVuIHlvdSdyZSByZWFkeSwgaGl0IGFueSBrZXkgdG8gY29udGludWUuIEZpcmVmb3ggd2lsbCBsYXVuY2ggYW5kXG4gICAgICBkaXNwbGF5IGEgd2l6YXJkIHRvIHdhbGsgeW91IHRocm91Z2ggaG93IHRvIHRydXN0IHRoZSBkZXZjZXJ0XG4gICAgICBjZXJ0aWZpY2F0ZS4gV2hlbiB5b3UgYXJlIGZpbmlzaGVkLCBjb21lIGJhY2sgaGVyZSBhbmQgd2UnbGwgZmluaXNoIHVwLlxuXG4gICAgICAoSWYgRmlyZWZveCBkb2Vzbid0IHN0YXJ0LCBnbyBhaGVhZCBhbmQgc3RhcnQgaXQgYW5kIG5hdmlnYXRlIHRvXG4gICAgICAke2NlcnRpZmljYXRlSG9zdH0gaW4gYSBuZXcgdGFiLilcblxuICAgICAgSWYgeW91IGFyZSBjdXJpb3VzIGFib3V0IHdoeSBhbGwgdGhpcyBpcyBuZWNlc3NhcnksIGNoZWNrIG91dFxuICAgICAgaHR0cHM6Ly9naXRodWIuY29tL2RhdmV3YXNtZXIvZGV2Y2VydCNob3ctaXQtd29ya3NcblxuICAgICAgPFByZXNzIGFueSBrZXkgdG8gbGF1bmNoIEZpcmVmb3ggd2l6YXJkPlxuICAgIGApO1xuICAgIGF3YWl0IHdhaXRGb3JVc2VyKCk7XG4gIH0sXG4gIGFzeW5jIGZpcmVmb3hXaXphcmRQcm9tcHRQYWdlKGNlcnRpZmljYXRlVVJMOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFxuICAgICAgPGh0bWw+XG4gICAgICAgIDxoZWFkPlxuICAgICAgICAgIDxtZXRhIGh0dHAtZXF1aXY9XCJyZWZyZXNoXCIgY29udGVudD1cIjA7IHVybD1cIiR7Y2VydGlmaWNhdGVVUkx9XCIgLz5cbiAgICAgICAgPC9oZWFkPlxuICAgICAgPC9odG1sPlxuICAgIGA7XG4gIH0sXG4gIGFzeW5jIHdhaXRGb3JGaXJlZm94V2l6YXJkKCkge1xuICAgIGNvbnNvbGUubG9nKGBcbiAgICAgIExhdW5jaGluZyBGaXJlZm94IC4uLlxuXG4gICAgICBHcmVhdCEgT25jZSB5b3UndmUgZmluaXNoZWQgdGhlIEZpcmVmb3ggd2l6YXJkIGZvciBhZGRpbmcgdGhlIGRldmNlcnRcbiAgICAgIGNlcnRpZmljYXRlLCBqdXN0IGhpdCBhbnkga2V5IGhlcmUgYWdhaW4gYW5kIHdlJ2xsIHdyYXAgdXAuXG5cbiAgICAgIDxQcmVzcyBhbnkga2V5IHRvIGNvbnRpbnVlPlxuICAgIGApO1xuICAgIGF3YWl0IHdhaXRGb3JVc2VyKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRVSTtcbiJdfQ==