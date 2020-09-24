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
    }
}