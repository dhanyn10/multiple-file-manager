const fs = require('fs')
let report = []
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
    prevRename: function (selectedFunc, previous, next, dataList) {
        let tableData = []
        for(let d = 0; d < dataList.length; d++)
        {
            if(dataList[d].selected == true)
            {
                if(selectedFunc == 1)
                {
                    let filename = dataList[d].name
                    let newname = filename.replace(previous, next)
                    tableData.push({
                        before: filename,
                        after: newname
                    })
                }
                else if (selectedFunc == 2)
                {
                    let originalname    = dataList[d].name
                    let tempname        = originalname.split(".")
                    let filename        = tempname[0]
                    let completename    = previous + filename + next
                    let newname         = originalname.replace(filename, completename)
                    tableData.push({
                        before: originalname,
                        after: newname
                    })
                }
            }
        }
        return tableData
    },
    replaceFunc: function (fulldir, listfile, repfrom, repto)
    {
        const length = listfile.length

        //reset report array
        report = []

        for(let l = 0; l < length; l++)
        {
            if(listfile[l].selected == true)
            {
                let filename = listfile[l].name
                let newname = filename.replace(repfrom, repto)
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

        for(let l = 0; l < length; l++)
        {
            if(listfile[l].selected == true)
            {
                let originalname    = listfile[l].name
                let tempname        = originalname.split(".")

                //assuming you file name contains only filename with single extension
                let filename        = tempname[0]
                let completename    = before + filename + after
                let newname         = originalname.replace(filename, completename)
                
                this.renameFunc(fulldir, originalname, newname)
            }
        }
        return report
    }
}
