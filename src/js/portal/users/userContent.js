import request from "../request";

export function userContent(
    username,
    folder = null,
    start = 1,
    num = 100
) {
    let portal = this;
    let url = `${portal.portalUrl}sharing/rest/content/users/${username}` + (folder ? `/${folder}` : "");
    let parameters = {
        start: start,
        num: num,
        token: portal.token,
        f: "json"
    };
    let options = {
        withCredentials: portal.withCredentials
    };
    return request.get(url, parameters, options);
}
