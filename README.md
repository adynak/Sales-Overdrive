
## Sales Overdrive

This repo is a collection of JavaScript code used to facilitate building PDF forms.

* The code is a Folder Level Script.
* The code is accessible from the Help menu.

## Getting Started

You have a few things to get in place before using this app in your environment

### Prerequisites

Load these software packages:

```
Adobe Acrobat DC
```
### Installing
Clone the repo to a folder under your Javascripts folder.  This folder might be read only.  You will need to fix that.  You might find the folder here:
```C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts```

If you cannot find this file, run this code in the interactive JavaScript console:
```app.getPath("app", "javascript");```

## Running the app
When you start Adobe Acrobat DC, these scripts will automatically load.  Recall a PDF form and build out all the fields you need. You can clone fields if this makes it easier for you build the form.  You will need to size only checkbox fields.  *(Do one then clone it!)*  Align all fields precisely. 

Use field properties to apply Sales OverDrive field codes.  Fields assigned a code will automatically populate with a Sample Field Value and a Tool Tip.

For fields without a Sales OverDrive field code, do nothing.  The app will help you resolve these interactively.

When you are ready, from the Adobe menu start with Help

+ Help
  - Sales OverDrive
     - Update Form Fields
     - Clear Sample Field Values

### Update Form Fields
This menu item performs many tasks.

 - It applies font size auto, Helvetica bold, removes border and fill color and sets height to all text fields.

 - Any field without a Sales OverDrive code is given a new field name based on the formID, the field type and a sequence number.

 - The fields are sorted and the tab order is set based on vertical then
   horizontal position.

 - Four fields are automatically added to the top left corner of each
   page to display text and values for **Deal Number** and **Customer
   Number**

 - Finally, for each text field without a Sales OverDrive code, a dialog
   box opens prompting you for the Tool Tip, Sample Field Value and
   Default Field Value.

 - For each check box field without a Sales OverDrive code, a dialog box
   opens prompting you to confirm or change the Tool Tip ***"Click to
   check/uncheck this box"***
   
### Clear Sample Field Values
This menu option fill remove all the Sample Field Values that display when you preview the form.  It will not remove Tool Tips.

## Make it Yours

Look in **en_us** for branding and boilerplate text.


## Authors

* **Al Dynak** - *Initial work* 

See also the list of [contributors](https://github.com/adynak/Sales-Overdrive/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/adynak/Sales-Overdrive/blob/master/LICENSE.md) file for details
