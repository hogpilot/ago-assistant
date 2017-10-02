import request from "../request";

/*
 * Return the version of the portal.
 */
export function version() {
    let portal = this;
    let url = `${portal.portalUrl}sharing/rest`;
    let parameters = {
        f: "json"
    };
    let options = {
        withCredentials: portal.withCredentials
    };
    // return request.get(url, parameters, options);
    return new Promise(function(resolve, reject) {
        request.get(url, parameters, options).then(
            (data) => {
                console.info("API v" + data.currentVersion);
                resolve(data);
            },
            () => {
                // Try it again with enterprise auth.
                options.withCredentials = portal.withCredentials = true;
                request.get(url, parameters, options).then(
                    (data) => {
                        console.info("API v" + data.currentVersion);
                        resolve(data);
                    },
                    (error) => {
                        // It's still failing, perhaps we should now try enterprise auth with jsonp so crossdomain will follow redirects.
                        console.info("If the portal URL is actually valid, please log a github issue and reference 'portal.version() fails with url ____`");
                        // This is not implemented because it probably isn't needed, but see:
                        // https://github.com/Esri/ago-assistant/blob/b2b15a89d1ef0f8a42716a37d8ef7b7da0db97f3/src/js/portal/portal.js#L9
                        // for how it was implemented in the past
                        portal.withCredentials = false;
                        reject(error);
                    }
                );
            }
        );
    });
}
