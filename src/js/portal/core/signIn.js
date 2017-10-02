/*
 * Generates an access token in exchange for user credentials that
 * can be used by clients when working with the ArcGIS Portal API.
 */
export function signIn(username, password) {
    let portal = this;
    return new Promise(function(resolve, reject) {
        portal.generateToken(username, password).then(
            (response) => {
                portal.token = response.token;
                portal.self().then(
                    (data) => {
                        portal.username = data.user.username;
                        portal.user = data.user;
                        portal.name = data.name || data.portalName;
                        portal.id = data.id;
                        if (data.isPortal === true) {
                            // Portal.
                            portal.portalUrl = "https://" + data.portalHostname + "/";
                        } else if (data.isPortal === false && data.id) {
                            // ArcGIS Online Org.
                            // Set it to the org's custom URL instead of www.arcgis.com.
                            portal.portalUrl = "https://" + data.urlKey + "." + data.customBaseUrl + "/";
                        } else {
                            // ArcGIS Online personal account.
                            portal.portalUrl = "https://" + data.portalHostname + "/";
                        }
                        portal.userProfile(portal.username).then(
                            (user) => {
                                portal.user.groups = user.groups;
                                portal.userContentAll().then(
                                    (content) => {
                                        resolve(portal);
                                    },
                                    (error) => {
                                        reject(error);
                                    }
                                );
                            },
                            (error) => {
                                reject(error);
                            }
                        );
                    },
                    (error) => {
                        reject(error);
                    }
                );
            },
            (error) => {
                reject(error);
            }
        );
    });
}
