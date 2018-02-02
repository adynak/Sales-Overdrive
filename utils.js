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