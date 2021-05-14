export const Utils = {
    fulldirFunc: function (dir) {

        var fulldir = dir

        //delete random string as refresh prefix
        //random string generates is like xxxx...(16 char)_refresh_
        if(fulldir.slice(16,25) == "_refresh_")
            fulldir = fulldir.slice(25)
        
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
        var rs = '';
        do {
            rs += Math.random().toString(36).substr(2)
        } while (rs.length < length)
        
        rs = rs.substr(0, length)
        
        return rs;
    }
}
