app.addSubMenu({ cName: "Sales Over&Drive", cParent: "Help", nPos: 99 })

app.addMenuItem({cName:"&JS Ref", cParent:"View", cExec:"app.openDoc('/C/Users/dynaka/Documents/Laser Tools/js_api_reference.pdf');" });
app.addMenuItem({cName:"Update &Form Fields", cParent:"Sales Over&Drive", cExec:"populateOverdriveFields();" });
app.addMenuItem({cName:"&Clear Test Values", cParent:"Sales Over&Drive", cExec:"clearFieldSampleValues();" });
app.addMenuItem({cName:"t&est", cParent:"Sales Over&Drive", cExec:"getCustomFieldPrefix();" });



// Functions

function clearFieldSampleValues(){
    var numFields = this.numFields;
    var fieldObj;

    for (var i = 0; i < numFields; i++) {
        fieldObj = this.getField(this.getNthFieldName(i));
        fieldObj.value = '';
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
    var numFields, textFieldIndex;

    var jsonFilename   = "/C/Users/dynaka/Documents/Lasert~1/availableFields.json";
    var jsonStream     = util.readFileIntoStream(jsonFilename);
    var jsonString     = util.stringFromStream(jsonStream);
    var overDriveCodes = eval(jsonString);

    var customFieldPrefix = getCustomFieldPrefix();
    textFieldIndex = 0;

    if (customFieldPrefix === false){
        return;
    }

    insertDealAndCustomerFields();

    numFields = this.numFields;

    
    for (var i = 0; i < numFields; i++) {

console.println("index = " + i + "numfield = " + this.numFields);

        fieldName = this.getNthFieldName(i);
        fieldObj = this.getField(this.getNthFieldName(i));
        overDriveCode = getOverDriveCodes(fieldObj, overDriveCodes);

        if (overDriveCode.tooltip === null) {

            switch(fieldObj.type){
                case "text":
                    textFieldIndex += 1;
                    textFieldIndex = buildCustomTextField(fieldName, fieldObj, customFieldPrefix, textFieldIndex);
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

function buildCustomTextField(fieldName, fieldObj, customFieldPrefix, textFieldIndex){
    // open a dialog to get values
    // you cannot rename a field so
    // build a new one from the ashes of the existing field
    // delete the existing field
    // note that the dialog has OK - DELETE buttons
    // return textFieldIndex, which is deincremented by on on cancel
    
    var dialog = getCustomFieldDialog();
    dialog.fieldName    = fieldName;
    dialog.tooltip      = fieldObj.userName;
    dialog.displayValue = fieldObj.value;
    dialog.defaultValue = fieldObj.defaultValue;
    if ("ok" == app.execDialog(dialog)) {

        var fieldRectangle = this.getField(fieldName).rect; 
        var newFieldName   = customFieldPrefix + '_text_' + textFieldIndex;

        var newCustomField = this.addField(newFieldName, "text", 0, fieldRectangle);

        if (dialog.displayValue == '') {
            newCustomField.value = "Needs Attention";
        } else {
            newCustomField.value = dialog.displayValue;
        }

        if (dialog.tooltip == '') {
            newCustomField.userName = "Needs Attention";
        } else {
            newCustomField.userName = dialog.tooltip;
        }

        if (dialog.defaultValue != '') {
            newCustomField.defaultValue = dialog.defaultValue;
        }

        newCustomField.rotation = 0; 
        newCustomField.textSize=0;
        newCustomField.readonly = false;
        newCustomField.textFont = "Helvetica-Bold";

    } else {
        textFieldIndex -= 1;
    }

    this.removeField(fieldName);
    return textFieldIndex;
}
