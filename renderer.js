let remote  = require('electron').remote;
let dialog  = remote.dialog;
let mainapp = remote.require('./index');
let btn     = document.getElementById('browse-directory');
let shell   = require('electron').shell

//open all link to default browser
document.addEventListener('click', function (event) {
    if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        shell.openExternal(event.target.href)
    }
})

btn.addEventListener('click', () => {
    //show open directory window
    dialog.showOpenDialog({
        properties: ['openDirectory']
    },
    //display folder position result in absolute path
    (folderposition) => {
        if(folderposition !== undefined)
        {
            //when user confirm submit folder name
            //set input field with attributes id location with result of selected directory
            document.getElementById('location').value = folderposition;
        }
        else
        {
            /* when user cancel submit folder name
             * set input field with attributes id location with null. So, in application
             * will only display the placeholder value of this element
             */
            document.getElementById('location').value = null;
        }
    });
})

document.getElementById('execute').addEventListener('click', function(){
    //format result status element with null/empty
    document.getElementById('result-status').innerHTML = null;
    //location -> file directory in explorer with absolute path
    var location    = document.getElementById('location').value;
    //retrieve user function option with html attribute "name" with value "manage"
    var manage      = document.getElementsByName('manage');
    //variable for option 4
    var arrfile     = [];//array to store filename
    var arrfileun   = [];//array to store unique filename
    for(i = 0; i < manage.length; i++)
    {
        //get ckecked radio input to specify which function will used
        if(manage[i].checked)
        {
            option = manage[i].value;
        }
    }
    //system require nodejs filesystem
    var fs          = require('fs');
    //converting backward slash to forward slash
    location        = location.replace(/\\/g, "/");
    //insert forward slash to reduce user mistake in writting a slash
    loclength       = location.length;
    loclastindex    = location.substring(loclength-1, loclength);

    if(loclength == 0)
    {
        document.getElementById("result-status").innerHTML =
        '<div class="card">' +
            '<div class="card-header bg-red static text-white">Error</div>' +
            '<div class="card-content bg-white">' +
                '<div class="card-content-text" style="word-wrap:break-word;">' +
                    'Directory is empty' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="block" style="margin-bottom:2px"></div>' +
        document.getElementById("result-status").innerHTML;
    }
    else
    {

        if(loclastindex != "/")
        {
            location += "/";
        }
    
        var fulldir     = location;
    
        //file system function to read the directory
        fs.readdir(fulldir, function (error, files)
        {
            if (error)
            {
                document.getElementById("result-status").innerHTML =
                '<div class="card">' +
                    '<div class="card-header bg-red static text-white">Error</div>' +
                    '<div class="card-content bg-white">' +
                        '<div class="card-content-text" style="word-wrap:break-word;">' +
                            '<pre>' +
                                '<code style="overflow:auto">' +
                                    error +
                                '</code>' +
                            '</pre>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="block" style="margin-bottom:2px"></div>' +
                document.getElementById("result-status").innerHTML;
            }
        
            //reset notification every click to the button
            document.getElementById('success-count').value = 0;
    
            newfile         = "";
            deletechar      = document.getElementsByName('delete-character')[0].value;
            replacefind     = document.getElementsByName('replace-find')[0].value;
            replacewith     = document.getElementsByName('replace-with')[0].value;
            insertbefore    = document.getElementsByName('insert-before')[0].value;
            insertafter     = document.getElementsByName('insert-after')[0].value;
    
            files.forEach(function (filename)
            {
                arrname       = filename.split(".");
                //assumtion file name including extension has written like as follow
                //loremipsum.pdf
                filenameonly  = arrname[0];
                
                /* for option 4, insert all of the file name to array "arrfile"
                 * we will get all file name first then sort it
                */
                arrfile.push(filenameonly);
    
                fileextension = "." + arrname[arrname.length-1];
    
                //function for rename file
                if(option >= 1 && option <= 3)
                {
                    //function for deleting character
                    if(option == 1)
                    {
                        newfile = filename.replace(deletechar, "");
                    }
                    //function for replacing character
                    if(option == 2)
                    {
                        newfile = filename.replace(replacefind, replacewith);
                    }
                    //function for inserting character
                    if(option == 3)
                    {
                        newfile = insertbefore + filenameonly + insertafter + fileextension;
                    }
                    //filesystem action for function 1 to 3
                    fs.rename(fulldir + filename, fulldir + newfile, function (error)
                    {
                        if (error)
                        {
                            document.getElementById("result-status").innerHTML =
                            '<div class="card">' +
                                '<div class="card-header bg-red static text-white">Error</div>' +
                                '<div class="card-content bg-white">' +
                                    '<div class="card-content-text" style="word-wrap:break-word;">' +
                                        'Filename : ' + filename + "<br/>" +
                                        '<pre>' +
                                            '<code style="overflow:auto">' +
                                                error +
                                            '</code>' +
                                        '</pre>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="block" style="margin-bottom:2px"></div>' +
                            document.getElementById("result-status").innerHTML;
                        }
                        else
                        {
                            successcount = document.getElementById('success-count').value;
                            successcount = Number(successcount);
                            successcount++;
                            document.getElementById('success-count').value = successcount;
                        }
                    });
                }
            });
            //function for delete duplicated file
            if(option == 4)
            {
                //sort all file name in current directory
                arrfile = arrfile.sort();
                for(a = 0; a < arrfile.length; a++)
                {
                    duplicatedfile = false;
                    for(c = 0; c < arrfileun.length; c++)
                    {
                        /* if result indexOf return > -1, means that there's any
                         * similarity in filename
                         */
                        if(arrfile[a].indexOf(arrfileun[c]) > -1)
                        {
                            duplicatedfile = true;
                        }
                    }
                    //dont find any duplication in filename
                    if(duplicatedfile == false)
                    {
                        //insert filename into array
                        arrfileun.push(arrfile[a]);
                    }
                }
                files.forEach(function(filename){
                    deletethisfile = true;
                    for(a = 0; a < arrfileun.length; a++)
                    {
                        //split filename with dot (.)
                        arrname       = filename.split(".");
                        //get file name extension
                        fileextension = "." + arrname[arrname.length-1];
                        //uset value for uniquefilename
                        uniquefilename = arrfileun[a] + fileextension;
                        //if filename and uniquefilename is same
                        if(filename === uniquefilename)
                        {
                            deletethisfile = false;
                        }
                    }
                    if(deletethisfile == true)
                    {
                        fs.unlink(fulldir + filename, function (error)
                        {
                            if (error)
                            {
                                document.getElementById("result-status").innerHTML =
                                '<div class="card">' +
                                    '<div class="card-header bg-red static text-white">Error</div>' +
                                    '<div class="card-content bg-white">' +
                                        '<div class="card-content-text" style="word-wrap:break-word;">' +
                                            'Filename : ' + filename + "<br/>" +
                                            '<pre>' +
                                                '<code style="overflow:auto">' +
                                                    error +
                                                '</code>' +
                                            '</pre>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="block" style="margin-bottom:2px"></div>' +
                                document.getElementById("result-status").innerHTML;
                            }
                            else
                            {
                                successcount = document.getElementById('success-count').value;
                                successcount = Number(successcount);
                                successcount++;
                                document.getElementById('success-count').value = successcount;
                            }
                        });
                    }
                });
            }
        });
        setTimeout(function(){
            successcount = Number(document.getElementById('success-count').value);
            if(successcount > 0)
            {
                var alertsuccess = 
                '<div class="card">' +
                    '<div class="card-header bg-green text-white">' +
                        'Success ['+ successcount + ']' +
                    '</div>' +
                '</div>' +
                '<div class="block" style="margin-bottom:2px"></div>';
                document.getElementById("result-status").innerHTML = alertsuccess + document.getElementById("result-status").innerHTML;
            }
        },500);
    }
});
window.onerror = function(error, url, line) {
    var alerterror = 
        '<div class="card">' +
            '<div class="card-header bg-red static text-white">Error</div>' +
            '<div class="card-content bg-white">' +
                '<div class="card-content-text" style="word-wrap:break-word;">' +
                    '<pre>' +
                        '<code style="overflow:auto">' +
                            error +
                        '</code>' +
                    '</pre>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="block" style="margin-bottom:2px"></div>';
        document.getElementById("result-status").innerHTML = alerterror + document.getElementById("result-status").innerHTML;
};