let remote  = require('electron').remote;
let dialog  = remote.dialog;
let mainapp = remote.require('./index');
let btn     = document.getElementById('browse-directory');

$('.panel-heading').click(function() {
    $('.panel-heading').removeClass('active-function');
    if(!$(this).closest('.panel').find('.panel-collapse').hasClass('in'))
        $(this).addClass('active-function');
});

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
});

$("#apply").click(function(){
    //initiate array to store filename
    arrfilename         = [];

    //initiate array to store unique filename
    arrfileunique       = [];

    //retrieve value selected function
    selected_function   = $(".active-function").attr('href');

    //get file location
    directory_location  = $("#location").val();

    if(selected_function != null)
    {
        // retrieve selected function name, so when it has "#function", then will get "function"
        selected_function   = selected_function.substring(1);

        // converting backward slash to forward slash
        directory_location  = directory_location.replace(/\\/g, "/");
        //count location length value
        loclength           = directory_location.length;

        // error handler if user haven't choose any directory yet
        if(loclength == 0)
        {
            swal("Directory cannot be empty",{
                buttons: {
                    cancel: {
                        text: "Okey",
                        visible: true,
                        className: "btn-danger"
                    }
                },
                closeOnClickOutside: false
            });
        }
        else
        {
            //insert forward slash at the end of directory name
            loclastindex    = directory_location.substring(loclength-1, loclength);

            if(loclastindex != "/")
            {
                directory_location += "/";
            }

            //initiate electron filesystem
            fs = require('fs');

            //filesystem use function read current directory
            fs.readdir(directory_location, function(error, file){

                //error status
                if(error)
                {
                    swal({
                        title: "Error",
                        text: "Description: "+ error + "<br/> File: " + file,
                        buttons: {
                            confirm: {
                                text: "Okey",
                                visible: true,
                                className: "btn-danger"
                            }
                        }
                    });
                }
                //no error found
                else
                {
                    //initiate variable to store new file name
                    newfilename             = "";

                    delete_character        = $("#input-delete-character").val();
                    replace_character_from  = $("#input-replace-character-from").val();
                    replace_character_to    = $("#input-replace-character-to").val();
                    insert_character_before = $("#input-insert-character-before").val();
                    insert_character_after  = $("#input-insert-character-after").val();

                    //execution to each file at recent directory
                    file.forEach(function(filename){

                        /**
                         * =========================================================================
                         * get file name without it's extension, assuming file has complete name
                         * like mytext.pdf, so we will get filename : "mytext" without pdf extension
                         * =========================================================================
                         */
                        temporaryfilename   = filename.split(".");
                        filenameonly        = temporaryfilename[0];

                        /**
                         * =========================================================================
                         * for function "delete duplicated file" we need to insert all file name to
                         * >>arrfilename<< then sort it when usen need to run the function
                         * =========================================================================
                         */
                        arrfilename.push(filenameonly);

                        //set file extension
                        file_extension      = "." + temporaryfilename[temporaryfilename.length - 1];

                        //function for rename file
                        if(selected_function == "delete-character")
                        {
                            //replace character all file in current directory with nothing
                            newfilename = filename.replace(delete_character, "");
                            //run rename
                            rename(selected_function, fs, directory_location, arrfilename, filename, newfilename);
                        }
                        if(selected_function == "replace-character")
                        {
                            newfilename = filename.replace(replace_character_from, replace_character_to);
                            //run rename
                            rename(selected_function, fs, directory_location, arrfilename, filename, newfilename);
                        }
                        if(selected_function == "insert-character")
                        {
                            newfilename = insert_character_before + filenameonly + insert_character_after + file_extension;
                            //run rename
                            rename(selected_function, fs, directory_location, arrfilename, filename, newfilename);
                        }
                    });
                    if(selected_function == "delete-duplicated-file")
                    {
                        //sort all file name in current directory
                        arrfilename = arrfilename.sort();
                        for(a = 0; a < arrfilename.length; a++)
                        {
                            duplicatedfile = false;
                            for(c = 0; c < arrfileunique.length; c++)
                            {
                                /**
                                 * ============================================================================
                                 * Looking for any similarity in filename with javascript >>indexOf<< function.
                                 * if this indexOf function return value with > -1, then it's mean there is any
                                 * similarity in filename and set boolean:duplicatedfile to "true"
                                 * ============================================================================
                                 */
                                if(arrfilename[a].indexOf(arrfileunique[c]) > -1)
                                {
                                    duplicatedfile = true;
                                }
                            }
                            /**
                             * ================================================================================
                             * at the rest of above loop to find any duplicated file. If system don't
                             * find any dupplicated file based on filename, current filename will be stored
                             * into >>arrfileunique<<
                             * ================================================================================
                             */
                            if(duplicatedfile == false)
                            {
                                arrfileunique.push(arrfilename[a]);
                            }
                        }
                        //function delete duplicated file
                        deleteduplicatedfile(fs, directory_location, file, arrfilename, arrfileunique);
                    }
                }
            });
        }
    }
    else
    {
        swal("Please choose a function first",{
            buttons: {
                cancel: {
                    text: "Okey",
                    visible: true,
                    className: "btn-danger"
                }
            },
            closeOnClickOutside: false
        });
    } 
});


/**
 * 
 * @param fn : "selected function"
 * @param fs : electron filesystem
 * @param fulldir   : full directory with absolute path
 * @param filename  : file name
 * @param newfile   : new file name
 */
function rename(fn, fs, fulldir, arrfilename, filename, newfile)
{
    swal({
        title: "Attention",
        text: "Here're the list of file that will be executed",
        buttons: {
            cancel: "Cancel",
            catch: {
                text: "Execute",
                visible: true,
                className: "btn-danger",
                value: "run"
            }
        },
        closeOnClickOutside: false
    }).then((value) => {
        switch(value)
        {
            case "run":
                fs.rename(fulldir + filename, fulldir + newfile, function(error){
                    if(error)
                    {
                        swal({
                            title: "Error",
                            text: "Description: "+ error,
                            buttons: {
                                confirm: {
                                    text: "Okey",
                                    visible: true,
                                    className: "btn-danger"
                                }
                            },
                            closeOnClickOutside: false
                        });
                    }
                    else
                    {
                        ms = null;
                        if(fn == "delete-character")
                        {
                            ms = "delete character success";
                        }
                        else if(fn == "replace-character")
                        {
                            ms = "replace character success";
                        }
                        else if(fn == "insert-character")
                        {
                            ms = "insert character success";
                        }
                        swal({
                            title: "Success",
                            text: ms,
                            buttons: {
                                confirm: {
                                    text: "Okey",
                                    visible: true,
                                    className: "btn-success"
                                }
                            },
                            closeOnClickOutside: false
                        });
                    }
                });
            break;
            default:
                swal({
                    title: "Info",
                    text: "Execution canceled",
                    buttons: {
                        confirm: {
                            text: "Okey",
                            visible: true,
                            className: "btn-success"
                        }
                    },
                    closeOnClickOutside: false
                });
            break;
        }
    });
}
function deleteduplicatedfile(fs, fulldir, file, arrfilename, arrfileunique)
{
    file.forEach(function(filename){
        deletethisfile = true;
        for(a = 0; a < arrfileunique.length; a++)
        {
            //split filename with dot (.)
            arrname         = filename.split(".");
            //get file name extension
            fileextension       = "." + arrname[arrname.length-1];
            //set value for uniquefilename
            uniquefilename      = arrfileunique[a] + fileextension;
            //if filename and uniquefilename is same
            if(filename == uniquefilename)
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
                    swal({
                        title: "Error",
                        text: "Description: "+ error,
                        buttons: {
                            confirm: {
                                text: "Okey",
                                visible: true,
                                className: "btn-danger"
                            }
                        },
                        closeOnClickOutside: false
                    });
                }
                else
                {
                    swal({
                        title: "Success",
                        text: "Success deleting your duplicated file",
                        buttons: {
                            confirm: {
                                text: "Okey",
                                visible: true,
                                className: "btn-success"
                            }
                        },
                        closeOnClickOutside: false
                    });
                }
            });
        }
    });
}

window.onerror = function(error, url, line) {
    swal({
        title: "Error",
        text: "Description: \n" + error + "\n Line: " + line,
        buttons: {
            confirm: {
                text: "Okey",
                visible: true,
                className: "btn-danger"
            }
        },
        closeOnClickOutside: false
    });
}