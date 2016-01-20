///
//Utils function to do stuff

/**
 * @public
 * @param {string} className to convert into function which can be instantiate
 */
sosimplist.stringToFunction = function(className) {
  var arr = className.split(".");

  var fn = (window || this);
  for (var i = 0, len = arr.length; i < len; i++) {
    fn = fn[arr[i]];
  }

  if (typeof fn !== "function") {
    throw new Error("function not found");
  }

  return  fn;
};

/**
 * @public
 * @param {object} oldOptions to update 
 * @param {object} newOptions to use as input to update oldOptions
 * @return {object} updated options
 */
sosimplist.updateOptions = function(oldOptions, newOptions){
    var updatedOptions = oldOptions;
    if (newOptions) {
        for (var opt in newOptions) {
            if (updatedOptions[opt] !== undefined) {
                if(!(updatedOptions[opt] instanceof Array) && (updatedOptions[opt] instanceof Object)){
                    updatedOptions[opt] = sosimplist.updateOptions(updatedOptions[opt], newOptions[opt]);
                }
                else{
                    updatedOptions[opt] = newOptions[opt];
                }
            }
            else {
                throw new Error('Option = ' + opt + ' in newOptions['+opt+'] = ' + newOptions[opt] + ', does not exist in this version!');
            }
        }
    }
    return updatedOptions;
}

/**
 * @public
 * @param {object} oldObject to update
 * @param {object} newObject to use as input to update oldObject
 * @return {object} updated object
 */
sosimplist.mergeObjectProperties = function(oldObject, newObject){
    var updatedObject = oldObject;
    if (newObject) {
        for (var opt in newObject) {
            if(!(updatedObject[opt] instanceof Array) && (updatedObject[opt] instanceof Object)){
                updatedObject[opt] = sosimplist.mergeObjectProperties(updatedObject[opt], newObject[opt]);
            }
            else{
                updatedObject[opt] = newObject[opt];
            }
        }
    }
    return updatedObject;
}

