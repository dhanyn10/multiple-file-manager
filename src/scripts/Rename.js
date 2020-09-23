const fs = require('fs')

export const Rename = {
    
/**
 * 
 * @param fn : "selected function"
 * @param fulldir   : full directory with absolute path
 * @param filename  : file name
 * @param newfile   : new file name
 */
    renameFunc: function (val)
    {
        var fulldir = val.fulldir,
            oldname = val.oldname,
            newname = val.newname

        // converting backward slash to forward slash
        fulldir = fulldir.replace(/\\/g, "/")
        var dirlength = fulldir.length

        //insert forward slash at the end of directory name
        var dirlastindex = fulldir.substring(dirlength-1, dirlength)
        if(dirlastindex != "/")
        {
            fulldir += "/"
        }

        //renaming file
        fs.renameSync(fulldir + oldname, fulldir + newname, function(error){
            if(error){
                console.log(error)
            }
        })
    },

    deleteFunc: function(val)
    {
        var fulldir     = val.fulldir
        var listfile    = val.listfile
        var deleteChar  = val.deleteChar

        const length = listfile.length

        for(var l = 0; l < length; l++)
        {
            if(listfile[l].selected == true)
            {
                var filename = listfile[l].name
                //replace character all file in current directory with nothing
                var newname = filename.replace(deleteChar, "")
                this.renameFunc({
                    fulldir: fulldir,
                    oldname: filename,
                    newname: newname
                })
            }
        }
    }
}
