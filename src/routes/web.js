export const Routes = [
    {
        uri: '/',
        method: 'get',
        callback: (_req, res) => {
            res.render("index.njk", {
                appName: "Chismecito Chat"
            });
        }
    }
];
