const fs = require('fs')
import { Utils } from "../scripts/Utils.js"

export const Rename = {
    
/**
 * @param fulldir   : full directory with absolute path
 * @param filename  : file name
 * @param newfile   : new file name
 */
    renameFunc: function (val)
    {
        var fulldir = val.fulldir,
            oldname = val.oldname,
            newname = val.newname

        fulldir = Utils.fulldirFunc(fulldir)

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
                var newname = filename.replace(deleteChar, "")
                this.renameFunc({
                    fulldir: fulldir,
                    oldname: filename,
                    newname: newname
                })
            }
        }
    },
    replaceFunc: function (val)
    {
        var fulldir     = val.fulldir
        var listfile    = val.listfile
        var repfrom     = val.repfrom
        var repto       = val.repto

        const length = listfile.length

        for(var l = 0; l < length; l++)
        {
            if(listfile[l].selected == true)
            {
                var filename = listfile[l].name
                var newname = filename.replace(repfrom, repto)
                this.renameFunc({
                    fulldir: fulldir,
                    oldname: filename,
                    newname: newname
                })
            }
        }
    },
    insertFunc: function (val)
    {
        var fulldir     = val.fulldir
        var listfile    = val.listfile
        var before      = val.before
        var after       = val.after
        
        const length = listfile.length
        
        for(var l = 0; l < length; l++)
        {
            if(listfile[l].selected == true)
            {
                var originalname = listfile[l].name
                var tempname = originalname.split(".")
                //assuming you file name contains only filename with single extension
                var filename = tempname[0]
                var completename = before + filename + after
                var newname = originalname.replace(filename, completename)
                this.renameFunc({
                    fulldir: fulldir,
                    oldname: originalname,
                    newname: newname
                })
            }
        }
    }
}
