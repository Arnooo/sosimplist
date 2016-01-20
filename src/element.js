/**
 * Element object
 * This is a generic element, including its view, its model and its controller
 */

/**
 * @public
 * @constructor
 * @param {object} parent element
 * @param {object} configuration is used to create the element
 */
sosimplist.Element = function(parent, configuration) {
    try{
        var self_ = this;
        self_.parent_ = parent;
        var view = document.createElement(configuration.view.type);
        self_.view_ = sosimplist.mergeObjectProperties(view, configuration.view.properties);
        for(var attribute in configuration.view.attributes){
            self_.view_.setAttribute(attribute, configuration.view.attributes[attribute]);
        }
        for(var i = 0; i < configuration.controller.length; i++){
            var objToDispatch = {
                name: configuration.controller[i].dispatch, 
                value: self_.view_[configuration.controller[i].dispatch],
                target: self_
            };
            var valueName = configuration.controller[i].dispatch;
            self_.view_.addEventListener(configuration.controller[i].onEvent, function(event){
                var val = self_.view_[objToDispatch.name];
                objToDispatch.value = val;
                self_.parent_.dispatch(objToDispatch);
            }, 
            false);
        }
        self_.model_ = configuration.model;
    }
    catch(e){
        console.error(e.name + ': ' + e.message);
    }
}

/**
 * @public
 */
sosimplist.Element.prototype.getView = function() {
    var self_ = this;
    return self_.view_;
}

/**
 * @public
 * @param {string} property of this object
 * @return {bool} return element property
 */
sosimplist.Element.prototype.property = function(property) {
    var self_ = this;
    var returnProperty = null;
    if(self_.view_[property]){
        returnProperty = self_.view_[property];
    }
    return returnProperty;
};

/**
 * @public
 * @return {object} return serialized object
 */
sosimplist.Element.prototype.serialize = function() {
    try {
        var self_ = this;
        var content = {
        };
        for(var i = 0; i < self_.model_.length; i++){
            content[self_.model_[i]] = self_.view_[self_.model_[i]];
        }
        return content;
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.Element.prototype.unserialize = function(obj) {
    try {
        var self_ = this;
        for(var attr in obj){
            self_.view_[attr] = obj[attr];
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};