import * as _ from "lodash";
import {OmnisharpClientOptions} from "./interfaces";

export function ensureClientOptions(options: OmnisharpClientOptions) {
    var statusSampleTime = options.statusSampleTime || (options.statusSampleTime = 500);
    var responseSampleTime = options.responseSampleTime || (options.responseSampleTime = 100);
    var responseConcurrency = options.concurrency || (options.concurrency = 4);
    var timeout = options.timeout || (options.timeout = 60);
    var responseConcurencyTimeout = options.concurrencyTimeout || (options.concurrencyTimeout = Math.ceil(options.timeout / 6) * 1000);

    // Keep concurrency capped at 2
    // This lets us get around an issue with a single stuck request (that is taking a while to complete)
    options.concurrency = Math.max(options.concurrency, 2);

    // Keep concurrencyTimeout at a decently high interval.
    options.concurrencyTimeout = Math.max(options.concurrencyTimeout, Math.min(options.timeout * 1000, 5000));

    if (options && options.omnisharp) {
        options.additionalArguments = flattenArguments(options.omnisharp || {});
    }
}

export function flattenArguments(obj, prefix = '') {
    var result: any[] = [];
    _.each(obj, (value, key) => {
        if (_.isObject(value)) {
            result.push(...flattenArguments(value, `${prefix ? prefix + ':' : ''}${key[0].toUpperCase() + key.substr(1) }`));
            return
        }

        result.push(`--${prefix ? prefix + ':' : ''}${key[0].toUpperCase() + key.substr(1) }=${value}`);
    });

    return result;
}