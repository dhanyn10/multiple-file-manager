export const Utils = {
    fulldirFunc: function (dir) {

        var fulldir = dir

        //delete random string as refresh prefix
        if(fulldir.includes("_refresh_"))
            fulldir = fulldir.slice(22)
        
        // converting backward slash to forward slash
        fulldir = fulldir.replace(/\\/g, "/")
        var dirlength = fulldir.length

        //insert forward slash at the end of directory name
        var dirlastindex = fulldir.substring(dirlength-1, dirlength)
        if(dirlastindex != "/")
        {
            fulldir += "/"
        }
        return fulldir
    },
    mfmDevTools: function () {
        let remote = require('electron').remote
        remote.getCurrentWindow().openDevTools()
    },
    randomString: function (length) {
        return Math.random().toString(16).substr(2, length)
    }
}