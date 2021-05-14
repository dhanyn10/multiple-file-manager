export const Utils = {
    addZero: function (x, n) {
        while (x.toString().length < n) {
            x = "0" + x
        }
        return x
    },
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
        
        //generate time from hour to miliseconds
        const d = new Date(),
        h = this.addZero(d.getHours(), 2),
        m = this.addZero(d.getMinutes(), 2),
        s = this.addZero(d.getSeconds(), 2),
        ms = this.addZero(d.getMilliseconds(), 3),
        dateHMSMl = h + "-" + m + "-" + s + "-" + ms

        //generate random string with given specific length
        var rs = '';
        do {
            rs += Math.random().toString(36).substr(2)
        } while (rs.length < length)
        
        rs = rs.substr(0, length)
        
        return dateHMSMl + rs
    }
}
