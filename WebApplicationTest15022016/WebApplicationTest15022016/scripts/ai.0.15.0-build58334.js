var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        (function (LoggingSeverity) {
            LoggingSeverity[LoggingSeverity["CRITICAL"] = 0] = "CRITICAL";
            LoggingSeverity[LoggingSeverity["WARNING"] = 1] = "WARNING";
        })(ApplicationInsights.LoggingSeverity || (ApplicationInsights.LoggingSeverity = {}));
        var LoggingSeverity = ApplicationInsights.LoggingSeverity;
        var _InternalLogging = (function () {
            function _InternalLogging() {
            }
            _InternalLogging.throwInternalNonUserActionable = function (severity, message) {
                if (this.enableDebugExceptions()) {
                    throw message;
                }
                else {
                    this.warnToConsole(message);
                    this.logInternalMessage(severity, this.AiNonUserActionablePrefix + message);
                }
            };
            _InternalLogging.throwInternalUserActionable = function (severity, message) {
                if (this.enableDebugExceptions()) {
                    throw message;
                }
                else {
                    this.warnToConsole(message);
                    this.logInternalMessage(severity, this.AiUserActionablePrefix + message);
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
                if (this.verboseLogging() || severity === 0 /* CRITICAL */) {
                    this.queue.push(message);
                    this._messageCount++;
                }
                if (this._messageCount == this.MAX_INTERNAL_MESSAGE_LIMIT) {
                    var throttleLimitMessage = this.AiNonUserActionablePrefix + "Internal events throttle limit per PageView reached for this app.";
                    this.queue.push(throttleLimitMessage);
                    this.warnToConsole(throttleLimitMessage);
                }
            };
            _InternalLogging._areInternalMessagesThrottled = function () {
                return this._messageCount >= this.MAX_INTERNAL_MESSAGE_LIMIT;
            };
            _InternalLogging.AiUserActionablePrefix = "AI: ";
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
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Util = (function () {
            function Util() {
            }
            Util._getStorageObject = function () {
                try {
                    if (window.localStorage) {
                        return window.localStorage;
                    }
                    else {
                        return null;
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.warnToConsole('Failed to get client localStorage: ' + e.message);
                    return null;
                }
            };
            Util.canUseLocalStorage = function () {
                return !!Util._getStorageObject();
            };
            Util.getStorage = function (name) {
                var storage = Util._getStorageObject();
                if (storage !== null) {
                    try {
                        return storage.getItem(name);
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "Browser failed read of local storage." + Util.dump(e));
                    }
                }
                return null;
            };
            Util.setStorage = function (name, data) {
                var storage = Util._getStorageObject();
                if (storage !== null) {
                    try {
                        storage.setItem(name, data);
                        return true;
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "Browser failed write to local storage." + Util.dump(e));
                    }
                }
                return false;
            };
            Util.removeStorage = function (name) {
                var storage = Util._getStorageObject();
                if (storage !== null) {
                    try {
                        storage.removeItem(name);
                        return true;
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "Browser failed removal of local storage item." + Util.dump(e));
                    }
                }
                return false;
            };
            Util._getSessionStorageObject = function () {
                try {
                    if (window.sessionStorage) {
                        return window.sessionStorage;
                    }
                    else {
                        return null;
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.warnToConsole('Failed to get client session storage: ' + e.message);
                    return null;
                }
            };
            Util.canUseSessionStorage = function () {
                return !!Util._getSessionStorageObject();
            };
            Util.getSessionStorage = function (name) {
                var storage = Util._getSessionStorageObject();
                if (storage !== null) {
                    try {
                        return storage.getItem(name);
                    }
                    catch (e) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Browser failed read of session storage." + Util.dump(e));
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
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Browser failed write to session storage." + Util.dump(e));
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
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Browser failed removal of session storage item." + Util.dump(e));
                    }
                }
                return false;
            };
            Util.setCookie = function (name, value) {
                Util.document.cookie = name + "=" + value + ";path=/";
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
            Util.newGuid = function () {
                var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
                var oct = "", tmp;
                for (var a = 0; a < 4; a++) {
                    tmp = (4294967296 * Math.random()) | 0;
                    oct += hexValues[tmp & 0xF] + hexValues[tmp >> 4 & 0xF] + hexValues[tmp >> 8 & 0xF] + hexValues[tmp >> 12 & 0xF] + hexValues[tmp >> 16 & 0xF] + hexValues[tmp >> 20 & 0xF] + hexValues[tmp >> 24 & 0xF] + hexValues[tmp >> 28 & 0xF];
                }
                var clockSequenceHi = hexValues[8 + (Math.random() * 4) | 0];
                return oct.substr(0, 8) + "-" + oct.substr(9, 4) + "-4" + oct.substr(13, 3) + "-" + clockSequenceHi + oct.substr(16, 3) + "-" + oct.substr(19, 12);
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
                        return date.getUTCFullYear() + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate()) + "T" + pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + "." + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + "Z";
                    }
                }
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
                return (message == "Script error." || message == "Script error") && url == "" && lineNumber == 0 && columnNumber == 0 && error == null;
            };
            Util.dump = function (object) {
                var objectTypeDump = Object.prototype.toString.call(object);
                var propertyValueDump = JSON.stringify(object);
                if (objectTypeDump === "[object Error]") {
                    propertyValueDump = "{ stack: '" + object.stack + "', message: '" + object.message + "', name: '" + object.name + "'";
                }
                return objectTypeDump + propertyValueDump;
            };
            Util.addEventHandler = function (eventName, callback) {
                if (!window || typeof eventName !== 'string' || typeof callback !== 'function') {
                    return false;
                }
                var verbEventName = 'on' + eventName;
                if (window.addEventListener) {
                    window.addEventListener(eventName, callback, false);
                }
                else if (window.attachEvent) {
                    window.attachEvent(verbEventName, callback);
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
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
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
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(0 /* CRITICAL */, "cannot serialize " + name + " because it is null or undefined");
                    return output;
                }
                if (source[circularReferenceCheck]) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "Circular reference detected while serializing: '" + name);
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
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "Attempting to serialize an object which does not implement ISerializable: " + name);
                        try {
                            JSON.stringify(source);
                            output = source;
                        }
                        catch (e) {
                            ApplicationInsights._InternalLogging.throwInternalUserActionable(0 /* CRITICAL */, e && typeof e.toString === 'function' ? e.toString() : "Error serializing object");
                        }
                    }
                    return output;
                }
                source[circularReferenceCheck] = true;
                for (var field in source.aiDataContract) {
                    var isRequired = source.aiDataContract[field];
                    var isArray = typeof isRequired !== "boolean";
                    var isPresent = source[field] !== undefined;
                    var isObject = typeof source[field] === "object" && source[field] !== null;
                    if (isRequired && !isPresent && !isArray) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Missing required field specification: The field '" + field + "' on '" + name + "' is required but not present on source");
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
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(0 /* CRITICAL */, "This field was specified as an array in the contract but the item is not an array.\r\n" + name);
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
                            ApplicationInsights._InternalLogging.throwInternalUserActionable(0 /* CRITICAL */, output[field]);
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
var __extends = this.__extends || function (d, b) {
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
                        _super.call(this);
                        this.name = name;
                        this.data = data;
                        this.time = ApplicationInsights.Util.toISOStringForIE8(new Date());
                        this.aiDataContract = {
                            time: true,
                            iKey: true,
                            name: true,
                            tags: true,
                            data: true
                        };
                    }
                    return Envelope;
                })(Microsoft.Telemetry.Envelope);
                Common.Envelope = Envelope;
            })(Common = Telemetry.Common || (Telemetry.Common = {}));
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
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
            var Device = (function () {
                function Device() {
                    this.id = "browser";
                    if (typeof screen !== "undefined" && screen.width && screen.height) {
                        this.resolution = screen.width + "X" + screen.height;
                    }
                    this.locale = (typeof screen !== "undefined" && navigator.browserLanguage) ? navigator.browserLanguage : "unknown";
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
            var Internal = (function () {
                function Internal() {
                    this.sdkVersion = "JavaScript:" + ApplicationInsights.Version;
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
            var Operation = (function () {
                function Operation() {
                    this.id = ApplicationInsights.Util.newGuid();
                }
                return Operation;
            })();
            Context.Operation = Operation;
        })(Context = ApplicationInsights.Context || (ApplicationInsights.Context = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var SamplingScoreGenerator = (function () {
            function SamplingScoreGenerator() {
            }
            SamplingScoreGenerator.getScore = function (envelope) {
                var tagKeys = new AI.ContextTagKeys();
                var score = 0;
                if (envelope.tags[tagKeys.userId]) {
                    score = SamplingScoreGenerator.getSamplingHashCode(envelope.tags[tagKeys.userId]) / SamplingScoreGenerator.INT_MAX_VALUE;
                }
                else if (envelope.tags[tagKeys.operationId]) {
                    score = SamplingScoreGenerator.getSamplingHashCode(envelope.tags[tagKeys.operationId]) / SamplingScoreGenerator.INT_MAX_VALUE;
                }
                else {
                    score = Math.random();
                }
                return score * 100;
            };
            SamplingScoreGenerator.getSamplingHashCode = function (input) {
                if (input == "") {
                    return 0;
                }
                var hash = 5381;
                for (var i = 0; i < input.length; ++i) {
                    hash = ((hash << 5) + hash) + input.charCodeAt(i);
                    hash = hash & hash;
                }
                return Math.abs(hash);
            };
            SamplingScoreGenerator.INT_MAX_VALUE = 2147483647;
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
            var Sample = (function () {
                function Sample(sampleRate) {
                    this.INT_MAX_VALUE = 2147483647;
                    if (sampleRate > 100 || sampleRate < 0) {
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "Sampling rate is out of range (0..100): '" + sampleRate + "'. Sampling will be disabled, you may be sending too much data which may affect your AI service level.");
                        this.sampleRate = 100;
                    }
                    this.sampleRate = sampleRate;
                }
                Sample.prototype.isSampledIn = function (envelope) {
                    if (this.sampleRate == 100)
                        return true;
                    var score = ApplicationInsights.SamplingScoreGenerator.getScore(envelope);
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
            var Session = (function () {
                function Session() {
                }
                return Session;
            })();
            Context.Session = Session;
            var _SessionManager = (function () {
                function _SessionManager(config, sessionHandler) {
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
                    this._sessionHandler = sessionHandler;
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
                        if (typeof this._sessionHandler === "function") {
                            this._sessionHandler(1 /* End */, this.automaticSession.renewalDate);
                        }
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
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Error parsing ai_session cookie, session will be reset: " + ApplicationInsights.Util.dump(e));
                    }
                    if (this.automaticSession.renewalDate == 0) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "AI session renewal date is 0, session will be reset.");
                    }
                };
                _SessionManager.prototype.renew = function () {
                    var now = +new Date;
                    this.automaticSession.id = ApplicationInsights.Util.newGuid();
                    this.automaticSession.acquisitionDate = now;
                    this.automaticSession.renewalDate = now;
                    this.setCookie(this.automaticSession.id, this.automaticSession.acquisitionDate, this.automaticSession.renewalDate);
                    if (typeof this._sessionHandler === "function") {
                        this._sessionHandler(0 /* Start */, now);
                    }
                    if (!ApplicationInsights.Util.canUseLocalStorage()) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "Browser does not support local storage. Session durations will be inaccurate.");
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
                    ApplicationInsights.Util.setCookie('ai_session', cookie.join('|') + ';expires=' + cookieExpiry.toUTCString());
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
            var User = (function () {
                function User(accountId) {
                    var cookie = ApplicationInsights.Util.getCookie(User.userCookieName);
                    if (cookie) {
                        var params = cookie.split(User.cookieSeparator);
                        if (params.length > 0) {
                            this.id = params[0];
                        }
                    }
                    if (!this.id) {
                        this.id = ApplicationInsights.Util.newGuid();
                        var date = new Date();
                        var acqStr = ApplicationInsights.Util.toISOStringForIE8(date);
                        this.accountAcquisitionDate = acqStr;
                        date.setTime(date.getTime() + 31536000000);
                        var newCookie = [this.id, acqStr];
                        ApplicationInsights.Util.setCookie(User.userCookieName, newCookie.join(User.cookieSeparator) + ';expires=' + date.toUTCString());
                        ApplicationInsights.Util.removeStorage('ai_session');
                    }
                    this.accountId = accountId;
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
                        ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "Setting auth user context failed. " + "User auth/account id should be of type string, and not contain commas, semi-colons, equal signs, spaces, or vertical-bars.");
                        return;
                    }
                    this.authenticatedId = authenticatedUserId;
                    var authCookie = this.authenticatedId;
                    if (accountId) {
                        this.accountId = accountId;
                        authCookie = [this.authenticatedId, this.accountId].join(User.cookieSeparator);
                    }
                    ApplicationInsights.Util.setCookie(User.authUserCookieName, encodeURI(authCookie));
                };
                User.prototype.clearAuthenticatedUserContext = function () {
                    this.authenticatedId = null;
                    this.accountId = null;
                    ApplicationInsights.Util.deleteCookie(User.authUserCookieName);
                };
                User.prototype.validateUserInput = function (id) {
                    if (typeof id !== 'string' || !id || id.match(/,|;|=| |\|/)) {
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
        var Sender = (function () {
            function Sender(config) {
                this._buffer = [];
                this._lastSend = 0;
                this._config = config;
                this._sender = null;
                if (typeof XMLHttpRequest != "undefined") {
                    var testXhr = new XMLHttpRequest();
                    if ("withCredentials" in testXhr) {
                        this._sender = this._xhrSender;
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
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Cannot send empty telemetry");
                        return;
                    }
                    if (!this._sender) {
                        ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Sender was not initialized");
                        return;
                    }
                    var payload = ApplicationInsights.Serializer.serialize(envelope);
                    if (this._getSizeInBytes(this._buffer) + payload.length > this._config.maxBatchSizeInBytes()) {
                        this.triggerSend();
                    }
                    this._buffer.push(payload);
                    if (!this._timeoutHandle) {
                        this._timeoutHandle = setTimeout(function () {
                            _this._timeoutHandle = null;
                            _this.triggerSend();
                        }, this._config.maxBatchInterval());
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Failed adding telemetry to the sender's buffer, some telemetry will be lost: " + ApplicationInsights.Util.dump(e));
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
                        if (this._buffer.length) {
                            var batch = this._config.emitLineDelimitedJson() ? this._buffer.join("\n") : "[" + this._buffer.join(",") + "]";
                            this._sender(batch, isAsync);
                        }
                        this._lastSend = +new Date;
                    }
                    this._buffer.length = 0;
                    clearTimeout(this._timeoutHandle);
                    this._timeoutHandle = null;
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "Telemetry transmission failed, some telemetry will be lost: " + ApplicationInsights.Util.dump(e));
                }
            };
            Sender.prototype._xhrSender = function (payload, isAsync) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", this._config.endpointUrl(), isAsync);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = function () { return Sender._xhrReadyStateChange(xhr, payload); };
                xhr.onerror = function (event) { return Sender._onError(payload, xhr.responseText || xhr.response || "", event); };
                xhr.send(payload);
            };
            Sender.prototype._xdrSender = function (payload, isAsync) {
                var xdr = new XDomainRequest();
                xdr.onload = function () { return Sender._xdrOnLoad(xdr, payload); };
                xdr.onerror = function (event) { return Sender._onError(payload, xdr.responseText || "", event); };
                xdr.open('POST', this._config.endpointUrl());
                xdr.send(payload);
            };
            Sender._xhrReadyStateChange = function (xhr, payload) {
                if (xhr.readyState === 4) {
                    if ((xhr.status < 200 || xhr.status >= 300) && xhr.status !== 0) {
                        Sender._onError(payload, xhr.responseText || xhr.response || "");
                    }
                    else {
                        Sender._onSuccess(payload);
                    }
                }
            };
            Sender._xdrOnLoad = function (xdr, payload) {
                if (xdr && (xdr.responseText + "" === "200" || xdr.responseText === "")) {
                    Sender._onSuccess(payload);
                }
                else {
                    Sender._onError(payload, xdr && xdr.responseText || "");
                }
            };
            Sender._onError = function (payload, message, event) {
                ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "Failed to send telemetry:\n" + message);
            };
            Sender._onSuccess = function (payload) {
            };
            return Sender;
        })();
        ApplicationInsights.Sender = Sender;
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
var AI;
(function (AI) {
    "use strict";
    var MessageData = (function (_super) {
        __extends(MessageData, _super);
        function MessageData() {
            this.ver = 2;
            this.properties = {};
            _super.call(this);
        }
        return MessageData;
    })(Microsoft.Telemetry.Domain);
    AI.MessageData = MessageData;
})(AI || (AI = {}));
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
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "name contains illegal characters. Illgeal character have been replaced with '_'. new name: " + name);
                            }
                            if (name.length > DataSanitizer.MAX_NAME_LENGTH) {
                                name = name.substring(0, DataSanitizer.MAX_NAME_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "name is too long.  It has been truncated to " + DataSanitizer.MAX_NAME_LENGTH + " characters.  name: " + name);
                            }
                        }
                        return name;
                    };
                    DataSanitizer.sanitizeString = function (value) {
                        if (value) {
                            value = ApplicationInsights.Util.trim(value);
                            if (value.toString().length > DataSanitizer.MAX_STRING_LENGTH) {
                                value = value.substring(0, DataSanitizer.MAX_STRING_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "string value is too long. It has been truncated to " + DataSanitizer.MAX_STRING_LENGTH + " characters. value: " + value);
                            }
                        }
                        return value;
                    };
                    DataSanitizer.sanitizeUrl = function (url) {
                        if (url) {
                            if (url.length > DataSanitizer.MAX_URL_LENGTH) {
                                url = url.substring(0, DataSanitizer.MAX_URL_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "url is too long, it has been trucated to " + DataSanitizer.MAX_URL_LENGTH + " characters. url: " + url);
                            }
                        }
                        return url;
                    };
                    DataSanitizer.sanitizeMessage = function (message) {
                        if (message) {
                            if (message.length > DataSanitizer.MAX_MESSAGE_LENGTH) {
                                message = message.substring(0, DataSanitizer.MAX_MESSAGE_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "message is too long, it has been trucated to " + DataSanitizer.MAX_MESSAGE_LENGTH + " characters.  message: " + message);
                            }
                        }
                        return message;
                    };
                    DataSanitizer.sanitizeException = function (exception) {
                        if (exception) {
                            if (exception.length > DataSanitizer.MAX_EXCEPTION_LENGTH) {
                                exception = exception.substring(0, DataSanitizer.MAX_EXCEPTION_LENGTH);
                                ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "exception is too long, iit has been trucated to " + DataSanitizer.MAX_EXCEPTION_LENGTH + " characters.  exception: " + exception);
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
                        ver: true,
                        message: true,
                        severityLevel: false,
                        measurements: false,
                        properties: false
                    };
                    message = message || ApplicationInsights.Util.NotSpecified;
                    this.message = Telemetry.Common.DataSanitizer.sanitizeMessage(message);
                    this.properties = Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                }
                Trace.envelopeType = "Microsoft.ApplicationInsights.Message";
                Trace.dataType = "MessageData";
                return Trace;
            })(AI.MessageData);
            Telemetry.Trace = Trace;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return EventData;
    })(Microsoft.Telemetry.Domain);
    AI.EventData = EventData;
})(AI || (AI = {}));
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
                        ver: true,
                        name: true,
                        properties: false,
                        measurements: false
                    };
                    this.name = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeString(name);
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                }
                Event.envelopeType = "Microsoft.ApplicationInsights.Event";
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
var AI;
(function (AI) {
    "use strict";
    var ExceptionData = (function (_super) {
        __extends(ExceptionData, _super);
        function ExceptionData() {
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
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var Exception = (function (_super) {
                __extends(Exception, _super);
                function Exception(exception, handledAt, properties, measurements) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: true,
                        handledAt: true,
                        exceptions: true,
                        severityLevel: false,
                        properties: false,
                        measurements: false
                    };
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                    this.handledAt = handledAt || "unhandled";
                    this.exceptions = [new _ExceptionDetails(exception)];
                }
                Exception.CreateSimpleException = function (message, typeName, assembly, fileName, details, line, handledAt) {
                    var exceptionTelemetry;
                    try {
                        throw new Error();
                    }
                    catch (e) {
                        exceptionTelemetry = new Telemetry.Exception(e);
                    }
                    var stack = exceptionTelemetry.exceptions[0].parsedStack[0];
                    stack.assembly = assembly;
                    stack.fileName = fileName;
                    stack.level = 0;
                    stack.line = line;
                    stack.method = "unknown";
                    var exception = exceptionTelemetry.exceptions[0];
                    exception.hasFullStack = true;
                    exception.message = message;
                    exception.parsedStack = null;
                    exception.stack = details;
                    exception.typeName = typeName;
                    exceptionTelemetry.handledAt = handledAt || "unhandled";
                    return exceptionTelemetry;
                };
                Exception.envelopeType = "Microsoft.ApplicationInsights.Exception";
                Exception.dataType = "ExceptionData";
                return Exception;
            })(AI.ExceptionData);
            Telemetry.Exception = Exception;
            var _ExceptionDetails = (function (_super) {
                __extends(_ExceptionDetails, _super);
                function _ExceptionDetails(exception) {
                    _super.call(this);
                    this.aiDataContract = {
                        id: false,
                        outerId: false,
                        typeName: true,
                        message: true,
                        hasFullStack: false,
                        stack: false,
                        parsedStack: []
                    };
                    this.typeName = Telemetry.Common.DataSanitizer.sanitizeString(exception.name || ApplicationInsights.Util.NotSpecified);
                    this.message = Telemetry.Common.DataSanitizer.sanitizeMessage(exception.message || ApplicationInsights.Util.NotSpecified);
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
                        level: true,
                        method: true,
                        assembly: false,
                        fileName: false,
                        line: false
                    };
                    this.level = level;
                    this.method = "unavailable";
                    this.assembly = ApplicationInsights.Util.trim(frame);
                    var matches = frame.match(_StackFrame.regex);
                    if (matches && matches.length >= 5) {
                        this.method = ApplicationInsights.Util.trim(matches[2]);
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
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    var MetricData = (function (_super) {
        __extends(MetricData, _super);
        function MetricData() {
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
var AI;
(function (AI) {
    "use strict";
    var DataPoint = (function () {
        function DataPoint() {
            this.kind = 0 /* Measurement */;
        }
        return DataPoint;
    })();
    AI.DataPoint = DataPoint;
})(AI || (AI = {}));
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
                            name: true,
                            kind: false,
                            value: true,
                            count: false,
                            min: false,
                            max: false,
                            stdDev: false
                        };
                    }
                    return DataPoint;
                })(AI.DataPoint);
                Common.DataPoint = DataPoint;
            })(Common = Telemetry.Common || (Telemetry.Common = {}));
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
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
                        ver: true,
                        metrics: true,
                        properties: false
                    };
                    var dataPoint = new Microsoft.ApplicationInsights.Telemetry.Common.DataPoint();
                    dataPoint.count = count > 0 ? count : undefined;
                    dataPoint.max = isNaN(max) || max === null ? undefined : max;
                    dataPoint.min = isNaN(min) || min === null ? undefined : min;
                    dataPoint.name = Telemetry.Common.DataSanitizer.sanitizeString(name);
                    dataPoint.value = value;
                    this.metrics = [dataPoint];
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                }
                Metric.envelopeType = "Microsoft.ApplicationInsights.Metric";
                Metric.dataType = "MetricData";
                return Metric;
            })(AI.MetricData);
            Telemetry.Metric = Metric;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    var PageViewData = (function (_super) {
        __extends(PageViewData, _super);
        function PageViewData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return PageViewData;
    })(AI.EventData);
    AI.PageViewData = PageViewData;
})(AI || (AI = {}));
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
                        ver: true,
                        name: false,
                        url: false,
                        duration: false,
                        properties: false,
                        measurements: false
                    };
                    this.url = Telemetry.Common.DataSanitizer.sanitizeUrl(url);
                    this.name = Telemetry.Common.DataSanitizer.sanitizeString(name || ApplicationInsights.Util.NotSpecified);
                    if (!isNaN(durationMs)) {
                        this.duration = ApplicationInsights.Util.msToTimeSpan(durationMs);
                    }
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                }
                PageView.envelopeType = "Microsoft.ApplicationInsights.Pageview";
                PageView.dataType = "PageviewData";
                return PageView;
            })(AI.PageViewData);
            Telemetry.PageView = PageView;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    var PageViewPerfData = (function (_super) {
        __extends(PageViewPerfData, _super);
        function PageViewPerfData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return PageViewPerfData;
    })(AI.PageViewData);
    AI.PageViewPerfData = PageViewPerfData;
})(AI || (AI = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var PageViewPerformance = (function (_super) {
                __extends(PageViewPerformance, _super);
                function PageViewPerformance(name, url, durationMs, properties, measurements) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: true,
                        name: false,
                        url: false,
                        duration: false,
                        perfTotal: false,
                        networkConnect: false,
                        sentRequest: false,
                        receivedResponse: false,
                        domProcessing: false,
                        properties: false,
                        measurements: false
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
                            ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "error calculating page view performance: total='" + total + "', network='" + network + "', request='" + request + "', response='" + response + "', dom='" + dom + "'");
                        }
                        else if (total < Math.floor(network) + Math.floor(request) + Math.floor(response) + Math.floor(dom)) {
                            ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "client performance math error:" + total + " < " + network + " + " + request + " + " + response + " + " + dom);
                        }
                        else {
                            durationMs = total;
                            this.perfTotal = ApplicationInsights.Util.msToTimeSpan(total);
                            this.networkConnect = ApplicationInsights.Util.msToTimeSpan(network);
                            this.sentRequest = ApplicationInsights.Util.msToTimeSpan(request);
                            this.receivedResponse = ApplicationInsights.Util.msToTimeSpan(response);
                            this.domProcessing = ApplicationInsights.Util.msToTimeSpan(dom);
                            this.isValid = true;
                        }
                    }
                    this.url = Telemetry.Common.DataSanitizer.sanitizeUrl(url);
                    this.name = Telemetry.Common.DataSanitizer.sanitizeString(name || ApplicationInsights.Util.NotSpecified);
                    if (!isNaN(durationMs)) {
                        this.duration = ApplicationInsights.Util.msToTimeSpan(durationMs);
                    }
                    this.properties = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(properties);
                    this.measurements = ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeMeasurements(measurements);
                }
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
                    return timing.domainLookupStart > 0 && timing.navigationStart > 0 && timing.responseStart > 0 && timing.requestStart > 0 && timing.loadEventEnd > 0 && timing.responseEnd > 0 && timing.connectEnd > 0 && timing.domLoading > 0;
                };
                PageViewPerformance.getDuration = function (start, end) {
                    var duration = 0;
                    if (!(isNaN(start) || isNaN(end))) {
                        duration = Math.max(end - start, 0);
                    }
                    return duration;
                };
                PageViewPerformance.envelopeType = "Microsoft.ApplicationInsights.PageviewPerformance";
                PageViewPerformance.dataType = "PageviewPerformanceData";
                return PageViewPerformance;
            })(AI.PageViewPerfData);
            Telemetry.PageViewPerformance = PageViewPerformance;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var AI;
(function (AI) {
    "use strict";
    var SessionStateData = (function (_super) {
        __extends(SessionStateData, _super);
        function SessionStateData() {
            this.ver = 2;
            this.state = 0 /* Start */;
            _super.call(this);
        }
        return SessionStateData;
    })(Microsoft.Telemetry.Domain);
    AI.SessionStateData = SessionStateData;
})(AI || (AI = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        var Telemetry;
        (function (Telemetry) {
            "use strict";
            var SessionTelemetry = (function (_super) {
                __extends(SessionTelemetry, _super);
                function SessionTelemetry(state) {
                    _super.call(this);
                    this.aiDataContract = {
                        ver: true,
                        state: true
                    };
                    this.state = state;
                }
                SessionTelemetry.envelopeType = "Microsoft.ApplicationInsights.SessionState";
                SessionTelemetry.dataType = "SessionStateData";
                return SessionTelemetry;
            })(AI.SessionStateData);
            Telemetry.SessionTelemetry = SessionTelemetry;
        })(Telemetry = ApplicationInsights.Telemetry || (ApplicationInsights.Telemetry = {}));
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        var TelemetryContext = (function () {
            function TelemetryContext(config) {
                var _this = this;
                this._config = config;
                this._sender = new ApplicationInsights.Sender(config);
                if (typeof window !== 'undefined') {
                    this._sessionManager = new ApplicationInsights.Context._SessionManager(config, function (sessionState, timestamp) { return TelemetryContext._sessionHandler(_this, sessionState, timestamp); });
                    this.application = new ApplicationInsights.Context.Application();
                    this.device = new ApplicationInsights.Context.Device();
                    this.internal = new ApplicationInsights.Context.Internal();
                    this.location = new ApplicationInsights.Context.Location();
                    this.user = new ApplicationInsights.Context.User(config.accountId());
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
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(0 /* CRITICAL */, "cannot call .track() with a null or undefined argument");
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
                var telemetryInitializersFailed = false;
                try {
                    this.telemetryInitializers = this.telemetryInitializers || [];
                    var telemetryInitializersCount = this.telemetryInitializers.length;
                    for (var i = 0; i < telemetryInitializersCount; ++i) {
                        var telemetryInitializer = this.telemetryInitializers[i];
                        if (telemetryInitializer) {
                            telemetryInitializer.apply(null, [envelope]);
                        }
                    }
                }
                catch (e) {
                    telemetryInitializersFailed = true;
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(0 /* CRITICAL */, "One of telemetry initializers failed, telemetry item will not be sent: " + ApplicationInsights.Util.dump(e));
                }
                if (!telemetryInitializersFailed) {
                    if (envelope.name === ApplicationInsights.Telemetry.SessionTelemetry.envelopeType || envelope.name === ApplicationInsights.Telemetry.Metric.envelopeType || this.sample.isSampledIn(envelope)) {
                        this._sender.send(envelope);
                    }
                    else {
                        ApplicationInsights._InternalLogging.logInternalMessage(1 /* WARNING */, "Telemetry is sampled and not sent to the AI service. SampleRate is " + this.sample.sampleRate);
                    }
                }
                return envelope;
            };
            TelemetryContext._sessionHandler = function (tc, sessionState, timestamp) {
                var sessionStateTelemetry = new ApplicationInsights.Telemetry.SessionTelemetry(sessionState);
                var sessionStateData = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.SessionTelemetry.dataType, sessionStateTelemetry);
                var sessionStateEnvelope = new ApplicationInsights.Telemetry.Common.Envelope(sessionStateData, ApplicationInsights.Telemetry.SessionTelemetry.envelopeType);
                sessionStateEnvelope.time = ApplicationInsights.Util.toISOStringForIE8(new Date(timestamp));
                tc._track(sessionStateEnvelope);
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
                    var tagKeys = new AI.ContextTagKeys();
                    envelope.tags[tagKeys.sampleRate] = sampleContext.sampleRate;
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
                    if (typeof userContext.accountAcquisitionDate === "string") {
                        envelope.tags[tagKeys.userAccountAcquisitionDate] = userContext.accountAcquisitionDate;
                    }
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
                            baseType: true,
                            baseData: true
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
var Microsoft;
(function (Microsoft) {
    var ApplicationInsights;
    (function (ApplicationInsights) {
        "use strict";
        ApplicationInsights.Version = "0.18.0";
        var AppInsights = (function () {
            function AppInsights(config) {
                var _this = this;
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
                    appUserId: function () { return _this.config.appUserId; },
                    sessionRenewalMs: function () { return _this.config.sessionRenewalMs; },
                    sessionExpirationMs: function () { return _this.config.sessionExpirationMs; },
                    endpointUrl: function () { return _this.config.endpointUrl; },
                    emitLineDelimitedJson: function () { return _this.config.emitLineDelimitedJson; },
                    maxBatchSizeInBytes: function () { return _this.config.maxBatchSizeInBytes; },
                    maxBatchInterval: function () { return _this.config.maxBatchInterval; },
                    disableTelemetry: function () { return _this.config.disableTelemetry; },
                    sampleRate: function () { return _this.config.samplingPercentage; }
                };
                this.context = new ApplicationInsights.TelemetryContext(configGetters);
                this._eventTracking = new Timing("trackEvent");
                this._eventTracking.action = function (name, url, duration, properties, measurements) {
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
            }
            AppInsights.prototype.sendPageViewInternal = function (name, url, duration, properties, measurements) {
                var pageView = new ApplicationInsights.Telemetry.PageView(name, url, duration, properties, measurements);
                var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.PageView.dataType, pageView);
                var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.PageView.envelopeType);
                this.context.track(envelope);
            };
            AppInsights.prototype.startTrackPage = function (name) {
                try {
                    if (typeof name !== "string") {
                        name = window.document && window.document.title || "";
                    }
                    this._pageTracking.start(name);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "startTrackPage failed, page view may not be collected: " + ApplicationInsights.Util.dump(e));
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
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "stopTrackPage failed, page view will not be collected: " + ApplicationInsights.Util.dump(e));
                }
            };
            AppInsights.prototype.trackPageView = function (name, url, properties, measurements) {
                try {
                    if (typeof name !== "string") {
                        name = window.document && window.document.title || "";
                    }
                    if (typeof url !== "string") {
                        url = window.location && window.location.href || "";
                    }
                    this.trackPageViewInternal(name, url, properties, measurements);
                    if (this.config.autoTrackPageVisitTime) {
                        this._pageVisitTimeManager.trackPreviousPageVisit(name, url);
                    }
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "trackPageView failed, page view will not be collected: " + ApplicationInsights.Util.dump(e));
                }
            };
            AppInsights.prototype.trackPageViewInternal = function (name, url, properties, measurements) {
                var _this = this;
                var durationMs = 0;
                if (ApplicationInsights.Telemetry.PageViewPerformance.isPerformanceTimingSupported()) {
                    var startTime = window.performance.timing.navigationStart;
                    durationMs = ApplicationInsights.Telemetry.PageViewPerformance.getDuration(startTime, +new Date);
                    var handle = setInterval(function () {
                        try {
                            durationMs = ApplicationInsights.Telemetry.PageViewPerformance.getDuration(startTime, +new Date);
                            var timingDataReady = ApplicationInsights.Telemetry.PageViewPerformance.isPerformanceTimingDataReady();
                            var timeoutReached = durationMs > 60000;
                            if (timeoutReached || timingDataReady) {
                                clearInterval(handle);
                                durationMs = ApplicationInsights.Telemetry.PageViewPerformance.getDuration(startTime, +new Date);
                                var pageViewPerformance = new ApplicationInsights.Telemetry.PageViewPerformance(name, url, durationMs, properties, measurements);
                                _this.sendPageViewInternal(name, url, pageViewPerformance.isValid && !isNaN(pageViewPerformance.duration) ? +pageViewPerformance.duration : durationMs, properties, measurements);
                                if (pageViewPerformance.isValid) {
                                    var pageViewPerformanceData = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.PageViewPerformance.dataType, pageViewPerformance);
                                    var pageViewPerformanceEnvelope = new ApplicationInsights.Telemetry.Common.Envelope(pageViewPerformanceData, ApplicationInsights.Telemetry.PageViewPerformance.envelopeType);
                                    _this.context.track(pageViewPerformanceEnvelope);
                                }
                                _this.context._sender.triggerSend();
                            }
                        }
                        catch (e) {
                            ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "trackPageView failed on page load calculation: " + ApplicationInsights.Util.dump(e));
                        }
                    }, 100);
                }
            };
            AppInsights.prototype.startTrackEvent = function (name) {
                try {
                    this._eventTracking.start(name);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "startTrackEvent failed, event will not be collected: " + ApplicationInsights.Util.dump(e));
                }
            };
            AppInsights.prototype.stopTrackEvent = function (name, properties, measurements) {
                try {
                    this._eventTracking.stop(name, undefined, properties, measurements);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "stopTrackEvent failed, event will not be collected: " + ApplicationInsights.Util.dump(e));
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
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "trackEvent failed, event will not be collected: " + ApplicationInsights.Util.dump(e));
                }
            };
            AppInsights.prototype.trackException = function (exception, handledAt, properties, measurements) {
                try {
                    if (!ApplicationInsights.Util.isError(exception)) {
                        try {
                            throw new Error(exception);
                        }
                        catch (error) {
                            exception = error;
                        }
                    }
                    var exceptionTelemetry = new ApplicationInsights.Telemetry.Exception(exception, handledAt, properties, measurements);
                    var data = new ApplicationInsights.Telemetry.Common.Data(ApplicationInsights.Telemetry.Exception.dataType, exceptionTelemetry);
                    var envelope = new ApplicationInsights.Telemetry.Common.Envelope(data, ApplicationInsights.Telemetry.Exception.envelopeType);
                    this.context.track(envelope);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "trackException failed, exception will not be collected: " + ApplicationInsights.Util.dump(e));
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
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "trackMetric failed, metric will not be collected: " + ApplicationInsights.Util.dump(e));
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
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, "trackTrace failed, trace will not be collected: " + ApplicationInsights.Util.dump(e));
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
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "flush failed, telemetry will not be collected: " + ApplicationInsights.Util.dump(e));
                }
            };
            AppInsights.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId) {
                try {
                    this.context.user.setAuthenticatedUserContext(authenticatedUserId, accountId);
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "Setting auth user context failed. " + ApplicationInsights.Util.dump(e));
                }
            };
            AppInsights.prototype.clearAuthenticatedUserContext = function () {
                try {
                    this.context.user.clearAuthenticatedUserContext();
                }
                catch (e) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "Clearing auth user context failed. " + ApplicationInsights.Util.dump(e));
                }
            };
            AppInsights.prototype.SendCORSException = function (properties) {
                var exceptionData = Microsoft.ApplicationInsights.Telemetry.Exception.CreateSimpleException("Script error.", "Error", "unknown", "unknown", "The browser’s same-origin policy prevents us from getting the details of this exception.The exception occurred in a script loaded from an origin different than the web page.For cross- domain error reporting you can use crossorigin attribute together with appropriate CORS HTTP headers.For more information please see http://www.w3.org/TR/cors/.", 0, null);
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
                    ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, "_onerror threw " + exceptionDump + " while logging error, error will not be collected: " + errorString);
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
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "start" + this._name + " was called more than once for this event without calling stop" + this._name + ". key is '" + name + "'");
                }
                this._events[name] = +new Date;
            };
            Timing.prototype.stop = function (name, url, properties, measurements) {
                var start = this._events[name];
                if (isNaN(start)) {
                    ApplicationInsights._InternalLogging.throwInternalUserActionable(1 /* WARNING */, "stop" + this._name + " was called without a corresponding start" + this._name + " . Event name is '" + name + "'");
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
var AI;
(function (AI) {
    "use strict";
    var AjaxCallData = (function (_super) {
        __extends(AjaxCallData, _super);
        function AjaxCallData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return AjaxCallData;
    })(AI.PageViewData);
    AI.AjaxCallData = AjaxCallData;
})(AI || (AI = {}));
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
var AI;
(function (AI) {
    "use strict";
    var RemoteDependencyData = (function (_super) {
        __extends(RemoteDependencyData, _super);
        function RemoteDependencyData() {
            this.ver = 2;
            this.kind = 0 /* Measurement */;
            this.dependencyKind = 2 /* Other */;
            this.success = true;
            this.dependencySource = 0 /* Undefined */;
            this.properties = {};
            _super.call(this);
        }
        return RemoteDependencyData;
    })(Microsoft.Telemetry.Domain);
    AI.RemoteDependencyData = RemoteDependencyData;
})(AI || (AI = {}));
var AI;
(function (AI) {
    "use strict";
    var RequestData = (function (_super) {
        __extends(RequestData, _super);
        function RequestData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
            _super.call(this);
        }
        return RequestData;
    })(Microsoft.Telemetry.Domain);
    AI.RequestData = RequestData;
})(AI || (AI = {}));
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
                    var message = "Failed to send queued telemetry";
                    if (exception && typeof exception.toString === "function") {
                        message += ": " + exception.toString();
                    }
                    Microsoft.ApplicationInsights._InternalLogging.throwInternalNonUserActionable(1 /* WARNING */, message);
                }
            };
            Initialization.prototype.pollInteralLogs = function (appInsightsInstance) {
                return setInterval(function () {
                    var queue = Microsoft.ApplicationInsights._InternalLogging.queue;
                    var length = queue.length;
                    for (var i = 0; i < length; i++) {
                        appInsightsInstance.trackTrace(queue[i]);
                    }
                    queue.length = 0;
                }, this.config.diagnosticLogInterval);
            };
            Initialization.prototype.addHousekeepingBeforeUnload = function (appInsightsInstance) {
                if ('onbeforeunload' in window) {
                    var performHousekeeping = function () {
                        appInsightsInstance.context._sender.triggerSend();
                        appInsightsInstance.context._sessionManager.backup();
                    };
                    if (!Microsoft.ApplicationInsights.Util.addEventHandler('beforeunload', performHousekeeping)) {
                        Microsoft.ApplicationInsights._InternalLogging.throwInternalNonUserActionable(0 /* CRITICAL */, 'Could not add handler for beforeunload');
                    }
                }
            };
            Initialization.getDefaultConfig = function (config) {
                if (!config) {
                    config = {};
                }
                config.endpointUrl = config.endpointUrl || "//dc.services.visualstudio.com/v2/track";
                config.accountId = config.accountId;
                config.appUserId = config.appUserId;
                config.sessionRenewalMs = 30 * 60 * 1000;
                config.sessionExpirationMs = 24 * 60 * 60 * 1000;
                config.maxBatchSizeInBytes = config.maxBatchSizeInBytes > 0 ? config.maxBatchSizeInBytes : 1000000;
                config.maxBatchInterval = !isNaN(config.maxBatchInterval) ? config.maxBatchInterval : 15000;
                config.enableDebug = ApplicationInsights.Util.stringToBoolOrDefault(config.enableDebug);
                config.autoCollectErrors = (config.autoCollectErrors !== undefined && config.autoCollectErrors !== null) ? ApplicationInsights.Util.stringToBoolOrDefault(config.autoCollectErrors) : true;
                config.disableTelemetry = ApplicationInsights.Util.stringToBoolOrDefault(config.disableTelemetry);
                config.verboseLogging = ApplicationInsights.Util.stringToBoolOrDefault(config.verboseLogging);
                config.emitLineDelimitedJson = ApplicationInsights.Util.stringToBoolOrDefault(config.emitLineDelimitedJson);
                config.diagnosticLogInterval = config.diagnosticLogInterval || 10000;
                config.autoTrackPageVisitTime = ApplicationInsights.Util.stringToBoolOrDefault(config.autoTrackPageVisitTime);
                if (isNaN(config.samplingPercentage) || config.samplingPercentage <= 0 || config.samplingPercentage >= 100) {
                    config.samplingPercentage = 100;
                }
                return config;
            };
            return Initialization;
        })();
        ApplicationInsights.Initialization = Initialization;
    })(ApplicationInsights = Microsoft.ApplicationInsights || (Microsoft.ApplicationInsights = {}));
})(Microsoft || (Microsoft = {}));
function initializeAppInsights() {
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
}
initializeAppInsights();
