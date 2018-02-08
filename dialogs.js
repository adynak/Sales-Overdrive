function getCustomFieldDialog(){
	    var dialog = {
    	fieldName:"",
    	tooltip:"",
    	displayValue:"",
    	defaultValue:"",
        initialize: function(dialog) {
            dialog.load({
                "fldn": this.fieldName,
                "ttip": this.tooltip,
                "dval": this.displayValue,
                "fval": this.defaultValue
            });
        },
        commit: function(dialog) { 
            var results = dialog.store();
    		this.tooltip      = results[ "ttip"];
    		this.displayValue = results["dval"];
            this.defaultValue = results["fval"];
        },
        okay: function(dialog) {
            dialog.end("okay"); 
        },
        dele: function(dialog){
            dialog.end("dele"); 
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
                            type: "view",
                            align_children: "align_row",
                            elements:
                            [
                                {
                                    type: "button",
                                    item_id: "okay",
                                    name: "OK"
                                },
                                {
                                    type: "button",
                                    item_id: "dele",
                                    name: "Remove Field"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };    

    return dialog;
}

function getCustomCheckboxDialog(){
        var dialog = {
        fieldName:"",
        tooltip:"",
        isChecked:"",
        initialize: function(dialog) {
            var tooltip = dialog.store()["ttip"];
            tooltip = txtDialogPrompts.checkBoxTooltip;
            if (this.tooltip != '') {
                tooltip - this.tooltip;
            }
            dialog.load({
                "fldn": this.fieldName,
                "ttip": tooltip,
                "dval": this.isChecked
            });
        },
        commit: function(dialog) { 
            var results = dialog.store();
            this.tooltip = results["ttip"];
            this.isChecked = results["dval"];
        },
        description: {
            name: "Custom Check Box Editor: ",
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
                                    name: "Tooltip:"
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
                            elements: [
                                {
                                    item_id: "dval",
                                    type: "check_box",
                                    name: '     Checkbox is checked by default'
                                }                                
                            ]
                        },
                        {
                            alignment: "align_right",
                            type: "ok_cancel",
                            ok_name: "Ok",
                            cancel_name: "Delete"
                        }
                    ]
                }
            ]
        }
    };    

    return dialog;
}