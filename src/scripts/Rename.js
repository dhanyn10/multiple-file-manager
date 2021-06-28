const fs = require('fs')
var report = []
import { Utils } from "../scripts/Utils.js"

export const Rename = {
    
/**
 * @param fulldir   : full directory with absolute path
 * @param oldname   : file name before changed
 * @param newfile   : new file name
 */
    renameFunc: function (fulldir, oldname, newname)
    {
        fulldir = Utils.fulldirFunc(fulldir)
        
        let _old = fulldir + oldname,
            _new = fulldir + newname

        //check if filename is exist or not
        if(fs.existsSync(_old))
        {
            fs.renameSync(_old, _new)
            oldname = Utils.reportBadge(oldname)
            newname = Utils.reportBadge(newname)
            report.push(`File ${oldname} has been renamed to ${newname}`)
        }
        else
        {
            _old = Utils.reportBadge(_old)
            report.push(`File ${_old} is not exist`)
        }
    },
    prevRename: function (previous, next, dataList) {
        var tableData = []
        for(var d = 0; d < dataList.length; d++)
        {
            if(dataList[d].selected == true)
            {
                tableData.push({
                    before: dataList[d].name,
                    after: dataList[d].name.replace(previous, next)
                })
            }
        }
        return tableData
    },
    replaceFunc: function (fulldir, listfile, repfrom, repto)
    {
        const length = listfile.length

        //reset report array
        report = []

        for(var l = 0; l < length; l++)
        {
            if(listfile[l].selected == true)
            {
                var filename = listfile[l].name
                var newname = filename.replace(repfrom, repto)
                this.renameFunc(fulldir, filename, newname)
            }
        }
        return report
    },
    insertFunc: function (fulldir, listfile, before, after)
    {   
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
                
                this.renameFunc(fulldir, originalname, newname)
            }
        }
        return report
    }
}
