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
                    category: "Utilities",
                    icon: './public/icon/icon.png'
                },
                dmg: {
                    icon: './public/icon/icon.png'
                }
            }
        }
    }
}