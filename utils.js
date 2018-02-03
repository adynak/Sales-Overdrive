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
    console.println(obj.name);
    app.alert({
        cMsg: obj.name,
        cTitle: "Acme Testing Service"
    });

    var output = [];
    for (var property in obj) {
        // output += property + ': ' + obj[property];
        output.push(property);
        output.sort();
        // output += property + ", ";
    }
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


function renumberCustomFields(){
    var fieldConfigs = [];
    var fieldConfig = {};
    var horizontal, vertical;
    var numFields = this.numFields;
    for (var x = 0; x < numFields; x++) {
        fieldObj = this.getField(this.getNthFieldName(x));
        fieldConfig.fieldName  = fieldObj.name;
        fieldConfig.horizontal = fieldObj.rect[0] * (-1);
        fieldConfig.vertical   = fieldObj.rect[1];
        fieldConfigs.push(fieldConfig);
        // console.println(fieldObj.name);
        // console.println('0 = ' + fieldObj.rect[0]);
        // console.println('1 = ' + fieldObj.rect[1]);
        // console.println('2 = ' + fieldObj.rect[2]);
        // console.println('3 = ' + fieldObj.rect[3]);
        // console.println('*****');

        fieldConfig = {};
    }

    fieldConfigs.sort(dynamicSortMultiple("vertical", "horizontal"));

    // for (var x = 0; x < fieldConfigs.length; x++) {
    //     console.println(fieldConfigs[x].fieldName);
    // }

    this.setPageTabOrder(0, "rows");


}