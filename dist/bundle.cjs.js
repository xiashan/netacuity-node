'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dgram = require('dgram');
var require$$0 = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dgram__default = /*#__PURE__*/_interopDefaultLegacy(dgram);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var is$1 = {exports: {}};

/*!
 * is.js 0.8.0
 * Author: Aras Atasaygin
 */

(function (module, exports) {
(function(root, factory) {    // eslint-disable-line no-extra-semi
    {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    }
}(commonjsGlobal, function() {

    // Baseline
    /* -------------------------------------------------------------------------- */

    // define 'is' object and current version
    var is = {};
    is.VERSION = '0.8.0';

    // define interfaces
    is.not = {};
    is.all = {};
    is.any = {};

    // cache some methods to call later on
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // helper function which reverses the sense of predicate result
    function not(func) {
        return function() {
            return !func.apply(null, slice.call(arguments));
        };
    }

    // helper function which call predicate function per parameter and return true if all pass
    function all(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (!func.call(null, params[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // helper function which call predicate function per parameter and return true if any pass
    function any(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (func.call(null, params[i])) {
                    return true;
                }
            }
            return false;
        };
    }

    // build a 'comparator' object for various comparison checks
    var comparator = {
        '<': function(a, b) { return a < b; },
        '<=': function(a, b) { return a <= b; },
        '>': function(a, b) { return a > b; },
        '>=': function(a, b) { return a >= b; }
    };

    // helper function which compares a version to a range
    function compareVersion(version, range) {
        var string = (range + '');
        var n = +(string.match(/\d+/) || NaN);
        var op = string.match(/^[<>]=?|/)[0];
        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
    }

    // helper function which extracts params from arguments
    function getParams(args) {
        var params = slice.call(args);
        var length = params.length;
        if (length === 1 && is.array(params[0])) {    // support array
            params = params[0];
        }
        return params;
    }

    // Type checks
    /* -------------------------------------------------------------------------- */

    // is a given value Arguments?
    is.arguments = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Arguments]' ||
            (value != null && typeof value === 'object' && 'callee' in value);
    };

    // is a given value Array?
    is.array = Array.isArray || function(value) {    // check native isArray first
        return toString.call(value) === '[object Array]';
    };

    // is a given value Boolean?
    is.boolean = function(value) {
        return value === true || value === false || toString.call(value) === '[object Boolean]';
    };

    // is a given value Char?
    is.char = function(value) {
        return is.string(value) && value.length === 1;
    };

    // is a given value Date Object?
    is.date = function(value) {
        return toString.call(value) === '[object Date]';
    };

    // is a given object a DOM node?
    is.domNode = function(object) {
        return is.object(object) && object.nodeType > 0;
    };

    // is a given value Error object?
    is.error = function(value) {
        return toString.call(value) === '[object Error]';
    };

    // is a given value function?
    is['function'] = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Function]' || typeof value === 'function';
    };

    // is given value a pure JSON object?
    is.json = function(value) {
        return toString.call(value) === '[object Object]';
    };

    // is a given value NaN?
    is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
        return value !== value;
    };

    // is a given value null?
    is['null'] = function(value) {
        return value === null;
    };

    // is a given value number?
    is.number = function(value) {
        return is.not.nan(value) && toString.call(value) === '[object Number]';
    };

    // is a given value object?
    is.object = function(value) {
        return Object(value) === value;
    };

    // is a given value RegExp?
    is.regexp = function(value) {
        return toString.call(value) === '[object RegExp]';
    };

    // are given values same type?
    // prevent NaN, Number same type check
    is.sameType = function(value, other) {
        var tag = toString.call(value);
        if (tag !== toString.call(other)) {
            return false;
        }
        if (tag === '[object Number]') {
            return !is.any.nan(value, other) || is.all.nan(value, other);
        }
        return true;
    };
    // sameType method does not support 'all' and 'any' interfaces
    is.sameType.api = ['not'];

    // is a given value String?
    is.string = function(value) {
        return toString.call(value) === '[object String]';
    };

    // is a given value undefined?
    is.undefined = function(value) {
        return value === void 0;
    };

    // is a given value window?
    // setInterval method is only available for window object
    is.windowObject = function(value) {
        return value != null && typeof value === 'object' && 'setInterval' in value;
    };

    // Presence checks
    /* -------------------------------------------------------------------------- */

    //is a given value empty? Objects, arrays, strings
    is.empty = function(value) {
        if (is.object(value)) {
            var length = Object.getOwnPropertyNames(value).length;
            if (length === 0 || (length === 1 && is.array(value)) ||
                    (length === 2 && is.arguments(value))) {
                return true;
            }
            return false;
        }
        return value === '';
    };

    // is a given value existy?
    is.existy = function(value) {
        return value != null;
    };

    // is a given value falsy?
    is.falsy = function(value) {
        return !value;
    };

    // is a given value truthy?
    is.truthy = not(is.falsy);

    // Arithmetic checks
    /* -------------------------------------------------------------------------- */

    // is a given number above minimum parameter?
    is.above = function(n, min) {
        return is.all.number(n, min) && n > min;
    };
    // above method does not support 'all' and 'any' interfaces
    is.above.api = ['not'];

    // is a given number decimal?
    is.decimal = function(n) {
        return is.number(n) && n % 1 !== 0;
    };

    // are given values equal? supports numbers, strings, regexes, booleans
    // TODO: Add object and array support
    is.equal = function(value, other) {
        // check 0 and -0 equity with Infinity and -Infinity
        if (is.all.number(value, other)) {
            return value === other && 1 / value === 1 / other;
        }
        // check regexes as strings too
        if (is.all.string(value, other) || is.all.regexp(value, other)) {
            return '' + value === '' + other;
        }
        if (is.all.boolean(value, other)) {
            return value === other;
        }
        return false;
    };
    // equal method does not support 'all' and 'any' interfaces
    is.equal.api = ['not'];

    // is a given number even?
    is.even = function(n) {
        return is.number(n) && n % 2 === 0;
    };

    // is a given number finite?
    is.finite = isFinite || function(n) {
        return is.not.infinite(n) && is.not.nan(n);
    };

    // is a given number infinite?
    is.infinite = function(n) {
        return n === Infinity || n === -Infinity;
    };

    // is a given number integer?
    is.integer = function(n) {
        return is.number(n) && n % 1 === 0;
    };

    // is a given number negative?
    is.negative = function(n) {
        return is.number(n) && n < 0;
    };

    // is a given number odd?
    is.odd = function(n) {
        return is.number(n) && n % 2 === 1;
    };

    // is a given number positive?
    is.positive = function(n) {
        return is.number(n) && n > 0;
    };

    // is a given number above maximum parameter?
    is.under = function(n, max) {
        return is.all.number(n, max) && n < max;
    };
    // least method does not support 'all' and 'any' interfaces
    is.under.api = ['not'];

    // is a given number within minimum and maximum parameters?
    is.within = function(n, min, max) {
        return is.all.number(n, min, max) && n > min && n < max;
    };
    // within method does not support 'all' and 'any' interfaces
    is.within.api = ['not'];

    // Regexp checks
    /* -------------------------------------------------------------------------- */
    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
    // Scott Gonzalez: Email address validation

    // dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
    // eppPhone match extensible provisioning protocol format
    // nanpPhone match north american number plan format
    // time match hours, minutes, and seconds, 24-hour clock
    var regexes = {
        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
        alphaNumeric: /^[A-Za-z0-9]+$/,
        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
        dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
        hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
        hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
        ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
        ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
    };

    function regexpCheck(regexp, regexes) {
        is[regexp] = function(value) {
            return regexes[regexp].test(value);
        };
    }

    // create regexp checks methods from 'regexes' object
    for (var regexp in regexes) {
        if (regexes.hasOwnProperty(regexp)) {
            regexpCheck(regexp, regexes);
        }
    }

    // simplify IP checks by calling the regex helpers for IPv4 and IPv6
    is.ip = function(value) {
        return is.ipv4(value) || is.ipv6(value);
    };

    // String checks
    /* -------------------------------------------------------------------------- */

    // is a given string or sentence capitalized?
    is.capitalized = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        var words = string.split(' ');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word.length) {
                var chr = word.charAt(0);
                if (chr !== chr.toUpperCase()) {
                    return false;
                }
            }
        }
        return true;
    };

    // is string end with a given target parameter?
    is.endWith = function(string, target) {
        if (is.not.string(string)) {
            return false;
        }
        target += '';
        var position = string.length - target.length;
        return position >= 0 && string.indexOf(target, position) === position;
    };
    // endWith method does not support 'all' and 'any' interfaces
    is.endWith.api = ['not'];

    // is a given string include parameter target?
    is.include = function(string, target) {
        return string.indexOf(target) > -1;
    };
    // include method does not support 'all' and 'any' interfaces
    is.include.api = ['not'];

    // is a given string all lowercase?
    is.lowerCase = function(string) {
        return is.string(string) && string === string.toLowerCase();
    };

    // is a given string palindrome?
    is.palindrome = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
        var length = string.length - 1;
        for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
            if (string.charAt(i) !== string.charAt(length - i)) {
                return false;
            }
        }
        return true;
    };

    // is a given value space?
    // horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
    is.space = function(value) {
        if (is.not.char(value)) {
            return false;
        }
        var charCode = value.charCodeAt(0);
        return (charCode > 8 && charCode < 14) || charCode === 32;
    };

    // is string start with a given target parameter?
    is.startWith = function(string, target) {
        return is.string(string) && string.indexOf(target) === 0;
    };
    // startWith method does not support 'all' and 'any' interfaces
    is.startWith.api = ['not'];

    // is a given string all uppercase?
    is.upperCase = function(string) {
        return is.string(string) && string === string.toUpperCase();
    };

    // Time checks
    /* -------------------------------------------------------------------------- */

    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    // is a given dates day equal given day parameter?
    is.day = function(date, day) {
        return is.date(date) && day.toLowerCase() === days[date.getDay()];
    };
    // day method does not support 'all' and 'any' interfaces
    is.day.api = ['not'];

    // is a given date in daylight saving time?
    is.dayLightSavingTime = function(date) {
        var january = new Date(date.getFullYear(), 0, 1);
        var july = new Date(date.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
        return date.getTimezoneOffset() < stdTimezoneOffset;
    };

    // is a given date future?
    is.future = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() > now.getTime();
    };

    // is date within given range?
    is.inDateRange = function(date, start, end) {
        if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
            return false;
        }
        var stamp = date.getTime();
        return stamp > start.getTime() && stamp < end.getTime();
    };
    // inDateRange method does not support 'all' and 'any' interfaces
    is.inDateRange.api = ['not'];

    // is a given date in last month range?
    is.inLastMonth = function(date) {
        return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
    };

    // is a given date in last week range?
    is.inLastWeek = function(date) {
        return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
    };

    // is a given date in last year range?
    is.inLastYear = function(date) {
        return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    };

    // is a given date in next month range?
    is.inNextMonth = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
    };

    // is a given date in next week range?
    is.inNextWeek = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
    };

    // is a given date in next year range?
    is.inNextYear = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    };

    // is the given year a leap year?
    is.leapYear = function(year) {
        return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };

    // is a given dates month equal given month parameter?
    is.month = function(date, month) {
        return is.date(date) && month.toLowerCase() === months[date.getMonth()];
    };
    // month method does not support 'all' and 'any' interfaces
    is.month.api = ['not'];

    // is a given date past?
    is.past = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() < now.getTime();
    };

    // is a given date in the parameter quarter?
    is.quarterOfYear = function(date, quarter) {
        return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
    };
    // quarterOfYear method does not support 'all' and 'any' interfaces
    is.quarterOfYear.api = ['not'];

    // is a given date indicate today?
    is.today = function(date) {
        var now = new Date();
        var todayString = now.toDateString();
        return is.date(date) && date.toDateString() === todayString;
    };

    // is a given date indicate tomorrow?
    is.tomorrow = function(date) {
        var now = new Date();
        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
        return is.date(date) && date.toDateString() === tomorrowString;
    };

    // is a given date weekend?
    // 6: Saturday, 0: Sunday
    is.weekend = function(date) {
        return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
    };

    // is a given date weekday?
    is.weekday = not(is.weekend);

    // is a given dates year equal given year parameter?
    is.year = function(date, year) {
        return is.date(date) && is.number(year) && year === date.getFullYear();
    };
    // year method does not support 'all' and 'any' interfaces
    is.year.api = ['not'];

    // is a given date indicate yesterday?
    is.yesterday = function(date) {
        var now = new Date();
        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
        return is.date(date) && date.toDateString() === yesterdayString;
    };

    // Environment checks
    /* -------------------------------------------------------------------------- */

    var freeGlobal = is.windowObject(typeof commonjsGlobal == 'object' && commonjsGlobal) && commonjsGlobal;
    var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
    var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

    var document = freeSelf && freeSelf.document;
    var previousIs = root.is;

    // store navigator properties to use later
    var navigator = freeSelf && freeSelf.navigator;
    var appVersion = (navigator && navigator.appVersion || '').toLowerCase();
    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
    var vendor = (navigator && navigator.vendor || '').toLowerCase();

    // is current device android?
    is.android = function() {
        return /android/.test(userAgent);
    };
    // android method does not support 'all' and 'any' interfaces
    is.android.api = ['not'];

    // is current device android phone?
    is.androidPhone = function() {
        return /android/.test(userAgent) && /mobile/.test(userAgent);
    };
    // androidPhone method does not support 'all' and 'any' interfaces
    is.androidPhone.api = ['not'];

    // is current device android tablet?
    is.androidTablet = function() {
        return /android/.test(userAgent) && !/mobile/.test(userAgent);
    };
    // androidTablet method does not support 'all' and 'any' interfaces
    is.androidTablet.api = ['not'];

    // is current device blackberry?
    is.blackberry = function() {
        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
    };
    // blackberry method does not support 'all' and 'any' interfaces
    is.blackberry.api = ['not'];

    // is current browser chrome?
    // parameter is optional
    is.chrome = function(range) {
        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
        return match !== null && compareVersion(match[1], range);
    };
    // chrome method does not support 'all' and 'any' interfaces
    is.chrome.api = ['not'];

    // is current device desktop?
    is.desktop = function() {
        return is.not.mobile() && is.not.tablet();
    };
    // desktop method does not support 'all' and 'any' interfaces
    is.desktop.api = ['not'];

    // is current browser edge?
    // parameter is optional
    is.edge = function(range) {
        var match = userAgent.match(/edge\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // edge method does not support 'all' and 'any' interfaces
    is.edge.api = ['not'];

    // is current browser firefox?
    // parameter is optional
    is.firefox = function(range) {
        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // firefox method does not support 'all' and 'any' interfaces
    is.firefox.api = ['not'];

    // is current browser internet explorer?
    // parameter is optional
    is.ie = function(range) {
        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ie method does not support 'all' and 'any' interfaces
    is.ie.api = ['not'];

    // is current device ios?
    is.ios = function() {
        return is.iphone() || is.ipad() || is.ipod();
    };
    // ios method does not support 'all' and 'any' interfaces
    is.ios.api = ['not'];

    // is current device ipad?
    // parameter is optional
    is.ipad = function(range) {
        var match = userAgent.match(/ipad.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipad method does not support 'all' and 'any' interfaces
    is.ipad.api = ['not'];

    // is current device iphone?
    // parameter is optional
    is.iphone = function(range) {
        // original iPhone doesn't have the os portion of the UA
        var match = userAgent.match(/iphone(?:.+?os (\d+))?/);
        return match !== null && compareVersion(match[1] || 1, range);
    };
    // iphone method does not support 'all' and 'any' interfaces
    is.iphone.api = ['not'];

    // is current device ipod?
    // parameter is optional
    is.ipod = function(range) {
        var match = userAgent.match(/ipod.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipod method does not support 'all' and 'any' interfaces
    is.ipod.api = ['not'];

    // is current operating system linux?
    is.linux = function() {
        return /linux/.test(appVersion);
    };
    // linux method does not support 'all' and 'any' interfaces
    is.linux.api = ['not'];

    // is current operating system mac?
    is.mac = function() {
        return /mac/.test(appVersion);
    };
    // mac method does not support 'all' and 'any' interfaces
    is.mac.api = ['not'];

    // is current device mobile?
    is.mobile = function() {
        return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
    };
    // mobile method does not support 'all' and 'any' interfaces
    is.mobile.api = ['not'];

    // is current state offline?
    is.offline = not(is.online);
    // offline method does not support 'all' and 'any' interfaces
    is.offline.api = ['not'];

    // is current state online?
    is.online = function() {
        return !navigator || navigator.onLine === true;
    };
    // online method does not support 'all' and 'any' interfaces
    is.online.api = ['not'];

    // is current browser opera?
    // parameter is optional
    is.opera = function(range) {
        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // opera method does not support 'all' and 'any' interfaces
    is.opera.api = ['not'];

    // is current browser phantomjs?
    // parameter is optional
    is.phantom = function(range) {
        var match = userAgent.match(/phantomjs\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // phantom method does not support 'all' and 'any' interfaces
    is.phantom.api = ['not'];

    // is current browser safari?
    // parameter is optional
    is.safari = function(range) {
        var match = userAgent.match(/version\/(\d+).+?safari/);
        return match !== null && compareVersion(match[1], range);
    };
    // safari method does not support 'all' and 'any' interfaces
    is.safari.api = ['not'];

    // is current device tablet?
    is.tablet = function() {
        return is.ipad() || is.androidTablet() || is.windowsTablet();
    };
    // tablet method does not support 'all' and 'any' interfaces
    is.tablet.api = ['not'];

    // is current device supports touch?
    is.touchDevice = function() {
        return !!document && ('ontouchstart' in freeSelf ||
            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
    };
    // touchDevice method does not support 'all' and 'any' interfaces
    is.touchDevice.api = ['not'];

    // is current operating system windows?
    is.windows = function() {
        return /win/.test(appVersion);
    };
    // windows method does not support 'all' and 'any' interfaces
    is.windows.api = ['not'];

    // is current device windows phone?
    is.windowsPhone = function() {
        return is.windows() && /phone/.test(userAgent);
    };
    // windowsPhone method does not support 'all' and 'any' interfaces
    is.windowsPhone.api = ['not'];

    // is current device windows tablet?
    is.windowsTablet = function() {
        return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
    };
    // windowsTablet method does not support 'all' and 'any' interfaces
    is.windowsTablet.api = ['not'];

    // Object checks
    /* -------------------------------------------------------------------------- */

    // has a given object got parameterized count property?
    is.propertyCount = function(object, count) {
        if (is.not.object(object) || is.not.number(count)) {
            return false;
        }
        var n = 0;
        for (var property in object) {
            if (hasOwnProperty.call(object, property) && ++n > count) {
                return false;
            }
        }
        return n === count;
    };
    // propertyCount method does not support 'all' and 'any' interfaces
    is.propertyCount.api = ['not'];

    // is given object has parameterized property?
    is.propertyDefined = function(object, property) {
        return is.object(object) && is.string(property) && property in object;
    };
    // propertyDefined method does not support 'all' and 'any' interfaces
    is.propertyDefined.api = ['not'];

    // Array checks
    /* -------------------------------------------------------------------------- */

    // is a given item in an array?
    is.inArray = function(value, array) {
        if (is.not.array(array)) {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    };
    // inArray method does not support 'all' and 'any' interfaces
    is.inArray.api = ['not'];

    // is a given array sorted?
    is.sorted = function(array, sign) {
        if (is.not.array(array)) {
            return false;
        }
        var predicate = comparator[sign] || comparator['>='];
        for (var i = 1; i < array.length; i++) {
            if (!predicate(array[i], array[i - 1])) {
                return false;
            }
        }
        return true;
    };

    // API
    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
    /* -------------------------------------------------------------------------- */

    function setInterfaces() {
        var options = is;
        for (var option in options) {
            if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
                var interfaces = options[option].api || ['not', 'all', 'any'];
                for (var i = 0; i < interfaces.length; i++) {
                    if (interfaces[i] === 'not') {
                        is.not[option] = not(is[option]);
                    }
                    if (interfaces[i] === 'all') {
                        is.all[option] = all(is[option]);
                    }
                    if (interfaces[i] === 'any') {
                        is.any[option] = any(is[option]);
                    }
                }
            }
        }
    }
    setInterfaces();

    // Configuration methods
    // Intentionally added after setInterfaces function
    /* -------------------------------------------------------------------------- */

    // change namespace of library to prevent name collisions
    // var preferredName = is.setNamespace();
    // preferredName.odd(3);
    // => true
    is.setNamespace = function() {
        root.is = previousIs;
        return this;
    };

    // set optional regexes to methods
    is.setRegexp = function(regexp, name) {
        for (var r in regexes) {
            if (hasOwnProperty.call(regexes, r) && (name === r)) {
                regexes[r] = regexp;
            }
        }
    };

    return is;
}));
}(is$1));

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var is = is$1.exports;
/**
 * Parse x-forwarded-for headers.
 *
 * @param {string} value - The value to be parsed.
 * @return {string|null} First known IP address, if any.
 */


function getClientIpFromXForwardedFor(value) {
  if (!is.existy(value)) {
    return null;
  }

  if (is.not.string(value)) {
    throw new TypeError("Expected a string, got \"".concat(_typeof(value), "\""));
  } // x-forwarded-for may return multiple IP addresses in the format:
  // "client IP, proxy 1 IP, proxy 2 IP"
  // Therefore, the right-most IP address is the IP address of the most recent proxy
  // and the left-most IP address is the IP address of the originating client.
  // source: http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html
  // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)


  var forwardedIps = value.split(',').map(function (e) {
    var ip = e.trim();

    if (ip.includes(':')) {
      var splitted = ip.split(':'); // make sure we only use this if it's ipv4 (ip:port)

      if (splitted.length === 2) {
        return splitted[0];
      }
    }

    return ip;
  }); // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
  // Therefore taking the left-most IP address that is not unknown
  // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)

  return forwardedIps.find(is.ip);
}
/**
 * Determine client IP address.
 *
 * @param req
 * @returns {string} ip - The IP address if known, defaulting to empty string if unknown.
 */


function getClientIp(req) {
  // Server is probably behind a proxy.
  if (req.headers) {
    // Standard headers used by Amazon EC2, Heroku, and others.
    if (is.ip(req.headers['x-client-ip'])) {
      return req.headers['x-client-ip'];
    } // Load-balancers (AWS ELB) or proxies.


    var xForwardedFor = getClientIpFromXForwardedFor(req.headers['x-forwarded-for']);

    if (is.ip(xForwardedFor)) {
      return xForwardedFor;
    } // Cloudflare.
    // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
    // CF-Connecting-IP - applied to every request to the origin.


    if (is.ip(req.headers['cf-connecting-ip'])) {
      return req.headers['cf-connecting-ip'];
    } // Fastly and Firebase hosting header (When forwared to cloud function)


    if (is.ip(req.headers['fastly-client-ip'])) {
      return req.headers['fastly-client-ip'];
    } // Akamai and Cloudflare: True-Client-IP.


    if (is.ip(req.headers['true-client-ip'])) {
      return req.headers['true-client-ip'];
    } // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.


    if (is.ip(req.headers['x-real-ip'])) {
      return req.headers['x-real-ip'];
    } // (Rackspace LB and Riverbed's Stingray)
    // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
    // https://splash.riverbed.com/docs/DOC-1926


    if (is.ip(req.headers['x-cluster-client-ip'])) {
      return req.headers['x-cluster-client-ip'];
    }

    if (is.ip(req.headers['x-forwarded'])) {
      return req.headers['x-forwarded'];
    }

    if (is.ip(req.headers['forwarded-for'])) {
      return req.headers['forwarded-for'];
    }

    if (is.ip(req.headers.forwarded)) {
      return req.headers.forwarded;
    }
  } // Remote address checks.


  if (is.existy(req.connection)) {
    if (is.ip(req.connection.remoteAddress)) {
      return req.connection.remoteAddress;
    }

    if (is.existy(req.connection.socket) && is.ip(req.connection.socket.remoteAddress)) {
      return req.connection.socket.remoteAddress;
    }
  }

  if (is.existy(req.socket) && is.ip(req.socket.remoteAddress)) {
    return req.socket.remoteAddress;
  }

  if (is.existy(req.info) && is.ip(req.info.remoteAddress)) {
    return req.info.remoteAddress;
  } // AWS Api Gateway + Lambda


  if (is.existy(req.requestContext) && is.existy(req.requestContext.identity) && is.ip(req.requestContext.identity.sourceIp)) {
    return req.requestContext.identity.sourceIp;
  }

  return null;
}
/**
 * Expose request IP as a middleware.
 *
 * @param {object} [options] - Configuration.
 * @param {string} [options.attributeName] - Name of attribute to augment request object with.
 * @return {*}
 */


function mw$1(options) {
  // Defaults.
  var configuration = is.not.existy(options) ? {} : options; // Validation.

  if (is.not.object(configuration)) {
    throw new TypeError('Options must be an object!');
  }

  var attributeName = configuration.attributeName || 'clientIp';
  return function (req, res, next) {
    var ip = getClientIp(req);
    Object.defineProperty(req, attributeName, {
      get: function get() {
        return ip;
      },
      configurable: true
    });
    next();
  };
}

var dist = {
  getClientIpFromXForwardedFor: getClientIpFromXForwardedFor,
  getClientIp: getClientIp,
  mw: mw$1
};

var randomstring$1 = {};

var charset$1 = {};

var numbers         = '0123456789';
var charsLower      = 'abcdefghijklmnopqrstuvwxyz';
var charsUpper      = charsLower.toUpperCase();
var hexChars        = 'abcdef';
var unreadableChars = /[0OIl]/ig;

charset$1.generate = function(type, readable) {
  var charset;
  
  if (type === 'alphanumeric') {
    charset = numbers + charsLower + charsUpper;
  }
  else if (type === 'numeric') {
    charset = numbers;
  }
  else if (type === 'alphabetic') {
    charset = charsLower + charsUpper;
  }
  else if (type === 'hex') {
    charset = numbers + hexChars;
  }
  else {
    charset = type;
  }
  
  if (readable) {
    charset = charset.replace(unreadableChars, '');
  }
  
  return charset;
};

var crypto  = require$$0__default["default"];
var charset = charset$1;

randomstring$1.generate = function(options) {
  
  var length, chars, string = '';
  
  // Handle options
  if (typeof options === 'object') {
    length = options.length || 32;
    
    if (options.charset) {
      chars = charset.generate(options.charset, options.readable);
    }
    else {
      chars = charset.generate('alphanumeric', options.readable);
    }
  }
  else if (typeof options === 'number') {
    length = options;
    chars  = charset.generate('alphanumeric');
  }
  else {
    length = 32;
    chars  = charset.generate('alphanumeric');
  }
  
  // Generate the string
  while (string.length < length) {
    var bf;
    try {
      bf = crypto.randomBytes(length);
    }
    catch (e) {
      continue;
    }
    for (var i = 0; i < bf.length; i++) {
      var index = bf.readUInt8(i) % chars.length;
      string += chars.charAt(index);
    }
  }

  return string;
};

var randomstring = randomstring$1;

var validator$1 = {exports: {}};

/*!
 * Copyright (c) 2015 Chris O'Hara <cohara87@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function (module, exports) {
(function (name, definition) {
    {
        module.exports = definition();
    }
})('validator', function (validator) {

    validator = { version: '4.1.0' };

    var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
    var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;

    var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
    var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

    var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;

    var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

    var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

    var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/
      , isbn13Maybe = /^(?:[0-9]{13})$/;

    var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
      , ipv6Block = /^[0-9A-F]{1,4}$/i;

    var uuid = {
        '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i
      , '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      , '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      , all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    };

    var alpha = /^[A-Z]+$/i
      , alphanumeric = /^[0-9A-Z]+$/i
      , numeric = /^[-+]?[0-9]+$/
      , int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
      , float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
      , hexadecimal = /^[0-9A-F]+$/i
      , decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/
      , hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

    var ascii = /^[\x00-\x7F]+$/
      , multibyte = /[^\x00-\x7F]/
      , fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/
      , halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

    var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

    var base64 = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

    var phones = {
      'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
      'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
      'en-ZA': /^(\+?27|0)\d{9}$/,
      'en-AU': /^(\+?61|0)4\d{8}$/,
      'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
      'fr-FR': /^(\+?33|0)[67]\d{8}$/,
      'pt-PT': /^(\+351)?9[1236]\d{7}$/,
      'el-GR': /^(\+30)?((2\d{9})|(69\d{8}))$/,
      'en-GB': /^(\+?44|0)7\d{9}$/,
      'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      'en-ZM': /^(\+26)?09[567]\d{7}$/,
      'ru-RU': /^(\+?7|8)?9\d{9}$/
    };

    // from http://goo.gl/0ejHHW
    var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

    validator.extend = function (name, fn) {
        validator[name] = function () {
            var args = Array.prototype.slice.call(arguments);
            args[0] = validator.toString(args[0]);
            return fn.apply(validator, args);
        };
    };

    //Right before exporting the validator object, pass each of the builtins
    //through extend() so that their first argument is coerced to a string
    validator.init = function () {
        for (var name in validator) {
            if (typeof validator[name] !== 'function' || name === 'toString' ||
                    name === 'toDate' || name === 'extend' || name === 'init') {
                continue;
            }
            validator.extend(name, validator[name]);
        }
    };

    validator.toString = function (input) {
        if (typeof input === 'object' && input !== null && input.toString) {
            input = input.toString();
        } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
            input = '';
        } else if (typeof input !== 'string') {
            input += '';
        }
        return input;
    };

    validator.toDate = function (date) {
        if (Object.prototype.toString.call(date) === '[object Date]') {
            return date;
        }
        date = Date.parse(date);
        return !isNaN(date) ? new Date(date) : null;
    };

    validator.toFloat = function (str) {
        return parseFloat(str);
    };

    validator.toInt = function (str, radix) {
        return parseInt(str, radix || 10);
    };

    validator.toBoolean = function (str, strict) {
        if (strict) {
            return str === '1' || str === 'true';
        }
        return str !== '0' && str !== 'false' && str !== '';
    };

    validator.equals = function (str, comparison) {
        return str === validator.toString(comparison);
    };

    validator.contains = function (str, elem) {
        return str.indexOf(validator.toString(elem)) >= 0;
    };

    validator.matches = function (str, pattern, modifiers) {
        if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
            pattern = new RegExp(pattern, modifiers);
        }
        return pattern.test(str);
    };

    var default_email_options = {
        allow_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
    };

    validator.isEmail = function (str, options) {
        options = merge(options, default_email_options);

        if (options.allow_display_name) {
            var display_email = str.match(displayName);
            if (display_email) {
                str = display_email[1];
            }
        }

        var parts = str.split('@')
          , domain = parts.pop()
          , user = parts.join('@');

        var lower_domain = domain.toLowerCase();
        if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
            user = user.replace(/\./g, '').toLowerCase();
        }

        if (!validator.isByteLength(user, 0, 64) ||
                !validator.isByteLength(domain, 0, 256)) {
            return false;
        }

        if (!validator.isFQDN(domain, {require_tld: options.require_tld})) {
            return false;
        }

        if (user[0] === '"') {
            user = user.slice(1, user.length - 1);
            return options.allow_utf8_local_part ?
                quotedEmailUserUtf8.test(user) :
                quotedEmailUser.test(user);
        }

        var pattern = options.allow_utf8_local_part ?
            emailUserUtf8Part : emailUserPart;

        var user_parts = user.split('.');
        for (var i = 0; i < user_parts.length; i++) {
            if (!pattern.test(user_parts[i])) {
                return false;
            }
        }

        return true;
    };

    var default_url_options = {
        protocols: [ 'http', 'https', 'ftp' ]
      , require_tld: true
      , require_protocol: false
      , require_valid_protocol: true
      , allow_underscores: false
      , allow_trailing_dot: false
      , allow_protocol_relative_urls: false
    };

    validator.isURL = function (url, options) {
        if (!url || url.length >= 2083 || /\s/.test(url)) {
            return false;
        }
        if (url.indexOf('mailto:') === 0) {
            return false;
        }
        options = merge(options, default_url_options);
        var protocol, auth, host, hostname, port,
            port_str, split;
        split = url.split('://');
        if (split.length > 1) {
            protocol = split.shift();
            if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
                return false;
            }
        } else if (options.require_protocol) {
            return false;
        }  else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
            split[0] = url.substr(2);
        }
        url = split.join('://');
        split = url.split('#');
        url = split.shift();

        split = url.split('?');
        url = split.shift();

        split = url.split('/');
        url = split.shift();
        split = url.split('@');
        if (split.length > 1) {
            auth = split.shift();
            if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
                return false;
            }
        }
        hostname = split.join('@');
        split = hostname.split(':');
        host = split.shift();
        if (split.length) {
            port_str = split.join(':');
            port = parseInt(port_str, 10);
            if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
                return false;
            }
        }
        if (!validator.isIP(host) && !validator.isFQDN(host, options) &&
                host !== 'localhost') {
            return false;
        }
        if (options.host_whitelist &&
                options.host_whitelist.indexOf(host) === -1) {
            return false;
        }
        if (options.host_blacklist &&
                options.host_blacklist.indexOf(host) !== -1) {
            return false;
        }
        return true;
    };

    validator.isIP = function (str, version) {
        version = validator.toString(version);
        if (!version) {
            return validator.isIP(str, 4) || validator.isIP(str, 6);
        } else if (version === '4') {
            if (!ipv4Maybe.test(str)) {
                return false;
            }
            var parts = str.split('.').sort(function (a, b) {
                return a - b;
            });
            return parts[3] <= 255;
        } else if (version === '6') {
            var blocks = str.split(':');
            var foundOmissionBlock = false; // marker to indicate ::

            // At least some OS accept the last 32 bits of an IPv6 address
            // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
            // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
            // and '::a.b.c.d' is deprecated, but also valid.
            var foundIPv4TransitionBlock = validator.isIP(blocks[blocks.length - 1], 4);
            var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

            if (blocks.length > expectedNumberOfBlocks)
                return false;

            // initial or final ::
            if (str === '::') {
                return true;
            } else if (str.substr(0, 2) === '::') {
                blocks.shift();
                blocks.shift();
                foundOmissionBlock = true;
            } else if (str.substr(str.length - 2) === '::') {
                blocks.pop();
                blocks.pop();
                foundOmissionBlock = true;
            }

            for (var i = 0; i < blocks.length; ++i) {
                // test for a :: which can not be at the string start/end
                // since those cases have been handled above
                if (blocks[i] === '' && i > 0 && i < blocks.length -1) {
                    if (foundOmissionBlock)
                        return false; // multiple :: in address
                    foundOmissionBlock = true;
                } else if (foundIPv4TransitionBlock && i == blocks.length - 1) ; else if (!ipv6Block.test(blocks[i])) {
                    return false;
                }
            }

            if (foundOmissionBlock) {
                return blocks.length >= 1;
            } else {
                return blocks.length === expectedNumberOfBlocks;
            }
        }
        return false;
    };

    var default_fqdn_options = {
        require_tld: true
      , allow_underscores: false
      , allow_trailing_dot: false
    };

    validator.isFQDN = function (str, options) {
        options = merge(options, default_fqdn_options);

        /* Remove the optional trailing dot before checking validity */
        if (options.allow_trailing_dot && str[str.length - 1] === '.') {
            str = str.substring(0, str.length - 1);
        }
        var parts = str.split('.');
        if (options.require_tld) {
            var tld = parts.pop();
            if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
                return false;
            }
        }
        for (var part, i = 0; i < parts.length; i++) {
            part = parts[i];
            if (options.allow_underscores) {
                if (part.indexOf('__') >= 0) {
                    return false;
                }
                part = part.replace(/_/g, '');
            }
            if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
                return false;
            }
            if (/[\uff01-\uff5e]/.test(part)) {
                // disallow full-width chars
                return false;
            }
            if (part[0] === '-' || part[part.length - 1] === '-' ||
                    part.indexOf('---') >= 0) {
                return false;
            }
        }
        return true;
    };

    validator.isBoolean = function(str) {
        return (['true', 'false', '1', '0'].indexOf(str) >= 0);
    };

    validator.isAlpha = function (str) {
        return alpha.test(str);
    };

    validator.isAlphanumeric = function (str) {
        return alphanumeric.test(str);
    };

    validator.isNumeric = function (str) {
        return numeric.test(str);
    };

    validator.isDecimal = function (str) {
        return str !== '' && decimal.test(str);
    };

    validator.isHexadecimal = function (str) {
        return hexadecimal.test(str);
    };

    validator.isHexColor = function (str) {
        return hexcolor.test(str);
    };

    validator.isLowercase = function (str) {
        return str === str.toLowerCase();
    };

    validator.isUppercase = function (str) {
        return str === str.toUpperCase();
    };

    validator.isInt = function (str, options) {
        options = options || {};
        return int.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
    };

    validator.isFloat = function (str, options) {
        options = options || {};
        return str !== '' && float.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
    };

    validator.isDivisibleBy = function (str, num) {
        return validator.toFloat(str) % validator.toInt(num) === 0;
    };

    validator.isNull = function (str) {
        return str.length === 0;
    };

    validator.isLength = function (str, min, max) {
        var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
        var len = str.length - surrogatePairs.length;
        return len >= min && (typeof max === 'undefined' || len <= max);
    };

    validator.isByteLength = function (str, min, max) {
        var len = encodeURI(str).split(/%..|./).length - 1;
        return len >= min && (typeof max === 'undefined' || len <= max);
    };

    validator.isUUID = function (str, version) {
        var pattern = uuid[version ? version : 'all'];
        return pattern && pattern.test(str);
    };

    validator.isDate = function (str) {
        var normalizedDate = new Date((new Date(str)).toUTCString());
        var regularDay = String(normalizedDate.getDate());
        var utcDay = String(normalizedDate.getUTCDate());
        var dayOrYear, dayOrYearMatches, year;
        if (isNaN(Date.parse(normalizedDate))) {
            return false;
        }
        //check for valid double digits that could be late days
        //check for all matches since a string like '12/23' is a valid date
        //ignore everything with nearby colons
        dayOrYearMatches = str.match(/(^|[^:\d])[23]\d([^:\d]|$)/g);
        if (!dayOrYearMatches) {
            return true;
        }
        dayOrYear = dayOrYearMatches.map(function(digitString) {
            return digitString.match(/\d+/g)[0];
        }).join('/');
        year = String(normalizedDate.getFullYear()).slice(-2);
        //local date and UTC date can differ, but both are valid, so check agains both
        if (dayOrYear === regularDay || dayOrYear === utcDay || dayOrYear === year) {
            return true;
        } else if ((dayOrYear === (regularDay + '/' + year)) || (dayOrYear === (year + '/' + regularDay))) {
            return true;
        } else if ((dayOrYear === (utcDay + '/' + year)) || (dayOrYear === (year + '/' + utcDay))) {
            return true;
        } else {
            return false;
        }
    };

    validator.isAfter = function (str, date) {
        var comparison = validator.toDate(date || new Date())
          , original = validator.toDate(str);
        return !!(original && comparison && original > comparison);
    };

    validator.isBefore = function (str, date) {
        var comparison = validator.toDate(date || new Date())
          , original = validator.toDate(str);
        return !!(original && comparison && original < comparison);
    };

    validator.isIn = function (str, options) {
        var i;
        if (Object.prototype.toString.call(options) === '[object Array]') {
            var array = [];
            for (i in options) {
                array[i] = validator.toString(options[i]);
            }
            return array.indexOf(str) >= 0;
        } else if (typeof options === 'object') {
            return options.hasOwnProperty(str);
        } else if (options && typeof options.indexOf === 'function') {
            return options.indexOf(str) >= 0;
        }
        return false;
    };

    validator.isCreditCard = function (str) {
        var sanitized = str.replace(/[^0-9]+/g, '');
        if (!creditCard.test(sanitized)) {
            return false;
        }
        var sum = 0, digit, tmpNum, shouldDouble;
        for (var i = sanitized.length - 1; i >= 0; i--) {
            digit = sanitized.substring(i, (i + 1));
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += ((tmpNum % 10) + 1);
                } else {
                    sum += tmpNum;
                }
            } else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }
        return !!((sum % 10) === 0 ? sanitized : false);
    };

    validator.isISIN = function (str) {
        if (!isin.test(str)) {
            return false;
        }

        var checksumStr = str.replace(/[A-Z]/g, function(character) {
            return parseInt(character, 36);
        });

        var sum = 0, digit, tmpNum, shouldDouble = true;
        for (var i = checksumStr.length - 2; i >= 0; i--) {
            digit = checksumStr.substring(i, (i + 1));
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += tmpNum + 1;
                } else {
                    sum += tmpNum;
                }
            } else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }

        return parseInt(str.substr(str.length - 1), 10) === (10000 - sum) % 10;
    };

    validator.isISBN = function (str, version) {
        version = validator.toString(version);
        if (!version) {
            return validator.isISBN(str, 10) || validator.isISBN(str, 13);
        }
        var sanitized = str.replace(/[\s-]+/g, '')
          , checksum = 0, i;
        if (version === '10') {
            if (!isbn10Maybe.test(sanitized)) {
                return false;
            }
            for (i = 0; i < 9; i++) {
                checksum += (i + 1) * sanitized.charAt(i);
            }
            if (sanitized.charAt(9) === 'X') {
                checksum += 10 * 10;
            } else {
                checksum += 10 * sanitized.charAt(9);
            }
            if ((checksum % 11) === 0) {
                return !!sanitized;
            }
        } else  if (version === '13') {
            if (!isbn13Maybe.test(sanitized)) {
                return false;
            }
            var factor = [ 1, 3 ];
            for (i = 0; i < 12; i++) {
                checksum += factor[i % 2] * sanitized.charAt(i);
            }
            if (sanitized.charAt(12) - ((10 - (checksum % 10)) % 10) === 0) {
                return !!sanitized;
            }
        }
        return false;
    };

    validator.isMobilePhone = function(str, locale) {
        if (locale in phones) {
            return phones[locale].test(str);
        }
        return false;
    };

    var default_currency_options = {
        symbol: '$'
      , require_symbol: false
      , allow_space_after_symbol: false
      , symbol_after_digits: false
      , allow_negatives: true
      , parens_for_negatives: false
      , negative_sign_before_digits: false
      , negative_sign_after_digits: false
      , allow_negative_sign_placeholder: false
      , thousands_separator: ','
      , decimal_separator: '.'
      , allow_space_after_digits: false
    };

    validator.isCurrency = function (str, options) {
        options = merge(options, default_currency_options);

        return currencyRegex(options).test(str);
    };

    validator.isJSON = function (str) {
        try {
            var obj = JSON.parse(str);
            return !!obj && typeof obj === 'object';
        } catch (e) {}
        return false;
    };

    validator.isMultibyte = function (str) {
        return multibyte.test(str);
    };

    validator.isAscii = function (str) {
        return ascii.test(str);
    };

    validator.isFullWidth = function (str) {
        return fullWidth.test(str);
    };

    validator.isHalfWidth = function (str) {
        return halfWidth.test(str);
    };

    validator.isVariableWidth = function (str) {
        return fullWidth.test(str) && halfWidth.test(str);
    };

    validator.isSurrogatePair = function (str) {
        return surrogatePair.test(str);
    };

    validator.isBase64 = function (str) {
        return base64.test(str);
    };

    validator.isMongoId = function (str) {
        return validator.isHexadecimal(str) && str.length === 24;
    };

    validator.isISO8601 = function (str) {
        return iso8601.test(str);
    };

    validator.ltrim = function (str, chars) {
        var pattern = chars ? new RegExp('^[' + chars + ']+', 'g') : /^\s+/g;
        return str.replace(pattern, '');
    };

    validator.rtrim = function (str, chars) {
        var pattern = chars ? new RegExp('[' + chars + ']+$', 'g') : /\s+$/g;
        return str.replace(pattern, '');
    };

    validator.trim = function (str, chars) {
        var pattern = chars ? new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g') : /^\s+|\s+$/g;
        return str.replace(pattern, '');
    };

    validator.escape = function (str) {
        return (str.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\//g, '&#x2F;')
            .replace(/\`/g, '&#96;'));
    };

    validator.stripLow = function (str, keep_new_lines) {
        var chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
        return validator.blacklist(str, chars);
    };

    validator.whitelist = function (str, chars) {
        return str.replace(new RegExp('[^' + chars + ']+', 'g'), '');
    };

    validator.blacklist = function (str, chars) {
        return str.replace(new RegExp('[' + chars + ']+', 'g'), '');
    };

    var default_normalize_email_options = {
        lowercase: true
    };

    validator.normalizeEmail = function (email, options) {
        options = merge(options, default_normalize_email_options);
        if (!validator.isEmail(email)) {
            return false;
        }
        var parts = email.split('@', 2);
        parts[1] = parts[1].toLowerCase();
        if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
            parts[0] = parts[0].toLowerCase().replace(/\./g, '');
            if (parts[0][0] === '+') {
                return false;
            }
            parts[0] = parts[0].split('+')[0];
            parts[1] = 'gmail.com';
        } else if (options.lowercase) {
            parts[0] = parts[0].toLowerCase();
        }
        return parts.join('@');
    };

    function merge(obj, defaults) {
        obj = obj || {};
        for (var key in defaults) {
            if (typeof obj[key] === 'undefined') {
                obj[key] = defaults[key];
            }
        }
        return obj;
    }

    function currencyRegex(options) {
        var symbol = '(\\' + options.symbol.replace(/\./g, '\\.') + ')' + (options.require_symbol ? '' : '?')
            , negative = '-?'
            , whole_dollar_amount_without_sep = '[1-9]\\d*'
            , whole_dollar_amount_with_sep = '[1-9]\\d{0,2}(\\' + options.thousands_separator + '\\d{3})*'
            , valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep]
            , whole_dollar_amount = '(' + valid_whole_dollar_amounts.join('|') + ')?'
            , decimal_amount = '(\\' + options.decimal_separator + '\\d{2})?';
        var pattern = whole_dollar_amount + decimal_amount;
        // default is negative sign before symbol, but there are two other options (besides parens)
        if (options.allow_negatives && !options.parens_for_negatives) {
            if (options.negative_sign_after_digits) {
                pattern += negative;
            }
            else if (options.negative_sign_before_digits) {
                pattern = negative + pattern;
            }
        }
        // South African Rand, for example, uses R 123 (space) and R-123 (no space)
        if (options.allow_negative_sign_placeholder) {
            pattern = '( (?!\\-))?' + pattern;
        }
        else if (options.allow_space_after_symbol) {
            pattern = ' ?' + pattern;
        }
        else if (options.allow_space_after_digits) {
            pattern += '( (?!$))?';
        }
        if (options.symbol_after_digits) {
            pattern += symbol;
        } else {
            pattern = symbol + pattern;
        }
        if (options.allow_negatives) {
            if (options.parens_for_negatives) {
                pattern = '(\\(' + pattern + '\\)|' + pattern + ')';
            }
            else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
                pattern = negative + pattern;
            }
        }
        return new RegExp(
            '^' +
            // ensure there's a dollar and/or decimal amount, and that it doesn't start with a space or a negative sign followed by a space
            '(?!-? )(?=.*\\d)' +
            pattern +
            '$'
        );
    }

    validator.init();

    return validator;

});
}(validator$1));

var validator = validator$1.exports;

/*
 * ***************************************************************************
 * File:           NetAcuityTools.js
 * Author:         Digital Envoy
 * Program Name:   NetAcuity API library
 * Version:        6.0.0.7
 * Date:           21-Feb-2017
 *
 * Copyright 2000-2017, Digital Envoy, Inc.  All rights reserved.
 *
 *  Description:
 *    Supporting functions for the Node JS implementation
 *    of the Digital Envoy NetAcuity API library to query
 *    for ip based location data.
 *
 *
 *
 * This library is provided as an access method to the NetAcuity software
 * provided to you under License Agreement from Digital Envoy Inc.
 * You may NOT redistribute it and/or modify it in any way without express
 * written consent of Digital Envoy, Inc.
 *
 * Address bug reports and comments to:  tech-support@digitalenvoy.net
 *
 *
 * **************************************************************************
 */
const commonError = {
  ERROR: 'Service Error',
  TIMEOUT: 'Request timed out for transaction %s',
  IDENTIFY_ERROR: 'Transaction id not match',
  SERVICE_ERROR: 'NetAcuity service error %s',
  PARAM_ERROR: 'Params Error'
};
const databaseEnums = {
  geo: 3,
  edge: 4,
  sic: 5,
  domain: 6,
  zip: 7,
  isp: 8,
  home_biz: 9,
  asn: 10,
  language: 11,
  proxy: 12,
  isAnIsp: 14,
  company: 15,
  demographics: 17,
  naics: 18,
  cbsa: 19,
  mobileCarrier: 24,
  organization: 25,
  pulse: 26,
  pulseplus: 30
};

function na_geo(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['country'] = response[0] == undefined ? '?' : response[0];
  this['region'] = response[1] == undefined ? '?' : response[1];
  this['city'] = response[2] == undefined ? '?' : response[2];
  this['conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['country-conf'] = response[4] == undefined ? 0 : response[4];
  this['region-conf'] = response[5] == undefined ? 0 : response[5];
  this['city-conf'] = response[6] == undefined ? 0 : response[6];
  this['metro-code'] = response[7] == undefined ? 0 : response[7];
  this['latitude'] = response[8] == undefined ? 0 : response[8];
  this['longitude'] = response[9] == undefined ? 0 : response[9];
  this['country-code'] = response[10] == undefined ? 0 : response[10];
  this['region-code'] = response[11] == undefined ? 0 : response[11];
  this['city-code'] = response[12] == undefined ? 0 : response[12];
  this['continent-code'] = response[13] == undefined ? 0 : response[13];
  this['two-letter-country'] = response[14] == undefined ? '?' : response[14];
}

function na_edge(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['edge-country'] = response[0] == undefined ? '?' : response[0];
  this['edge-region'] = response[1] == undefined ? '?' : response[1];
  this['edge-city'] = response[2] == undefined ? '?' : response[2];
  this['edge-conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['edge-metro-code'] = response[4] == undefined ? 0 : response[4];
  this['edge-latitude'] = response[5] == undefined ? 0 : response[5];
  this['edge-longitude'] = response[6] == undefined ? 0 : response[6];
  this['edge-postal-code'] = response[7] == undefined ? '?' : response[7];
  this['edge-country-code'] = response[8] == undefined ? 0 : response[8];
  this['edge-region-code'] = response[9] == undefined ? 0 : response[9];
  this['edge-city-code'] = response[10] == undefined ? 0 : response[10];
  this['edge-continent-code'] = response[11] == undefined ? 0 : response[11];
  this['edge-two-letter-country'] = response[12] == undefined ? '?' : response[12];
  this['edge-internal-code'] = response[13] == undefined ? 0 : response[13];
  this['edge-area-codes'] = response[14] == undefined ? '?' : response[14];
  this['edge-country-conf'] = response[15] == undefined ? 0 : response[15];
  this['edge-region-conf'] = response[16] == undefined ? 0 : response[16];
  this['edge-city-conf'] = response[17] == undefined ? 0 : response[17];
  this['edge-postal-conf'] = response[18] == undefined ? 0 : response[18];
  this['edge-gmt-offset'] = response[19] == undefined ? 0 : response[19];
  this['edge-in-dst'] = response[20] == undefined ? '?' : response[20];
}

function na_sic(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['sic-code'] = response[0] == undefined ? 0 : response[0];
}

function na_domain(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['domain-name'] = response[0] == undefined ? '?' : response[0];
}

function na_zip(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['area-code'] = response[0] == undefined ? 0 : response[0];
  this['zip-code'] = response[1] == undefined ? 0 : response[1];
  this['gmt-offset'] = response[2] == undefined ? 0 : response[2];
  this['in-dst'] = response[3] == undefined ? '?' : response[3];
  this['zip-code-text'] = response[4] == undefined ? '?' : response[4];
  this['zip-country'] = response[5] == undefined ? '?' : response[5];
}

function na_isp(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['isp-name'] = response[0] == undefined ? '?' : response[0];
}

function na_home_biz(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['homebiz-type'] = response[0] == undefined ? '?' : response[0];
}

function na_asn(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['asn'] = response[0] == undefined ? 0 : response[0];
  this['asn-name'] = response[1] == undefined ? '?' : response[1];
}

function na_language(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['primary-lang'] = response[0] == undefined ? '?' : response[0];
  this['secondary-lang'] = response[1] == undefined ? '?' : response[1];
}

function na_proxy(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['proxy-type'] = response[0] == undefined ? '?' : response[0];
  this['proxy-description'] = response[1] == undefined ? '?' : response[1];
}

function na_is_an_isp(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['is-an-isp'] = response[0] == undefined ? '?' : response[0];
}

function na_company(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['company-name'] = response[0] == undefined ? '?' : response[0];
}

function na_demographics(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['rank'] = response[0] == undefined ? 0 : response[0];
  this['households'] = response[1] == undefined ? 0 : response[1];
  this['women'] = response[2] == undefined ? 0 : response[2];
  this['w18-34'] = response[3] == undefined ? 0 : response[3];
  this['w35-49'] = response[4] == undefined ? 0 : response[4];
  this['men'] = response[5] == undefined ? 0 : response[5];
  this['m18-34'] = response[6] == undefined ? 0 : response[6];
  this['m35-49'] = response[7] == undefined ? 0 : response[7];
  this['teens'] = response[8] == undefined ? 0 : response[8];
  this['kids'] = response[9] == undefined ? 0 : response[9];
}

function na_naics(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['naics-code'] = response[0] == undefined ? 0 : response[0];
}

function na_cbsa(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['cbsa-code'] = response[0] == undefined ? 0 : response[0];
  this['cbsa-title'] = response[1] == undefined ? '?' : response[1];
  this['cbsa-type'] = response[2] == undefined ? '?' : response[2];
  this['csa-code'] = response[3] == undefined ? 0 : response[3];
  this['csa-title'] = response[4] == undefined ? '?' : response[4];
  this['md-code'] = response[5] == undefined ? 0 : response[5];
  this['md-title'] = response[6] == undefined ? '?' : response[6];
}

function na_mobile_carrier(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['mobile-carrier'] = response[0] == undefined ? '?' : response[0];
  this['mcc'] = response[1] == undefined ? 0 : response[1];
  this['mnc'] = response[2] == undefined ? 0 : response[2];
  this['mobile-carrier-code'] = response[2] == undefined ? 0 : response[3];
}

function na_organization(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['organization-name'] = response[0] == undefined ? '?' : response[0];
}

function na_pulse(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['pulse-country'] = response[0] == undefined ? '?' : response[0];
  this['pulse-region'] = response[1] == undefined ? '?' : response[1];
  this['pulse-city'] = response[2] == undefined ? '?' : response[2];
  this['pulse-conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['pulse-conn-type'] = response[4] == undefined ? '?' : response[4];
  this['pulse-metro-code'] = response[5] == undefined ? 0 : response[5];
  this['pulse-latitude'] = response[6] == undefined ? 0 : response[6];
  this['pulse-longitude'] = response[7] == undefined ? 0 : response[7];
  this['pulse-postal-code'] = response[8] == undefined ? '?' : response[8];
  this['pulse-country-code'] = response[9] == undefined ? 0 : response[9];
  this['pulse-region-code'] = response[10] == undefined ? 0 : response[10];
  this['pulse-city-code'] = response[11] == undefined ? 0 : response[11];
  this['pulse-continent-code'] = response[12] == undefined ? 0 : response[12];
  this['pulse-two-letter-country'] = response[13] == undefined ? '?' : response[13];
  this['pulse-internal-code'] = response[14] == undefined ? 0 : response[14];
  this['pulse-area-codes'] = response[15] == undefined ? '?' : response[15];
  this['pulse-country-conf'] = response[16] == undefined ? 0 : response[16];
  this['pulse-region-conf'] = response[17] == undefined ? 0 : response[17];
  this['pulse-city-conf'] = response[18] == undefined ? 0 : response[18];
  this['pulse-postal-conf'] = response[19] == undefined ? 0 : response[19];
  this['pulse-gmt-offset'] = response[20] == undefined ? 0 : response[20];
  this['pulse-in-dst'] = response[21] == undefined ? '?' : response[21];
}

function na_pulse_plus(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['pulse-plus-country'] = response[0] == undefined ? '?' : response[0];
  this['pulse-plus-region'] = response[1] == undefined ? '?' : response[1];
  this['pulse-plus-city'] = response[2] == undefined ? '?' : response[2];
  this['pulse-plus-conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['pulse-plus-conn-type'] = response[4] == undefined ? '?' : response[4];
  this['pulse-plus-metro-code'] = response[5] == undefined ? 0 : response[5];
  this['pulse-plus-latitude'] = response[6] == undefined ? 0 : response[6];
  this['pulse-plus-longitude'] = response[7] == undefined ? 0 : response[7];
  this['pulse-plus-postal-code'] = response[8] == undefined ? '?' : response[8];
  this['pulse-plus-postal-ext'] = response[9] == undefined ? '?' : response[9];
  this['pulse-plus-country-code'] = response[10] == undefined ? 0 : response[10];
  this['pulse-plus-region-code'] = response[11] == undefined ? 0 : response[11];
  this['pulse-plus-city-code'] = response[12] == undefined ? 0 : response[12];
  this['pulse-plus-continent-code'] = response[13] == undefined ? 0 : response[13];
  this['pulse-plus-two-letter-country'] = response[14] == undefined ? '?' : response[14];
  this['pulse-plus-internal-code'] = response[15] == undefined ? 0 : response[15];
  this['pulse-plus-area-codes'] = response[16] == undefined ? '?' : response[16];
  this['pulse-plus-country-conf'] = response[17] == undefined ? 0 : response[17];
  this['pulse-plus-region-conf'] = response[18] == undefined ? 0 : response[18];
  this['pulse-plus-city-conf'] = response[19] == undefined ? 0 : response[19];
  this['pulse-plus-postal-conf'] = response[20] == undefined ? 0 : response[20];
  this['pulse-plus-gmt-offset'] = response[21] == undefined ? 0 : response[22];
  this['pulse-plus-in-dst'] = response[22] == undefined ? '?' : response[22];
}

const isValidDatabaseId = databaseId => {
  for (var key in databaseEnums) {
    if (databaseEnums.hasOwnProperty(key)) {
      if (databaseEnums[key] == databaseId) {
        return true;
      }
    }
  }

  return false;
};
const isValidApiId = apiId => {
  return validator.isInt(apiId, {
    min: 0,
    max: 127
  });
};
const isValidDelay = number => {
  return validator.isInt(number);
};
const determineIpType = ipAddress => {
  var type;

  if (validator.isIP(ipAddress, 4)) {
    type = 4;
  } else if (validator.isIP(ipAddress, 6)) {
    type = 6;
  }

  return type;
};
/**
 *
 * @param queryParamArray an array containint the databaseId, transaciton id, and ip address queried
 * @param responseArray the raw response array
 * @param callback the callback function provided by the user
 */

const generateResponseObject = (queryParamArray, responseArray, callback) => {
  var responseObject;

  switch (queryParamArray[0]) {
    case 3:
      responseObject = new na_geo(queryParamArray, responseArray);
      break;

    case 4:
      responseObject = new na_edge(queryParamArray, responseArray);
      break;

    case 5:
      responseObject = new na_sic(queryParamArray, responseArray);
      break;

    case 6:
      responseObject = new na_domain(queryParamArray, responseArray);
      break;

    case 7:
      responseObject = new na_zip(queryParamArray, responseArray);
      break;

    case 8:
      responseObject = new na_isp(queryParamArray, responseArray);
      break;

    case 9:
      responseObject = new na_home_biz(queryParamArray, responseArray);
      break;

    case 10:
      responseObject = new na_asn(queryParamArray, responseArray);
      break;

    case 11:
      responseObject = new na_language(queryParamArray, responseArray);
      break;

    case 12:
      responseObject = new na_proxy(queryParamArray, responseArray);
      break;

    case 14:
      responseObject = new na_is_an_isp(queryParamArray, responseArray);
      break;

    case 15:
      responseObject = new na_company(queryParamArray, responseArray);
      break;

    case 17:
      responseObject = new na_demographics(queryParamArray, responseArray);
      break;

    case 18:
      responseObject = new na_naics(queryParamArray, responseArray);
      break;

    case 19:
      responseObject = new na_cbsa(queryParamArray, responseArray);
      break;

    case 24:
      responseObject = new na_mobile_carrier(queryParamArray, responseArray);
      break;

    case 25:
      responseObject = new na_organization(queryParamArray, responseArray);
      break;

    case 26:
      responseObject = new na_pulse(queryParamArray, responseArray);
      break;

    case 30:
      responseObject = new na_pulse_plus(queryParamArray, responseArray);
      break;

    default:
      console.log('This should not happen.');
  }

  return responseObject;
};
const showError = (identify, extra) => {
  let errInfo;

  if (!identify || !commonError[identify]) {
    errInfo = commonError.ERROR;
  } else {
    errInfo = commonError[identify];
  }

  if (extra) {
    errInfo = errInfo.replace('%s', extra);
  }

  return errInfo;
};
const showResult = data => {
  return data;
};

/*
 * ***************************************************************************
 * File:           NetAcuityAPI.js
 * Author:         Digital Envoy
 * Program Name:   NetAcuity API library
 * Version:        6.0.0.7
 * Date:           21-Feb-2017
 *
 * Copyright 2000-2017, Digital Envoy, Inc.  All rights reserved.
 *
 *  Description:
 *    Node JS implementation of the Digital Envoy NetAcuity API library
 *    to query for ip based location data.
 *
 *
 *
 * This library is provided as an access method to the NetAcuity software
 * provided to you under License Agreement from Digital Envoy Inc.
 * You may NOT redistribute it and/or modify it in any way without express
 * written consent of Digital Envoy, Inc.
 *
 * Address bug reports and comments to:  tech-support@digitalenvoy.net
 *
 *
 * **************************************************************************
 */
const implementationProtocolVersion = 5;
const nodeJSAPI = 12;
const netAcuityPort = 5400;
/**
 *
 * @param queryParamArray contains the following parameters in order : databaseId, apiId, ipAddress, netAcuityServerIp, timeoutDelay
 * @param callback the user provided function that handles the asynchronous listeners' results
 * @param rawBoolean true if the user wants to receive raw data instead of a generated object
 */

const queryNetAcuityServer = (queryParamArray, rawBoolean = false) => {
  const [databaseId, apiId, ipAddress, netAcuityIp, timeoutDelay] = queryParamArray; //check if queryParamArray has appropriate values

  const ipType = determineIpType(netAcuityIp);
  return new Promise((resolve, reject) => {
    if (isValidDatabaseId(databaseId) && isValidApiId(apiId) && ipType != undefined && determineIpType(netAcuityIp) != undefined && isValidDelay(timeoutDelay)) {
      //set socket type and query string
      const client = ipType === 4 ? dgram__default["default"].createSocket('udp4') : dgram__default["default"].createSocket('udp6');
      const transactionId = randomstring.generate({
        length: 10,
        charset: 'alphanumeric'
      });
      const queryString = databaseId + ';' + apiId + ';' + ipAddress + ';' + implementationProtocolVersion + ';' + nodeJSAPI + ';' + transactionId + ';';
      const bufferMessage = Buffer.from(queryString); //if the request times out, close the client and call the callback function with the response

      const timeoutObject = setTimeout(function (err) {
        client.close();

        if (err) {
          return reject(showError('SERVICE_ERROR', err));
        }

        return reject(showError('TIMEOUT', transactionId));
      }, timeoutDelay); //parses the message received from the netacuity server and calls a function that generates the response objects and calls the callback function

      client.on('message', function (message) {
        client.close();
        clearTimeout(timeoutObject);
        const msg = message.toString();

        if (rawBoolean) {
          return resolve(showResult(msg));
        }

        const delimitedArray = msg.split(';'); //find the transactionId section, followed by the error, and then the fields - sometimes netacuity server pads with an extra field

        let index = 0;

        while (delimitedArray[index] != transactionId && index < delimitedArray.length) {
          index++;
        }

        if (index >= delimitedArray.length - 1) {
          return reject(showError('IDENTIFY_ERROR'));
        }

        if (delimitedArray[index + 1] == '') {
          //make sure error field is empty
          const responseArray = delimitedArray.slice(index + 2, delimitedArray.length - 1);
          const paramArray = [databaseId, transactionId, ipAddress];
          const response = generateResponseObject(paramArray, responseArray);
          return resolve(response);
        } else {
          return reject(showError('SERVICE_ERROR', `Error: ${delimitedArray[index + 1]}`));
        }
      }); //send the request

      client.send(bufferMessage, 0, bufferMessage.length, netAcuityPort, netAcuityIp, function (err) {
        if (err) {
          return reject(showError('SERVICE_ERROR', err));
        } // console.log('Querying NetAcuity Server : ' + queryString);

      });
    } else {
      reject(showError('PARAM_ERROR', err));
    }
  });
};

/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:24
 * @LastEditTime: 2021-10-21 10:16:00
 */

function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}
/**
 * get client geo info
 * @param {object} [req]
 * @param {object} [options] - Configuration.
 * @param {number} [options.databaseType]
 * @param {string} [options.netAcuityIp]
 * @param {number} [options.apiId]
 * @param {number} [options.timeoutDelay]
 * @param {boolean} [options.rawBoolean]
 * @return {*}
 */


const getClientInfo = async (req, options) => {
  if (!isObject(options)) {
    throw new TypeError('Options must be an object!');
  }

  const {
    databaseType = 3,
    apiId = 64,
    netAcuityIp,
    timeoutDelay = 2000,
    rawBoolean = false
  } = options;

  if (!netAcuityIp) {
    throw new Error('NetAcuityIp must be exist!');
  }

  const clientIp = dist.getClientIp(req);
  const queryParam = [databaseType, apiId, clientIp, netAcuityIp, timeoutDelay];

  try {
    return await queryNetAcuityServer(queryParam, rawBoolean);
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * Expose client geo as a middleware.
 *
 * @param {object} [options] - Configuration.
 * @param {string} [options.attributeName] - Name of attribute to augment request object with.
 * @return {*}
 */

const mw = (options = {}) => {
  if (!isObject(options)) {
    throw new TypeError('Options must be an object!');
  }

  const attributeName = options.attributeName || 'clientInfo';
  return async (req, res, next) => {
    const data = await getClientInfo(req, options);
    Object.defineProperty(req, attributeName, {
      get: () => data,
      configurable: true
    });
    next();
  };
};

exports.getClientInfo = getClientInfo;
exports.mw = mw;
