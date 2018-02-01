app.addSubMenu({ cName: "Sales Over&Drive", cParent: "Help", nPos: 99 })

app.addMenuItem({cName:"&JS Ref", cParent:"View", cExec:"app.openDoc('/C/Users/dynaka/Documents/Laser Tools/js_api_reference.pdf');" });
app.addMenuItem({cName:"Update &Form Fields", cParent:"Sales Over&Drive", cExec:"populateOverdriveFields();" });
app.addMenuItem({cName:"&Clear Test Values", cParent:"Sales Over&Drive", cExec:"clearFieldSampleValues();" });
app.addMenuItem({cName:"t&est", cParent:"Sales Over&Drive", cExec:"getCustomFieldPrefix();" });



// Functions
function printObject(o) {
    var out = '';
    for (var p in o) {
        out += p + "\n";
    //     // out += p + ': ' + o[p] + '\n';
    }
    // console.println('fgcolor ' + o.fgColor);
    // console.println('bgColor ' + o.bgColor);
    // console.println('fillColor ' + o.fillColor);
    // console.println('borderColor ' + o.borderColor);
    // console.println('strokeColor ' + o.strokeColor);
    // console.println('borderStyle ' + o.borderStyle);
    // console.println('borderwidth ' + o.borderwidth);
    // console.println('lineWidth ' + o.lineWidth);
    // console.println('style ' + o.style);

}


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

function populateOverdriveFields() {

    var customFieldPrefix = getCustomFieldPrefix();
    if (customFieldPrefix === false){
        return;
    }

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


    var jsonFilename = "/C/Users/dynaka/Documents/Lasert~1/availableFields.json";

    var rStream = util.readFileIntoStream(jsonFilename);
    var cFile = util.stringFromStream(rStream);
    var overDriveCodes = eval(cFile);

    var dialog1 = {
    	fieldName:"",
        initialize: function(dialog) {
            dialog.load({
                "fldn": this.fieldName
            });
        },
        commit: function(dialog) { // called when OK pressed
            var results = dialog.store();
    		
    		this.tooltip = results[ "ttip"];
    		this.displayValue = results["dval"];
            this.defaultValue = results["fval"];
          
        },
        description: {
            name: "Custom Field Editor: ",
            align_children: "align_left",
            width: 350,
            height: 200,
            elements: [{
                    type: "cluster",
                    name: "Custom Field Configuration",
                    align_children: "align_left",
                    elements: [
    					{
                            type: "static_text",
                            name: "fldn: ",
                            char_width: 25,
                            item_id: "fldn"
                        },
    					{
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                    type: "static_text",
                                    name: "Tooltip:           "
                                },
                                {
                                    item_id: "ttip",
                                    type: "edit_text",
                                    alignment: "align_fill",
                                    width: 300,
                                    height: 20
                                }
                            ]
                        },
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                    type: "static_text",
                                    name: "Display Value: "
                                },
                                {
                                    item_id: "dval",
                                    type: "edit_text",
                                    alignment: "align_fill",
                                    width: 300,
                                    height: 20
                                }
                            ]
                        },
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [{
                                    type: "static_text",
                                    name: "Default Value: "
                                },
                                {
                                    item_id: "fval",
                                    type: "edit_text",
                                    alignment: "align_fill",
                                    width: 300,
                                    height: 20
                                }
                            ]
                        },
                        {
                            alignment: "align_right",
                            type: "ok_cancel",
                            ok_name: "Ok",
                            cancel_name: "Cancel"
                        }
                    ]
                }
            ]
        }
    };    
    
    function getOverDrive(needle, haystack){
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
    
    var fieldName, fieldObj = {}, msg;
    var numFields = this.numFields;

 for (var i = 0; i < numFields; i++) {

     fieldName = this.getNthFieldName(i);
     fieldObj = this.getField(this.getNthFieldName(i));
     overDriveCode = getOverDrive(fieldObj, overDriveCodes);

     if (overDriveCode.tooltip === null) {

         if (fieldObj == 'text') {
             dialog1.fieldName = fieldName;
             if ("ok" == app.execDialog(dialog1)) {

                 if (dialog1.displayValue == '') {
                     fieldObj.value = "Needs Attention";
                 } else {
                     fieldObj.value = dialog1.displayValue;
                 }
                 if (dialog1.tooltip == '') {
                     fieldObj.userName = "Needs Attention";
                 } else {
                     fieldObj.userName = dialog1.tooltip;
                 }
                 if (dialog1.defaultValue != '') {
                     fieldObj.devaultValue = dialog1.defaultValue;
                 }

             } else {
                 fieldObj.value = "Needs Attention";
                 fieldObj.userName = "Needs Attention";
             }
         } else {
             fieldObj.value = overDriveCode.value;
             fieldObj.userName = overDriveCode.tooltip;
             fieldObj.defaultValue = overDriveCode.defaultValue;
         }

         if (fieldObj.type == 'checkbox') {
             fieldObj = buildCheckboxField(fieldObj);
         }
     } else {
         fieldObj.value = overDriveCode.value;
         fieldObj.userName = overDriveCode.tooltip;
         fieldObj.defaultValue = overDriveCode.defaultValue;
     }
 }

    // app.alert({
    //     cMsg: "Now wasn't that easy?" + " " + numFields + " fields updated.",
    //     cTitle: "Overdrive Tools",
    //     nIcon: 2,
    //     nType: 2
    // });

}
