<div align="center">

# Multiple File Manager  
[![devDependencies Status](https://david-dm.org/dhanyn10/multiple-file-manager/dev-status.svg)](https://david-dm.org/dhanyn10/multiple-file-manager?type=dev)
[![dependencies Status](https://david-dm.org/dhanyn10/multiple-file-manager/status.svg)](https://david-dm.org/dhanyn10/multiple-file-manager)
[![version](https://badge.fury.io/gh/dhanyn10%2Fmultiple-file-manager.svg)](https://badge.fury.io/gh/dhanyn10%2Fmultiple-file-manager)
</div>

## Download
You can check the latest version to [release page](https://github.com/dhanyn10/multiple-file-manager/releases)

## How it Work
### Rename File
#### Delete :  
deleting character that's match to every filename in a folder.  
  
if you have:  

    file-01.pdf  
    file-02.pdf  
    file-03.pdf  

fill the `delete` input field with `file`, then you will have result as follows:

    -01.pdf  
    -02.pdf  
    -03.pdf  

#### Replace :  
replace character to any character you want to replace.
if you have:

    file-01.pdf  
    file-02.pdf  
    file-03.pdf  

fill the `from` input field with `file`, and `to` with `goodbooks`, then you will have result as follows:  

    goodbooks-01.pdf  
    goodbooks-02.pdf  
    goodbooks-03.pdf  

#### Insert :  
insert character to the beginning(prefix) and/or the end(suffix) of your filename.  
if you have:

    file-01.pdf  
    file-02.pdf  
    file-03.pdf  

fill the `before` input field with `library-`,  
and `after` with ` collection`, then you will have result as follows:

    library-file-01 collection.pdf  
    library-file-02 collection.pdf    
    library-file-03 collection.pdf    


### Manage File
#### Delete Duplicated  
deleting any file which detected as duplicated file.  
this function will detecting duplicated file just in the recent folder, when you have selecting some file as follows:  

    doc 01.txt
    doc 01_0.txt
    doc 01_1.txt
    doc 01_2.txt
    doc 02.txt
    doc 02_0.txt
    doc 02_1.txt
    doc 02_2.txt

this application will specify that `doc 01.txt` and `doc 02.txt` will keep to your computer, and the rest as follows:

    doc 01_0.txt
    doc 01_1.txt
    doc 01_2.txt
    doc 02_0.txt
    doc 02_1.txt
    doc 02_2.txt

__will deleted permanently__  
## Contribution
Do you find an error or have feature request? then let's check this repository [issues](https://github.com/dhanyn10/multiple-file-manager/issues)

## License
this project is developed under [MIT License](LICENSE)
