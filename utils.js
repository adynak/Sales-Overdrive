var con = {
    log : function(debugItem){
        console.println(debugItem);
    }
}
function randomInterval(min,max)
{
	var someNumber;
    someNumber = Math.floor(Math.random()*(max-min+1)+min);
    return someNumber.toString();
}

function getOverDriveCodes(needle, haystack){
    for (var i = 0 ; i < haystack.length; i++) {
        if (haystack[i].name === needle.name){
            if ((typeof(haystack.defaultValue) === 'undefined')){
                haystack.defaultValue = null;
            }
            return haystack[i];
        }
    }   
    return { name: needle,
             tooltip: null,
             value: null, 
             defaultValue: null
    };
}

function getCustomFieldSuffix(suffixArray){
    suffixArray.sort();
    var suffixArray=suffixArray.map(Number);
    for(var i = 1; i < suffixArray.length; i++) {
        if(suffixArray[i] - suffixArray[i-1] != 1) {
            return suffixArray[i-1] + 1;
        }
    }
    if (suffixArray[0] !=1){
        return 1;
    } else {
        return suffixArray[i-1] + 1;
    }
}

function printObject(obj){
    var output = [];
    for (var property in obj) {

        // output += property + ': ' + obj[property];
        output.push(property);
    }

    output.sort();

    app.alert({
        cMsg: output,
        cTitle: "Acme Testing Service"
    });

}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function renumberCustomFields(fieldType,fieldPrefix){
    var customType;
    var isCustom, isChecked, isDefault;
    var fieldConfigs = [];
    var fieldConfig = {};
    var horizontal, vertical, index, fieldRectangle, x, page;
    var oldFieldName, newFieldName;

    var numFields = this.numFields;
    if (fieldType == 'text'){
        customType = "_customText_";
    } 
    if (fieldType == 'checkbox'){
        customType = "_customCheckbox_";
    } 

    for (x = 0; x < numFields; x++) {
        fieldObj = this.getField(this.getNthFieldName(x));
        isCustom = fieldObj.customField;
        if (isCustom && fieldObj.type == fieldType ){
            fieldConfig.name         = fieldObj.name;
            fieldConfig.value        = fieldObj.value;
            fieldConfig.defaultValue = fieldObj.defaultValue;            
            fieldConfig.userName     = fieldObj.userName;            
            fieldConfig.horizontal   = fieldObj.rect[0] * (-1);
            fieldConfig.vertical     = fieldObj.rect[1];
            fieldConfig.page         = fieldObj.page;
            fieldConfig.rect         = fieldObj.rect;
            fieldConfig.comb         = fieldObj.comb;
            fieldConfig.charLimit    = fieldObj.charLimit;

            if (fieldType == 'checkbox'){
                fieldConfig.style        = fieldObj.style;
                fieldConfig.fillColor    = fieldObj.fillColor;
                fieldConfig.strokeColor  = fieldObj.strokeColor;

                fieldConfig.isChecked = (fieldObj.isBoxChecked(0))     ? true: false;
                fieldConfig.isDefault = (fieldObj.isDefaultChecked(0)) ? true: false;
            }
 
            fieldConfigs.push(fieldConfig);
            fieldConfig = {};
        }
    }
    
    fieldConfigs.sort(dynamicSortMultiple("vertical", "horizontal"));

    for (var ix = 0; ix < this.numPages; ix++)
        this.setPageTabOrder(ix, "rows");

    for (var fx = 0; fx < fieldConfigs.length; fx++) {
        oldFieldName = fieldConfigs[fx].name;
        this.removeField(oldFieldName);
    }

    for (x = 0; x < fieldConfigs.length; x++) {
        customFieldSuffix = x + 1;
        newFieldName = fieldPrefix + customType + customFieldSuffix;

        page = fieldConfigs[x].page;
         if (typeof fieldConfigs[x].page == "number") {
            fieldRectangle    = fieldConfigs[x].rect;
            if (fieldType == 'text'){
                fieldRectangle[1] = fieldRectangle[3] + 15;
            }
            newField              = this.addField(newFieldName, fieldType, page, fieldRectangle);
            newField.userName     = fieldConfigs[x].userName;
            newField.value        = fieldConfigs[x].value;
            newField.page         = fieldConfigs[x].page;
            if (fieldType == 'text'){
                newField.defaultValue = fieldConfigs[x].defaultValue;
                newField.customField  = true;
                newField.rotation     = 0; 
                newField.textSize     = 0;
                newField.readonly     = false;
                newField.textFont     = "Helvetica-Bold";
                newField.comb         = fieldConfigs[x].comb;
                newField.charLimit    = fieldConfigs[x].charLimit;
            } 
            if (fieldType == 'checkbox'){
                newField.style       = fieldConfigs[x].style;
                newField.fillcolor   = fieldConfigs[x].fillColor;
                newField.strokeColor = fieldConfigs[x].strokeColor;
                newField.checkThisBox(0,fieldConfigs[x].isChecked);
                newField.defaultIsChecked(0,fieldConfigs[x].isDefault);
            }
         } else {
            for (var j = 0; j < fieldConfigs[x].page.length; j++) {
                con.log(fieldConfigs[x].name)
            }
         }
    }

}

function findClonedCustomFields(overDriveCodes){
    var fieldPrefix, fieldSuffix, newFieldName, fieldType, fieldRectangle, page;
    // fields with the same name show up only once in numFields
    numFields = this.numFields;
    for (var x = 0; x < numFields; x++) {
        fieldObj = this.getField(this.getNthFieldName(x));

        overDriveCode = getOverDriveCodes(fieldObj, overDriveCodes);
        // if this field name is found in the list of overDriveCoces, skip it

        if (overDriveCode.tooltip === null) {
            fieldName = fieldObj.name;
            if (typeof fieldObj.page == "number") {
                // his is not a cloned field
            } else {
                for (var j = 0; j < fieldObj.page.length; j++) {
                    repeatedField       = this.getField(this.getNthFieldName(x) + "." + j);
                    fieldSuffix         = randomInterval(100000,999999);
                    fieldType           = repeatedField.type;
                    fieldRectangle      = repeatedField.rect;
                    page                = fieldObj.page[j];
                    newFieldName        = fieldType + '_' + fieldSuffix;
                    newField            = this.addField(newFieldName, fieldType, page, fieldRectangle);
                    newField.horizontal = repeatedField.rect[0] * (-1);
                    newField.vertical   = repeatedField.rect[1];
                    newField.comb       = repeatedField.comb;
                    newField.charLimit  = repeatedField.charLimit;
                }
                this.removeField(fieldName);
            }
        }
    }
}

function getDatePart(part,dateString){
    var temp, d, datePart = "";
    d = new Date(dateString);
    if (d == "Invalid Date"){
        datePart = "";
    } else {

        if (part.toUpperCase() == "MM"){
            temp = d.getMonth() + 1;
            datePart = ("0" + temp).slice(-2);
        }

        if (part.toUpperCase() == "DD"){
            temp = d.getDate();
            datePart = ("0" + temp).slice(-2);
        }

        if (part.toUpperCase() == "YYYY"){
            datePart = d.getFullYear();
        }

        if (part.toUpperCase() == "YY"){
            datePart = d.getYear();
        }

        if (part.toUpperCase() == "FULLNAME"){
            datePart = monthNames[d.getMonth()].fullName;
        }

        if (part.toUpperCase() == "SHORTNAME"){
            datePart = monthNames[d.getMonth()].shortName;
        }

    }
    return datePart;
}
