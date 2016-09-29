var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        (function (LoggingSeverity) {
            LoggingSeverity[LoggingSeverity["CRITICAL"] = 0] = "CRITICAL";
            LoggingSeverity[LoggingSeverity["WARNING"] = 1] = "WARNING";
        })(ApplicationInsights.LoggingSeverity || (ApplicationInsights.LoggingSeverity = {}));
        var LoggingSeverity = ApplicationInsights.LoggingSeverity;
        (function (_InternalMessageId) {
            _InternalMessageId[_InternalMessageId["NONUSRACT_BrowserDoesNotSupportLocalStorage"] = 0] = "NONUSRACT_BrowserDoesNotSupportLocalStorage";
            _InternalMessageId[_InternalMessageId["NONUSRACT_BrowserCannotReadLocalStorage"] = 1] = "NONUSRACT_BrowserCannotReadLocalStorage";
            _InternalMessageId[_InternalMessageId["NONUSRACT_BrowserCannotReadSessionStorage"] = 2] = "NONUSRACT_BrowserCannotReadSessionStorage";
            _InternalMessageId[_InternalMessageId["NONUSRACT_BrowserCannotWriteLocalStorage"] = 3] = "NONUSRACT_BrowserCannotWriteLocalStorage";
            _InternalMessageId[_InternalMessageId["NONUSRACT_BrowserCannotWriteSessionStorage"] = 4] = "NONUSRACT_BrowserCannotWriteSessionStorage";
            _InternalMessageId[_InternalMessageId["NONUSRACT_BrowserFailedRemovalFromLocalStorage"] = 5] = "NONUSRACT_BrowserFailedRemovalFromLocalStorage";
            _InternalMessageId[_InternalMessageId["NONUSRACT_BrowserFailedRemovalFromSessionStorage"] = 6] = "NONUSRACT_BrowserFailedRemovalFromSessionStorage";
            _InternalMessageId[_InternalMessageId["NONUSRACT_CannotSendEmptyTelemetry"] = 7] = "NONUSRACT_CannotSendEmptyTelemetry";
            _InternalMessageId[_InternalMessageId["NONUSRACT_ClientPerformanceMathError"] = 8] = "NONUSRACT_ClientPerformanceMathError";
            _InternalMessageId[_InternalMessageId["NONUSRACT_ErrorParsingAISessionCookie"] = 9] = "NONUSRACT_ErrorParsingAISessionCookie";
            _InternalMessageId[_InternalMessageId["NONUSRACT_ErrorPVCalc"] = 10] = "NONUSRACT_ErrorPVCalc";
            _InternalMessageId[_InternalMessageId["NONUSRACT_ExceptionWhileLoggingError"] = 11] = "NONUSRACT_ExceptionWhileLoggingError";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedAddingTelemetryToBuffer"] = 12] = "NONUSRACT_FailedAddingTelemetryToBuffer";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedMonitorAjaxAbort"] = 13] = "NONUSRACT_FailedMonitorAjaxAbort";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedMonitorAjaxDur"] = 14] = "NONUSRACT_FailedMonitorAjaxDur";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedMonitorAjaxOpen"] = 15] = "NONUSRACT_FailedMonitorAjaxOpen";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedMonitorAjaxRSC"] = 16] = "NONUSRACT_FailedMonitorAjaxRSC";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedMonitorAjaxSend"] = 17] = "NONUSRACT_FailedMonitorAjaxSend";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedToAddHandlerForOnBeforeUnload"] = 18] = "NONUSRACT_FailedToAddHandlerForOnBeforeUnload";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedToSendQueuedTelemetry"] = 19] = "NONUSRACT_FailedToSendQueuedTelemetry";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailedToReportDataLoss"] = 20] = "NONUSRACT_FailedToReportDataLoss";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FlushFailed"] = 21] = "NONUSRACT_FlushFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_MessageLimitPerPVExceeded"] = 22] = "NONUSRACT_MessageLimitPerPVExceeded";
            _InternalMessageId[_InternalMessageId["NONUSRACT_MissingRequiredFieldSpecification"] = 23] = "NONUSRACT_MissingRequiredFieldSpecification";
            _InternalMessageId[_InternalMessageId["NONUSRACT_NavigationTimingNotSupported"] = 24] = "NONUSRACT_NavigationTimingNotSupported";
            _InternalMessageId[_InternalMessageId["NONUSRACT_OnError"] = 25] = "NONUSRACT_OnError";
            _InternalMessageId[_InternalMessageId["NONUSRACT_SessionRenewalDateIsZero"] = 26] = "NONUSRACT_SessionRenewalDateIsZero";
            _InternalMessageId[_InternalMessageId["NONUSRACT_SenderNotInitialized"] = 27] = "NONUSRACT_SenderNotInitialized";
            _InternalMessageId[_InternalMessageId["NONUSRACT_StartTrackEventFailed"] = 28] = "NONUSRACT_StartTrackEventFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_StopTrackEventFailed"] = 29] = "NONUSRACT_StopTrackEventFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_StartTrackFailed"] = 30] = "NONUSRACT_StartTrackFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_StopTrackFailed"] = 31] = "NONUSRACT_StopTrackFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TelemetrySampledAndNotSent"] = 32] = "NONUSRACT_TelemetrySampledAndNotSent";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TrackEventFailed"] = 33] = "NONUSRACT_TrackEventFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TrackExceptionFailed"] = 34] = "NONUSRACT_TrackExceptionFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TrackMetricFailed"] = 35] = "NONUSRACT_TrackMetricFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TrackPVFailed"] = 36] = "NONUSRACT_TrackPVFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TrackPVFailedCalc"] = 37] = "NONUSRACT_TrackPVFailedCalc";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TrackTraceFailed"] = 38] = "NONUSRACT_TrackTraceFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_TransmissionFailed"] = 39] = "NONUSRACT_TransmissionFailed";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailToSetStorageBuffer"] = 40] = "NONUSRACT_FailToSetStorageBuffer";
            _InternalMessageId[_InternalMessageId["NONUSRACT_FailToRestoreStorageBuffer"] = 41] = "NONUSRACT_FailToRestoreStorageBuffer";
            _InternalMessageId[_InternalMessageId["USRACT_CannotSerializeObject"] = 42] = "USRACT_CannotSerializeObject";
            _InternalMessageId[_InternalMessageId["USRACT_CannotSerializeObjectNonSerializable"] = 43] = "USRACT_CannotSerializeObjectNonSerializable";
            _InternalMessageId[_InternalMessageId["USRACT_CircularReferenceDetected"] = 44] = "USRACT_CircularReferenceDetected";
            _InternalMessageId[_InternalMessageId["USRACT_ClearAuthContextFailed"] = 45] = "USRACT_ClearAuthContextFailed";
            _InternalMessageId[_InternalMessageId["USRACT_ExceptionTruncated"] = 46] = "USRACT_ExceptionTruncated";
            _InternalMessageId[_InternalMessageId["USRACT_IllegalCharsInName"] = 47] = "USRACT_IllegalCharsInName";
            _InternalMessageId[_InternalMessageId["USRACT_ItemNotInArray"] = 48] = "USRACT_ItemNotInArray";
            _InternalMessageId[_InternalMessageId["USRACT_MaxAjaxPerPVExceeded"] = 49] = "USRACT_MaxAjaxPerPVExceeded";
            _InternalMessageId[_InternalMessageId["USRACT_MessageTruncated"] = 50] = "USRACT_MessageTruncated";
            _InternalMessageId[_InternalMessageId["USRACT_NameTooLong"] = 51] = "USRACT_NameTooLong";
            _InternalMessageId[_InternalMessageId["USRACT_SampleRateOutOfRange"] = 52] = "USRACT_SampleRateOutOfRange";
            _InternalMessageId[_InternalMessageId["USRACT_SetAuthContextFailed"] = 53] = "USRACT_SetAuthContextFailed";
            _InternalMessageId[_InternalMessageId["USRACT_SetAuthContextFailedAccountName"] = 54] = "USRACT_SetAuthContextFailedAccountName";
            _InternalMessageId[_InternalMessageId["USRACT_StringValueTooLong"] = 55] = "USRACT_StringValueTooLong";
            _InternalMessageId[_InternalMessageId["USRACT_StartCalledMoreThanOnce"] = 56] = "USRACT_StartCalledMoreThanOnce";
            _InternalMessageId[_InternalMessageId["USRACT_StopCalledWithoutStart"] = 57] = "USRACT_StopCalledWithoutStart";
            _InternalMessageId[_InternalMessageId["USRACT_TelemetryInitializerFailed"] = 58] = "USRACT_TelemetryInitializerFailed";
            _InternalMessageId[_InternalMessageId["USRACT_TrackArgumentsNotSpecified"] = 59] = "USRACT_TrackArgumentsNotSpecified";
            _InternalMessageId[_InternalMessageId["USRACT_UrlTooLong"] = 60] = "USRACT_UrlTooLong";
        })(ApplicationInsights._InternalMessageId || (ApplicationInsights._InternalMessageId = {}));
        var _InternalMessageId = ApplicationInsights._InternalMessageId;
        var _InternalLogMessage = (function () {
            function _InternalLogMessage(msgId, msg, properties) {
                this.message = _InternalMessageId[msgId].toString();
                this.messageId = msgId;
                var diagnosticText = (msg ? " message:" + _InternalLogMessage.sanitizeDiagnosticText(msg) : "") +
                    (properties ? " props:" + _InternalLogMessage.sanitizeDiagnosticText(JSON.stringify(properties)) : "");
                this.message += diagnosticText;
            }
            _InternalLogMessage.sanitizeDiagnosticText = function (text) {
                return "\"" + text.replace(/\"/g, "") + "\"";
            };
            return _InternalLogMessage;
        })();
        ApplicationInsights._InternalLogMessage = _InternalLogMessage;
        var _InternalLogging = (function () {
            function _InternalLogging() {
            }
            _InternalLogging.throwInternalNonUserActionable = function (severity, message) {
                if (this.enableDebugExceptions()) {
                    throw message;
                }
                else {
                    if (typeof (message) !== "undefined" && !!message) {
                        if (typeof (message.message) !== "undefined") {
                            message.message = this.AiNonUserActionablePrefix + message.message;
                            if (this.verboseLogging()) {
                                this.warnToConsole(message.message);
                            }
                            this.logInternalMessage(severity, message);
                        }
                    }
                }
            };
            _InternalLogging.throwInternalUserActionable = function (severity, message) {
                if (this.enableDebugExceptions()) {
                    throw message;
                }
                else {
                    if (typeof (message) !== "undefined" && !!message) {
                        if (typeof (message.message) !== "undefined") {
                            message.message = this.AiUserActionablePrefix + message.message;
                            this.warnToConsole(message.message);
                            this.logInternalMessage(severity, message);
                        }
                    }
                }
            };
            _InternalLogging.warnToConsole = function (message) {
                if (typeof console !== "undefined" && !!console) {
                    if (typeof console.warn === "function") {
                        console.warn(message);
                    }
                    else if (typeof console.log === "function") {
                        console.log(message);
                    }
                }
            };
            _InternalLogging.resetInternalMessageCount = function () {
                this._messageCount = 0;
            };
            _InternalLogging.clearInternalMessageLoggedTypes = function () {
                if (ApplicationInsights.Util.canUseSessionStorage()) {
                    var sessionStorageKeys = ApplicationInsights.Util.getSessionStorageKeys();
                    for (var i = 0; i < sessionStorageKeys.length; i++) {
                        if (sessionStorageKeys[i].indexOf(_InternalLogging.AIInternalMessagePrefix) === 0) {
                            ApplicationInsights.Util.removeSessionStorage(sessionStorageKeys[i]);
                        }
                    }
                }
            };
            _InternalLogging.setMaxInternalMessageLimit = function (limit) {
                if (!limit) {
                    throw new Error('limit cannot be undefined.');
                }
                this.MAX_INTERNAL_MESSAGE_LIMIT = limit;
            };
            _InternalLogging.logInternalMessage = function (severity, message) {
                if (this._areInternalMessagesThrottled()) {
                    return;
                }
                var logMessage = true;
                if (ApplicationInsights.Util.canUseSessionStorage()) {
                    var storageMessageKey = _InternalLogging.AIInternalMessagePrefix + _InternalMessageId[message.messageId];
                    var internalMessageTypeLogRecord = ApplicationInsights.Util.getSessionStorage(storageMessageKey);
                    if (internalMessageTypeLogRecord) {
                        logMessage = false;
                    }
                    else {
                        ApplicationInsights.Util.setSessionStorage(storageMessageKey, "1");
                    }
                }
                if (logMessage) {
                    if (this.verboseLogging() || severity === LoggingSeverity.CRITICAL) {
                        this.queue.push(message);
                        this._messageCount++;
                    }
                    if (this._messageCount == this.MAX_INTERNAL_MESSAGE_LIMIT) {
                        var throttleLimitMessage = "Internal events throttle limit per PageView reached for this app.";
                        var throttleMessage = new _InternalLogMessage(_InternalMessageId.NONUSRACT_MessageLimitPerPVExceeded, throttleLimitMessage);
                        this.queue.push(throttleMessage);
                        this.warnToConsole(throttleLimitMessage);
                    }
                }
            };
            _InternalLogging._areInternalMessagesThrottled = function () {
                return this._messageCount >= this.MAX_INTERNAL_MESSAGE_LIMIT;
            };
            _InternalLogging.AiUserActionablePrefix = "AI: ";
            _InternalLogging.AIInternalMessagePrefix = "AITR_";
            _InternalLogging.AiNonUserActionablePrefix = "AI (Internal): ";
            _InternalLogging.enableDebugExceptions = function () { return false; };
            _InternalLogging.verboseLogging = function () { return false; };
            _InternalLogging.queue = [];
            _InternalLogging.MAX_INTERNAL_MESSAGE_LIMIT = 25;
            _InternalLogging._messageCount = 0;
            return _InternalLogging;
        })();
        ApplicationInsights._InternalLogging = _InternalLogging;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="./logging.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var StorageType;
        (function (StorageType) {
            StorageType[StorageType["LocalStorage"] = 0] = "LocalStorage";
            StorageType[StorageType["SessionStorage"] = 1] = "SessionStorage";
        })(StorageType || (StorageType = {}));
        var Util = (function () {
            function Util() {
            }
            Util._getLocalStorageObject = function () {
                return Util._getVerifiedStorageObject(StorageType.LocalStorage);
            };
            Util._getVerifiedStorageObject = function (storageType) {
                var storage = null;
                var fail;
                var uid;
                try {
                    uid = new Date;
                    storage = storageType === StorageType.LocalStorage ? window.localStorage : window.sessionStorage;
                    storage.setItem(uid, uid);
                    fail = storage.getItem(uid) != uid;
                    storage.removeItem(uid);
                    if (fail) {
                        storage = null;
                    }
                }
                catch (exception) {
                    storage = null;
                }
                return storage;
            };
            Util.canUseLocalStorage = function () {
                return !!Util._getLocalStorageObject();
            };
            Util.getStorage = function (name) {
                var storage = Util._getLocalStorageObject();
                if (storage !== null) {
                    try {
                        return storage.getItem(name);
                    }
                    catch (e) {
                        var message = new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_BrowserCannotReadLocalStorage, "Browser failed read of local storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, message);
                    }
                }
                return null;
            };
            Util.setStorage = function (name, data) {
                var storage = Util._getLocalStorageObject();
                if (storage !== null) {
                    try {
                        storage.setItem(name, data);
                        return true;
                    }
                    catch (e) {
                        var message = new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_BrowserCannotWriteLocalStorage, "Browser failed write to local storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, message);
                    }
                }
                return false;
            };
            Util.removeStorage = function (name) {
                var storage = Util._getLocalStorageObject();
                if (storage !== null) {
                    try {
                        storage.removeItem(name);
                        return true;
                    }
                    catch (e) {
                        var message = new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_BrowserFailedRemovalFromLocalStorage, "Browser failed removal of local storage item. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, message);
                    }
                }
                return false;
            };
            Util._getSessionStorageObject = function () {
                return Util._getVerifiedStorageObject(StorageType.SessionStorage);
            };
            Util.canUseSessionStorage = function () {
                return !!Util._getSessionStorageObject();
            };
            Util.getSessionStorageKeys = function () {
                var keys = [];
                if (Util.canUseSessionStorage()) {
                    for (var key in window.sessionStorage) {
                        keys.push(key);
                    }
                }
                return keys;
            };
            Util.getSessionStorage = function (name) {
                var storage = Util._getSessionStorageObject();
                if (storage !== null) {
                    try {
                        return storage.getItem(name);
                    }
                    catch (e) {
                        var message = new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_BrowserCannotReadSessionStorage, "Browser failed read of session storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, message);
                    }
                }
                return null;
            };
            Util.setSessionStorage = function (name, data) {
                var storage = Util._getSessionStorageObject();
                if (storage !== null) {
                    try {
                        storage.setItem(name, data);
                        return true;
                    }
                    catch (e) {
                        var message = new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_BrowserCannotWriteSessionStorage, "Browser failed write to session storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, message);
                    }
                }
                return false;
            };
            Util.removeSessionStorage = function (name) {
                var storage = Util._getSessionStorageObject();
                if (storage !== null) {
                    try {
                        storage.removeItem(name);
                        return true;
                    }
                    catch (e) {
                        var message = new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_BrowserFailedRemovalFromSessionStorage, "Browser failed removal of session storage item. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, message);
                    }
                }
                return false;
            };
            Util.setCookie = function (name, value, domain) {
                var domainAttrib = "";
                if (domain) {
                    domainAttrib = ";domain=" + domain;
                }
                Util.document.cookie = name + "=" + value + domainAttrib + ";path=/";
            };
            Util.stringToBoolOrDefault = function (str) {
                if (!str) {
                    return false;
                }
                return str.toString().toLowerCase() === "true";
            };
            Util.getCookie = function (name) {
                var value = "";
                if (name && name.length) {
                    var cookieName = name + "=";
                    var cookies = Util.document.cookie.split(";");
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i];
                        cookie = Util.trim(cookie);
                        if (cookie && cookie.indexOf(cookieName) === 0) {
                            value = cookie.substring(cookieName.length, cookies[i].length);
                            break;
                        }
                    }
                }
                return value;
            };
            Util.deleteCookie = function (name) {
                Util.document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            };
            Util.trim = function (str) {
                if (typeof str !== "string")
                    return str;
                return str.replace(/^\s+|\s+$/g, "");
            };
            Util.newId = function () {
                var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var result = "";
                var random = Math.random() * 1073741824;
                while (random > 0) {
                    var char = base64chars.charAt(random % 64);
                    result += char;
                    random = Math.floor(random / 64);
                }
                return result;
            };
            Util.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === "[object Array]";
            };
            Util.isError = function (obj) {
                return Object.prototype.toString.call(obj) === "[object Error]";
            };
            Util.isDate = function (obj) {
                return Object.prototype.toString.call(obj) === "[object Date]";
            };
            Util.toISOStringForIE8 = function (date) {
                if (Util.isDate(date)) {
                    if (Date.prototype.toISOString) {
                        return date.toISOString();
                    }
                    else {
                        function pad(number) {
                            var r = String(number);
                            if (r.length === 1) {
                                r = "0" + r;
                            }
                            return r;
                        }
                        return date.getUTCFullYear()
                            + "-" + pad(date.getUTCMonth() + 1)
                            + "-" + pad(date.getUTCDate())
                            + "T" + pad(date.getUTCHours())
                            + ":" + pad(date.getUTCMinutes())
                            + ":" + pad(date.getUTCSeconds())
                            + "." + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                            + "Z";
                    }
                }
            };
            Util.getIEVersion = function (userAgentStr) {
                if (userAgentStr === void 0) { userAgentStr = null; }
                var myNav = userAgentStr ? userAgentStr.toLowerCase() : navigator.userAgent.toLowerCase();
                return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : null;
            };
            Util.msToTimeSpan = function (totalms) {
                if (isNaN(totalms) || totalms < 0) {
                    totalms = 0;
                }
                var ms = "" + totalms % 1000;
                var sec = "" + Math.floor(totalms / 1000) % 60;
                var min = "" + Math.floor(totalms / (1000 * 60)) % 60;
                var hour = "" + Math.floor(totalms / (1000 * 60 * 60)) % 24;
                ms = ms.length === 1 ? "00" + ms : ms.length === 2 ? "0" + ms : ms;
                sec = sec.length < 2 ? "0" + sec : sec;
                min = min.length < 2 ? "0" + min : min;
                hour = hour.length < 2 ? "0" + hour : hour;
                return hour + ":" + min + ":" + sec + "." + ms;
            };
            Util.isCrossOriginError = function (message, url, lineNumber, columnNumber, error) {
                return (message === "Script error." || message === "Script error") && error === null;
            };
            Util.dump = function (object) {
                var objectTypeDump = Object.prototype.toString.call(object);
                var propertyValueDump = JSON.stringify(object);
                if (objectTypeDump === "[object Error]") {
                    propertyValueDump = "{ stack: '" + object.stack + "', message: '" + object.message + "', name: '" + object.name + "'";
                }
                return objectTypeDump + propertyValueDump;
            };
            Util.getExceptionName = function (object) {
                var objectTypeDump = Object.prototype.toString.call(object);
                if (objectTypeDump === "[object Error]") {
                    return object.name;
                }
                return "";
            };
            Util.addEventHandler = function (eventName, callback) {
                if (!window || typeof eventName !== 'string' || typeof callback !== 'function') {
                    return false;
                }
                var verbEventName = 'on' + eventName;
                if (window.addEventListener) {
                    window.addEventListener(eventName, callback, false);
                }
                else if (window["attachEvent"]) {
                    window["attachEvent"].call(verbEventName, callback);
                }
                else {
                    return false;
                }
                return true;
            };
            Util.document = typeof document !== "undefined" ? document : {};
            Util.NotSpecified = "not_specified";
            return Util;
        })();
        ApplicationInsights.Util = Util;
        var UrlHelper = (function () {
            function UrlHelper() {
            }
            UrlHelper.parseUrl = function (url) {
                if (!UrlHelper.htmlAnchorElement) {
                    UrlHelper.htmlAnchorElement = !!UrlHelper.document.createElement ? UrlHelper.document.createElement('a') : {};
                }
                UrlHelper.htmlAnchorElement.href = url;
                return UrlHelper.htmlAnchorElement;
            };
            UrlHelper.getAbsoluteUrl = function (url) {
                var result;
                var a = UrlHelper.parseUrl(url);
                if (a) {
                    result = a.href;
                }
                return result;
            };
            UrlHelper.getPathName = function (url) {
                var result;
                var a = UrlHelper.parseUrl(url);
                if (a) {
                    result = a.pathname;
                }
                return result;
            };
            UrlHelper.document = typeof document !== "undefined" ? document : {};
            return UrlHelper;
        })();
        ApplicationInsights.UrlHelper = UrlHelper;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../logging.ts" />
/// <reference path="../util.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var extensions = (function () {
            function extensions() {
            }
            extensions.IsNullOrUndefined = function (obj) {
                return typeof (obj) === "undefined" || obj === null;
            };
            return extensions;
        })();
        ApplicationInsights.extensions = extensions;
        var stringUtils = (function () {
            function stringUtils() {
            }
            stringUtils.GetLength = function (strObject) {
                var res = 0;
                if (!extensions.IsNullOrUndefined(strObject)) {
                    var stringified = "";
                    try {
                        stringified = strObject.toString();
                    }
                    catch (ex) {
                    }
                    res = stringified.length;
                    res = isNaN(res) ? 0 : res;
                }
                return res;
            };
            return stringUtils;
        })();
        ApplicationInsights.stringUtils = stringUtils;
        var dateTime = (function () {
            function dateTime() {
            }
            dateTime.Now = (window.performance && window.performance.now) ?
                function () {
                    return performance.now();
                }
                :
                    function () {
                        return new Date().getTime();
                    };
            dateTime.GetDuration = function (start, end) {
                var result = null;
                if (start !== 0 && end !== 0 && !extensions.IsNullOrUndefined(start) && !extensions.IsNullOrUndefined(end)) {
                    result = end - start;
                }
                return result;
            };
            return dateTime;
        })();
        ApplicationInsights.dateTime = dateTime;
        var EventHelper = (function () {
            function EventHelper() {
            }
            EventHelper.AttachEvent = function (obj, eventNameWithoutOn, handlerRef) {
                var result = false;
                if (!extensions.IsNullOrUndefined(obj)) {
                    if (!extensions.IsNullOrUndefined(obj.attachEvent)) {
                        obj.attachEvent("on" + eventNameWithoutOn, handlerRef);
                        result = true;
                    }
                    else {
                        if (!extensions.IsNullOrUndefined(obj.addEventListener)) {
                            obj.addEventListener(eventNameWithoutOn, handlerRef, false);
                            result = true;
                        }
                    }
                }
                return result;
            };
            EventHelper.DetachEvent = function (obj, eventNameWithoutOn, handlerRef) {
                if (!extensions.IsNullOrUndefined(obj)) {
                    if (!extensions.IsNullOrUndefined(obj.detachEvent)) {
                        obj.detachEvent("on" + eventNameWithoutOn, handlerRef);
                    }
                    else {
                        if (!extensions.IsNullOrUndefined(obj.removeEventListener)) {
                            obj.removeEventListener(eventNameWithoutOn, handlerRef, false);
                        }
                    }
                }
            };
            return EventHelper;
        })();
        ApplicationInsights.EventHelper = EventHelper;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../logging.ts" />
/// <reference path="../util.ts" />
/// <reference path="./ajaxUtils.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var XHRMonitoringState = (function () {
            function XHRMonitoringState() {
                this.openDone = false;
                this.setRequestHeaderDone = false;
                this.sendDone = false;
                this.abortDone = false;
                this.onreadystatechangeCallbackAttached = false;
            }
            return XHRMonitoringState;
        })();
        ApplicationInsights.XHRMonitoringState = XHRMonitoringState;
        var ajaxRecord = (function () {
            function ajaxRecord(id) {
                this.completed = false;
                this.requestHeadersSize = null;
                this.ttfb = null;
                this.responseReceivingDuration = null;
                this.callbackDuration = null;
                this.ajaxTotalDuration = null;
                this.aborted = null;
                this.pageUrl = null;
                this.requestUrl = null;
                this.requestSize = 0;
                this.method = null;
                this.status = null;
                this.requestSentTime = null;
                this.responseStartedTime = null;
                this.responseFinishedTime = null;
                this.callbackFinishedTime = null;
                this.endTime = null;
                this.originalOnreadystatechage = null;
                this.xhrMonitoringState = new XHRMonitoringState();
                this.clientFailure = 0;
                this.CalculateMetrics = function () {
                    var self = this;
                    self.ajaxTotalDuration = ApplicationInsights.dateTime.GetDuration(self.requestSentTime, self.responseFinishedTime);
                };
                this.id = id;
            }
            ajaxRecord.prototype.getAbsoluteUrl = function () {
                return this.requestUrl ? ApplicationInsights.UrlHelper.getAbsoluteUrl(this.requestUrl) : null;
            };
            ajaxRecord.prototype.getPathName = function () {
                return this.requestUrl ? ApplicationInsights.UrlHelper.getPathName(this.requestUrl) : null;
            };
            return ajaxRecord;
        })();
        ApplicationInsights.ajaxRecord = ajaxRecord;
        ;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
;
/// <reference path="../logging.ts" />
/// <reference path="../util.ts" />
/// <reference path="./ajaxUtils.ts" />
/// <reference path="./ajaxRecord.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var AjaxMonitor = (function () {
            function AjaxMonitor(appInsights) {
                this.currentWindowHost = window.location.host;
                this.appInsights = appInsights;
                this.initialized = false;
                this.Init();
            }
            AjaxMonitor.prototype.Init = function () {
                if (this.supportsMonitoring()) {
                    this.instrumentOpen();
                    this.instrumentSend();
                    this.instrumentAbort();
                    this.initialized = true;
                }
            };
            AjaxMonitor.prototype.isMonitoredInstance = function (xhr, excludeAjaxDataValidation) {
                return this.initialized
                    && (excludeAjaxDataValidation === true || !ApplicationInsights.extensions.IsNullOrUndefined(xhr.ajaxData))
                    && xhr[AjaxMonitor.DisabledPropertyName] !== true;
            };
            AjaxMonitor.prototype.supportsMonitoring = function () {
                var result = false;
                if (!ApplicationInsights.extensions.IsNullOrUndefined(XMLHttpRequest)) {
                    result = true;
                }
                return result;
            };
            AjaxMonitor.prototype.instrumentOpen = function () {
                var originalOpen = XMLHttpRequest.prototype.open;
                var ajaxMonitorInstance = this;
                XMLHttpRequest.prototype.open = function (method, url, async) {
                    try {
                        if (ajaxMonitorInstance.isMonitoredInstance(this, true) &&
                            (!this.ajaxData ||
                                !this.ajaxData.xhrMonitoringState.openDone)) {
                            ajaxMonitorInstance.openHandler(this, method, url, async);
                        }
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedMonitorAjaxOpen, "Failed to monitor XMLHttpRequest.open, monitoring data for this ajax call may be incorrect.", {
                            ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(this),
                            exception: Microsoft.ApplicationInsights.Util.dump(e)
                        }));
                    }
                    return originalOpen.apply(this, arguments);
                };
            };
            AjaxMonitor.prototype.openHandler = function (xhr, method, url, async) {
                var ajaxData = new ApplicationInsights.ajaxRecord(ApplicationInsights.Util.newId());
                ajaxData.method = method;
                ajaxData.requestUrl = url;
                ajaxData.xhrMonitoringState.openDone = true;
                xhr.ajaxData = ajaxData;
                this.attachToOnReadyStateChange(xhr);
            };
            AjaxMonitor.getFailedAjaxDiagnosticsMessage = function (xhr) {
                var result = "";
                try {
                    if (!ApplicationInsights.extensions.IsNullOrUndefined(xhr) &&
                        !ApplicationInsights.extensions.IsNullOrUndefined(xhr.ajaxData) &&
                        !ApplicationInsights.extensions.IsNullOrUndefined(xhr.ajaxData.requestUrl)) {
                        result += "(url: '" + xhr.ajaxData.requestUrl + "')";
                    }
                }
                catch (e) { }
                return result;
            };
            AjaxMonitor.prototype.instrumentSend = function () {
                var originalSend = XMLHttpRequest.prototype.send;
                var ajaxMonitorInstance = this;
                XMLHttpRequest.prototype.send = function (content) {
                    try {
                        if (ajaxMonitorInstance.isMonitoredInstance(this) && !this.ajaxData.xhrMonitoringState.sendDone) {
                            ajaxMonitorInstance.sendHandler(this, content);
                        }
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedMonitorAjaxSend, "Failed to monitor XMLHttpRequest, monitoring data for this ajax call may be incorrect.", {
                            ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(this),
                            exception: Microsoft.ApplicationInsights.Util.dump(e)
                        }));
                    }
                    return originalSend.apply(this, arguments);
                };
            };
            AjaxMonitor.prototype.sendHandler = function (xhr, content) {
                xhr.ajaxData.requestSentTime = ApplicationInsights.dateTime.Now();
                if (!this.appInsights.config.disableCorrelationHeaders && (ApplicationInsights.UrlHelper.parseUrl(xhr.ajaxData.getAbsoluteUrl()).host == this.currentWindowHost)) {
                    xhr.setRequestHeader("x-ms-request-id", xhr.ajaxData.id);
                }
                xhr.ajaxData.xhrMonitoringState.sendDone = true;
            };
            AjaxMonitor.prototype.instrumentAbort = function () {
                var originalAbort = XMLHttpRequest.prototype.abort;
                var ajaxMonitorInstance = this;
                XMLHttpRequest.prototype.abort = function () {
                    try {
                        if (ajaxMonitorInstance.isMonitoredInstance(this) && !this.ajaxData.xhrMonitoringState.abortDone) {
                            this.ajaxData.aborted = 1;
                            this.ajaxData.xhrMonitoringState.abortDone = true;
                        }
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedMonitorAjaxAbort, "Failed to monitor XMLHttpRequest.abort, monitoring data for this ajax call may be incorrect.", {
                            ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(this),
                            exception: Microsoft.ApplicationInsights.Util.dump(e)
                        }));
                    }
                    return originalAbort.apply(this, arguments);
                };
            };
            AjaxMonitor.prototype.attachToOnReadyStateChange = function (xhr) {
                var ajaxMonitorInstance = this;
                xhr.ajaxData.xhrMonitoringState.onreadystatechangeCallbackAttached = ApplicationInsights.EventHelper.AttachEvent(xhr, "readystatechange", function () {
                    try {
                        if (ajaxMonitorInstance.isMonitoredInstance(xhr)) {
                            if (xhr.readyState === 4) {
                                ajaxMonitorInstance.onAjaxComplete(xhr);
                            }
                        }
                    }
                    catch (e) {
                        var exceptionText = Microsoft.ApplicationInsights.Util.dump(e);
                        if (!exceptionText || exceptionText.toLowerCase().indexOf("c00c023f") == -1) {
                            ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedMonitorAjaxRSC, "Failed to monitor XMLHttpRequest 'readystatechange' event handler, monitoring data for this ajax call may be incorrect.", {
                                ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(xhr),
                                exception: Microsoft.ApplicationInsights.Util.dump(e)
                            }));
                        }
                    }
                });
            };
            AjaxMonitor.prototype.onAjaxComplete = function (xhr) {
                xhr.ajaxData.responseFinishedTime = ApplicationInsights.dateTime.Now();
                xhr.ajaxData.status = xhr.status;
                xhr.ajaxData.CalculateMetrics();
                if (xhr.ajaxData.ajaxTotalDuration < 0) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedMonitorAjaxDur, "Failed to calculate the duration of the ajax call, monitoring data for this ajax call won't be sent.", {
                        ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(xhr),
                        requestSentTime: xhr.ajaxData.requestSentTime,
                        responseFinishedTime: xhr.ajaxData.responseFinishedTime
                    }));
                }
                else {
                    this.appInsights.trackAjax(xhr.ajaxData.id, xhr.ajaxData.getAbsoluteUrl(), xhr.ajaxData.getPathName(), xhr.ajaxData.ajaxTotalDuration, (+(xhr.ajaxData.status)) >= 200 && (+(xhr.ajaxData.status)) < 400, +xhr.ajaxData.status, xhr.ajaxData.method);
                    xhr.ajaxData = null;
                }
            };
            AjaxMonitor.instrumentedByAppInsightsName = "InstrumentedByAppInsights";
            AjaxMonitor.DisabledPropertyName = "Microsoft_ApplicationInsights_BypassAjaxInstrumentation";
            return AjaxMonitor;
        })();
        ApplicationInsights.AjaxMonitor = AjaxMonitor;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var HashCodeScoreGenerator = (function () {
            function HashCodeScoreGenerator() {
            }
            HashCodeScoreGenerator.prototype.getHashCodeScore = function (key) {
                var score = this.getHashCode(key) / HashCodeScoreGenerator.INT_MAX_VALUE;
                return score * 100;
            };
            HashCodeScoreGenerator.prototype.getHashCode = function (input) {
                if (input == "") {
                    return 0;
                }
                while (input.length < HashCodeScoreGenerator.MIN_INPUT_LENGTH) {
                    input = input.concat(input);
                }
                var hash = 5381;
                for (var i = 0; i < input.length; ++i) {
                    hash = ((hash << 5) + hash) + input.charCodeAt(i);
                    hash = hash & hash;
                }
                return Math.abs(hash);
            };
            HashCodeScoreGenerator.INT_MAX_VALUE = 2147483647;
            HashCodeScoreGenerator.MIN_INPUT_LENGTH = 8;
            return HashCodeScoreGenerator;
        })();
        ApplicationInsights.HashCodeScoreGenerator = HashCodeScoreGenerator;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="logging.ts" />
/// <reference path="util.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        (function (FieldType) {
            FieldType[FieldType["Default"] = 0] = "Default";
            FieldType[FieldType["Required"] = 1] = "Required";
            FieldType[FieldType["Array"] = 2] = "Array";
            FieldType[FieldType["Hidden"] = 4] = "Hidden";
        })(ApplicationInsights.FieldType || (ApplicationInsights.FieldType = {}));
        var FieldType = ApplicationInsights.FieldType;
        ;
        var Serializer = (function () {
            function Serializer() {
            }
            Serializer.serialize = function (input) {
                var output = Serializer._serializeObject(input, "root");
                return JSON.stringify(output);
            };
            Serializer._serializeObject = function (source, name) {
                var circularReferenceCheck = "__aiCircularRefCheck";
                var output = {};
                if (!source) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_CannotSerializeObject, "cannot serialize object because it is null or undefined", { name: name }));
                    return output;
                }
                if (source[circularReferenceCheck]) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_CircularReferenceDetected, "Circular reference detected while serializing object", { name: name }));
                    return output;
                }
                if (!source.aiDataContract) {
                    if (name === "measurements") {
                        output = Serializer._serializeStringMap(source, "number", name);
                    }
                    else if (name === "properties") {
                        output = Serializer._serializeStringMap(source, "string", name);
                    }
                    else if (name === "tags") {
                        output = Serializer._serializeStringMap(source, "string", name);
                    }
                    else if (ApplicationInsights.Util.isArray(source)) {
                        output = Serializer._serializeArray(source, name);
                    }
                    else {
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_CannotSerializeObjectNonSerializable, "Attempting to serialize an object which does not implement ISerializable", { name: name }));
                        try {
                            JSON.stringify(source);
                            output = source;
                        }
                        catch (e) {
                            ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, e && typeof e.toString === 'function' ? e.toString() : "Error serializing object");
                        }
                    }
                    return output;
                }
                source[circularReferenceCheck] = true;
                for (var field in source.aiDataContract) {
                    var contract = source.aiDataContract[field];
                    var isRequired = (typeof contract === "function") ? (contract() & FieldType.Required) : (contract & FieldType.Required);
                    var isHidden = (typeof contract === "function") ? (contract() & FieldType.Hidden) : (contract & FieldType.Hidden);
                    var isArray = contract & FieldType.Array;
                    var isPresent = source[field] !== undefined;
                    var isObject = typeof source[field] === "object" && source[field] !== null;
                    if (isRequired && !isPresent && !isArray) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_MissingRequiredFieldSpecification, "Missing required field specification. The field is required but not present on source", { field: field, name: name }));
                        continue;
                    }
                    if (isHidden) {
                        continue;
                    }
                    var value;
                    if (isObject) {
                        if (isArray) {
                            value = Serializer._serializeArray(source[field], field);
                        }
                        else {
                            value = Serializer._serializeObject(source[field], field);
                        }
                    }
                    else {
                        value = source[field];
                    }
                    if (value !== undefined) {
                        output[field] = value;
                    }
                }
                delete source[circularReferenceCheck];
                return output;
            };
            Serializer._serializeArray = function (sources, name) {
                var output = undefined;
                if (!!sources) {
                    if (!ApplicationInsights.Util.isArray(sources)) {
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_ItemNotInArray, "This field was specified as an array in the contract but the item is not an array.\r\n", { name: name }));
                    }
                    else {
                        output = [];
                        for (var i = 0; i < sources.length; i++) {
                            var source = sources[i];
                            var item = Serializer._serializeObject(source, name + "[" + i + "]");
                            output.push(item);
                        }
                    }
                }
                return output;
            };
            Serializer._serializeStringMap = function (map, expectedType, name) {
                var output = undefined;
                if (map) {
                    output = {};
                    for (var field in map) {
                        var value = map[field];
                        if (expectedType === "string") {
                            if (value === undefined) {
                                output[field] = "undefined";
                            }
                            else if (value === null) {
                                output[field] = "null";
                            }
                            else if (!value.toString) {
                                output[field] = "invalid field: toString() is not defined.";
                            }
                            else {
                                output[field] = value.toString();
                            }
                        }
                        else if (expectedType === "number") {
                            if (value === undefined) {
                                output[field] = "undefined";
                            }
                            else if (value === null) {
                                output[field] = "null";
                            }
                            else {
                                var num = parseFloat(value);
                                if (isNaN(num)) {
                                    output[field] = "NaN";
                                }
                                else {
                                    output[field] = num;
                                }
                            }
                        }
                        else {
                            output[field] = "invalid field: " + name + " is of unknown type.";
                            ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, output[field]);
                        }
                    }
                }
                return output;
            };
            return Serializer;
        })();
        ApplicationInsights.Serializer = Serializer;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Telemetry;
    (function (Telemetry) {
        "use strict";
        var Base = (function () {
            function Base() {
            }
            return Base;
        })();
        Telemetry.Base = Base;
    })(Telemetry = Microsoft.Telemetry || (Microsoft.Telemetry = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="Base.ts" />
var Microsoft;
(function (Microsoft) {
    var Telemetry;
    (function (Telemetry) {
        "use strict";
        var Envelope = (function () {
            function Envelope() {
                this.ver = 1;
                this.sampleRate = 100.0;
                this.tags = {};
            }
            return Envelope;
        })();
        Telemetry.Envelope = Envelope;
    })(Telemetry = Microsoft.Telemetry || (Microsoft.Telemetry = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../../JavaScriptSDK.Interfaces/Contracts/Generated/Envelope.ts" />
/// <reference path="../../../JavaScriptSDK.Interfaces/Contracts/Generated/Base.ts" />
/// <reference path="../../Util.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            var Common;
            (function (Common) {
                "use strict";
                var Envelope = (function (_super) {
                    __extends(Envelope, _super);
                    function Envelope(data, name) {
                        var _this = this;
                        _super.call(this);
                        this.name = Common.DataSanitizer.sanitizeString(name) || ApplicationInsights.Util.NotSpecified;
                        this.data = data;
                        this.time = ApplicationInsights.Util.toISOStringForIE8(new Date());
                        this.aiDataContract = {
                            time: ApplicationInsights.FieldType.Required,
                            iKey: ApplicationInsights.FieldType.Required,
                            name: ApplicationInsights.FieldType.Required,
                            sampleRate: function () {
                                return (_this.sampleRate == 100) ? ApplicationInsights.FieldType.Hidden : ApplicationInsights.FieldType.Required;
                            },
                            tags: ApplicationInsights.FieldType.Required,
                            data: ApplicationInsights.FieldType.Required,
                        };
                    }
                    return Envelope;
                })(Microsoft.Telemetry.Envelope);
                Common.Envelope = Envelope;
            })(Common = Telemetry.Common || (Telemetry.Common = {}));
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../../JavaScriptSDK.Interfaces/Contracts/Generated/Base.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            var Common;
            (function (Common) {
                "use strict";
                var Base = (function (_super) {
                    __extends(Base, _super);
                    function Base() {
                        _super.apply(this, arguments);
                        this.aiDataContract = {};
                    }
                    return Base;
                })(Microsoft.Telemetry.Base);
                Common.Base = Base;
            })(Common = Telemetry.Common || (Telemetry.Common = {}));
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    var ContextTagKeys = (function () {
        function ContextTagKeys() {
            this.applicationVersion = "ai.application.ver";
            this.applicationBuild = "ai.application.build";
            this.applicationTypeId = "ai.application.typeId";
            this.applicationId = "ai.application.applicationId";
            this.deviceId = "ai.device.id";
            this.deviceIp = "ai.device.ip";
            this.deviceLanguage = "ai.device.language";
            this.deviceLocale = "ai.device.locale";
            this.deviceModel = "ai.device.model";
            this.deviceNetwork = "ai.device.network";
            this.deviceNetworkName = "ai.device.networkName";
            this.deviceOEMName = "ai.device.oemName";
            this.deviceOS = "ai.device.os";
            this.deviceOSVersion = "ai.device.osVersion";
            this.deviceRoleInstance = "ai.device.roleInstance";
            this.deviceRoleName = "ai.device.roleName";
            this.deviceScreenResolution = "ai.device.screenResolution";
            this.deviceType = "ai.device.type";
            this.deviceMachineName = "ai.device.machineName";
            this.deviceVMName = "ai.device.vmName";
            this.locationIp = "ai.location.ip";
            this.operationId = "ai.operation.id";
            this.operationName = "ai.operation.name";
            this.operationParentId = "ai.operation.parentId";
            this.operationRootId = "ai.operation.rootId";
            this.operationSyntheticSource = "ai.operation.syntheticSource";
            this.operationIsSynthetic = "ai.operation.isSynthetic";
            this.operationCorrelationVector = "ai.operation.correlationVector";
            this.sessionId = "ai.session.id";
            this.sessionIsFirst = "ai.session.isFirst";
            this.sessionIsNew = "ai.session.isNew";
            this.userAccountAcquisitionDate = "ai.user.accountAcquisitionDate";
            this.userAccountId = "ai.user.accountId";
            this.userAgent = "ai.user.userAgent";
            this.userId = "ai.user.id";
            this.userStoreRegion = "ai.user.storeRegion";
            this.userAuthUserId = "ai.user.authUserId";
            this.userAnonymousUserAcquisitionDate = "ai.user.anonUserAcquisitionDate";
            this.userAuthenticatedUserAcquisitionDate = "ai.user.authUserAcquisitionDate";
            this.sampleRate = "ai.sample.sampleRate";
            this.cloudName = "ai.cloud.name";
            this.cloudRoleVer = "ai.cloud.roleVer";
            this.cloudEnvironment = "ai.cloud.environment";
            this.cloudLocation = "ai.cloud.location";
            this.cloudDeploymentUnit = "ai.cloud.deploymentUnit";
            this.serverDeviceOS = "ai.serverDevice.os";
            this.serverDeviceOSVer = "ai.serverDevice.osVer";
            this.internalSdkVersion = "ai.internal.sdkVersion";
            this.internalAgentVersion = "ai.internal.agentVersion";
            this.internalDataCollectorReceivedTime = "ai.internal.dataCollectorReceivedTime";
            this.internalProfileId = "ai.internal.profileId";
            this.internalProfileClassId = "ai.internal.profileClassId";
            this.internalAccountId = "ai.internal.accountId";
            this.internalApplicationName = "ai.internal.applicationName";
            this.internalInstrumentationKey = "ai.internal.instrumentationKey";
            this.internalTelemetryItemId = "ai.internal.telemetryItemId";
            this.internalApplicationType = "ai.internal.applicationType";
            this.internalRequestSource = "ai.internal.requestSource";
            this.internalFlowType = "ai.internal.flowType";
            this.internalIsAudit = "ai.internal.isAudit";
            this.internalTrackingSourceId = "ai.internal.trackingSourceId";
            this.internalTrackingType = "ai.internal.trackingType";
            this.internalIsDiagnosticExample = "ai.internal.isDiagnosticExample";
        }
        return ContextTagKeys;
    })();
    AI.ContextTagKeys = ContextTagKeys;
})(AI || (AI = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Context/IApplication.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var Application = (function () {
                function Application() {
                }
                return Application;
            })();
            Context.Application = Application;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Context/IDevice.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var Device = (function () {
                function Device() {
                    this.id = "browser";
                    this.type = "Browser";
                }
                return Device;
            })();
            Context.Device = Device;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Context/IInternal.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var Internal = (function () {
                function Internal() {
                    this.sdkVersion = "javascript:" + ApplicationInsights.Version;
                }
                return Internal;
            })();
            Context.Internal = Internal;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Context/ILocation.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var Location = (function () {
                function Location() {
                }
                return Location;
            })();
            Context.Location = Location;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../util.ts" />
/// <reference path="../../JavaScriptSDK.Interfaces/Context/IOperation.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var Operation = (function () {
                function Operation() {
                    this.id = ApplicationInsights.Util.newId();
                    if (window && window.location && window.location.pathname) {
                        this.name = window.location.pathname;
                    }
                }
                return Operation;
            })();
            Context.Operation = Operation;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="./HashCodeScoreGenerator.ts" />
/// <reference path="../JavaScriptSDK.Interfaces/Contracts/Generated/Envelope.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var SamplingScoreGenerator = (function () {
            function SamplingScoreGenerator() {
                this.hashCodeGeneragor = new ApplicationInsights.HashCodeScoreGenerator();
            }
            SamplingScoreGenerator.prototype.getSamplingScore = function (envelope) {
                var tagKeys = new AI.ContextTagKeys();
                var score = 0;
                if (envelope.tags[tagKeys.userId]) {
                    score = this.hashCodeGeneragor.getHashCodeScore(envelope.tags[tagKeys.userId]);
                }
                else if (envelope.tags[tagKeys.operationId]) {
                    score = this.hashCodeGeneragor.getHashCodeScore(envelope.tags[tagKeys.operationId]);
                }
                else {
                    score = Math.random();
                }
                return score;
            };
            return SamplingScoreGenerator;
        })();
        ApplicationInsights.SamplingScoreGenerator = SamplingScoreGenerator;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../SamplingScoreGenerator.ts" />
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/Envelope.ts" />
/// <reference path="../../JavaScriptSDK.Interfaces/Context/ISample.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var Sample = (function () {
                function Sample(sampleRate) {
                    this.INT_MAX_VALUE = 2147483647;
                    if (sampleRate > 100 || sampleRate < 0) {
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_SampleRateOutOfRange, "Sampling rate is out of range (0..100). Sampling will be disabled, you may be sending too much data which may affect your AI service level.", { samplingRate: sampleRate }));
                        this.sampleRate = 100;
                    }
                    this.sampleRate = sampleRate;
                    this.samplingScoreGenerator = new ApplicationInsights.SamplingScoreGenerator();
                }
                Sample.prototype.isSampledIn = function (envelope) {
                    if (this.sampleRate == 100)
                        return true;
                    var score = this.samplingScoreGenerator.getSamplingScore(envelope);
                    return score < this.sampleRate;
                };
                return Sample;
            })();
            Context.Sample = Sample;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    (function (SessionState) {
        SessionState[SessionState["Start"] = 0] = "Start";
        SessionState[SessionState["End"] = 1] = "End";
    })(AI.SessionState || (AI.SessionState = {}));
    var SessionState = AI.SessionState;
})(AI || (AI = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../util.ts" />
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/SessionState.ts"/>
/// <reference path="../../JavaScriptSDK.Interfaces/Context/ISession.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var Session = (function () {
                function Session() {
                }
                return Session;
            })();
            Context.Session = Session;
            var _SessionManager = (function () {
                function _SessionManager(config) {
                    if (!config) {
                        config = {};
                    }
                    if (!(typeof config.sessionExpirationMs === "function")) {
                        config.sessionExpirationMs = function () { return _SessionManager.acquisitionSpan; };
                    }
                    if (!(typeof config.sessionRenewalMs === "function")) {
                        config.sessionRenewalMs = function () { return _SessionManager.renewalSpan; };
                    }
                    this.config = config;
                    this.automaticSession = new Session();
                }
                _SessionManager.prototype.update = function () {
                    if (!this.automaticSession.id) {
                        this.initializeAutomaticSession();
                    }
                    var now = +new Date;
                    var acquisitionExpired = now - this.automaticSession.acquisitionDate > this.config.sessionExpirationMs();
                    var renewalExpired = now - this.automaticSession.renewalDate > this.config.sessionRenewalMs();
                    if (acquisitionExpired || renewalExpired) {
                        this.automaticSession.isFirst = undefined;
                        this.renew();
                    }
                    else {
                        this.automaticSession.renewalDate = +new Date;
                        this.setCookie(this.automaticSession.id, this.automaticSession.acquisitionDate, this.automaticSession.renewalDate);
                    }
                };
                _SessionManager.prototype.backup = function () {
                    this.setStorage(this.automaticSession.id, this.automaticSession.acquisitionDate, this.automaticSession.renewalDate);
                };
                _SessionManager.prototype.initializeAutomaticSession = function () {
                    var cookie = ApplicationInsights.Util.getCookie('ai_session');
                    if (cookie && typeof cookie.split === "function") {
                        this.initializeAutomaticSessionWithData(cookie);
                    }
                    else {
                        var storage = ApplicationInsights.Util.getStorage('ai_session');
                        if (storage) {
                            this.initializeAutomaticSessionWithData(storage);
                        }
                    }
                    if (!this.automaticSession.id) {
                        this.automaticSession.isFirst = true;
                        this.renew();
                    }
                };
                _SessionManager.prototype.initializeAutomaticSessionWithData = function (sessionData) {
                    var params = sessionData.split("|");
                    if (params.length > 0) {
                        this.automaticSession.id = params[0];
                    }
                    try {
                        if (params.length > 1) {
                            var acq = +params[1];
                            this.automaticSession.acquisitionDate = +new Date(acq);
                            this.automaticSession.acquisitionDate = this.automaticSession.acquisitionDate > 0 ? this.automaticSession.acquisitionDate : 0;
                        }
                        if (params.length > 2) {
                            var renewal = +params[2];
                            this.automaticSession.renewalDate = +new Date(renewal);
                            this.automaticSession.renewalDate = this.automaticSession.renewalDate > 0 ? this.automaticSession.renewalDate : 0;
                        }
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_ErrorParsingAISessionCookie, "Error parsing ai_session cookie, session will be reset: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                    }
                    if (this.automaticSession.renewalDate == 0) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_SessionRenewalDateIsZero, "AI session renewal date is 0, session will be reset."));
                    }
                };
                _SessionManager.prototype.renew = function () {
                    var now = +new Date;
                    this.automaticSession.id = ApplicationInsights.Util.newId();
                    this.automaticSession.acquisitionDate = now;
                    this.automaticSession.renewalDate = now;
                    this.setCookie(this.automaticSession.id, this.automaticSession.acquisitionDate, this.automaticSession.renewalDate);
                    if (!ApplicationInsights.Util.canUseLocalStorage()) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_BrowserDoesNotSupportLocalStorage, "Browser does not support local storage. Session durations will be inaccurate."));
                    }
                };
                _SessionManager.prototype.setCookie = function (guid, acq, renewal) {
                    var acquisitionExpiry = acq + this.config.sessionExpirationMs();
                    var renewalExpiry = renewal + this.config.sessionRenewalMs();
                    var cookieExpiry = new Date();
                    var cookie = [guid, acq, renewal];
                    if (acquisitionExpiry < renewalExpiry) {
                        cookieExpiry.setTime(acquisitionExpiry);
                    }
                    else {
                        cookieExpiry.setTime(renewalExpiry);
                    }
                    var cookieDomnain = this.config.cookieDomain ? this.config.cookieDomain() : null;
                    ApplicationInsights.Util.setCookie('ai_session', cookie.join('|') + ';expires=' + cookieExpiry.toUTCString(), cookieDomnain);
                };
                _SessionManager.prototype.setStorage = function (guid, acq, renewal) {
                    ApplicationInsights.Util.setStorage('ai_session', [guid, acq, renewal].join('|'));
                };
                _SessionManager.acquisitionSpan = 86400000;
                _SessionManager.renewalSpan = 1800000;
                return _SessionManager;
            })();
            Context._SessionManager = _SessionManager;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../util.ts" />
/// <reference path="../../JavaScriptSDK.Interfaces/Context/IUser.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Context;
        (function (Context) {
            "use strict";
            var User = (function () {
                function User(config) {
                    var cookie = ApplicationInsights.Util.getCookie(User.userCookieName);
                    if (cookie) {
                        var params = cookie.split(User.cookieSeparator);
                        if (params.length > 0) {
                            this.id = params[0];
                        }
                    }
                    this.config = config;
                    if (!this.id) {
                        this.id = ApplicationInsights.Util.newId();
                        var date = new Date();
                        var acqStr = ApplicationInsights.Util.toISOStringForIE8(date);
                        this.accountAcquisitionDate = acqStr;
                        date.setTime(date.getTime() + 31536000000);
                        var newCookie = [this.id, acqStr];
                        var cookieDomain = this.config.cookieDomain ? this.config.cookieDomain() : undefined;
                        ApplicationInsights.Util.setCookie(User.userCookieName, newCookie.join(User.cookieSeparator) + ';expires=' + date.toUTCString(), cookieDomain);
                        ApplicationInsights.Util.removeStorage('ai_session');
                    }
                    this.accountId = config.accountId ? config.accountId() : undefined;
                    var authCookie = ApplicationInsights.Util.getCookie(User.authUserCookieName);
                    if (authCookie) {
                        authCookie = decodeURI(authCookie);
                        var authCookieString = authCookie.split(User.cookieSeparator);
                        if (authCookieString[0]) {
                            this.authenticatedId = authCookieString[0];
                        }
                        if (authCookieString.length > 1 && authCookieString[1]) {
                            this.accountId = authCookieString[1];
                        }
                    }
                }
                User.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId) {
                    var isInvalidInput = !this.validateUserInput(authenticatedUserId) || (accountId && !this.validateUserInput(accountId));
                    if (isInvalidInput) {
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_SetAuthContextFailedAccountName, "Setting auth user context failed. " +
                            "User auth/account id should be of type string, and not contain commas, semi-colons, equal signs, spaces, or vertical-bars."));
                        return;
                    }
                    this.authenticatedId = authenticatedUserId;
                    var authCookie = this.authenticatedId;
                    if (accountId) {
                        this.accountId = accountId;
                        authCookie = [this.authenticatedId, this.accountId].join(User.cookieSeparator);
                    }
                    ApplicationInsights.Util.setCookie(User.authUserCookieName, encodeURI(authCookie), this.config.cookieDomain());
                };
                User.prototype.clearAuthenticatedUserContext = function () {
                    this.authenticatedId = null;
                    this.accountId = null;
                    ApplicationInsights.Util.deleteCookie(User.authUserCookieName);
                };
                User.prototype.validateUserInput = function (id) {
                    if (typeof id !== 'string' ||
                        !id ||
                        id.match(/,|;|=| |\|/)) {
                        return false;
                    }
                    return true;
                };
                User.cookieSeparator = '|';
                User.userCookieName = 'ai_user';
                User.authUserCookieName = 'ai_authUser';
                return User;
            })();
            Context.User = User;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var DataLossAnalyzer = (function () {
            function DataLossAnalyzer() {
            }
            DataLossAnalyzer.reset = function () {
                if (DataLossAnalyzer.isEnabled()) {
                    ApplicationInsights.Util.setSessionStorage(DataLossAnalyzer.ITEMS_QUEUED_KEY, "0");
                    DataLossAnalyzer.itemsRestoredFromSessionBuffer = 0;
                }
            };
            DataLossAnalyzer.isEnabled = function () {
                return DataLossAnalyzer.enabled &&
                    DataLossAnalyzer.appInsights != null &&
                    DataLossAnalyzer.appInsights.context._sender._XMLHttpRequestSupported &&
                    ApplicationInsights.Util.canUseSessionStorage();
            };
            DataLossAnalyzer.getIssuesReported = function () {
                var result = (!DataLossAnalyzer.isEnabled() || isNaN(+ApplicationInsights.Util.getSessionStorage(DataLossAnalyzer.ISSUES_REPORTED_KEY))) ?
                    0 :
                    +ApplicationInsights.Util.getSessionStorage(DataLossAnalyzer.ISSUES_REPORTED_KEY);
                return result;
            };
            DataLossAnalyzer.incrementItemsQueued = function () {
                try {
                    if (DataLossAnalyzer.isEnabled()) {
                        var itemsQueued = DataLossAnalyzer.getNumberOfLostItems();
                        ++itemsQueued;
                        ApplicationInsights.Util.setSessionStorage(DataLossAnalyzer.ITEMS_QUEUED_KEY, itemsQueued.toString());
                    }
                }
                catch (e) { }
            };
            DataLossAnalyzer.decrementItemsQueued = function (countOfItemsSentSuccessfully) {
                try {
                    if (DataLossAnalyzer.isEnabled()) {
                        var itemsQueued = DataLossAnalyzer.getNumberOfLostItems();
                        itemsQueued -= countOfItemsSentSuccessfully;
                        if (itemsQueued < 0)
                            itemsQueued = 0;
                        ApplicationInsights.Util.setSessionStorage(DataLossAnalyzer.ITEMS_QUEUED_KEY, itemsQueued.toString());
                    }
                }
                catch (e) { }
            };
            DataLossAnalyzer.getNumberOfLostItems = function () {
                var result = 0;
                try {
                    if (DataLossAnalyzer.isEnabled()) {
                        result = isNaN(+ApplicationInsights.Util.getSessionStorage(DataLossAnalyzer.ITEMS_QUEUED_KEY)) ?
                            0 :
                            +ApplicationInsights.Util.getSessionStorage(DataLossAnalyzer.ITEMS_QUEUED_KEY);
                    }
                }
                catch (e) {
                    result = 0;
                }
                return result;
            };
            DataLossAnalyzer.reportLostItems = function () {
                try {
                    if (DataLossAnalyzer.isEnabled() &&
                        DataLossAnalyzer.getIssuesReported() < DataLossAnalyzer.LIMIT_PER_SESSION &&
                        DataLossAnalyzer.getNumberOfLostItems() > 0) {
                        var lostItems = DataLossAnalyzer.getNumberOfLostItems() - DataLossAnalyzer.itemsRestoredFromSessionBuffer;
                        DataLossAnalyzer.appInsights.trackTrace("AI (Internal): Internal report DATALOSS:\"" + lostItems + "\"", null);
                        DataLossAnalyzer.appInsights.flush();
                        var issuesReported = DataLossAnalyzer.getIssuesReported();
                        ++issuesReported;
                        ApplicationInsights.Util.setSessionStorage(DataLossAnalyzer.ISSUES_REPORTED_KEY, issuesReported.toString());
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedToReportDataLoss, "Failed to report data loss: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
                finally {
                    try {
                        DataLossAnalyzer.reset();
                    }
                    catch (e) { }
                }
            };
            DataLossAnalyzer.enabled = false;
            DataLossAnalyzer.itemsRestoredFromSessionBuffer = 0;
            DataLossAnalyzer.LIMIT_PER_SESSION = 10;
            DataLossAnalyzer.ITEMS_QUEUED_KEY = "AI_itemsQueued";
            DataLossAnalyzer.ISSUES_REPORTED_KEY = "AI_lossIssuesReported";
            return DataLossAnalyzer;
        })();
        ApplicationInsights.DataLossAnalyzer = DataLossAnalyzer;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="serializer.ts" />
/// <reference path="Telemetry/Common/Envelope.ts"/>
/// <reference path="Telemetry/Common/Base.ts" />
/// <reference path="../JavaScriptSDK.Interfaces/Contracts/Generated/ContextTagKeys.ts"/>
/// <reference path="Context/Application.ts"/>
/// <reference path="Context/Device.ts"/>
/// <reference path="Context/Internal.ts"/>
/// <reference path="Context/Location.ts"/>
/// <reference path="Context/Operation.ts"/>
/// <reference path="Context/Sample.ts"/>
/// <reference path="Context/Session.ts"/>
/// <reference path="Context/User.ts"/>
/// <reference path="ajax/ajax.ts"/>
/// <reference path="DataLossAnalyzer.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var ArraySendBuffer = (function () {
            function ArraySendBuffer(config) {
                this._config = config;
                this._buffer = [];
            }
            ArraySendBuffer.prototype.enqueue = function (payload) {
                this._buffer.push(payload);
            };
            ArraySendBuffer.prototype.count = function () {
                return this._buffer.length;
            };
            ArraySendBuffer.prototype.clear = function () {
                this._buffer.length = 0;
            };
            ArraySendBuffer.prototype.getItems = function () {
                return this._buffer.slice(0);
            };
            ArraySendBuffer.prototype.batchPayloads = function (payload) {
                if (payload && payload.length > 0) {
                    var batch = this._config.emitLineDelimitedJson() ?
                        payload.join("\n") :
                        "[" + payload.join(",") + "]";
                    return batch;
                }
                return null;
            };
            ArraySendBuffer.prototype.markAsSent = function (payload) {
                this.clear();
            };
            ArraySendBuffer.prototype.clearSent = function (payload) {
                this.clear();
            };
            return ArraySendBuffer;
        })();
        ApplicationInsights.ArraySendBuffer = ArraySendBuffer;
        var SessionStorageSendBuffer = (function () {
            function SessionStorageSendBuffer(config) {
                this._config = config;
                var bufferItems = this.getBuffer(SessionStorageSendBuffer.BUFFER_KEY);
                var notDeliveredItems = this.getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                this._buffer = bufferItems.concat(notDeliveredItems);
                ApplicationInsights.DataLossAnalyzer.itemsRestoredFromSessionBuffer = this._buffer.length;
                this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, this._buffer);
                this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
            }
            SessionStorageSendBuffer.prototype.enqueue = function (payload) {
                this._buffer.push(payload);
                this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, this._buffer);
            };
            SessionStorageSendBuffer.prototype.count = function () {
                return this._buffer.length;
            };
            SessionStorageSendBuffer.prototype.clear = function () {
                this._buffer.length = 0;
                this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, []);
                this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
            };
            SessionStorageSendBuffer.prototype.getItems = function () {
                return this._buffer.slice(0);
            };
            SessionStorageSendBuffer.prototype.batchPayloads = function (payload) {
                if (payload && payload.length > 0) {
                    var batch = this._config.emitLineDelimitedJson() ?
                        payload.join("\n") :
                        "[" + payload.join(",") + "]";
                    return batch;
                }
                return null;
            };
            SessionStorageSendBuffer.prototype.markAsSent = function (payload) {
                var sentElements = this.getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                sentElements = sentElements.concat(payload);
                this._buffer = this.removePayloadsFromBuffer(payload, this._buffer);
                this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, this._buffer);
                this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
            };
            SessionStorageSendBuffer.prototype.clearSent = function (payload) {
                var sentElements = this.getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                sentElements = this.removePayloadsFromBuffer(payload, sentElements);
                this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
            };
            SessionStorageSendBuffer.prototype.removePayloadsFromBuffer = function (payloads, buffer) {
                var remaining = [];
                for (var i in buffer) {
                    var contains = false;
                    for (var j in payloads) {
                        if (payloads[j] === buffer[i]) {
                            contains = true;
                            break;
                        }
                    }
                    if (!contains) {
                        remaining.push(buffer[i]);
                    }
                }
                ;
                return remaining;
            };
            SessionStorageSendBuffer.prototype.getBuffer = function (key) {
                try {
                    var bufferJson = ApplicationInsights.Util.getSessionStorage(key);
                    if (bufferJson) {
                        var buffer = JSON.parse(bufferJson);
                        if (buffer) {
                            return buffer;
                        }
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailToRestoreStorageBuffer, " storage key: " + key + ", " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
                return [];
            };
            SessionStorageSendBuffer.prototype.setBuffer = function (key, buffer) {
                try {
                    var bufferJson = JSON.stringify(buffer);
                    ApplicationInsights.Util.setSessionStorage(key, bufferJson);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailToSetStorageBuffer, " storage key: " + key + ", " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            SessionStorageSendBuffer.BUFFER_KEY = "AI_buffer";
            SessionStorageSendBuffer.SENT_BUFFER_KEY = "AI_sentBuffer";
            return SessionStorageSendBuffer;
        })();
        ApplicationInsights.SessionStorageSendBuffer = SessionStorageSendBuffer;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="serializer.ts" />
/// <reference path="Telemetry/Common/Envelope.ts"/>
/// <reference path="Telemetry/Common/Base.ts" />
/// <reference path="../JavaScriptSDK.Interfaces/Contracts/Generated/ContextTagKeys.ts"/>
/// <reference path="../JavaScriptSDK.Interfaces/Contracts/Generated/Envelope.ts" />
/// <reference path="Context/Application.ts"/>
/// <reference path="Context/Device.ts"/>
/// <reference path="Context/Internal.ts"/>
/// <reference path="Context/Location.ts"/>
/// <reference path="Context/Operation.ts"/>
/// <reference path="Context/Sample.ts"/>
/// <reference path="Context/Session.ts"/>
/// <reference path="Context/User.ts"/>
/// <reference path="ajax/ajax.ts"/>
/// <reference path="DataLossAnalyzer.ts"/>
/// <reference path="SendBuffer.ts"/>
;
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var Sender = (function () {
            function Sender(config) {
                this._XMLHttpRequestSupported = false;
                this._lastSend = 0;
                this._config = config;
                this._sender = null;
                this._buffer = (ApplicationInsights.Util.canUseSessionStorage() && this._config.enableSessionStorageBuffer())
                    ? new ApplicationInsights.SessionStorageSendBuffer(config) : new ApplicationInsights.ArraySendBuffer(config);
                if (typeof XMLHttpRequest != "undefined") {
                    var testXhr = new XMLHttpRequest();
                    if ("withCredentials" in testXhr) {
                        this._sender = this._xhrSender;
                        this._XMLHttpRequestSupported = true;
                    }
                    else if (typeof XDomainRequest !== "undefined") {
                        this._sender = this._xdrSender;
                    }
                }
            }
            Sender.prototype.send = function (envelope) {
                var _this = this;
                try {
                    if (this._config.disableTelemetry()) {
                        return;
                    }
                    if (!envelope) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_CannotSendEmptyTelemetry, "Cannot send empty telemetry"));
                        return;
                    }
                    if (!this._sender) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_SenderNotInitialized, "Sender was not initialized"));
                        return;
                    }
                    var payload = ApplicationInsights.Serializer.serialize(envelope);
                    var bufferPayload = this._buffer.getItems();
                    var batch = this._buffer.batchPayloads(bufferPayload);
                    if (batch && (batch.length + payload.length > this._config.maxBatchSizeInBytes())) {
                        this.triggerSend();
                    }
                    this._buffer.enqueue(payload);
                    if (!this._timeoutHandle) {
                        this._timeoutHandle = setTimeout(function () {
                            _this._timeoutHandle = null;
                            _this.triggerSend();
                        }, this._config.maxBatchInterval());
                    }
                    ApplicationInsights.DataLossAnalyzer.incrementItemsQueued();
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedAddingTelemetryToBuffer, "Failed adding telemetry to the sender's buffer, some telemetry will be lost: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            Sender.prototype._getSizeInBytes = function (list) {
                var size = 0;
                if (list && list.length) {
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        if (item && item.length) {
                            size += item.length;
                        }
                    }
                }
                return size;
            };
            Sender.prototype.triggerSend = function (async) {
                var isAsync = true;
                if (typeof async === 'boolean') {
                    isAsync = async;
                }
                try {
                    if (!this._config.disableTelemetry()) {
                        if (this._buffer.count() > 0) {
                            var payload = this._buffer.getItems();
                            this._sender(payload, isAsync);
                        }
                        this._lastSend = +new Date;
                    }
                    else {
                        this._buffer.clear();
                    }
                    clearTimeout(this._timeoutHandle);
                    this._timeoutHandle = null;
                }
                catch (e) {
                    if (!ApplicationInsights.Util.getIEVersion() || ApplicationInsights.Util.getIEVersion() > 9) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TransmissionFailed, "Telemetry transmission failed, some telemetry will be lost: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                    }
                }
            };
            Sender.prototype._xhrSender = function (payload, isAsync) {
                var _this = this;
                var xhr = new XMLHttpRequest();
                xhr[ApplicationInsights.AjaxMonitor.DisabledPropertyName] = true;
                xhr.open("POST", this._config.endpointUrl(), isAsync);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = function () { return _this._xhrReadyStateChange(xhr, payload, payload.length); };
                xhr.onerror = function (event) { return _this._onError(payload, xhr.responseText || xhr.response || "", event); };
                var batch = this._buffer.batchPayloads(payload);
                xhr.send(batch);
                this._buffer.markAsSent(payload);
            };
            Sender.prototype._xdrSender = function (payload, isAsync) {
                var _this = this;
                var xdr = new XDomainRequest();
                xdr.onload = function () { return _this._xdrOnLoad(xdr, payload); };
                xdr.onerror = function (event) { return _this._onError(payload, xdr.responseText || "", event); };
                xdr.open('POST', this._config.endpointUrl());
                var batch = this._buffer.batchPayloads(payload);
                xdr.send(batch);
                this._buffer.markAsSent(payload);
            };
            Sender.prototype._xhrReadyStateChange = function (xhr, payload, countOfItemsInPayload) {
                if (xhr.readyState === 4) {
                    if ((xhr.status < 200 || xhr.status >= 300) && xhr.status !== 0) {
                        this._onError(payload, xhr.responseText || xhr.response || "");
                    }
                    else {
                        this._onSuccess(payload, countOfItemsInPayload);
                    }
                }
            };
            Sender.prototype._xdrOnLoad = function (xdr, payload) {
                if (xdr && (xdr.responseText + "" === "200" || xdr.responseText === "")) {
                    this._onSuccess(payload, 0);
                }
                else {
                    this._onError(payload, xdr && xdr.responseText || "");
                }
            };
            Sender.prototype._onError = function (payload, message, event) {
                ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_OnError, "Failed to send telemetry.", { message: message }));
                this._buffer.clearSent(payload);
            };
            Sender.prototype._onSuccess = function (payload, countOfItemsInPayload) {
                ApplicationInsights.DataLossAnalyzer.decrementItemsQueued(countOfItemsInPayload);
                this._buffer.clearSent(payload);
            };
            return Sender;
        })();
        ApplicationInsights.Sender = Sender;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="./HashCodeScoreGenerator.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var SplitTest = (function () {
            function SplitTest() {
                this.hashCodeGeneragor = new ApplicationInsights.HashCodeScoreGenerator();
            }
            SplitTest.prototype.isEnabled = function (key, percentEnabled) {
                return this.hashCodeGeneragor.getHashCodeScore(key) < percentEnabled;
            };
            return SplitTest;
        })();
        ApplicationInsights.SplitTest = SplitTest;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Telemetry;
    (function (Telemetry) {
        "use strict";
        var Domain = (function () {
            function Domain() {
            }
            return Domain;
        })();
        Telemetry.Domain = Domain;
    })(Telemetry = Microsoft.Telemetry || (Microsoft.Telemetry = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    (function (SeverityLevel) {
        SeverityLevel[SeverityLevel["Verbose"] = 0] = "Verbose";
        SeverityLevel[SeverityLevel["Information"] = 1] = "Information";
        SeverityLevel[SeverityLevel["Warning"] = 2] = "Warning";
        SeverityLevel[SeverityLevel["Error"] = 3] = "Error";
        SeverityLevel[SeverityLevel["Critical"] = 4] = "Critical";
    })(AI.SeverityLevel || (AI.SeverityLevel = {}));
    var SeverityLevel = AI.SeverityLevel;
})(AI || (AI = {}));
/// <reference path="Domain.ts" />
/// <reference path="SeverityLevel.ts" />
var AI;
(function (AI) {
    "use strict";
    var MessageData = (function (_super) {
        __extends(MessageData, _super);
        function MessageData() {
            _super.call(this);
            this.ver = 2;
            this.properties = {};
            _super.call(this);
        }
        return MessageData;
    })(Microsoft.Telemetry.Domain);
    AI.MessageData = MessageData;
})(AI || (AI = {}));
/// <reference path="../../logging.ts" />
/// <reference path="../../Util.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            var Common;
            (function (Common) {
                "use strict";
                var DataSanitizer = (function () {
                    function DataSanitizer() {
                    }
                    DataSanitizer.sanitizeKeyAndAddUniqueness = function (key, map) {
                        var origLength = key.length;
                        var field = DataSanitizer.sanitizeKey(key);
                        if (field.length !== origLength) {
                            var i = 0;
                            var uniqueField = field;
                            while (map[uniqueField] !== undefined) {
                                i++;
                                uniqueField = field.substring(0, DataSanitizer.MAX_NAME_LENGTH - 3) + DataSanitizer.padNumber(i);
                            }
                            field = uniqueField;
                        }
                        return field;
                    };
                    DataSanitizer.sanitizeKey = function (name) {
                        if (name) {
                            name = ApplicationInsights.Util.trim(name.toString());
                            if (name.search(/[^0-9a-zA-Z-._()\/ ]/g) >= 0) {
                                name = name.replace(/[^0-9a-zA-Z-._()\/ ]/g, "_");
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_IllegalCharsInName, "name contains illegal characters. Illegal characters have been replaced with '_'.", { newName: name }));
                            }
                            if (name.length > DataSanitizer.MAX_NAME_LENGTH) {
                                name = name.substring(0, DataSanitizer.MAX_NAME_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_NameTooLong, "name is too long.  It has been truncated to " + DataSanitizer.MAX_NAME_LENGTH + " characters.", { name: name }));
                            }
                        }
                        return name;
                    };
                    DataSanitizer.sanitizeString = function (value) {
                        if (value) {
                            value = ApplicationInsights.Util.trim(value);
                            if (value.toString().length > DataSanitizer.MAX_STRING_LENGTH) {
                                value = value.toString().substring(0, DataSanitizer.MAX_STRING_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_StringValueTooLong, "string value is too long. It has been truncated to " + DataSanitizer.MAX_STRING_LENGTH + " characters.", { value: value }));
                            }
                        }
                        return value;
                    };
                    DataSanitizer.sanitizeUrl = function (url) {
                        if (url) {
                            url = ApplicationInsights.Util.trim(url);
                            if (url.length > DataSanitizer.MAX_URL_LENGTH) {
                                url = url.substring(0, DataSanitizer.MAX_URL_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_UrlTooLong, "url is too long, it has been trucated to " + DataSanitizer.MAX_URL_LENGTH + " characters.", { url: url }));
                            }
                        }
                        return url;
                    };
                    DataSanitizer.sanitizeMessage = function (message) {
                        if (message) {
                            if (message.length > DataSanitizer.MAX_MESSAGE_LENGTH) {
                                message = message.substring(0, DataSanitizer.MAX_MESSAGE_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_MessageTruncated, "message is too long, it has been trucated to " + DataSanitizer.MAX_MESSAGE_LENGTH + " characters.", { message: message }));
                            }
                        }
                        return message;
                    };
                    DataSanitizer.sanitizeException = function (exception) {
                        if (exception) {
                            if (exception.length > DataSanitizer.MAX_EXCEPTION_LENGTH) {
                                exception = exception.substring(0, DataSanitizer.MAX_EXCEPTION_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_ExceptionTruncated, "exception is too long, it has been trucated to " + DataSanitizer.MAX_EXCEPTION_LENGTH + " characters.", { exception: exception }));
                            }
                        }
                        return exception;
                    };
                    DataSanitizer.sanitizeProperties = function (properties) {
                        if (properties) {
                            var tempProps = {};
                            for (var prop in properties) {
                                var value = DataSanitizer.sanitizeString(properties[prop]);
                                prop = DataSanitizer.sanitizeKeyAndAddUniqueness(prop, tempProps);
                                tempProps[prop] = value;
                            }
                            properties = tempProps;
                        }
                        return properties;
                    };
                    DataSanitizer.sanitizeMeasurements = function (measurements) {
                        if (measurements) {
                            var tempMeasurements = {};
                            for (var measure in measurements) {
                                var value = measurements[measure];
                                measure = DataSanitizer.sanitizeKeyAndAddUniqueness(measure, tempMeasurements);
                                tempMeasurements[measure] = value;
                            }
                            measurements = tempMeasurements;
                        }
                        return measurements;
                    };
                    DataSanitizer.padNumber = function (num) {
                        var s = "00" + num;
                        return s.substr(s.length - 3);
                    };
                    DataSanitizer.MAX_NAME_LENGTH = 150;
                    DataSanitizer.MAX_STRING_LENGTH = 1024;
                    DataSanitizer.MAX_URL_LENGTH = 2048;
                    DataSanitizer.MAX_MESSAGE_LENGTH = 32768;
                    DataSanitizer.MAX_EXCEPTION_LENGTH = 32768;
                    return DataSanitizer;
                })();
                Common.DataSanitizer = DataSanitizer;
            })(Common = Telemetry.Common || (Telemetry.Common = {}));
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/MessageData.ts" />
/// <reference path="./Common/DataSanitizer.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var Trace = (function (_super) {
                __extends(Trace, _super);
                function Trace(message, properties) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: ApplicationInsights.FieldType.Required,
                        message: ApplicationInsights.FieldType.Required,
                        severityLevel: ApplicationInsights.FieldType.Default,
                        measurements: ApplicationInsights.FieldType.Default,
                        properties: ApplicationInsights.FieldType.Default
                    };
                    message = message || ApplicationInsights.Util.NotSpecified;
                    this.message = Telemetry.Common.DataSanitizer.sanitizeMessage(message);
                    this.properties = Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                }
                Trace.envelopeType = "Microsoft.ApplicationInsights.{0}.Message";
                Trace.dataType = "MessageData";
                return Trace;
            })(AI.MessageData);
            Telemetry.Trace = Trace;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="Domain.ts" />
var AI;
(function (AI) {
    "use strict";
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            _super.call(this);
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return EventData;
    })(Microsoft.Telemetry.Domain);
    AI.EventData = EventData;
})(AI || (AI = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/EventData.ts" />
/// <reference path="./Common/DataSanitizer.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var Event = (function (_super) {
                __extends(Event, _super);
                function Event(name, properties, measurements) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: ApplicationInsights.FieldType.Required,
                        name: ApplicationInsights.FieldType.Required,
                        properties: ApplicationInsights.FieldType.Default,
                        measurements: ApplicationInsights.FieldType.Default,
                    };
                    this.name = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeString(name) || ApplicationInsights.Util.NotSpecified;
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                }
                Event.envelopeType = "Microsoft.ApplicationInsights.{0}.Event";
                Event.dataType = "EventData";
                return Event;
            })(AI.EventData);
            Telemetry.Event = Event;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    var ExceptionDetails = (function () {
        function ExceptionDetails() {
            this.hasFullStack = true;
            this.parsedStack = [];
        }
        return ExceptionDetails;
    })();
    AI.ExceptionDetails = ExceptionDetails;
})(AI || (AI = {}));
/// <reference path="Domain.ts" />
/// <reference path="SeverityLevel.ts" />
/// <reference path="ExceptionDetails.ts"/>
var AI;
(function (AI) {
    "use strict";
    var ExceptionData = (function (_super) {
        __extends(ExceptionData, _super);
        function ExceptionData() {
            _super.call(this);
            this.ver = 2;
            this.exceptions = [];
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return ExceptionData;
    })(Microsoft.Telemetry.Domain);
    AI.ExceptionData = ExceptionData;
})(AI || (AI = {}));
var AI;
(function (AI) {
    "use strict";
    var StackFrame = (function () {
        function StackFrame() {
        }
        return StackFrame;
    })();
    AI.StackFrame = StackFrame;
})(AI || (AI = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/ExceptionData.ts" />
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/StackFrame.ts" />
/// <reference path="./Common/DataSanitizer.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var Exception = (function (_super) {
                __extends(Exception, _super);
                function Exception(exception, handledAt, properties, measurements, severityLevel) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: ApplicationInsights.FieldType.Required,
                        handledAt: ApplicationInsights.FieldType.Required,
                        exceptions: ApplicationInsights.FieldType.Required,
                        severityLevel: ApplicationInsights.FieldType.Default,
                        properties: ApplicationInsights.FieldType.Default,
                        measurements: ApplicationInsights.FieldType.Default,
                    };
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                    this.handledAt = handledAt || "unhandled";
                    this.exceptions = [new _ExceptionDetails(exception)];
                    if (severityLevel) {
                        this.severityLevel = severityLevel;
                    }
                }
                Exception.CreateSimpleException = function (message, typeName, assembly, fileName, details, line, handledAt) {
                    return {
                        handledAt: handledAt || "unhandled",
                        exceptions: [
                            {
                                hasFullStack: true,
                                message: message,
                                stack: details,
                                typeName: typeName,
                                parsedStack: [
                                    {
                                        level: 0,
                                        assembly: assembly,
                                        fileName: fileName,
                                        line: line,
                                        method: "unknown"
                                    }
                                ]
                            }
                        ]
                    };
                };
                Exception.envelopeType = "Microsoft.ApplicationInsights.{0}.Exception";
                Exception.dataType = "ExceptionData";
                return Exception;
            })(AI.ExceptionData);
            Telemetry.Exception = Exception;
            var _ExceptionDetails = (function (_super) {
                __extends(_ExceptionDetails, _super);
                function _ExceptionDetails(exception) {
                    _super.call(this);
                    this.aiDataContract = {
                        id: ApplicationInsights.FieldType.Default,
                        outerId: ApplicationInsights.FieldType.Default,
                        typeName: ApplicationInsights.FieldType.Required,
                        message: ApplicationInsights.FieldType.Required,
                        hasFullStack: ApplicationInsights.FieldType.Default,
                        stack: ApplicationInsights.FieldType.Default,
                        parsedStack: ApplicationInsights.FieldType.Array,
                    };
                    this.typeName = Telemetry.Common.DataSanitizer.sanitizeString(exception.name) || ApplicationInsights.Util.NotSpecified;
                    this.message = Telemetry.Common.DataSanitizer.sanitizeMessage(exception.message) || ApplicationInsights.Util.NotSpecified;
                    var stack = exception["stack"];
                    this.parsedStack = this.parseStack(stack);
                    this.stack = Telemetry.Common.DataSanitizer.sanitizeException(stack);
                    this.hasFullStack = ApplicationInsights.Util.isArray(this.parsedStack) && this.parsedStack.length > 0;
                }
                _ExceptionDetails.prototype.parseStack = function (stack) {
                    var parsedStack = undefined;
                    if (typeof stack === "string") {
                        var frames = stack.split('\n');
                        parsedStack = [];
                        var level = 0;
                        var totalSizeInBytes = 0;
                        for (var i = 0; i <= frames.length; i++) {
                            var frame = frames[i];
                            if (_StackFrame.regex.test(frame)) {
                                var parsedFrame = new _StackFrame(frames[i], level++);
                                totalSizeInBytes += parsedFrame.sizeInBytes;
                                parsedStack.push(parsedFrame);
                            }
                        }
                        var exceptionParsedStackThreshold = 32 * 1024;
                        if (totalSizeInBytes > exceptionParsedStackThreshold) {
                            var left = 0;
                            var right = parsedStack.length - 1;
                            var size = 0;
                            var acceptedLeft = left;
                            var acceptedRight = right;
                            while (left < right) {
                                var lSize = parsedStack[left].sizeInBytes;
                                var rSize = parsedStack[right].sizeInBytes;
                                size += lSize + rSize;
                                if (size > exceptionParsedStackThreshold) {
                                    var howMany = acceptedRight - acceptedLeft + 1;
                                    parsedStack.splice(acceptedLeft, howMany);
                                    break;
                                }
                                acceptedLeft = left;
                                acceptedRight = right;
                                left++;
                                right--;
                            }
                        }
                    }
                    return parsedStack;
                };
                return _ExceptionDetails;
            })(AI.ExceptionDetails);
            var _StackFrame = (function (_super) {
                __extends(_StackFrame, _super);
                function _StackFrame(frame, level) {
                    _super.call(this);
                    this.sizeInBytes = 0;
                    this.aiDataContract = {
                        level: ApplicationInsights.FieldType.Required,
                        method: ApplicationInsights.FieldType.Required,
                        assembly: ApplicationInsights.FieldType.Default,
                        fileName: ApplicationInsights.FieldType.Default,
                        line: ApplicationInsights.FieldType.Default,
                    };
                    this.level = level;
                    this.method = "<no_method>";
                    this.assembly = ApplicationInsights.Util.trim(frame);
                    var matches = frame.match(_StackFrame.regex);
                    if (matches && matches.length >= 5) {
                        this.method = ApplicationInsights.Util.trim(matches[2]) || this.method;
                        this.fileName = ApplicationInsights.Util.trim(matches[4]);
                        this.line = parseInt(matches[5]) || 0;
                    }
                    this.sizeInBytes += this.method.length;
                    this.sizeInBytes += this.fileName.length;
                    this.sizeInBytes += this.assembly.length;
                    this.sizeInBytes += _StackFrame.baseSize;
                    this.sizeInBytes += this.level.toString().length;
                    this.sizeInBytes += this.line.toString().length;
                }
                _StackFrame.regex = /^([\s]+at)?(.*?)(\@|\s\(|\s)([^\(\@\n]+):([0-9]+):([0-9]+)(\)?)$/;
                _StackFrame.baseSize = 58;
                return _StackFrame;
            })(AI.StackFrame);
            Telemetry._StackFrame = _StackFrame;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="Domain.ts" />
var AI;
(function (AI) {
    "use strict";
    var MetricData = (function (_super) {
        __extends(MetricData, _super);
        function MetricData() {
            _super.call(this);
            this.ver = 2;
            this.metrics = [];
            this.properties = {};
            _super.call(this);
        }
        return MetricData;
    })(Microsoft.Telemetry.Domain);
    AI.MetricData = MetricData;
})(AI || (AI = {}));
var AI;
(function (AI) {
    "use strict";
    (function (DataPointType) {
        DataPointType[DataPointType["Measurement"] = 0] = "Measurement";
        DataPointType[DataPointType["Aggregation"] = 1] = "Aggregation";
    })(AI.DataPointType || (AI.DataPointType = {}));
    var DataPointType = AI.DataPointType;
})(AI || (AI = {}));
/// <reference path="DataPointType.ts" />
var AI;
(function (AI) {
    "use strict";
    var DataPoint = (function () {
        function DataPoint() {
            this.kind = AI.DataPointType.Measurement;
        }
        return DataPoint;
    })();
    AI.DataPoint = DataPoint;
})(AI || (AI = {}));
/// <reference path="../../../JavaScriptSDK.Interfaces/Contracts/Generated/DataPoint.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            var Common;
            (function (Common) {
                "use strict";
                var DataPoint = (function (_super) {
                    __extends(DataPoint, _super);
                    function DataPoint() {
                        _super.apply(this, arguments);
                        this.aiDataContract = {
                            name: ApplicationInsights.FieldType.Required,
                            kind: ApplicationInsights.FieldType.Default,
                            value: ApplicationInsights.FieldType.Required,
                            count: ApplicationInsights.FieldType.Default,
                            min: ApplicationInsights.FieldType.Default,
                            max: ApplicationInsights.FieldType.Default,
                            stdDev: ApplicationInsights.FieldType.Default
                        };
                    }
                    return DataPoint;
                })(AI.DataPoint);
                Common.DataPoint = DataPoint;
            })(Common = Telemetry.Common || (Telemetry.Common = {}));
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/MetricData.ts" />
/// <reference path="./Common/DataSanitizer.ts" />
/// <reference path="./Common/DataPoint.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var Metric = (function (_super) {
                __extends(Metric, _super);
                function Metric(name, value, count, min, max, properties) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: ApplicationInsights.FieldType.Required,
                        metrics: ApplicationInsights.FieldType.Required,
                        properties: ApplicationInsights.FieldType.Default,
                    };
                    var dataPoint = new Microsoft.ApplicationInsights.Telemetry.Common.DataPoint();
                    dataPoint.count = count > 0 ? count : undefined;
                    dataPoint.max = isNaN(max) || max === null ? undefined : max;
                    dataPoint.min = isNaN(min) || min === null ? undefined : min;
                    dataPoint.name = Telemetry.Common.DataSanitizer.sanitizeString(name) || ApplicationInsights.Util.NotSpecified;
                    dataPoint.value = value;
                    this.metrics = [dataPoint];
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                }
                Metric.envelopeType = "Microsoft.ApplicationInsights.{0}.Metric";
                Metric.dataType = "MetricData";
                return Metric;
            })(AI.MetricData);
            Telemetry.Metric = Metric;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="EventData.ts" />
var AI;
(function (AI) {
    "use strict";
    var PageViewData = (function (_super) {
        __extends(PageViewData, _super);
        function PageViewData() {
            _super.call(this);
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return PageViewData;
    })(AI.EventData);
    AI.PageViewData = PageViewData;
})(AI || (AI = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/PageViewData.ts" />
/// <reference path="./Common/DataSanitizer.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var PageView = (function (_super) {
                __extends(PageView, _super);
                function PageView(name, url, durationMs, properties, measurements) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: ApplicationInsights.FieldType.Required,
                        name: ApplicationInsights.FieldType.Default,
                        url: ApplicationInsights.FieldType.Default,
                        duration: ApplicationInsights.FieldType.Default,
                        properties: ApplicationInsights.FieldType.Default,
                        measurements: ApplicationInsights.FieldType.Default,
                    };
                    this.url = Telemetry.Common.DataSanitizer.sanitizeUrl(url);
                    this.name = Telemetry.Common.DataSanitizer.sanitizeString(name) || ApplicationInsights.Util.NotSpecified;
                    if (!isNaN(durationMs)) {
                        this.duration = ApplicationInsights.Util.msToTimeSpan(durationMs);
                    }
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                }
                PageView.envelopeType = "Microsoft.ApplicationInsights.{0}.Pageview";
                PageView.dataType = "PageviewData";
                return PageView;
            })(AI.PageViewData);
            Telemetry.PageView = PageView;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="PageViewData.ts" />
var AI;
(function (AI) {
    "use strict";
    var PageViewPerfData = (function (_super) {
        __extends(PageViewPerfData, _super);
        function PageViewPerfData() {
            _super.call(this);
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return PageViewPerfData;
    })(AI.PageViewData);
    AI.PageViewPerfData = PageViewPerfData;
})(AI || (AI = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/PageViewPerfData.ts"/>
/// <reference path="./Common/DataSanitizer.ts"/>
/// <reference path="../Util.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var PageViewPerformance = (function (_super) {
                __extends(PageViewPerformance, _super);
                function PageViewPerformance(name, url, unused, properties, measurements) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: ApplicationInsights.FieldType.Required,
                        name: ApplicationInsights.FieldType.Default,
                        url: ApplicationInsights.FieldType.Default,
                        duration: ApplicationInsights.FieldType.Default,
                        perfTotal: ApplicationInsights.FieldType.Default,
                        networkConnect: ApplicationInsights.FieldType.Default,
                        sentRequest: ApplicationInsights.FieldType.Default,
                        receivedResponse: ApplicationInsights.FieldType.Default,
                        domProcessing: ApplicationInsights.FieldType.Default,
                        properties: ApplicationInsights.FieldType.Default,
                        measurements: ApplicationInsights.FieldType.Default
                    };
                    this.isValid = false;
                    var timing = PageViewPerformance.getPerformanceTiming();
                    if (timing) {
                        var total = PageViewPerformance.getDuration(timing.navigationStart, timing.loadEventEnd);
                        var network = PageViewPerformance.getDuration(timing.navigationStart, timing.connectEnd);
                        var request = PageViewPerformance.getDuration(timing.requestStart, timing.responseStart);
                        var response = PageViewPerformance.getDuration(timing.responseStart, timing.responseEnd);
                        var dom = PageViewPerformance.getDuration(timing.responseEnd, timing.loadEventEnd);
                        if (total == 0) {
                            ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_ErrorPVCalc, "error calculating page view performance.", { total: total, network: network, request: request, response: response, dom: dom }));
                        }
                        else if (total < Math.floor(network) + Math.floor(request) + Math.floor(response) + Math.floor(dom)) {
                            ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_ClientPerformanceMathError, "client performance math error.", { total: total, network: network, request: request, response: response, dom: dom }));
                        }
                        else {
                            this.durationMs = total;
                            this.perfTotal = this.duration = ApplicationInsights.Util.msToTimeSpan(total);
                            this.networkConnect = ApplicationInsights.Util.msToTimeSpan(network);
                            this.sentRequest = ApplicationInsights.Util.msToTimeSpan(request);
                            this.receivedResponse = ApplicationInsights.Util.msToTimeSpan(response);
                            this.domProcessing = ApplicationInsights.Util.msToTimeSpan(dom);
                            this.isValid = true;
                        }
                    }
                    this.url = Telemetry.Common.DataSanitizer.sanitizeUrl(url);
                    this.name = Telemetry.Common.DataSanitizer.sanitizeString(name) || ApplicationInsights.Util.NotSpecified;
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                }
                PageViewPerformance.prototype.getIsValid = function () {
                    return this.isValid;
                };
                PageViewPerformance.prototype.getDurationMs = function () {
                    return this.durationMs;
                };
                PageViewPerformance.getPerformanceTiming = function () {
                    if (typeof window != "undefined" && window.performance && window.performance.timing) {
                        return window.performance.timing;
                    }
                    return null;
                };
                PageViewPerformance.isPerformanceTimingSupported = function () {
                    return typeof window != "undefined" && window.performance && window.performance.timing;
                };
                PageViewPerformance.isPerformanceTimingDataReady = function () {
                    var timing = window.performance.timing;
                    return timing.domainLookupStart > 0
                        && timing.navigationStart > 0
                        && timing.responseStart > 0
                        && timing.requestStart > 0
                        && timing.loadEventEnd > 0
                        && timing.responseEnd > 0
                        && timing.connectEnd > 0
                        && timing.domLoading > 0;
                };
                PageViewPerformance.getDuration = function (start, end) {
                    var duration = 0;
                    if (!(isNaN(start) || isNaN(end))) {
                        duration = Math.max(end - start, 0);
                    }
                    return duration;
                };
                PageViewPerformance.envelopeType = "Microsoft.ApplicationInsights.{0}.PageviewPerformance";
                PageViewPerformance.dataType = "PageviewPerformanceData";
                return PageViewPerformance;
            })(AI.PageViewPerfData);
            Telemetry.PageViewPerformance = PageViewPerformance;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="./Contracts/Generated/Envelope.ts" />
/// <reference path="./Context/IApplication.ts"/>
/// <reference path="./Context/IDevice.ts"/>
/// <reference path="./Context/IInternal.ts"/>
/// <reference path="./Context/ILocation.ts"/>
/// <reference path="./Context/IOperation.ts"/>
/// <reference path="./Context/ISample.ts"/>
/// <reference path="./Context/IUser.ts"/>
/// <reference path="./Context/ISession.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="sender.ts"/>
/// <reference path="telemetry/trace.ts" />
/// <reference path="telemetry/event.ts" />
/// <reference path="telemetry/exception.ts" />
/// <reference path="telemetry/metric.ts" />
/// <reference path="telemetry/pageview.ts" />
/// <reference path="telemetry/pageviewperformance.ts" />
/// <reference path="./Util.ts"/>
/// <reference path="../JavaScriptSDK.Interfaces/Contracts/Generated/SessionState.ts"/>
/// <reference path="../JavaScriptSDK.Interfaces/ITelemetryContext.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var TelemetryContext = (function () {
            function TelemetryContext(config) {
                this._config = config;
                this._sender = new ApplicationInsights.Sender(config);
                if (typeof window !== 'undefined') {
                    this._sessionManager = new ApplicationInsights.Context._SessionManager(config);
                    this.application = new ApplicationInsights.Context.Application();
                    this.device = new ApplicationInsights.Context.Device();
                    this.internal = new ApplicationInsights.Context.Internal();
                    this.location = new ApplicationInsights.Context.Location();
                    this.user = new ApplicationInsights.Context.User(config);
                    this.operation = new ApplicationInsights.Context.Operation();
                    this.session = new ApplicationInsights.Context.Session();
                    this.sample = new ApplicationInsights.Context.Sample(config.sampleRate());
                }
            }
            TelemetryContext.prototype.addTelemetryInitializer = function (telemetryInitializer) {
                this.telemetryInitializers = this.telemetryInitializers || [];
                this.telemetryInitializers.push(telemetryInitializer);
            };
            TelemetryContext.prototype.track = function (envelope) {
                if (!envelope) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_TrackArgumentsNotSpecified, "cannot call .track() with a null or undefined argument"));
                }
                else {
                    if (envelope.name === ApplicationInsights.Telemetry.PageView.envelopeType) {
                        ApplicationInsights._InternalLogging.resetInternalMessageCount();
                    }
                    if (this.session) {
                        if (typeof this.session.id !== "string") {
                            this._sessionManager.update();
                        }
                    }
                    this._track(envelope);
                }
                return envelope;
            };
            TelemetryContext.prototype._track = function (envelope) {
                if (this.session) {
                    if (typeof this.session.id === "string") {
                        this._applySessionContext(envelope, this.session);
                    }
                    else {
                        this._applySessionContext(envelope, this._sessionManager.automaticSession);
                    }
                }
                this._applyApplicationContext(envelope, this.application);
                this._applyDeviceContext(envelope, this.device);
                this._applyInternalContext(envelope, this.internal);
                this._applyLocationContext(envelope, this.location);
                this._applySampleContext(envelope, this.sample);
                this._applyUserContext(envelope, this.user);
                this._applyOperationContext(envelope, this.operation);
                envelope.iKey = this._config.instrumentationKey();
                var doNotSendItem = false;
                try {
                    this.telemetryInitializers = this.telemetryInitializers || [];
                    var telemetryInitializersCount = this.telemetryInitializers.length;
                    for (var i = 0; i < telemetryInitializersCount; ++i) {
                        var telemetryInitializer = this.telemetryInitializers[i];
                        if (telemetryInitializer) {
                            if (telemetryInitializer.apply(null, [envelope]) === false) {
                                doNotSendItem = true;
                                break;
                            }
                        }
                    }
                }
                catch (e) {
                    doNotSendItem = true;
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_TelemetryInitializerFailed, "One of telemetry initializers failed, telemetry item will not be sent: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
                if (!doNotSendItem) {
                    if (envelope.name === ApplicationInsights.Telemetry.Metric.envelopeType ||
                        this.sample.isSampledIn(envelope)) {
                        var iKeyNoDashes = this._config.instrumentationKey().replace(/-/g, "");
                        envelope.name = envelope.name.replace("{0}", iKeyNoDashes);
                        this._sender.send(envelope);
                    }
                    else {
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TelemetrySampledAndNotSent, "Telemetry is sampled and not sent to the AI service.", { SampleRate: this.sample.sampleRate }));
                    }
                }
                return envelope;
            };
            TelemetryContext.prototype._applyApplicationContext = function (envelope, appContext) {
                if (appContext) {
                    var tagKeys = new AI.ContextTagKeys();
                    if (typeof appContext.ver === "string") {
                        envelope.tags[tagKeys.applicationVersion] = appContext.ver;
                    }
                    if (typeof appContext.build === "string") {
                        envelope.tags[tagKeys.applicationBuild] = appContext.build;
                    }
                }
            };
            TelemetryContext.prototype._applyDeviceContext = function (envelope, deviceContext) {
                var tagKeys = new AI.ContextTagKeys();
                if (deviceContext) {
                    if (typeof deviceContext.id === "string") {
                        envelope.tags[tagKeys.deviceId] = deviceContext.id;
                    }
                    if (typeof deviceContext.ip === "string") {
                        envelope.tags[tagKeys.deviceIp] = deviceContext.ip;
                    }
                    if (typeof deviceContext.language === "string") {
                        envelope.tags[tagKeys.deviceLanguage] = deviceContext.language;
                    }
                    if (typeof deviceContext.locale === "string") {
                        envelope.tags[tagKeys.deviceLocale] = deviceContext.locale;
                    }
                    if (typeof deviceContext.model === "string") {
                        envelope.tags[tagKeys.deviceModel] = deviceContext.model;
                    }
                    if (typeof deviceContext.network !== "undefined") {
                        envelope.tags[tagKeys.deviceNetwork] = deviceContext.network;
                    }
                    if (typeof deviceContext.oemName === "string") {
                        envelope.tags[tagKeys.deviceOEMName] = deviceContext.oemName;
                    }
                    if (typeof deviceContext.os === "string") {
                        envelope.tags[tagKeys.deviceOS] = deviceContext.os;
                    }
                    if (typeof deviceContext.osversion === "string") {
                        envelope.tags[tagKeys.deviceOSVersion] = deviceContext.osversion;
                    }
                    if (typeof deviceContext.resolution === "string") {
                        envelope.tags[tagKeys.deviceScreenResolution] = deviceContext.resolution;
                    }
                    if (typeof deviceContext.type === "string") {
                        envelope.tags[tagKeys.deviceType] = deviceContext.type;
                    }
                }
            };
            TelemetryContext.prototype._applyInternalContext = function (envelope, internalContext) {
                if (internalContext) {
                    var tagKeys = new AI.ContextTagKeys();
                    if (typeof internalContext.agentVersion === "string") {
                        envelope.tags[tagKeys.internalAgentVersion] = internalContext.agentVersion;
                    }
                    if (typeof internalContext.sdkVersion === "string") {
                        envelope.tags[tagKeys.internalSdkVersion] = internalContext.sdkVersion;
                    }
                }
            };
            TelemetryContext.prototype._applyLocationContext = function (envelope, locationContext) {
                if (locationContext) {
                    var tagKeys = new AI.ContextTagKeys();
                    if (typeof locationContext.ip === "string") {
                        envelope.tags[tagKeys.locationIp] = locationContext.ip;
                    }
                }
            };
            TelemetryContext.prototype._applyOperationContext = function (envelope, operationContext) {
                if (operationContext) {
                    var tagKeys = new AI.ContextTagKeys();
                    if (typeof operationContext.id === "string") {
                        envelope.tags[tagKeys.operationId] = operationContext.id;
                    }
                    if (typeof operationContext.name === "string") {
                        envelope.tags[tagKeys.operationName] = operationContext.name;
                    }
                    if (typeof operationContext.parentId === "string") {
                        envelope.tags[tagKeys.operationParentId] = operationContext.parentId;
                    }
                    if (typeof operationContext.rootId === "string") {
                        envelope.tags[tagKeys.operationRootId] = operationContext.rootId;
                    }
                    if (typeof operationContext.syntheticSource === "string") {
                        envelope.tags[tagKeys.operationSyntheticSource] = operationContext.syntheticSource;
                    }
                }
            };
            TelemetryContext.prototype._applySampleContext = function (envelope, sampleContext) {
                if (sampleContext) {
                    envelope.sampleRate = sampleContext.sampleRate;
                }
            };
            TelemetryContext.prototype._applySessionContext = function (envelope, sessionContext) {
                if (sessionContext) {
                    var tagKeys = new AI.ContextTagKeys();
                    if (typeof sessionContext.id === "string") {
                        envelope.tags[tagKeys.sessionId] = sessionContext.id;
                    }
                    if (typeof sessionContext.isFirst !== "undefined") {
                        envelope.tags[tagKeys.sessionIsFirst] = sessionContext.isFirst;
                    }
                }
            };
            TelemetryContext.prototype._applyUserContext = function (envelope, userContext) {
                if (userContext) {
                    var tagKeys = new AI.ContextTagKeys();
                    if (typeof userContext.accountId === "string") {
                        envelope.tags[tagKeys.userAccountId] = userContext.accountId;
                    }
                    if (typeof userContext.agent === "string") {
                        envelope.tags[tagKeys.userAgent] = userContext.agent;
                    }
                    if (typeof userContext.id === "string") {
                        envelope.tags[tagKeys.userId] = userContext.id;
                    }
                    if (typeof userContext.authenticatedId === "string") {
                        envelope.tags[tagKeys.userAuthUserId] = userContext.authenticatedId;
                    }
                    if (typeof userContext.storeRegion === "string") {
                        envelope.tags[tagKeys.userStoreRegion] = userContext.storeRegion;
                    }
                }
            };
            return TelemetryContext;
        })();
        ApplicationInsights.TelemetryContext = TelemetryContext;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="Base.ts" />
var Microsoft;
(function (Microsoft) {
    var Telemetry;
    (function (Telemetry) {
        "use strict";
        var Data = (function (_super) {
            __extends(Data, _super);
            function Data() {
                _super.call(this);
            }
            return Data;
        })(Microsoft.Telemetry.Base);
        Telemetry.Data = Data;
    })(Telemetry = Microsoft.Telemetry || (Microsoft.Telemetry = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../../JavaScriptSDK.Interfaces/Contracts/Generated/Data.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            var Common;
            (function (Common) {
                "use strict";
                var Data = (function (_super) {
                    __extends(Data, _super);
                    function Data(type, data) {
                        _super.call(this);
                        this.aiDataContract = {
                            baseType: ApplicationInsights.FieldType.Required,
                            baseData: ApplicationInsights.FieldType.Required
                        };
                        this.baseType = type;
                        this.baseData = data;
                    }
                    return Data;
                })(Microsoft.Telemetry.Data);
                Common.Data = Data;
            })(Common = Telemetry.Common || (Telemetry.Common = {}));
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/PageViewData.ts" />
/// <reference path="./Common/DataSanitizer.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var PageViewManager = (function () {
                function PageViewManager(appInsights, overridePageViewDuration) {
                    this.pageViewPerformanceSent = false;
                    this.overridePageViewDuration = false;
                    this.overridePageViewDuration = overridePageViewDuration;
                    this.appInsights = appInsights;
                }
                PageViewManager.prototype.trackPageView = function (name, url, properties, measurements, duration) {
                    var _this = this;
                    if (typeof name !== "string") {
                        name = window.document && window.document.title || "";
                    }
                    if (typeof url !== "string") {
                        url = window.location && window.location.href || "";
                    }
                    var pageViewSent = false;
                    var customDuration = 0;
                    if (Telemetry.PageViewPerformance.isPerformanceTimingSupported()) {
                        var start = Telemetry.PageViewPerformance.getPerformanceTiming().navigationStart;
                        customDuration = Telemetry.PageViewPerformance.getDuration(start, +new Date);
                    }
                    else {
                        this.appInsights.sendPageViewInternal(name, url, !isNaN(duration) ? duration : 0, properties, measurements);
                        this.appInsights.flush();
                        pageViewSent = true;
                    }
                    if (this.overridePageViewDuration || !isNaN(duration)) {
                        this.appInsights.sendPageViewInternal(name, url, !isNaN(duration) ? duration : customDuration, properties, measurements);
                        this.appInsights.flush();
                        pageViewSent = true;
                    }
                    var maxDurationLimit = 60000;
                    if (!Telemetry.PageViewPerformance.isPerformanceTimingSupported()) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_NavigationTimingNotSupported, "trackPageView: navigation timing API used for calculation of page duration is not supported in this browser. This page view will be collected without duration and timing info."));
                        return;
                    }
                    var handle = setInterval(function () {
                        try {
                            if (Telemetry.PageViewPerformance.isPerformanceTimingDataReady()) {
                                clearInterval(handle);
                                var pageViewPerformance = new Telemetry.PageViewPerformance(name, url, null, properties, measurements);
                                if (!pageViewPerformance.getIsValid() && !pageViewSent) {
                                    _this.appInsights.sendPageViewInternal(name, url, customDuration, properties, measurements);
                                    _this.appInsights.flush();
                                }
                                else {
                                    if (!pageViewSent) {
                                        _this.appInsights.sendPageViewInternal(name, url, pageViewPerformance.getDurationMs(), properties, measurements);
                                    }
                                    if (!_this.pageViewPerformanceSent) {
                                        _this.appInsights.sendPageViewPerformanceInternal(pageViewPerformance);
                                        _this.pageViewPerformanceSent = true;
                                    }
                                    _this.appInsights.flush();
                                }
                            }
                            else if (Telemetry.PageViewPerformance.getDuration(start, +new Date) > maxDurationLimit) {
                                clearInterval(handle);
                                if (!pageViewSent) {
                                    _this.appInsights.sendPageViewInternal(name, url, maxDurationLimit, properties, measurements);
                                    _this.appInsights.flush();
                                }
                            }
                        }
                        catch (e) {
                            ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TrackPVFailedCalc, "trackPageView failed on page load calculation: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                        }
                    }, 100);
                };
                return PageViewManager;
            })();
            Telemetry.PageViewManager = PageViewManager;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../AppInsights.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var PageVisitTimeManager = (function () {
                function PageVisitTimeManager(pageVisitTimeTrackingHandler) {
                    this.prevPageVisitDataKeyName = "prevPageVisitData";
                    this.pageVisitTimeTrackingHandler = pageVisitTimeTrackingHandler;
                }
                PageVisitTimeManager.prototype.trackPreviousPageVisit = function (currentPageName, currentPageUrl) {
                    try {
                        var prevPageVisitTimeData = this.restartPageVisitTimer(currentPageName, currentPageUrl);
                        if (prevPageVisitTimeData) {
                            this.pageVisitTimeTrackingHandler(prevPageVisitTimeData.pageName, prevPageVisitTimeData.pageUrl, prevPageVisitTimeData.pageVisitTime);
                        }
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.warnToConsole("Auto track page visit time failed, metric will not be collected: " + ApplicationInsights.Util.dump(e));
                    }
                };
                PageVisitTimeManager.prototype.restartPageVisitTimer = function (pageName, pageUrl) {
                    try {
                        var prevPageVisitData = this.stopPageVisitTimer();
                        this.startPageVisitTimer(pageName, pageUrl);
                        return prevPageVisitData;
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.warnToConsole("Call to restart failed: " + ApplicationInsights.Util.dump(e));
                        return null;
                    }
                };
                PageVisitTimeManager.prototype.startPageVisitTimer = function (pageName, pageUrl) {
                    try {
                        if (ApplicationInsights.Util.canUseSessionStorage()) {
                            if (ApplicationInsights.Util.getSessionStorage(this.prevPageVisitDataKeyName) != null) {
                                throw new Error("Cannot call startPageVisit consecutively without first calling stopPageVisit");
                            }
                            var currPageVisitData = new PageVisitData(pageName, pageUrl);
                            var currPageVisitDataStr = JSON.stringify(currPageVisitData);
                            ApplicationInsights.Util.setSessionStorage(this.prevPageVisitDataKeyName, currPageVisitDataStr);
                        }
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.warnToConsole("Call to start failed: " + ApplicationInsights.Util.dump(e));
                    }
                };
                PageVisitTimeManager.prototype.stopPageVisitTimer = function () {
                    try {
                        if (ApplicationInsights.Util.canUseSessionStorage()) {
                            var pageVisitEndTime = Date.now();
                            var pageVisitDataJsonStr = ApplicationInsights.Util.getSessionStorage(this.prevPageVisitDataKeyName);
                            if (pageVisitDataJsonStr) {
                                var prevPageVisitData = JSON.parse(pageVisitDataJsonStr);
                                prevPageVisitData.pageVisitTime = pageVisitEndTime - prevPageVisitData.pageVisitStartTime;
                                ApplicationInsights.Util.removeSessionStorage(this.prevPageVisitDataKeyName);
                                return prevPageVisitData;
                            }
                            else {
                                return null;
                            }
                        }
                        return null;
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.warnToConsole("Stop page visit timer failed: " + ApplicationInsights.Util.dump(e));
                        return null;
                    }
                };
                return PageVisitTimeManager;
            })();
            Telemetry.PageVisitTimeManager = PageVisitTimeManager;
            var PageVisitData = (function () {
                function PageVisitData(pageName, pageUrl) {
                    this.pageVisitStartTime = Date.now();
                    this.pageName = pageName;
                    this.pageUrl = pageUrl;
                }
                return PageVisitData;
            })();
            Telemetry.PageVisitData = PageVisitData;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    (function (DependencyKind) {
        DependencyKind[DependencyKind["SQL"] = 0] = "SQL";
        DependencyKind[DependencyKind["Http"] = 1] = "Http";
        DependencyKind[DependencyKind["Other"] = 2] = "Other";
    })(AI.DependencyKind || (AI.DependencyKind = {}));
    var DependencyKind = AI.DependencyKind;
})(AI || (AI = {}));
var AI;
(function (AI) {
    "use strict";
    (function (DependencySourceType) {
        DependencySourceType[DependencySourceType["Undefined"] = 0] = "Undefined";
        DependencySourceType[DependencySourceType["Aic"] = 1] = "Aic";
        DependencySourceType[DependencySourceType["Apmc"] = 2] = "Apmc";
    })(AI.DependencySourceType || (AI.DependencySourceType = {}));
    var DependencySourceType = AI.DependencySourceType;
})(AI || (AI = {}));
/// <reference path="Domain.ts" />
/// <reference path="DataPointType.ts" />
/// <reference path="DependencyKind.ts" />
/// <reference path="DependencySourceType.ts" />
var AI;
(function (AI) {
    "use strict";
    var RemoteDependencyData = (function (_super) {
        __extends(RemoteDependencyData, _super);
        function RemoteDependencyData() {
            _super.call(this);
            this.ver = 2;
            this.kind = AI.DataPointType.Aggregation;
            this.dependencyKind = AI.DependencyKind.Other;
            this.success = true;
            this.dependencySource = AI.DependencySourceType.Apmc;
            this.properties = {};
            _super.call(this);
        }
        return RemoteDependencyData;
    })(Microsoft.Telemetry.Domain);
    AI.RemoteDependencyData = RemoteDependencyData;
})(AI || (AI = {}));
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/PageViewData.ts" />
/// <reference path="./Common/DataSanitizer.ts"/>
/// <reference path="../../JavaScriptSDK.Interfaces/Contracts/Generated/RemoteDependencyData.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var RemoteDependencyData = (function (_super) {
                __extends(RemoteDependencyData, _super);
                function RemoteDependencyData(id, absoluteUrl, commandName, value, success, resultCode, method) {
                    _super.call(this);
                    this.aiDataContract = {
                        id: ApplicationInsights.FieldType.Required,
                        ver: ApplicationInsights.FieldType.Required,
                        name: ApplicationInsights.FieldType.Default,
                        kind: ApplicationInsights.FieldType.Required,
                        value: ApplicationInsights.FieldType.Default,
                        count: ApplicationInsights.FieldType.Default,
                        min: ApplicationInsights.FieldType.Default,
                        max: ApplicationInsights.FieldType.Default,
                        stdDev: ApplicationInsights.FieldType.Default,
                        dependencyKind: ApplicationInsights.FieldType.Default,
                        success: ApplicationInsights.FieldType.Default,
                        async: ApplicationInsights.FieldType.Default,
                        dependencySource: ApplicationInsights.FieldType.Default,
                        commandName: ApplicationInsights.FieldType.Default,
                        dependencyTypeName: ApplicationInsights.FieldType.Default,
                        properties: ApplicationInsights.FieldType.Default,
                        resultCode: ApplicationInsights.FieldType.Default
                    };
                    this.id = id;
                    this.name = this.formatDependencyName(method, absoluteUrl);
                    this.commandName = Telemetry.Common.DataSanitizer.sanitizeUrl(commandName);
                    this.value = value;
                    this.success = success;
                    this.resultCode = resultCode + "";
                    this.dependencyKind = AI.DependencyKind.Http;
                    this.dependencyTypeName = "Ajax";
                }
                RemoteDependencyData.prototype.formatDependencyName = function (method, absoluteUrl) {
                    if (method) {
                        return method.toUpperCase() + " " + absoluteUrl;
                    }
                    else {
                        return absoluteUrl;
                    }
                };
                RemoteDependencyData.envelopeType = "Microsoft.ApplicationInsights.{0}.RemoteDependency";
                RemoteDependencyData.dataType = "RemoteDependencyData";
                return RemoteDependencyData;
            })(AI.RemoteDependencyData);
            Telemetry.RemoteDependencyData = RemoteDependencyData;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="./IConfig.ts" />
/// <reference path="./ITelemetryContext.ts" />
/// <reference path="./Contracts/Generated/SeverityLevel.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="telemetrycontext.ts" />
/// <reference path="./Telemetry/Common/Data.ts"/>
/// <reference path="./Util.ts"/>
/// <reference path="../JavaScriptSDK.Interfaces/Contracts/Generated/SessionState.ts"/>
/// <reference path="./Telemetry/PageViewManager.ts"/>
/// <reference path="./Telemetry/PageVisitTimeManager.ts"/>
/// <reference path="./Telemetry/RemoteDependencyData.ts"/>
/// <reference path="./ajax/ajax.ts"/>
/// <reference path="./DataLossAnalyzer.ts"/>
/// <reference path="./SplitTest.ts"/>
/// <reference path="../JavaScriptSDK.Interfaces/IAppInsights.ts"/>
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        ApplicationInsights.Version = "0.22.19";
        var AppInsights = (function () {
            function AppInsights(config) {
                var _this = this;
                this._trackAjaxAttempts = 0;
                this.config = config || {};
                var defaults = AppInsights.defaultConfig;
                if (defaults !== undefined) {
                    for (var field in defaults) {
                        if (this.config[field] === undefined) {
                            this.config[field] = defaults[field];
                        }
                    }
                }
                ApplicationInsights._InternalLogging.verboseLogging = function () { return _this.config.verboseLogging; };
                ApplicationInsights._InternalLogging.enableDebugExceptions = function () { return _this.config.enableDebug; };
                var configGetters = {
                    instrumentationKey: function () { return _this.config.instrumentationKey; },
                    accountId: function () { return _this.config.accountId; },
                    sessionRenewalMs: function () { return _this.config.sessionRenewalMs; },
                    sessionExpirationMs: function () { return _this.config.sessionExpirationMs; },
                    endpointUrl: function () { return _this.config.endpointUrl; },
                    emitLineDelimitedJson: function () { return _this.config.emitLineDelimitedJson; },
                    maxBatchSizeInBytes: function () { return _this.config.maxBatchSizeInBytes; },
                    maxBatchInterval: function () { return _this.config.maxBatchInterval; },
                    disableTelemetry: function () { return _this.config.disableTelemetry; },
                    sampleRate: function () { return _this.config.samplingPercentage; },
                    cookieDomain: function () { return _this.config.cookieDomain; },
                    enableSessionStorageBuffer: function () { return _this.config.enableSessionStorageBuffer; }
                };
                var enableExperiment = new ApplicationInsights.SplitTest().isEnabled(this.config.instrumentationKey, 5);
                this.config.enableSessionStorageBuffer = enableExperiment;
                this.context = new ApplicationInsights.TelemetryContext(configGetters);
                ApplicationInsights.DataLossAnalyzer.appInsights = this;
                ApplicationInsights.DataLossAnalyzer.enabled = enableExperiment;
                ApplicationInsights.DataLossAnalyzer.reportLostItems();
                this._pageViewManager = new Microsoft.ApplicationInsights.Telemetry.PageViewManager(this, this.config.overridePageViewDuration);
                this._eventTracking = new Timing("trackEvent");
                this._eventTracking.action = function (name, url, duration, properties, measurements) {
                    if (!measurements) {
                        measurements = { duration: duration };
                    }
                    else {
                        if (isNaN(measurements["duration"])) {
                            measurements["duration"] = duration;
                        }
                    }
                    var event = new ApplicationInsights.Telemetry.Event(name, properties, measurements);
                    var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.Event.dataType, event);
                    var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.Event.envelopeType);
                    _this.context.track(envelope);
                };
                this._pageTracking = new Timing("trackPageView");
                this._pageTracking.action = function (name, url, duration, properties, measurements) {
                    _this.sendPageViewInternal(name, url, duration, properties, measurements);
                };
                this._pageVisitTimeManager = new ApplicationInsights.Telemetry.PageVisitTimeManager(function (pageName, pageUrl, pageVisitTime) { return _this.trackPageVisitTime(pageName, pageUrl, pageVisitTime); });
                if (!this.config.disableAjaxTracking) {
                    new Microsoft.ApplicationInsights.AjaxMonitor(this);
                }
            }
            AppInsights.prototype.sendPageViewInternal = function (name, url, duration, properties, measurements) {
                var pageView = new ApplicationInsights.Telemetry.PageView(name, url, duration, properties, measurements);
                var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.PageView.dataType, pageView);
                var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.PageView.envelopeType);
                this.context.track(envelope);
                this._trackAjaxAttempts = 0;
            };
            AppInsights.prototype.sendPageViewPerformanceInternal = function (pageViewPerformance) {
                var pageViewPerformanceData = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.PageViewPerformance.dataType, pageViewPerformance);
                var pageViewPerformanceEnvelope = new ApplicationInsights.Telemetry.Common.Envelope(pageViewPerformanceData, ApplicationInsights.Telemetry.PageViewPerformance.envelopeType);
                this.context.track(pageViewPerformanceEnvelope);
            };
            AppInsights.prototype.startTrackPage = function (name) {
                try {
                    if (typeof name !== "string") {
                        name = window.document && window.document.title || "";
                    }
                    this._pageTracking.start(name);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_StartTrackFailed, "startTrackPage failed, page view may not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.stopTrackPage = function (name, url, properties, measurements) {
                try {
                    if (typeof name !== "string") {
                        name = window.document && window.document.title || "";
                    }
                    if (typeof url !== "string") {
                        url = window.location && window.location.href || "";
                    }
                    this._pageTracking.stop(name, url, properties, measurements);
                    if (this.config.autoTrackPageVisitTime) {
                        this._pageVisitTimeManager.trackPreviousPageVisit(name, url);
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_StopTrackFailed, "stopTrackPage failed, page view will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.trackPageView = function (name, url, properties, measurements, duration) {
                try {
                    this._pageViewManager.trackPageView(name, url, properties, measurements, duration);
                    if (this.config.autoTrackPageVisitTime) {
                        this._pageVisitTimeManager.trackPreviousPageVisit(name, url);
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TrackPVFailed, "trackPageView failed, page view will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.startTrackEvent = function (name) {
                try {
                    this._eventTracking.start(name);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_StartTrackEventFailed, "startTrackEvent failed, event will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.stopTrackEvent = function (name, properties, measurements) {
                try {
                    this._eventTracking.stop(name, undefined, properties, measurements);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_StopTrackEventFailed, "stopTrackEvent failed, event will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.trackEvent = function (name, properties, measurements) {
                try {
                    var eventTelemetry = new ApplicationInsights.Telemetry.Event(name, properties, measurements);
                    var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.Event.dataType, eventTelemetry);
                    var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.Event.envelopeType);
                    this.context.track(envelope);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TrackEventFailed, "trackEvent failed, event will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.trackAjax = function (id, absoluteUrl, pathName, totalTime, success, resultCode, method) {
                if (this.config.maxAjaxCallsPerView === -1 ||
                    this._trackAjaxAttempts < this.config.maxAjaxCallsPerView) {
                    var dependency = new ApplicationInsights.Telemetry.RemoteDependencyData(id, absoluteUrl, pathName, totalTime, success, resultCode, method);
                    var dependencyData = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.RemoteDependencyData.dataType, dependency);
                    var envelope = new ApplicationInsights.Telemetry.Common.Envelope(dependencyData, ApplicationInsights.Telemetry.RemoteDependencyData.envelopeType);
                    this.context.track(envelope);
                }
                else if (this._trackAjaxAttempts === this.config.maxAjaxCallsPerView) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_MaxAjaxPerPVExceeded, "Maximum ajax per page view limit reached, ajax monitoring is paused until the next trackPageView(). In order to increase the limit set the maxAjaxCallsPerView configuration parameter."));
                }
                ++this._trackAjaxAttempts;
            };
            AppInsights.prototype.trackException = function (exception, handledAt, properties, measurements, severityLevel) {
                try {
                    if (!ApplicationInsights.Util.isError(exception)) {
                        try {
                            throw new Error(exception);
                        }
                        catch (error) {
                            exception = error;
                        }
                    }
                    var exceptionTelemetry = new ApplicationInsights.Telemetry.Exception(exception, handledAt, properties, measurements, severityLevel);
                    var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.Exception.dataType, exceptionTelemetry);
                    var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.Exception.envelopeType);
                    this.context.track(envelope);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TrackExceptionFailed, "trackException failed, exception will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.trackMetric = function (name, average, sampleCount, min, max, properties) {
                try {
                    var telemetry = new ApplicationInsights.Telemetry.Metric(name, average, sampleCount, min, max, properties);
                    var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.Metric.dataType, telemetry);
                    var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.Metric.envelopeType);
                    this.context.track(envelope);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TrackMetricFailed, "trackMetric failed, metric will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.trackTrace = function (message, properties) {
                try {
                    var telemetry = new ApplicationInsights.Telemetry.Trace(message, properties);
                    var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.Trace.dataType, telemetry);
                    var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.Trace.envelopeType);
                    this.context.track(envelope);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_TrackTraceFailed, "trackTrace failed, trace will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.trackPageVisitTime = function (pageName, pageUrl, pageVisitTime) {
                var properties = { PageName: pageName, PageUrl: pageUrl };
                this.trackMetric("PageVisitTime", pageVisitTime, 1, pageVisitTime, pageVisitTime, properties);
            };
            AppInsights.prototype.flush = function () {
                try {
                    this.context._sender.triggerSend();
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FlushFailed, "flush failed, telemetry will not be collected: " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId) {
                try {
                    this.context.user.setAuthenticatedUserContext(authenticatedUserId, accountId);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_SetAuthContextFailed, "Setting auth user context failed. " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.clearAuthenticatedUserContext = function () {
                try {
                    this.context.user.clearAuthenticatedUserContext();
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_SetAuthContextFailed, "Clearing auth user context failed. " + ApplicationInsights.Util.getExceptionName(e), { exception: ApplicationInsights.Util.dump(e) }));
                }
            };
            AppInsights.prototype.SendCORSException = function (properties) {
                var exceptionData = Microsoft.ApplicationInsights.Telemetry.Exception.CreateSimpleException("Script error.", "Error", "unknown", "unknown", "The browser's same-origin policy prevents us from getting the details of this exception.The exception occurred in a script loaded from an origin different than the web page.For cross- domain error reporting you can use crossorigin attribute together with appropriate CORS HTTP headers.For more information please see http://www.w3.org/TR/cors/.", 0, null);
                exceptionData.properties = properties;
                var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.Exception.dataType, exceptionData);
                var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.Exception.envelopeType);
                this.context.track(envelope);
            };
            AppInsights.prototype._onerror = function (message, url, lineNumber, columnNumber, error) {
                try {
                    var properties = { url: url ? url : document.URL };
                    if (ApplicationInsights.Util.isCrossOriginError(message, url, lineNumber, columnNumber, error)) {
                        this.SendCORSException(properties);
                    }
                    else {
                        if (!ApplicationInsights.Util.isError(error)) {
                            var stack = "window.onerror@" + properties.url + ":" + lineNumber + ":" + (columnNumber || 0);
                            error = new Error(message);
                            error["stack"] = stack;
                        }
                        this.trackException(error, null, properties);
                    }
                }
                catch (exception) {
                    var errorString = error ? (error.name + ", " + error.message) : "null";
                    var exceptionDump = ApplicationInsights.Util.dump(exception);
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_ExceptionWhileLoggingError, "_onerror threw exception while logging error, error will not be collected: " + ApplicationInsights.Util.getExceptionName(exception), { exception: exceptionDump, errorString: errorString }));
                }
            };
            return AppInsights;
        })();
        ApplicationInsights.AppInsights = AppInsights;
        var Timing = (function () {
            function Timing(name) {
                this._name = name;
                this._events = {};
            }
            Timing.prototype.start = function (name) {
                if (typeof this._events[name] !== "undefined") {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_StartCalledMoreThanOnce, "start was called more than once for this event without calling stop.", { name: this._name, key: name }));
                }
                this._events[name] = +new Date;
            };
            Timing.prototype.stop = function (name, url, properties, measurements) {
                var start = this._events[name];
                if (isNaN(start)) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(ApplicationInsights.LoggingSeverity.WARNING, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.USRACT_StopCalledWithoutStart, "stop was called without a corresponding start.", { name: this._name, key: name }));
                }
                else {
                    var end = +new Date;
                    var duration = ApplicationInsights.Telemetry.PageViewPerformance.getDuration(start, end);
                    this.action(name, url, duration, properties, measurements);
                }
                delete this._events[name];
                this._events[name] = undefined;
            };
            return Timing;
        })();
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="appinsights.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var Initialization = (function () {
            function Initialization(snippet) {
                snippet.queue = snippet.queue || [];
                var config = snippet.config || {};
                if (config && !config.instrumentationKey) {
                    config = snippet;
                    if (config["iKey"]) {
                        Microsoft.ApplicationInsights.Version = "0.10.0.0";
                        config.instrumentationKey = config["iKey"];
                    }
                    else if (config["applicationInsightsId"]) {
                        Microsoft.ApplicationInsights.Version = "0.7.2.0";
                        config.instrumentationKey = config["applicationInsightsId"];
                    }
                    else {
                        throw new Error("Cannot load Application Insights SDK, no instrumentationKey was provided.");
                    }
                }
                config = Initialization.getDefaultConfig(config);
                this.snippet = snippet;
                this.config = config;
            }
            Initialization.prototype.loadAppInsights = function () {
                var appInsights = new Microsoft.ApplicationInsights.AppInsights(this.config);
                if (this.config["iKey"]) {
                    var originalTrackPageView = appInsights.trackPageView;
                    appInsights.trackPageView = function (pagePath, properties, measurements) {
                        originalTrackPageView.apply(appInsights, [null, pagePath, properties, measurements]);
                    };
                }
                var legacyPageView = "logPageView";
                if (typeof this.snippet[legacyPageView] === "function") {
                    appInsights[legacyPageView] = function (pagePath, properties, measurements) {
                        appInsights.trackPageView(null, pagePath, properties, measurements);
                    };
                }
                var legacyEvent = "logEvent";
                if (typeof this.snippet[legacyEvent] === "function") {
                    appInsights[legacyEvent] = function (name, properties, measurements) {
                        appInsights.trackEvent(name, properties, measurements);
                    };
                }
                return appInsights;
            };
            Initialization.prototype.emptyQueue = function () {
                try {
                    if (Microsoft.ApplicationInsights.Util.isArray(this.snippet.queue)) {
                        var length = this.snippet.queue.length;
                        for (var i = 0; i < length; i++) {
                            var call = this.snippet.queue[i];
                            call();
                        }
                        this.snippet.queue = undefined;
                        delete this.snippet.queue;
                    }
                }
                catch (exception) {
                    var properties = {};
                    if (exception && typeof exception.toString === "function") {
                        properties.exception = exception.toString();
                    }
                    var message = new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedToSendQueuedTelemetry, "Failed to send queued telemetry", properties);
                    Microsoft.ApplicationInsights._InternalLogging.throwInternalNonUserActionable(ApplicationInsights.LoggingSeverity.WARNING, message);
                }
            };
            Initialization.prototype.pollInteralLogs = function (appInsightsInstance) {
                return setInterval(function () {
                    var queue = Microsoft.ApplicationInsights._InternalLogging.queue;
                    var length = queue.length;
                    for (var i = 0; i < length; i++) {
                        appInsightsInstance.trackTrace(queue[i].message);
                    }
                    queue.length = 0;
                }, this.config.diagnosticLogInterval);
            };
            Initialization.prototype.addHousekeepingBeforeUnload = function (appInsightsInstance) {
                // Add callback to push events when the user navigates away
                if (!appInsightsInstance.config.disableFlushOnBeforeUnload && ('onbeforeunload' in window)) {
                    var performHousekeeping = function () {
                        appInsightsInstance.context._sender.triggerSend();
                        appInsightsInstance.context._sessionManager.backup();
                    };
                    if (!Microsoft.ApplicationInsights.Util.addEventHandler('beforeunload', performHousekeeping)) {
                        Microsoft.ApplicationInsights._InternalLogging.throwInternalNonUserActionable(Microsoft.ApplicationInsights.LoggingSeverity.CRITICAL, new ApplicationInsights._InternalLogMessage(ApplicationInsights._InternalMessageId.NONUSRACT_FailedToAddHandlerForOnBeforeUnload, 'Could not add handler for beforeunload'));
                    }
                }
            };
            Initialization.getDefaultConfig = function (config) {
                if (!config) {
                    config = {};
                }
                config.endpointUrl = config.endpointUrl || "//dc.services.visualstudio.com/v2/track";
                config.sessionRenewalMs = 30 * 60 * 1000;
                config.sessionExpirationMs = 24 * 60 * 60 * 1000;
                config.maxBatchSizeInBytes = config.maxBatchSizeInBytes > 0 ? config.maxBatchSizeInBytes : 1000000;
                config.maxBatchInterval = !isNaN(config.maxBatchInterval) ? config.maxBatchInterval : 15000;
                config.enableDebug = ApplicationInsights.Util.stringToBoolOrDefault(config.enableDebug);
                config.disableExceptionTracking = (config.disableExceptionTracking !== undefined && config.disableExceptionTracking !== null) ?
                    ApplicationInsights.Util.stringToBoolOrDefault(config.disableExceptionTracking) :
                    false;
                config.disableTelemetry = ApplicationInsights.Util.stringToBoolOrDefault(config.disableTelemetry);
                config.verboseLogging = ApplicationInsights.Util.stringToBoolOrDefault(config.verboseLogging);
                config.emitLineDelimitedJson = ApplicationInsights.Util.stringToBoolOrDefault(config.emitLineDelimitedJson);
                config.diagnosticLogInterval = config.diagnosticLogInterval || 10000;
                config.autoTrackPageVisitTime = ApplicationInsights.Util.stringToBoolOrDefault(config.autoTrackPageVisitTime);
                if (isNaN(config.samplingPercentage) || config.samplingPercentage <= 0 || config.samplingPercentage >= 100) {
                    config.samplingPercentage = 100;
                }
                config.disableAjaxTracking = (config.disableAjaxTracking !== undefined && config.disableAjaxTracking !== null) ?
                    ApplicationInsights.Util.stringToBoolOrDefault(config.disableAjaxTracking) :
                    false;
                config.maxAjaxCallsPerView = !isNaN(config.maxAjaxCallsPerView) ? config.maxAjaxCallsPerView : 500;
                config.disableCorrelationHeaders = (config.disableCorrelationHeaders !== undefined && config.disableCorrelationHeaders !== null) ?
                    ApplicationInsights.Util.stringToBoolOrDefault(config.disableCorrelationHeaders) :
                    true;
                config.disableFlushOnBeforeUnload = (config.disableFlushOnBeforeUnload !== undefined && config.disableFlushOnBeforeUnload !== null) ?
                    ApplicationInsights.Util.stringToBoolOrDefault(config.disableFlushOnBeforeUnload) :
                    false;
                config.enableSessionStorageBuffer = (config.enableSessionStorageBuffer !== undefined && config.enableSessionStorageBuffer !== null) ?
                    ApplicationInsights.Util.stringToBoolOrDefault(config.enableSessionStorageBuffer) :
                    false;
                return config;
            };
            return Initialization;
        })();
        ApplicationInsights.Initialization = Initialization;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="initialization.ts" />
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        try {
            if (typeof window !== "undefined" && typeof JSON !== "undefined") {
                var aiName = "appInsights";
                if (window[aiName] === undefined) {
                    Microsoft.ApplicationInsights.AppInsights.defaultConfig = Microsoft.ApplicationInsights.Initialization.getDefaultConfig();
                }
                else {
                    var snippet = window[aiName] || {};
                    var init = new Microsoft.ApplicationInsights.Initialization(snippet);
                    var appInsightsLocal = init.loadAppInsights();
                    for (var field in appInsightsLocal) {
                        snippet[field] = appInsightsLocal[field];
                    }
                    init.emptyQueue();
                    init.pollInteralLogs(appInsightsLocal);
                    init.addHousekeepingBeforeUnload(appInsightsLocal);
                }
            }
        }
        catch (e) {
            Microsoft.ApplicationInsights._InternalLogging.warnToConsole('Failed to initialize AppInsights JS SDK: ' + e.message);
        }
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="PageViewData.ts" />
var AI;
(function (AI) {
    "use strict";
    var AjaxCallData = (function (_super) {
        __extends(AjaxCallData, _super);
        function AjaxCallData() {
            _super.call(this);
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return AjaxCallData;
    })(AI.PageViewData);
    AI.AjaxCallData = AjaxCallData;
})(AI || (AI = {}));
/// <reference path="Domain.ts" />
var AI;
(function (AI) {
    "use strict";
    var RequestData = (function (_super) {
        __extends(RequestData, _super);
        function RequestData() {
            _super.call(this);
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return RequestData;
    })(Microsoft.Telemetry.Domain);
    AI.RequestData = RequestData;
})(AI || (AI = {}));
/// <reference path="Domain.ts" />
/// <reference path="SessionState.ts" />
var AI;
(function (AI) {
    "use strict";
    var SessionStateData = (function (_super) {
        __extends(SessionStateData, _super);
        function SessionStateData() {
            _super.call(this);
            this.ver = 2;
            this.state = AI.SessionState.Start;
            _super.call(this);
        }
        return SessionStateData;
    })(Microsoft.Telemetry.Domain);
    AI.SessionStateData = SessionStateData;
})(AI || (AI = {}));
var AI;
(function (AI) {
    "use strict";
    (function (TestResult) {
        TestResult[TestResult["Pass"] = 0] = "Pass";
        TestResult[TestResult["Fail"] = 1] = "Fail";
    })(AI.TestResult || (AI.TestResult = {}));
    var TestResult = AI.TestResult;
})(AI || (AI = {}));
