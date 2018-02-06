app.addSubMenu({ cName: "Sales Over&Drive", cParent: "Help", nPos: 99 })

app.addMenuItem({cName:"&JS Ref", cParent:"View", cExec:"app.openDoc('/C/Users/dynaka/Documents/Laser Tools/js_api_reference.pdf');" });
app.addMenuItem({cName:"Update &Form Fields", cParent:"Sales Over&Drive", cExec:"populateOverdriveFields();" });
app.addMenuItem({cName:"&Clear Test Values", cParent:"Sales Over&Drive", cExec:"clearFieldSampleValues();" });
app.addMenuItem({cName:"t&est", cParent:"Sales Over&Drive", cExec:"objectViewer();" });


function objectViewer(){
    var f = this.getField('Check Box1');
    console.println('style = ' + f.style);
    var cbStatus = (f.isBoxChecked(0)) ? " checked" : " not checked";
        console.println('isBoxChecked0 = ' + cbStatus);

        var cbStatus = (f.isBoxChecked(1)) ? " checked" : " not checked";
        console.println('isBoxChecked1 = ' + cbStatus);

        var cbStatus = (f.isBoxChecked(3)) ? " checked" : " not checked";
        console.println('isBoxChecked3 = ' + cbStatus);

    console.println(f.rect[0]);
    console.println(f.rect[1]);console.println(f.rect[2]);console.println(f.rect[3]);
    console.println('fillColor = ' + f.fillColor);
    console.println('strokeColor = ' + f.strokeColor);
        console.println('type = ' + f.type);


var cbdStatus = (f.isDefaultChecked(0)) ? "default Checked" : "default Unchecked";
    console.println('isDefaultChecked = ' + cbdStatus);


    cbRect = [141.41099548339844,561.6220092773438,159.41099548339844,543.6220092773438];
        var x = this.addField("12345_checkbox_1","checkbox",0,cbRect);
        x.style = f.style;
        x.userName = f.userName;
        x.value = f.value;
        x.strokeColor = color.transparent;
        x.fillColor = color.transparent;

        if (f.isDefaultChecked(0)){
            x.checkThisBox(0,true);
            x.defaultIsChecked(0,true);
        }




}


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

    var dialog          = getCustomCheckboxDialog();
    dialog.fieldName    = fieldObj.name;
    dialog.tooltip      = fieldObj.userName;
    if ("ok" == app.execDialog(dialog)) {
        console.println('check');
        fieldObj.customField = true;

        fieldObj.style = 'cross';
        fieldObj.strokeColor = color.transparent;
        fieldObj.fillColor = color.transparent;

        if (dialog.tooltip == '') {
            fieldObj.userName = "Needs Attention";
        } else {
            fieldObj.userName = dialog.tooltip;
        }
console.println(dialog.checked);
        if (dialog.checked == true){
            fieldObj.checkThisBox(0,true);
            fieldObj.defaultIsChecked(0,true);
        }
    }

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
                    buildCustomTextField(fieldObj);
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

    renumberCustomFields('text',customFieldPrefix);

}

function buildCustomTextField(fieldObj){   
    var dialog          = getCustomFieldDialog();
    dialog.fieldName    = fieldObj.name;
    dialog.tooltip      = fieldObj.userName;
    dialog.displayValue = fieldObj.value;
    dialog.defaultValue = fieldObj.defaultValue;

    if ("ok" == app.execDialog(dialog)) {

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


    } else {
        this.removeField(fieldObj.name);
    }

}
