app.addSubMenu({ cName: "Sales Over&Drive", cParent: "Help", nPos: 99 })

app.addMenuItem({cName:"&JS Ref", cParent:"View", cExec:"app.openDoc('/C/Users/dynaka/Documents/Laser Tools/js_api_reference.pdf');" });
app.addMenuItem({cName:"Update &Form Fields", cParent:"Sales Over&Drive", cExec:"populateOverdriveFields();" });
app.addMenuItem({cName:"&Clear Test Values", cParent:"Sales Over&Drive", cExec:"clearFieldSampleValues();" });

// Functions

function clearFieldSampleValues(){
    var numFields = this.numFields;
    var fieldObj;

    for (var i = 0; i < numFields; i++) {
        fieldObj = this.getField(this.getNthFieldName(i));
        if (fieldObj.defaultValue == ''){
            fieldObj.value = '';
        }
    }

}

function buildCheckboxField(fieldObj){
    var dialogReturnValue;
    var dialog         = getCustomCheckboxDialog();
    dialog.fieldName   = fieldObj.name;
    dialog.tooltip     = fieldObj.userName;
    dialog.isChecked   = (fieldObj.isDefaultChecked(0)) ? true : false;

    dialogReturnValue = app.execDialog(dialog);
    if ("ok" == dialogReturnValue) {
        fieldObj.customField = true;

        fieldObj.style       = 'cross';
        fieldObj.strokeColor = color.transparent;
        fieldObj.fillColor   = color.transparent;

        if (dialog.tooltip == '') {
            fieldObj.userName = "Needs Attention";
        } else {
            fieldObj.userName = dialog.tooltip;
        }

        if (dialog.isChecked == true){
            fieldObj.checkThisBox(0,true);
            fieldObj.defaultIsChecked(0,true);
        }
    }

    if ('dele' == dialogReturnValue){
        this.removeField(fieldObj.name);
    }

}

function insertDealAndCustomerFields(){
    // put these fields once on each page
    var fieldObj;
    var numPages = this.numPages;


    var dealNoLbl = [0 , 792, 60 , 777];
    var dealNo    = [62, 792, 160, 777];
    var custNoLbl = [0 , 778, 60 , 763];
    var custNo    = [62, 778, 160, 763];

    fieldObj = this.getField("custnolbl");
    if (fieldObj === null){
        for ( var i=0; i < numPages; i++) {
            var w = this.addField("custnolbl","text",i,custNoLbl);
            w.rotation = 0; 
            w.textSize=0;
            w.readonly = true;
            w.textFont = "Helvetica-Bold";
        }
    }

    fieldObj = this.getField("custno");
    if (fieldObj === null){
        for ( var i=0; i < numPages; i++) {
            var x = this.addField("custno","text",i,custNo);
            x.rotation = 0; 
            x.textSize=0;
            x.readonly = false;
            x.textFont = "Helvetica-Bold";
        }
    }

    fieldObj = this.getField("dealnolbl");
    if (fieldObj === null){
        for ( var i=0; i < numPages; i++) {
            var y = this.addField("dealnolbl","text",i,dealNoLbl);
            y.rotation = 0; 
            y.textSize=0;
            y.readonly = true;
            y.textFont = "Helvetica-Bold";
        }
    }

    fieldObj = this.getField("dealno");
    if (fieldObj === null){
        for ( var i=0; i < numPages; i++) {
            var z = this.addField("dealno","text",i,dealNo);
            z.rotation = 0; 
            z.textSize=0;
            z.readonly = false;
            z.textFont = "Helvetica-Bold";
        }
    }

}

function populateOverdriveFields() {

    var fieldName, fieldObj = {};
    var numFields;
    var fieldNameArray;
    var repeatedField;

    var jsonFilename   = "/C/Users/dynaka/Documents/Lasert~1/availableFields.json";
    var jsonStream     = util.readFileIntoStream(jsonFilename);
    var jsonString     = util.stringFromStream(jsonStream);
    var overDriveCodes = eval(jsonString);

    var customFieldPrefix = getCustomFieldPrefix();

    if (customFieldPrefix === false){
        return;
    }

    // cut and paste fields are kinda hard to see, find them, make new visible ones, and delete the originals
    findClonedCustomFields(overDriveCodes);
    insertDealAndCustomerFields();

    numFields = this.numFields;

    var userFields = [];
    var userFieldConfig = {};
    var customTextFieldSuffixes  = [];
    var customCheckFieldSuffixes = [];

// fieldnames  = "buyername" or "123456_customText_1" etc    
    for (var x = 0; x < numFields; x++) {
        fieldObj = this.getField(this.getNthFieldName(x));
        fieldName = fieldObj.name;
        fieldNameArray = fieldName.split("_");

        if (fieldObj.type == 'text'){
            if (typeof fieldObj.page == "number") {
                fieldRectangle    = fieldObj.rect;            
                fieldRectangle[1] = fieldRectangle[3] + 15;
                fieldObj.rect     = fieldRectangle;
                fieldObj.textSize = 0;
                fieldObj.textFont = "Helvetica-Bold";
            } else {
                for (var j = 0; j < fieldObj.page.length; j++) {
                    repeatedField          = this.getField(this.getNthFieldName(x) + "." + j);
                    fieldRectangle         = repeatedField.rect;            
                    fieldRectangle[1]      = fieldRectangle[3] + 15;
                    repeatedField.rect     = fieldRectangle;
                    repeatedField.textSize = 0;
                    repeatedField.textFont = "Helvetica-Bold";
                }
            } 

        }

        userFieldConfig.fieldName = fieldName;
        userFieldConfig.fieldObj = fieldObj;
        userFieldConfig.customField = false;  
        userFieldConfig.horizontal   = fieldObj.rect[0] * (-1);
        userFieldConfig.vertical     = fieldObj.rect[1];

        if (typeof(fieldNameArray[1]) != 'undefined'){
            if (fieldNameArray[1] == 'customText'){
                userFieldConfig.customField = true;
                customTextFieldSuffixes.push(fieldNameArray[2]);
            }
            if (fieldObj.type == 'customCheckbox'){
                customCheckFieldSuffixes.push(fieldObj.customFieldNumber);
            }
        }
        userFields.push(userFieldConfig);
        userFieldConfig = {};
    }    

    numFields = userFields.length;

        userFields.sort(dynamicSortMultiple("vertical", "horizontal"));


    for (var i = 0; i < numFields; i++) {

        fieldName = userFields[i].fieldName;
        fieldObj  = userFields[i].fieldObj;
        overDriveCode = getOverDriveCodes(fieldObj, overDriveCodes);

        if (overDriveCode.tooltip === null) {

            switch(fieldObj.type){
                case "text":
                    buildCustomTextField(fieldObj);
                    break;
                case "checkbox":
                    buildCheckboxField(fieldObj);
                break;
            }

        } else {

            if (typeof(overDriveCode.value) != 'undefined'){
                if (fieldObj.value != overDriveCode.value){
                    if (fieldObj.value == ''){
                        fieldObj.value = overDriveCode.value;
                    }
                } else {
                    fieldObj.value = overDriveCode.value;                
                }
            }

            if (typeof(overDriveCode.tooltip) != 'undefined'){
                if (fieldObj.userName != overDriveCode.tooltip){
                    if (fieldObj.userName == ''){
                        fieldObj.userName = overDriveCode.tooltip;
                    }
                } else {
                    fieldObj.userName = overDriveCode.tooltip;
                }
            }

            if (typeof(overDriveCode.defaultValue) != 'undefined'){
                if (fieldObj.defaultValue != overDriveCode.defaultValue){
                    if (fieldObj.defaultValue == ''){
                        fieldObj.defaultValue = overDriveCode.defaultvalue;
                    }
                } else {
                    fieldObj.defaultValue = overDriveCode.defaultValue;
                }            
            }

        }
    }

    renumberCustomFields('text',customFieldPrefix);
    renumberCustomFields('checkbox',customFieldPrefix);

}

function buildCustomTextField(fieldObj){
    var dialogReturnValue;
    var dialog          = getCustomFieldDialog();
    dialog.fieldName    = fieldObj.name;
    dialog.tooltip      = fieldObj.userName;
    dialog.displayValue = fieldObj.value;
    dialog.defaultValue = fieldObj.defaultValue;

    dialogReturnValue = app.execDialog(dialog);
  

    if ("ok" == dialogReturnValue) {
        fieldObj.customField = true;

        if (dialog.displayValue == '') {
            fieldObj.value = "Needs Attention";
        } else {
            fieldObj.value = dialog.displayValue;
        }

        if (dialog.tooltip == '') {
            fieldObj.userName = "Needs Attention";
        } else {
            fieldObj.userName = dialog.tooltip;
        }

        if (dialog.defaultValue != '') {
            fieldObj.defaultValue = dialog.defaultValue;
            fieldObj.value = dialog.defaultValue;
        }

        fieldObj.rotation = 0; 
        fieldObj.textSize = 0;
        fieldObj.readonly = false;
        fieldObj.textFont = "Helvetica-Bold";
    }

    if ('dele' == dialogReturnValue){
        this.removeField(fieldObj.name);
    }

}
