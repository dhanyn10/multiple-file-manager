const trash = require('trash')
const chokidar = require('chokidar')
import { Utils } from "../scripts/Utils.js"

export const Manage = {
    deleteDuplicated: function (val) {
        var fulldir = val.fulldir
        var listfile = val.listfile

        fulldir = Utils.fulldirFunc(fulldir)

        var arrfilename = []
        var arrfileunique = []
        var arrfileExtension = []
        var fileEx = ""
        //get total of list file with selected: true
        var listlength = listfile.length
        for(var l = 0; l < listlength; l++)
        {
            if(listfile[l].selected == true)
            {
                const originalname = listfile[l].name.split(".")
                var tempname = originalname[0]
                fileEx = originalname[1]
                //insert all file name
                arrfilename.push(tempname)
                //insert all file extension
                arrfileExtension.push(fileEx)
            }
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
            for(var d = 0; d < arrfilename.length; d++)
            {
                var duplicatedfile = false
                for(var u = 0; u < arrfileunique.length; u++)
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
            for(var afu = 0; afu < arrfileunique.length; afu++)
            {
                // console.log(arrfileunique[afu])
                const fileUnique = arrfileunique[afu] + "." + fileEx
                // console.log(fileUnique)
                for(var afn = 0; afn < arrfilename.length; afn++)
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
            //delete(trash) all files listed in arrfilename
            for(var afd = 0; afd < arrfilename.length; afd++)
            {
                const exfile = arrfilename[afd] + "." + fileEx
                const watcher = chokidar.watch(fulldir + exfile, {
                    persistent: false
                })
                trash(fulldir + exfile)
                watcher.on('unlink', path => {
                    Utils.mfmDevTools()
                    console.info(`File ${path} has been removed`)
                })
            }
        }
        else
        {
            Utils.mfmDevTools()
            console.error("files must have the same extension")
        }
    }
}
