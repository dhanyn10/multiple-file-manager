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
                    category: "Utility"
                },
                dmg: {
                    icon: './public/icon/icon.png'
                }
            }
        }
    }
}