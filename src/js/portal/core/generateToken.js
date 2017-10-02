import request from "../request";

/*
 * Generates an access token in exchange for user credentials that
 * can be used by clients when working with the ArcGIS Portal API.
 */
export function generateToken(username, password) {
    let portal = this;
    let url = `${portal.portalUrl}sharing/rest/generateToken`;
    let payload = {
        client: "referer",
        referer: window.location.hostname,
        expiration: 60,
        username: username,
        password: password,
        f: "json"
    };
    let options = {
        withCredentials: portal.withCredentials
    };
    return new Promise(function(resolve, reject) {
        request.post(url, payload, options).then(
            (response) => {
                if (response.token) {
                    resolve(response);
                } else if (response.error) {
                    reject(response);
                }
            },
            (error)  => {
                reject(error);
            }
        );
    });
}
