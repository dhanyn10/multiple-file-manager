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
            loclastindex    = location.substring(loclength-1, loclength);
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