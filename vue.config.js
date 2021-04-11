module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                win: {
                    icon: './public/icon/icon.png'
                },
                linux: {
                    target: [
                        "deb",
                        "AppImage"
                    ],
                    category: "Utility",
                    icon: './public/icon/icon.png'
                },
                dmg: {
                    icon: './public/icon/icon.png'
                }
            },
            externals: ['chokidar'],
            // List them all here so that VCP Electron Builder can find them
            nodeModulesPath: ['../../node_modules', './node_modules']
        }
    }
}
