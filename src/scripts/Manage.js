const fs = require('fs')
import { Utils } from "../scripts/Utils.js"

export const Manage = {
    deleteDuplicated: function (val) {
        var fulldir = val.fulldir
        var listfile = val.listfile

        fulldir = Utils.fulldirFunc(fulldir)

        var arrfilename = []
        var arrfileunique = []
        var fileEx = ""
        //get total of list file with selected: true
        var listlength = listfile.length
        for(var l = 0; l < listlength; l++)
        {
            if(listfile[l].selected == true)
            {
                var originalname = listfile[l].name.split(".")
                var tempname = originalname[0]
                fileEx = originalname[1]
                //insert all file name
                arrfilename.push(tempname)
            }
        }
        //make sure the array of file name is already sorted
        arrfilename.sort()

        //find unique file name, then insert them to array: arrfileunique
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
        for(var afu = 0; afu < arrfileunique.length; afu++)
        {
            var originaluniquename = arrfileunique[afu] + "." + fileEx
            for(var afn = 0; afn < arrfilename.length; afn++)
            {
                var tempdeletedname = arrfilename[afn] + "." + fileEx
                if(originaluniquename != tempdeletedname)
                {
                    fs.unlink(fulldir + tempdeletedname, function (error){
                        if(error)
                        {
                            var createHtml = "<div class='alert alert-danger alert-dismissible'>"+
                                "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                                error +
                                "</div>"
                            document.getElementById('report-result').innerHTML += createHtml
                        }
                    })
                }
            }
        }
    }
}