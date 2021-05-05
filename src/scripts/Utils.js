export const Utils = {
    fulldirFunc: function (dir) {

        var fulldir = dir

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
    alertFunc: function (val) {
        var className = val.className
        var message = val.message
        var createHtml = "<div class='alert alert-" + className + " alert-dismissible'>"+
            "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
            message +
            "</div>"
        document.getElementById('report-result').innerHTML += createHtml
    },
    mfmDevTools: function () {
        let remote = require('electron').remote
        remote.getCurrentWindow().openDevTools()
    }
}