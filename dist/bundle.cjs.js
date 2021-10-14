'use strict';

/**
 * 当前函数库版本
 */
var netAcuityAPI = require('./lib/NetAcuityAPI.js');
var databaseEnums = {
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
    pulseplus: 30,
};
var query = function () {
    return __awaiter(this, void 0, void 0, function () {
        var queryParam, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryParam = [databaseEnums.geo, 64, '118.26.73.210', '47.88.65.136', 2000];
                    return [4 /*yield*/, netAcuityAPI.queryNetAcuityServer(queryParam)];
                case 1:
                    res = _a.sent();
                    console.log(res);
                    return [2 /*return*/];
            }
        });
    });
};
query();
