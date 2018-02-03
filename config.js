app.addSubMenu({ cName: "Sales Over&Drive", cParent: "Help", nPos: 99 })

app.addMenuItem({cName:"&JS Ref", cParent:"View", cExec:"app.openDoc('/C/Users/dynaka/Documents/Laser Tools/js_api_reference.pdf');" });
app.addMenuItem({cName:"Update &Form Fields", cParent:"Sales Over&Drive", cExec:"populateOverdriveFields();" });
app.addMenuItem({cName:"&Clear Test Values", cParent:"Sales Over&Drive", cExec:"clearFieldSampleValues();" });
app.addMenuItem({cName:"t&est", cParent:"Sales Over&Drive", cExec:"renumberCustomFields();" });



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

function buildCheckboxField(config){
    config.style       = style.cr;
    config.textSize    = 0;
    config.userName    = 'Click to check/uncheck this box';
    config.fillColor   = ["G,1"];
    config.borderColor = ["G,0"];
    config.strokeColor = ["G,0"];
    config.borderStyle = "solid";
    return config;
}

function insertDealAndCustomerFields(){

    for ( var i=0; i < this.numPages; i++) {
        
        var dealNoLbl = [0 , 792, 60 , 777];
        var dealNo    = [62, 792, 160, 777];

        var custNoLbl = [0 , 775, 60 , 760];
        var custNo    = [62, 775, 160, 760];

        var w = this.addField("custnolbl","text",i,custNoLbl);
        w.rotation = 0; 
        w.textSize=0;
        w.readonly = false;
        w.textFont = "Helvetica-Bold";

        var x = this.addField("custno","text",i,custNo);
        x.rotation = 0; 
        x.textSize=0;
        x.readonly = false;
        x.textFont = "Helvetica-Bold";

        var y = this.addField("dealnolbl","text",i,dealNoLbl);
        y.rotation = 0; 
        y.textSize=0;
        y.readonly = false;
        y.textFont = "Helvetica-Bold";

        var z = this.addField("dealno","text",i,dealNo);
        z.rotation = 0; 
        z.textSize=0;
        z.readonly = false;
        z.textFont = "Helvetica-Bold";
    }

}

function populateOverdriveFields() {

    var fieldName, fieldObj = {};
    var numFields;
    var fieldNameArray;

    var jsonFilename   = "/C/Users/dynaka/Documents/Lasert~1/availableFields.json";
    var jsonStream     = util.readFileIntoStream(jsonFilename);
    var jsonString     = util.stringFromStream(jsonStream);
    var overDriveCodes = eval(jsonString);

    var customFieldPrefix = getCustomFieldPrefix();

    if (customFieldPrefix === false){
        return;
    }

    // insertDealAndCustomerFields();

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

        userFieldConfig.fieldName = fieldName;
        userFieldConfig.fieldObj = fieldObj;
        userFieldConfig.customField = false;        
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

    for (var i = 0; i < numFields; i++) {

        // fieldName = this.getNthFieldName(i);
        fieldName = userFields[i].fieldName;
        // fieldObj = this.getField(this.getNthFieldName(i));
        fieldObj = userFields[i].fieldObj;
        overDriveCode = getOverDriveCodes(fieldObj, overDriveCodes);

        if (overDriveCode.tooltip === null) {

            switch(fieldObj.type){
                case "text":
                    buildCustomTextField(fieldName, fieldObj, customFieldPrefix, customTextFieldSuffixes);
                    break;
                case "checkbox":
                    fieldObj = buildCheckboxField(fieldObj);
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

}

function buildCustomTextField(fieldName, fieldObj, customFieldPrefix, customTextFieldSuffixes){
    // open a dialog to get values
    // you cannot rename a field so
    // build a new one from the ashes of the existing field
    // delete the existing field
    // note that the dialog has OK - DELETE buttons
    // return customFieldSuffix, which is deincremented by on on cancel
    
    var fieldRectangle, isCustom, newFieldName, customField;
    var formField, customFieldSuffix;

    var dialog = getCustomFieldDialog();
    dialog.fieldName    = fieldName;
    dialog.tooltip      = fieldObj.userName;
    dialog.displayValue = fieldObj.value;
    dialog.defaultValue = fieldObj.defaultValue;

    customFieldSuffix = getCustomFieldSuffix(customTextFieldSuffixes);
    if ("ok" == app.execDialog(dialog)) {

        formField      = this.getField(fieldName);
        fieldRectangle = formField.rect; 

        isCustom       = formField.customField;

        if (isCustom){
            customField = formField;
        } else {
            newFieldName = customFieldPrefix + '_customText_' + customFieldSuffix;
            customField  = this.addField(newFieldName, "text", 0, fieldRectangle);
            customField.customField = true;
            customField.customFieldNumber = customFieldSuffix;
            customTextFieldSuffixes.push(customFieldSuffix);
        }

        if (dialog.displayValue == '') {
            customField.value = "Needs Attention";
        } else {
            customField.value = dialog.displayValue;
        }

        if (dialog.tooltip == '') {
            customField.userName = "Needs Attention";
        } else {
            customField.userName = dialog.tooltip;
        }

        if (dialog.defaultValue != '') {
            customField.defaultValue = dialog.defaultValue;
        }

        customField.rotation = 0; 
        customField.textSize = 0;
        customField.readonly = false;
        customField.textFont = "Helvetica-Bold";

    } else {
        if (typeof(fieldObj.customFieldNumber) != 'undefined'){
            var needle = fieldObj.customFieldNumber;
            var index  = customTextFieldSuffixes.indexOf(needle);
            if (index > -1) {
                customTextFieldSuffixes.splice(index, 1);
            }
        }

        this.removeField(fieldName);
    }

    if (isCustom){

    } else {
        this.removeField(fieldName);
    }
}
