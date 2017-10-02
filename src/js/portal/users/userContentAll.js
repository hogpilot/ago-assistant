export function userContentAll(username) {
    let portal = this;
    let totalResults = Infinity;
    let numResultsRetreived = 0;
    let folders = null;
    username = username || portal.username;

    return new Promise(function(resolve, reject) {
        let fetchResults = (username, folder, start) => {
            return portal.userContent(username, folder, start).then(
                (results) => {
                    let currentFolderId = results.currentFolder ? results.currentFolder.id : null;
                    let folder = null;
                    if (results.folders && !folders) {
                        folders = [];
                        results.folders.forEach(
                            (item) => {
                                folders.push(
                                    {
                                        id: item.id,
                                        title: item.title,
                                        items: []
                                    }
                                );
                                fetchResults(username, item.id, 1);
                            }
                        );
                        folders.push(
                            {
                                id: null,
                                title: "/",
                                items: []
                            }
                        );
                    }
                    folders.some(
                        (element) => {
                            let match = element.id == currentFolderId;
                            if (match) {
                                folder = element;
                            }
                            return match;
                        }
                    );
                    folder.items = folder.items.concat(results.items);
                    folder.total = results.total;
                    if (results.nextStart != -1) {
                        fetchResults(username, folder.id, results.nextStart);
                    } else {
                        if (!folders.some(
                            (element) => {
                                return element.total != element.items.length;
                            }
                        )) {
                            if (username == portal.username) {
                                portal.user.content = folders;
                            }
                            resolve(folders);
                        }
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        };
        fetchResults(username);
    });
}
