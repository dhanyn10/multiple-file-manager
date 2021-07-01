const trash = require('trash')
const chokidar = require('chokidar')
import { Utils } from "../scripts/Utils.js"

export const Manage = {
    prevDuplicated: function (fulldir, listfile) {

        fulldir = Utils.fulldirFunc(fulldir)

        let arrfilename = []
        let arrfileunique = []
        let arrfileExtension = []
        let fileEx = ""
        let report = []
        let tableData = []
        //get total of list file with selected: true
        const listlength = listfile.length
        let listSelected = 0
        for(let l = 0; l < listlength; l++)
        {
            if(listfile[l].selected == true)
            {
                const originalname = listfile[l].name.split(".")
                let tempname = originalname[0]
                fileEx = originalname[1]
                //insert all file name
                arrfilename.push(tempname)
                //insert all file extension
                arrfileExtension.push(fileEx)
                listSelected++
            }
        }
        if(listSelected == 0)
        {
            report.push('You dont choose any file yet')
        }
        //check of array of file extension has same value
        const allEqual = arr => arr.every(v => v === arr[0])
        //result Equal must have return true to make sure that executed files working as expected
        const resultEqual = allEqual(arrfileExtension)

        //make sure arrfilename are already sorted
        arrfilename.sort()

        if(resultEqual == true)
        {
            //find unique file name, then insert them to arrfileunique
            for(let d = 0; d < arrfilename.length; d++)
            {
                var duplicatedfile = false
                for(let u = 0; u < arrfileunique.length; u++)
                {
                    if(arrfilename[d].indexOf(arrfileunique[u]) > -1)
                    {
                        duplicatedfile = true;
                    }
                }
                if(duplicatedfile == false)
                {
                    arrfileunique.push(arrfilename[d])
                }
            }
            //this will return list of arrfilename that will be executed
            for(let afu = 0; afu < arrfileunique.length; afu++)
            {
                const fileUnique = arrfileunique[afu] + "." + fileEx
                for(let afn = 0; afn < arrfilename.length; afn++)
                {
                    const tempdeletedname = arrfilename[afn] + "." + fileEx
                    if(fileUnique == tempdeletedname)
                    {
                        //removing unique filenames contained inside arrfilename
                        const getIndex = arrfilename.indexOf(arrfilename[afn])
                        if(getIndex > -1)
                        {
                            arrfilename.splice(getIndex, 1)
                        }
                    }
                }
            }
            for(let t = 0; t < arrfilename.length; t++)
            {
                tableData.push({
                    Number: t + 1,
                    Filenames: arrfilename[t] + "." + fileEx
                })
            }
            if(tableData.length > 0)
                return {
                    type: 'array',
                    data: tableData
                }
        }
        else
        {
            report.push("files must have the same extension")
        }
        return {
            type: 'report',
            data: report
        }
    },
    deleteDuplicated: function (fulldir, listfile) {

        fulldir = Utils.fulldirFunc(fulldir)
        // this will return data from prevDuplicated
        const datadup = this.prevDuplicated(fulldir, listfile)
        if(datadup.type == 'array')
        {
            const files = datadup.data
            let report = []

            // delete(trash) all files listed in arrfilename
            for(let j = 0; j < files.length; j++)
            {
                const completename = files[j].Filenames
                const watcher = chokidar.watch(fulldir + completename, {
                    persistent: false
                })
                trash(fulldir + completename)
                watcher.on('unlink', path => {
                    path = Utils.reportBadge(path)
                    report.push(`File ${path} has been removed`)
                })
            }
            return report
        }
    }
}
