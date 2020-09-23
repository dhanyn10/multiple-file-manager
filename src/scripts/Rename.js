// const filesystem = require('fs')

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
        
        console.log("dir", fulldir)
        console.log("oldname", oldname)
        console.log("newname", newname)
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
