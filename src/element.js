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
        self_.name_ = configuration.name;
        self_.type_ = configuration.type;
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
        for(var childId = 0; childId < configuration.view.childs.length; childId++){
            var childElement = document.createElement(configuration.view.childs[childId].type);
            self_.view_.appendChild(sosimplist.mergeObjectProperties(childElement, configuration.view.childs[childId].properties));
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
 */
sosimplist.Element.prototype.getName = function() {
    var self_ = this;
    return self_.name_;
}

/**
 * @public
 */
sosimplist.Element.prototype.getType = function() {
    var self_ = this;
    return self_.type_;
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
        var data = {
            name: self_.name_,
            content: {}
        };
        for(var i = 0; i < self_.model_.length; i++){
            data.content[self_.model_[i]] = self_.view_[self_.model_[i]];
        }
        return data;
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
        self_.name_ = obj.name;
        if(self_.view_.children.length > 0){
            for(var i = 0; i < obj.values.length; i++){
                var cloneNode = self_.view_.children[0].cloneNode(true);
                cloneNode.value = obj.values[i];
                cloneNode.text = obj.values[i];
                self_.view_.appendChild(cloneNode);
            }
        }
        
        for(var i = 0; i < self_.model_.length; i++){
            self_.view_[self_.model_[i]] = obj.content;
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};