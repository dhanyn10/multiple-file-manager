const fs = require('fs')
var report = []
import { Utils } from "../scripts/Utils.js"

export const Rename = {
    
/**
 * @param fulldir   : full directory with absolute path
 * @param filename  : file name
 * @param newfile   : new file name
 */
    renameFunc: function (val)
    {
        let fulldir = val.fulldir,
            oldname = val.oldname,
            newname = val.newname

        fulldir = Utils.fulldirFunc(fulldir)
        
        let _old = fulldir + oldname,
            _new = fulldir + newname

        //check if filename is exist or not
        if(fs.existsSync(_old))
        {
            fs.renameSync(_old, _new)
            report.push(`File ${oldname} has been renamed to ${newname}`)
        }
        else
        {
            report.push(`File ${_old} is not exist`)
        }
    },

    deleteFunc: function(val)
    {
        var fulldir     = val.fulldir
        var listfile    = val.listfile
        var deleteChar  = val.deleteChar

        const length = listfile.length

        //reset report array
        report = []

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
        return report
    },
    replaceFunc: function (val)
    {
        var fulldir     = val.fulldir
        var listfile    = val.listfile
        var repfrom     = val.repfrom
        var repto       = val.repto

        const length = listfile.length

        //reset report array
        report = []

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
        return report
    },
    insertFunc: function (val)
    {
        var fulldir     = val.fulldir
        var listfile    = val.listfile
        var before      = val.before
        var after       = val.after
        
        const length = listfile.length
        
        //reset report array
        report = []

        for(var l = 0; l < length; l++)
        {
            if(listfile[l].selected == true)
            {
                var originalname    = listfile[l].name
                var tempname        = originalname.split(".")

                //assuming you file name contains only filename with single extension
                var filename        = tempname[0]
                var completename    = before + filename + after
                var newname         = originalname.replace(filename, completename)
                
                this.renameFunc({
                    fulldir: fulldir,
                    oldname: originalname,
                    newname: newname
                })
            }
        }
        return report
    }
}
