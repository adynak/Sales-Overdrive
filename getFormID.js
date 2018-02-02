var getFormIDDialog = {
    formID: "", 
    initialize: function(dialog) { 
    	var comment = dialog.store()["dcom"];
        comment = txtGetFormID.comment;
       	var customIDPrompt = dialog.store()["pcom"];
        customIDPrompt = txtGetFormID.customIDPrompt;

        dialog.load(
            {
                "fnum": this.formID,
				"dcom": comment,
				"pcom": customIDPrompt
            }
        ); 
    },
    commit: function(dialog) { 
        var results = dialog.store();
        this.formID = results[ "fnum"];
    },
    other: function(dialog) { 
    	var formID = dialog.store()["fcom"];
		formID     = getFormIDFromFileName('ThereAreNoNumbersInHere');
		var comment = dialog.store()["dcom"];
        comment = txtGetFormID.comment;
       	var customIDPrompt = dialog.store()["pcom"];
        customIDPrompt = txtGetFormID.customIDPrompt;
		dialog.load(
            {
                "fnum": formID,
				"dcom": comment,
				"pcom": customIDPrompt
            }
        ); 
	},
    description: { 
        name: "Form Number", 
        elements: [
            { 
                type: "view", 
                elements: [
                    { 
 						item_id: "dcom",
                        type: "static_text",
                        multiline: false,
                        width: 270,
                        height: 120                 
                    }, 

					{
						type: "view",
						align_children: "align_right",
						elements: [
							{
								item_id: "pcom",
								type: "static_text",
								multiline: false,
								width: 200,
								height: 20
							},
							{
								item_id: "fnum",
								type: "edit_text",
								alignment: "align_fill",
								width: 200,
								height: 20
							}
						]
					},
                    { 
						type: "ok_cancel_other",
						ok_name: "Ok",
						cancel_name: "Cancel",
						other_name: "Generate"
                    }
                ]
            }
        ] 
    }
};

function getFormIDFromFileName(filename){
    var numberPattern = /\d+/g;
    var numberPatterns = filename.match( numberPattern );
    if (numberPatterns === null){
        return randomInterval(100000,999999);
    } else {
        return numberPatterns[0];
    }
}

function getCustomFieldPrefix(){

    var formName = this.documentFileName;
    var formID   = getFormIDFromFileName(formName);

	getFormIDDialog.formID = formID; 
    if( "ok" == app.execDialog(getFormIDDialog)) { 
		return getFormIDDialog.formID;
    } else {
    	return false;
    }
}
