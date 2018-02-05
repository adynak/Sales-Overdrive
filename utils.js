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
    var isCustom;
    var fieldConfigs = [];
    var fieldConfig = {};
    var horizontal, vertical, index, fieldRectangle, x;
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
            fieldConfig.rect         = fieldObj.rect;
            fieldConfigs.push(fieldConfig);
            fieldConfig = {};
        }
    }
    fieldConfigs.sort(dynamicSortMultiple("vertical", "horizontal"));
    this.setPageTabOrder(0, "rows");

    for (x = 0; x < fieldConfigs.length; x++) {
        oldFieldName = fieldConfigs[x].name;
        this.removeField(oldFieldName);
    }


    for (x = 0; x < fieldConfigs.length; x++) {
        customFieldSuffix = x + 1;
        newFieldName = fieldPrefix + customType + customFieldSuffix;

        fieldRectangle        = fieldConfigs[x].rect;
        newField              = this.addField(newFieldName, "text", 0, fieldRectangle);
        newField.userName     = fieldConfigs[x].userName;
        newField.value        = fieldConfigs[x].value;
        newField.defaultValue = fieldConfigs[x].defaultValue;
        newField.customField  = true;
        newField.rotation     = 0; 
        newField.textSize     = 0;
        newField.readonly     = false;
        newField.textFont     = "Helvetica-Bold";
    }

}