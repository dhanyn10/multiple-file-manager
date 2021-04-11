module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                win: {
                    icon: './public/icon/icon.png'
                },
                linux: {
                    package: [
                        "deb",
                        "AppImage"
                    ],
                    icon: './public/icon/icon.png'
                },
                dmg: {
                    icon: './public/icon/icon.png'
                }
            }
        }
    }
}