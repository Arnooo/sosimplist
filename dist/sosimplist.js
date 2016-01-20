// Defining sosimplist namespace
var sosimplist = {};
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


 
 /**
  * Constant
  */
var E_DB_SERVICE = {
    NONE: 'none',
    URL: 'url',
    FIREBASE: 'firebase'
};

sosimplist.databaseModule = null;

/**
 * @public
 * @constructor
 * @params {object} dbParams use to connect to the database
 */
sosimplist.DefaultDatabaseModule = function(dbParams){
    var self_ = this;
    self_.dbParams_ = dbParams;
}

/**
 * @public
 * @params {string} dataName to get from database
 */
sosimplist.DefaultDatabaseModule.prototype.get = function(dataName){
    var self_ = this;
    var dataToUnserialize = null;
    if(self_.dbParams_.dbService === E_DB_SERVICE.URL){
        var hrefArray = window.location.href.split('#');
        if(hrefArray[1]){
            dataToUnserialize = atob(hrefArray[1]);
        }
        else{
            //Do nothing
        }
    }
    else if(self_.dbParams_.dbService === E_DB_SERVICE.FIREBASE){
        //Do nothing yet
    }
    //E_DB_SERVICE.None
    else{
        if(self_.dbParams_.dbData &&
           self_.dbParams_.dbData.length>0){
            dataToUnserialize = JSON.stringify(self_.dbParams_.dbData);
        }
        else{
            //Do nothing
        }
    }
    return dataToUnserialize;
}

/**
 * @private
 * @param {string} data to set
 */
sosimplist.DefaultDatabaseModule.prototype.set = function(data) {
    var self_ = this;
    if(self_.dbParams_.dbService === E_DB_SERVICE.URL){
        window.location.href = window.location.href.split('#')[0] + '#' + btoa(data);
    }
    else if(self_.dbParams_.dbService === E_DB_SERVICE.FIREBASE){
        //Do nothing yet
    }
    //E_DB_SERVICE.None
    else{
        //Do nothing 
    }
};

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
 /**
  * @public
  * @constructor
  */
 sosimplist.ElementFactory = function() {
     var self_ = this;
 }

 /**
  * @public
  * @param {string} elementType is the type of the item to be created by the factory
  * @return {element} return the element asked
  */
 sosimplist.ElementFactory.prototype.createElement = function(elementType, options) {
    var element = {};
    if(elementType === 'selector'){
        element = {
            view: {
                type: 'div',
                properties: {
                    id: 'sosimplist-item-selector'+options.time,
                    className: 'sosimplist-item-selector'
                }
            },
            model: [],
            controller: []
        };
    }
    else if(elementType === 'checkbox'){
        element = {
            view: {
                type: 'input',
                properties: {
                    id: 'sosimplist-item-checkbox'+options.time,
                    className: 'sosimplist-item-checkbox',
                    type: 'checkbox',
                    checked:true
                }
            },
            model: ['checked'], //to be serialized
            controller: [{onEvent:'change',dispatch:'checked'}]
        };
    }
    else if(elementType === 'text'){
        element = {
            view: {
                type: 'div',
                properties: {
                    id: 'sosimplist-item-text'+options.time,
                    className: 'sosimplist-item-text sosimplist-editable',
                    contentEditable: true,
                    innerHTML:''
                },
                attributes:{
                    placeholder: sosimplist.translate('write something'),
                }
            },
            model: ['innerHTML'],
            controller: []
        };
    }
    else if(elementType === 'delete'){
        element = {
            view: {
                type: 'div',
                properties: {
                    id: 'sosimplist-item-delete'+options.time,
                    className: 'sosimplist-item-delete'
                }
            },
            model: [],
            controller: [{onEvent:'click',dispatch:'delete'}]
        };
    }
    else{
        //Do nothing
    }
    return element;
}
  
 /**
  * @public
  * @param {string} elementType is the type of the item to be created by the factory
  * @return {element} return the element asked
  */
 sosimplist.ElementFactory.prototype.create = function(elementType, options) {
     if(elementType === 'selector'){
        var divSelector = document.createElement('div');
        divSelector.className = 'sosimplist-item-selector';
        return divSelector;
     }
     else if(elementType === 'checkbox'){
        var inputCheckbox = document.createElement('input');
        inputCheckbox.className = 'sosimplist-item-checkbox';
        inputCheckbox.type = 'checkbox';
        inputCheckbox.checked = options.checked;
        inputCheckbox.addEventListener('change', options.change, false);
        return inputCheckbox;
     }
     else if(elementType === 'text'){
        var inputText = document.createElement('div');
        inputText.id = options.id;
        inputText.className = options.className+' sosimplist-editable';
        //enable eddition
        if (options.edit) {
            inputText.contentEditable = true;
        }
        else {
            inputText.className += ' sosimplist-edit-false';
        }
        inputText.setAttribute('placeholder', options.placeholder);
        inputText.addEventListener('keyup', options.keyup, false);
        inputText.addEventListener(
          'keydown',
          sosimplist.EventStrategy.key.enter.stop,
          false
        );
        inputText.addEventListener(
          'keypress',
          sosimplist.EventStrategy.key.enter.stop,
          false
        );
        inputText.innerHTML = options.text;
        return inputText;
     }
     else if(elementType === 'delete'){
        var divDelete = document.createElement('div');
        divDelete.className = 'sosimplist-item-delete';
        divDelete.addEventListener('click',options.click,false);
        return divDelete;
     }
     else if(elementType === 'image'){
        var imgElement = document.createElement('img');
        imgElement.className = 'sosimplist-list-image';
        imgElement.style.display = 'table-cell';
        imgElement.src = options.src;
        if(options.position === 'top' ||
           options.position === 'bottom'){
            var divImg = document.createElement('div');
            divImg.style.display = 'table-row';
            divImg.className = 'sosimplist-list-row';
            divImg.appendChild(imgElement);
            return divImg;
        }
        else {
          imgElement.style.height = '100%';
          return imgElement;
        }
        
     }
     else if(elementType === 'button'){
        var buttonElement = document.createElement('input');
        buttonElement.type = 'button';
        buttonElement.className = 'sosimplist-button';
        buttonElement.id = options.id;
        buttonElement.value = options.value;
        buttonElement.addEventListener('click', options.click, false);
        return buttonElement;
     }
     else{
         console.error('Element type = ' + elementType + ' not supported yet !');
    }
 }

 /**
 * @private
 * @return {Object}
 */
function ElementFactory_create() {
    return new sosimplist.ElementFactory();
}

sosimplist.elementfactory = ElementFactory_create();
/**
 * Event strategy object
 * This object synthetise events function do execute
 */
 sosimplist.EventStrategy = {
    key:{
        enter:{
            stop:function(event, done){
                if(event.keyCode === 13){
                    event.preventDefault();
                    event.stopPropagation();
                    if(done){done()};
                }
                else{
                    //Do nothing
                }
            }
        },
        not:{
            enter:{
                do:function(event, done){
                    if(event.keyCode !== 13 && done){
                        done();
                    }
                    else{
                        //Do nothing
                    }
                }
            }
        }
    },
    dragstart:function(event, opt) {
        var dragData = null;
        if (event.target.classList.contains(opt.source)) {
            var parentToDrag = event.target.closest(opt.closest);
            parentToDrag.style.zIndex = 1;
            parentToDrag.style.boxShadow = '3px 3px 3px grey';
            dragData = {
                elementId: parentToDrag.id,
                source: opt.source
            };

            var mask = document.createElement('div');
            mask.id = 'mask';
            mask.style.backgroundColor = 'red'; //To check if opacity is working
            mask.style.opacity = 0; // Should be not visible with opacity = 0
            mask.style.width = parentToDrag.clientWidth;
            mask.style.height = parentToDrag.clientHeight;
            mask.style.cursor = 'move';
            document.body.appendChild(mask);
            event.dataTransfer.setDragImage(mask, 0, 0);
        }
        else {
            //Do nothing
        }
        return dragData;
    },
    dragenter:function(event, dragData, opt) {
        event.preventDefault();
        if (dragData && dragData.source === opt.source) {
            var elementDragged = document.getElementById(dragData.elementId);
            var parentTarget = event.target.closest(opt.closest);
            if (elementDragged && parentTarget) {
                var isContainInThisList = parentTarget.parentNode.contains(elementDragged);
                if (isContainInThisList) {
                    elementDragged.nextSibling === parentTarget ?
                    elementDragged.parentNode.insertBefore(elementDragged, parentTarget.nextSibling) :
                    elementDragged.parentNode.insertBefore(elementDragged, parentTarget);
                }
                else {
                    //Do nothing
                }
            }
            else {
                //Do nothing
            }
        }
        else {
            //Do nothing
        }
    },
    drop:function(event, dragData, opt) {
        if (dragData && dragData.source === opt.source) {
            var elementDragged = document.getElementById(dragData.elementId);
            if (elementDragged) {
                document.body.removeChild(document.getElementById('mask'));
                elementDragged.style.boxShadow = '';
                elementDragged.style.zIndex = '0';
            }
            else {
                //Do nothing
            }
        }
        else {
            //Do nothing
        }
    }
};
/**
 * Item base object
 */

 /**
  * @public
  * @constructor
  * @param {object} parent
  * @param {object} options is used to configure the item
  */
 sosimplist.ItemBase = function(parent, options) {
    var self_ = this;
    self_.parent_ = parent;
    self_.options_ = options;
    self_.id_ = 'sosimplist-item' + (new Date().getTime());
    self_.checked_ = false;
    self_.text_ = '';
    self_.view_ = null;
 }

 /**
 * @public
 */
sosimplist.ItemBase.prototype.buildBase = function() {
    
    var self_ = this;
    if (self_.view_ === null) {
        self_.view_ = document.createElement('div');
        self_.view_.id = self_.id_;
        self_.view_.className = 'sosimplist-item';

        //Initialize layout
        var layout = [];

        //Add checkbox to the layout
        var inputCheckbox = sosimplist.elementfactory.create(
         'checkbox',
         { 
            checked:self_.checked_,
            change:function() {
                self_.check_(this.checked);
                if (self_.parent_) {
                    //move item to the right container
                    self_.parent_.dispatch('moveItem', self_);
                }
                else {
                    //Do nothing
                }
            }
        });
        layout.push(inputCheckbox);

        //Add text element to the layout
        var inputText = sosimplist.elementfactory.create(
         'text',
         {
            id: 'sosimplist-item-text' + self_.id_,
            className: 'sosimplist-item-text',
            keyup: function(event) {
                var inputThis = this;
                sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.text_ = inputThis.innerHTML;});
            },
            text: self_.text_,
            placeholder: sosimplist.translate('write something'),
            edit: self_.options_.edit
        });
        layout.push(inputText);

        //Add others element depending on edit option
        if (self_.options_.edit) {
            //Add selector at the begining of the layout
            layout.unshift(sosimplist.elementfactory.create('selector'));

            //Add delete tick at the end of the layout
            var divDelete = sosimplist.elementfactory.create(
            'delete',
            {
                click:function() {
                    if (self_.parent_) {
                        self_.parent_.dispatch('removeItem', self_);
                    }
                    else {
                        //Do nothing
                    }
                }
            });
            layout.push(divDelete);

            self_.view_.addEventListener(
                'keyup',
                function(event){
                    sosimplist.EventStrategy.key.enter.stop(event, function(){if(self_.parent_){self_.parent_.dispatch('insertItemAfter', self_);}});
                },
                false
            );
            self_.view_.addEventListener(
                'keydown',
                sosimplist.EventStrategy.key.enter.stop,
                false
            );
            self_.view_.addEventListener(
                'keypress',
                sosimplist.EventStrategy.key.enter.stop,
                false
            );
        }
        else {
            //Do nothing
        }

        for(var i = 0; i < layout.length; i++){
            self_.view_.appendChild(layout[i]);
        }

        //Customize view depending on private members
        self_.check_(self_.checked_);
    }
    else {
       console.error('Item base ID = ' + self_.id_ + ', View already builded !');
    }
};

 /**
* @public
* @return {object} return serialized object 
*/
sosimplist.ItemBase.prototype.serializeBase = function() {
    var self_ = this;
    var content = {
        checked: self_.checked_,
        text: self_.text_
    };
    return content;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemBase.prototype.unserializeBase = function(obj) {
    try {
       //DEBUGCheckArgumentsAreValids(arguments, 1);
        if (obj) {
            var self_ = this;
            self_.id_ = obj.id_;
            self_.checked_ = obj.checked;
            self_.text_ = obj.text;
        }
        else {
            throw new Error('Input obj = ' + obj + ', does not contain data to unserialize!');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
  * @public
  * @return {element} return view as Element object to be placed in the view
  */
 sosimplist.ItemBase.prototype.getView = function() {
    return this.view_;
 };

 /**
  * @public
  * @return {string} return item id
  */
 sosimplist.ItemBase.prototype.getId = function() {
    return this.id_;
 };

  /**
  * @public
  * @return {bool} return if item is checked
  */
 sosimplist.ItemBase.prototype.isChecked = function() {
    return this.checked_;
 };

 /**
 * @public
 * @param {string} property of this object
 * @return {bool} return element property
 */
sosimplist.ItemBase.prototype.property = function(property) {
    return this.checked_;
};

/**
  * @public
  */
 sosimplist.ItemBase.prototype.focus = function() {
    try {
        var self_ = this;
        var el = document.getElementById('sosimplist-item-text' + self_.id_);
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 };

/**
* @private
* @param {bool} check item or not
*/
sosimplist.ItemBase.prototype.check_ = function(check) {
    try {
       //DEBUGCheckArgumentsAreValids(arguments, 1);

        var self_ = this;

        if (check === true || check === false) {
            self_.checked_ = check;

            if (self_.options_.edit) {
                //hide/show selector
                if (self_.view_ &&
                   self_.view_.getElementsByClassName('sosimplist-item-selector') &&
                   self_.view_.getElementsByClassName('sosimplist-item-selector')[0]) {

                    //Enable/disable dragndrop
                    self_.view_.draggable = !self_.checked_;

                    if (self_.view_.draggable) {
                        self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'visible';
                    }
                    else {
                        self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'hidden';
                    }
                }
                else {
                    throw new Error('The view = ' + self_.view_ + ' is not initialized correctly!');
                }
            }
        }
        else {
            throw new Error('check = ' + check + ', cannot set this value!');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
}

/**
 * Item composite object
 * This object will create item based on given configuration
 */

/**
 * @public
 * @constructor
 * @param {object} config: {
 * }
 * @param {object} elements : [
 *     {
 *         view: {
 *             type: 'div',
 *             attributs: {
 *                 id: 'checkboxID',
 *                 className: 'checkboxClass',
 *                 checked:false
 *             }
 *         },
 *         model: {
 *             checked:false
 *         },
 *         controller: {
 *             change:
 *         }
 *     },
 *
 * ]
 */
sosimplist.ItemComposite = function(parent, config, elements) {
    var self_ = this;
    self_.parent_ = parent;
    self_.id_ = config.id;
    self_.focusOnElementId_ = config.focusOnElementId;
    self_.view_ = null;
    self_.eventToCallOnBuild = [];
    self_.elements_ = [];
    for(var i = 0; i < elements.length; i++){
        var element = new sosimplist.Element(self_, elements[i]);
        self_.elements_.push(element);
        for(var j = 0; j < elements[i].controller.length; j++){
            if(elements[i].controller[j].dispatch){
                var eventName = elements[i].controller[j].dispatch;
                var data = {
                    eventName: eventName,
                    elementId: i
                };
                self_.eventToCallOnBuild.push(data);
            }
            else{
                //Do nothing
            }
        }
    }
}


/**
 * @public
 */
sosimplist.ItemComposite.prototype.appendTo = function(element) {
    var self_ = this;
    for(var i = 0; i < self_.elements_.length; i++){
        element.appendChild(self_.elements_[i].getView());
    }
}

/**
 * @public
 */
sosimplist.ItemComposite.prototype.buildView = function() {
    var self_ = this;
    
    self_.view_ = document.createElement('div');
    self_.view_.id = self_.id_;
    self_.view_.className = 'sosimplist-item';
    self_.appendTo(self_.view_);

    self_.view_.addEventListener(
        'keyup',
        function(event){
            sosimplist.EventStrategy.key.enter.stop(event, function(){if(self_.parent_){self_.parent_.dispatch({name:'insertItemAfter', target:self_});}});
        },
        false
    );
    self_.view_.addEventListener(
        'keydown',
        sosimplist.EventStrategy.key.enter.stop,
        false
    );
    self_.view_.addEventListener(
        'keypress',
        sosimplist.EventStrategy.key.enter.stop,
        false
    );

    for(var i = 0; i < self_.eventToCallOnBuild.length; i++){
        var data = self_.eventToCallOnBuild[i];
        var eventFunction = self_[data.eventName];
        if(eventFunction){
            var event = {
                name: data.eventName,
                value: self_.elements_[data.elementId].property(data.eventName),
                target: null
            }
            eventFunction.call(self_, event);
        }
        else{
            //Do nothing
        }
    }
};

/**
* @public
* Dispatch event received to the right method
* @param {string} eventName
* @param {object} data
*/
sosimplist.ItemComposite.prototype.dispatch = function(event) {
    try {
        var self_ = this;
        if (event.name === 'checked') {
            self_.checked(event);
        }
        else {
            //Do nothing
        }
        event.target = self_;
        self_.parent_.dispatch(event);
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 */
sosimplist.ItemComposite.prototype.checked = function(event) {
    var self_ = this;
    if(event.name === 'checked'){
        self_.view_.draggable = !event.value;
        if (self_.view_.draggable) {
            self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'visible';
        }
        else {
            self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'hidden';
        }
    }
    else{
        //Do nothing
    }
};

/**
 * @public
 * @return view
 */
sosimplist.ItemComposite.prototype.getView = function() {
    var self_ = this;
    return self_.view_;
};


/**
 * @public
 * @return {string} return item id
 */
sosimplist.ItemComposite.prototype.getId = function() {
    var self_ = this;
    return self_.id_;
};

/**
 * @public
 * @param {string} property of this object
 * @return {bool} return item property
 */
sosimplist.ItemComposite.prototype.property = function(property) {
    var self_ = this;
    var returnProperty = null;
    for(var i = 0; i < self_.elements_.length && returnProperty === null; i++){
        returnProperty = self_.elements_[i].property(property);
    }
    return returnProperty;
};

/**
 * @public
 */
sosimplist.ItemComposite.prototype.focus = function() {
    try {
        var self_ = this;
        var el = document.getElementById(self_.focusOnElementId_);
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @return {object} return serialized object
 */
sosimplist.ItemComposite.prototype.serialize = function() {
    try {
        var self_ = this;
        var content = {
            type: 'Composite',
            elements:[]
        };
        for(var i = 0; i < self_.elements_.length; i++){
            content.elements.push(self_.elements_[i].serialize());
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
sosimplist.ItemComposite.prototype.unserialize = function(obj) {
    try {
        var self_ = this;
        for(var i = 0; i < obj.elements.length; i++){
            self_.elements_[i].unserialize(obj.elements[i]);
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

 /**
  * @public
  * @constructor
  */
 sosimplist.ItemFactory = function() {
     var self_ = this;
 }
 
 
 /**
  * @public
  * @param {string} itemType is the type of the item to be created by the factory
  * @return {object} return the object asked
  */
 sosimplist.ItemFactory.prototype.create = function(itemType, parent, options) {
     if(itemType === 'ItemText'){
         return new sosimplist.ItemText(parent, options);
     }
     else if(itemType === 'ItemTextComment'){
         return new sosimplist.ItemTextComment(parent, options);
     }
     else if(itemType === 'ItemComposite'){
         var time = (new Date().getTime());
         var config = {
             id: 'sosimplist-item'+time,
             focusOnElementId: 'sosimplist-item-text'+time
         };
         var elements = [
             sosimplist.elementfactory.createElement('selector', {time:time}),
             sosimplist.elementfactory.createElement('checkbox', {time:time}),
             sosimplist.elementfactory.createElement('text', {time:time}),
             sosimplist.elementfactory.createElement('delete', {time:time})
          ];
          return new sosimplist.ItemComposite(parent, config, elements);
     } 
     else{
         console.error('Item type = ' + itemType + ' not supported yet !');
    }
 }

 /**
 * @private
 * @return {Object}
 */
function ItemFactory_create() {
    return new sosimplist.ItemFactory();
}

sosimplist.itemfactory = ItemFactory_create();
/**
 * Item text object
 */

/**
 * @public
 * @constructor
 * @extends {ItemBase}
 * @param {object} parent
 * @param {object} options is used to configure the item
 */
sosimplist.ItemText = function(parent, options) {
    sosimplist.ItemBase.apply(this, arguments);
}

sosimplist.ItemText.prototype = new sosimplist.ItemBase();

/**
 * @public
 */
sosimplist.ItemText.prototype.buildView = function() {
    var self_ = this;
    self_.buildBase();
};

/**
 * @public
 * @return {object} return serialized object 
 */
sosimplist.ItemText.prototype.serialize = function() {
    var self_ = this;
    dataSerialized = self_.serializeBase();
    dataSerialized.type = 'Text';
    return dataSerialized;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemText.prototype.unserialize = function(obj) {
    var self_ = this;
    self_.unserializeBase(obj);
};

/**
 * Item text+comment object
 */

/**
 * @public
 * @constructor
 * @extends {ItemBase}
 * @param {object} parent
 * @param {object} options is used to configure the item
 */
sosimplist.ItemTextComment = function(parent, options) {
    var self_ = this;
    sosimplist.ItemBase.apply(this, arguments);
    self_.comment_='';
}

sosimplist.ItemTextComment.prototype = new sosimplist.ItemBase();

/**
 * @public
 */
sosimplist.ItemTextComment.prototype.buildView = function() {
    var self_ = this;
    self_.buildBase();
    var itemBaseView = self_.view_;
    if (itemBaseView) {
        var inputComment = sosimplist.elementfactory.create(
         'text',
         {
            id: self_.id_,
            className: 'sosimplist-item-text',
            keyup: function(event) {
                var inputThis = this;
                sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.comment_ = inputThis.innerHTML;});
            },
            text: self_.comment_,
            placeholder:'write a comment',
            edit: self_.options_.edit
        });
        if(self_.options_.edit){
            itemBaseView.insertBefore(inputComment, itemBaseView.lastChild);
        }
        else {
            itemBaseView.appendChild(inputComment);
        }
    }
    else {
       console.error('Item simple ID = ' + self_.id_ + ', View already builded !');
    }
};

/**
 * @public
 * @return {object} return serialized object 
 */
sosimplist.ItemTextComment.prototype.serialize = function() {
    var self_ = this;
    var dataSerialized = self_.serializeBase();
    dataSerialized.comment = self_.comment_;
    dataSerialized.type = 'TextComment';
    return dataSerialized;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemTextComment.prototype.unserialize = function(obj) {
    try {
       //DEBUGCheckArgumentsAreValids(arguments, 1);
        if (obj) {
            var self_ = this;
            self_.unserializeBase(obj);
            self_.comment_ = obj.comment;
        }
        else {
            throw new Error('Input obj = ' + obj + ', does not contain data to unserialize!');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * List object
 */

 /**
  * @public
  * @constructor
  * @param {object} options is used to configure the list
  */
 sosimplist.List = function(options) {
     var self_ = this;
     self_.options_ = options;
     self_.id_ = 'sosimplist-list' + (new Date().getTime());
     self_.view_ = null;
     self_.title_ = '';
     self_.image_ = null;
     self_.mapOfItem_ = {};
     self_.checkedVisible_ = false;
     self_.dropdownButtonVisible_ = false;
     self_.dragData = null;

     //add default item
     self_.addItem();
 }

 /**
 * @public
 */
sosimplist.List.prototype.buildView = function() {
    try {
        var self_ = this;
        if (self_.view_ === null) {
             self_.view_ = document.createElement('div');
             self_.view_.id = self_.id_;
             self_.view_.className = 'sosimplist-list';
             self_.view_.style.display = 'table';

             if (self_.options_.edit) {
                self_.view_.draggable = false; //drag list disabled
             }
             else {
                self_.view_.className += ' sosimplist-edit-false';
             }

             var listContent = document.createElement('div');
             listContent.className = 'sosimplist-list-content';
             listContent.style.display = 'table-cell';

             if(self_.image_){
                 var imgElement = sosimplist.elementfactory.create('image', {
                    position: self_.image_.position,
                    src: self_.image_.src
                 });
                 if(self_.image_.position === 'bottom' ||
                    self_.image_.position === 'right'){
                    self_.view_.appendChild(listContent);
                    self_.view_.appendChild(imgElement);
                 }
                 // Default image set to Top of the list
                 else{
                    self_.view_.appendChild(imgElement);
                    self_.view_.appendChild(listContent);
                 }
             }
             else {
                self_.view_.appendChild(listContent);
             }

             //Add text element, used for the list title, to the layout
            var inputTitle = sosimplist.elementfactory.create(
             'text',
             {
                id: 'sosimplist-title' + self_.id_,
                className: 'sosimplist-title',
                keyup: function(event) {
                    var inputThis = this;
                    sosimplist.EventStrategy.key.enter.stop(event);
                    sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.title_ = inputThis.innerHTML;});
                },
                text: self_.title_,
                placeholder: sosimplist.translate('Title'),
                edit: self_.options_.edit
             });
             listContent.appendChild(inputTitle);

             self_.itemContainer_ = document.createElement('div');
             self_.itemContainer_.className = 'sosimplist-container-item';
             self_.itemContainer_.addEventListener(
                 'dragstart',
                 function(event) {
                    self_.dragData = sosimplist.EventStrategy.dragstart(event, {source: 'sosimplist-item', closest: '.sosimplist-item'});
                 },
                 false
             );
             self_.itemContainer_.addEventListener(
                 'dragenter',
                 function(event) {
                    sosimplist.EventStrategy.dragenter(event, self_.dragData, {source: 'sosimplist-item', closest: '.sosimplist-item'});
                 },
                 false
             );
             self_.itemContainer_.addEventListener(
                'drop',
                function(event) {
                    sosimplist.EventStrategy.drop(event, self_.dragData, {source: 'sosimplist-item'});
                },
                false
             );
             self_.itemContainer_.addEventListener(
                'dragover',
                function(event) {
                    event.preventDefault();
                },
                false
             );
             listContent.appendChild(self_.itemContainer_);

             if (self_.options_.edit) {
                 var buttonAddItem = sosimplist.elementfactory.create('button', {
                    id: 'sosimplist-button-add-item',
                    value: sosimplist.translate('Add item'),
                    click: function() {self_.addItem();}
                 });
                 listContent.appendChild(buttonAddItem);
             }
             else {
                //Do nothing
             }


             var dropdownList = document.createElement('div');
             dropdownList.className = 'sosimplist-list-dropdown-checked';
             dropdownList.value = 'click';
             dropdownList.addEventListener(
                 'click',
                 function() {
                    self_.checkedVisible_ = !self_.checkedVisible_;
                    self_.setVisibility_();
                 },
                 false
             );
             var pin = document.createElement('div');
             pin.className = 'sosimplist-list-pin';
             dropdownList.appendChild(pin);
             var pinLabel = document.createElement('label');
             pinLabel.className = 'sosimplist-list-pin-label';
             pinLabel.innerHTML = sosimplist.translate('Selected items');
             dropdownList.appendChild(pinLabel);
             listContent.appendChild(dropdownList);

             self_.itemContainerChecked_ = document.createElement('div');
             self_.itemContainerChecked_.className = 'sosimplist-container-item-checked';
             listContent.appendChild(self_.itemContainerChecked_);

             //Fill view view items
             for (var itemId in self_.mapOfItem_) {
                if (self_.mapOfItem_[itemId].property('checked')) {
                    self_.itemContainerChecked_.appendChild(self_.mapOfItem_[itemId].getView());
                }
                else {
                    self_.itemContainer_.appendChild(self_.mapOfItem_[itemId].getView());
                }
             }

             //Customize view depending on private members
             self_.setVisibility_();
         }
         else {
            console.error('List ID = ' + self_.id_ + ', View already builded !');
         }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* @return {object} return serialized object
*/
sosimplist.List.prototype.serialize = function() {
    try {
        var self_ = this;
        var content = {
            title: self_.title_,
            image: self_.image_,
            items: [] // parse element array to save item order
        };
        for (var i = 0; i < self_.itemContainer_.children.length; i++) {
            content.items.push(self_.mapOfItem_[self_.itemContainer_.children[i].id].serialize());
        }
        for (var j = 0; j < self_.itemContainerChecked_.children.length; j++) {
            content.items.push(self_.mapOfItem_[self_.itemContainerChecked_.children[j].id].serialize());
        }
        return content;
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @param {object} obj content serialized to decode
 */
sosimplist.List.prototype.unserialize = function(obj) {
    try {
        var self_ = this;
        self_.id_ = obj.id_;
        self_.title_ = obj.title;
        self_.image_ = obj.image;
        self_.mapOfItem_ = {};
        for (var i = 0; i < obj.items.length; i++) {
            var myItem = sosimplist.itemfactory.create('Item'+obj.items[i].type, self_, self_.options_);
            obj.items[i].id_ = obj.items[i].id_ ? obj.items[i].id_ : myItem.getId()+i;
            myItem.unserialize(obj.items[i]);
            myItem.buildView();
            self_.mapOfItem_[myItem.getId()] = myItem;
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* @return {string} return list id
*/
sosimplist.List.prototype.getId = function() {
    return this.id_;
};

/**
* @public
* Add item to this list
* @param {object} itemElementCurrent used as index to create the new item element.
*/
sosimplist.List.prototype.addItem = function(itemElementCurrent) {
    try {
        var self_ = this;
        var myItem = sosimplist.itemfactory.create('ItemText', self_, self_.options_);
        myItem.buildView();
        self_.mapOfItem_[myItem.getId()] = myItem;
        if (self_.view_ !== null) {
            if (itemElementCurrent) {
                self_.itemContainer_.insertBefore(myItem.getView(), itemElementCurrent.nextSibling);
            }
            else {
                self_.itemContainer_.appendChild(myItem.getView());
            }
            myItem.focus();
        }
        else {
            //Do nothing
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Remove given item from this list
* @param {object} item
*/
sosimplist.List.prototype.removeItem = function(item) {
    try {
        var self_ = this;
        if (self_.itemContainer_.contains(document.getElementById(item.getId()))) {
            self_.itemContainer_.removeChild(document.getElementById(item.getId()));
        }
        else {
            self_.itemContainerChecked_.removeChild(document.getElementById(item.getId()));
        }
        self_.mapOfItem_[item.getId()] = undefined;
        delete self_.mapOfItem_[item.getId()];
        self_.setVisibility_();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Move given item to the right list container (checked container or default container)
* @param {object} item
*/
sosimplist.List.prototype.moveItem = function(item) {
    try {
        var self_ = this;
        if (item.property('checked')) {
            self_.itemContainerChecked_.appendChild(document.getElementById(item.getId()));
        }
        else {
            self_.itemContainer_.appendChild(document.getElementById(item.getId()));
        }
        self_.setVisibility_();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Insert new item after item given into parameter
* @param {object} item used as reference to insert new item after.
*/
sosimplist.List.prototype.insertItemAfter = function(item) {
    try {
        var self_ = this;
        self_.addItem(document.getElementById(item.getId()));
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Dispatch event received to the right method
* @param {string} eventName
* @param {object} data
*/
sosimplist.List.prototype.dispatch = function(event) {
    try {
        var self_ = this;
        if (event.name === 'checked') {
            self_.moveItem(event.target);
        }
        else if (event.name === 'delete') {
            self_.removeItem(event.target);
        }
        else if (event.name === 'insertItemAfter') {
            self_.insertItemAfter(event.target);
        }
        else {
            //Do nothing
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

 /**
  * @public
  * @return {string} return view as Element object to be placed in the view
  */
 sosimplist.List.prototype.getView = function() {
     return this.view_;
 };

 /**
  * @private
  */
 sosimplist.List.prototype.setVisibility_ = function() {
    try {
        var self_ = this;
         //hide/show list of item checked
        if (self_.checkedVisible_) {
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.display = '';
            setTimeout(function(){
                self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.opacity = '1';
               // self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.transform = 'translate(0, 0)';
            },10);
            self_.view_.getElementsByClassName('sosimplist-list-pin')[0].style.transform = 'rotate(90deg)';
        }
        else {
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.opacity = '0';
            //self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.transform = 'translate(0, -100%)';
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.display = 'none';
            self_.view_.getElementsByClassName('sosimplist-list-pin')[0].style.transform = '';
        }

        self_.dropdownButtonVisible_ = self_.itemContainerChecked_.hasChildNodes();
        if (self_.dropdownButtonVisible_) {
            self_.view_.getElementsByClassName('sosimplist-list-dropdown-checked')[0].style.display = '';
        }
        else {
            self_.view_.getElementsByClassName('sosimplist-list-dropdown-checked')[0].style.display = 'none';
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 };



/**
 * Use gjslint lib/*.js to check coding rules
 * Use fixjsstyle lib/*.js to fix coding rules
 *
 */


/**
 * @private
 * @constructor
 */
sosimplist.Manager = function() {
    /** @private */
    var self_ = this;
    self_.sosimplistId_ = new Date().getTime();
    self_.viewId_ = '';
    self_.view_ = null;
    self_.mapOfList_ = {};
    self_.options_ = {
        translationModule: 'sosimplist.DefaultTranslationModule',
        databaseModule: 'sosimplist.DefaultDatabaseModule',
        dbParams: {
            dbService: E_DB_SERVICE.NONE,
            dbName: null,
            dbUser: null,
            dbPassword: null,
            dbData: [],
        },
        lang:'en',
        edit: true, // edit / remove / add
        checkable: true  // can check list item or not
    };
    self_.dragData = null;
}

/**
 * @public
 * @param {string} viewId is the element Id where to display the list manager
 * @param {object} options is used to configure the list manager
 */
sosimplist.Manager.prototype.init = function(viewId, options) {
    try {
        var self_ = this;
        if (self_.view_ === null) {
            self_.viewId_ = viewId;

            //update options
            self_.options_ = sosimplist.updateOptions(self_.options_, options);

            // Load translation module
            sosimplist.translationModule = self_.loadModule_(self_.options_.translationModule, {lang:self_.options_.lang});

            // Load database module
            sosimplist.databaseModule = self_.loadModule_(self_.options_.databaseModule, self_.options_.dbParams);

            // load data 
            var dataToUnserialize = sosimplist.databaseModule.get('data');
            self_.unserialize(dataToUnserialize);

            //build view
            self_.view_ = document.getElementById(this.viewId_);

            //Display warning on not empty view
            if(self_.view_ && self_.view_.children.length > 0){
                console.warn("View not empty, Sosimplist will append all lists at the end of the element ID = '"+self_.viewId_+"'!");
            }
            self_.view_.className += 'sosimplist';
            self_.view_.addEventListener('keyup', function(){sosimplist.databaseModule.set(self_.serialize());}, false);
            self_.view_.addEventListener('change', function(){sosimplist.databaseModule.set(self_.serialize());}, false);
            self_.view_.addEventListener('click', function(){sosimplist.databaseModule.set(self_.serialize());}, false);
            self_.view_.addEventListener('dragend', function(){sosimplist.databaseModule.set(self_.serialize());}, false);

            self_.listContainer_ = document.createElement('div');
            self_.listContainer_.id = 'sosimplist-container-list' + self_.sosimplistId_;
            self_.listContainer_.className = 'sosimplist-container-list';
            self_.listContainer_.addEventListener(
                'dragstart',
                function(event) {
                    self_.dragData = sosimplist.EventStrategy.dragstart(event, {source: 'sosimplist-list', closest: '.sosimplist-list'});
                },
                false
            );
            self_.listContainer_.addEventListener(
                'dragenter',
                function(event) {
                    sosimplist.EventStrategy.dragenter(event, self_.dragData, {source: 'sosimplist-list', closest: '.sosimplist-list'});
                },
                false
            );
             self_.listContainer_.addEventListener(
                'drop',
                function(event) {
                    sosimplist.EventStrategy.drop(event, self_.dragData, {source: 'sosimplist-list'});
                },
                false
             );
             self_.listContainer_.addEventListener(
                'dragover',
                function(event) {
                    event.preventDefault();
                },
                false
             );
            self_.view_.appendChild(self_.listContainer_);

            for (var listId in self_.mapOfList_) {
                self_.listContainer_.appendChild(self_.mapOfList_[listId].getView());
            }

            if (self_.options_.edit) {
                var buttonAddList = sosimplist.elementfactory.create('button', {
                    id: 'sosimplist-button-add-list',
                    value: sosimplist.translate('Add list'),
                    click: function() {self_.addList();}
                });
                self_.view_.appendChild(buttonAddList);

                var buttonClear = sosimplist.elementfactory.create('button', {
                    id: 'sosimplist-button-clear',
                    value: sosimplist.translate('Clear'),
                    click: function() {self_.clearAll();}
                });
                self_.view_.appendChild(buttonClear);
            }
            else {
                //Do nothing
            }
        }
        else {
            console.error('Sosimplist ID = ' + self_.viewId_ + ', View already builded !');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @return {string} return content serialize in a JSON object
 */
sosimplist.Manager.prototype.serialize = function() {
    var self_ = this;
    var content = [];
    for (var listId in self_.mapOfList_) {
        content.push(self_.mapOfList_[listId].serialize());
    }

    return JSON.stringify(content);
};

/**
 * @public
 * @param {string} str content serialized in a JSON object
 */
sosimplist.Manager.prototype.unserialize = function(str) {
    try {
        var self_ = this;
        if(str){
            var content = JSON.parse(str);
            self_.mapOfList_ = {};
            for (var i = 0; i < content.length; i++) {
                var myList = new sosimplist.List(self_.options_);
                content[i].id_ = content[i].id_ ? content[i].id_ : myList.getId()+i ;
                myList.unserialize(content[i]);
                myList.buildView();
                self_.mapOfList_[myList.getId()] = myList;
            }
        } 
        else
        {
            //Cannot unserialize null data, throw error
            throw new Error('Cannot unserialize empty data'); 
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 */
sosimplist.Manager.prototype.addList = function() {
    try {
        var self_ = this;
        var myList = new sosimplist.List(self_.options_);
        myList.buildView();
        self_.listContainer_.appendChild(myList.getView());
        self_.mapOfList_[myList.getId()] = myList;
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 */
sosimplist.Manager.prototype.clearAll = function() {
    try {
        var self_ = this;
        self_.mapOfList_ = {};
        // Removing all children from an element
        var el = document.getElementById('sosimplist-container-list' + self_.sosimplistId_);
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        self_.updateLocation_();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

 /**
  * @public
  * @return {string} return view as Element object to be placed in the DOM
  */
 sosimplist.Manager.prototype.getView = function() {
     return this.view_;
 };

/**
* @public
* @return {string} return Sosimplist id
*/
sosimplist.Manager.prototype.getId = function() {
    return this.viewId_;
};

/**
* @public
* @param {string} lang to use
*/
sosimplist.Manager.prototype.setLang = function(lang) {
    var self_ = this;

    //If lang change we reinit the view
    if(lang.lang !== self_.options_.lang){
        self_.cleanView_();
        self_.init(self_.viewId_, lang);
    }
    else{}
};

/**
* @public
* @param {string} database to use
*/
sosimplist.Manager.prototype.setDatabase = function(database) {
    var self_ = this;

    //If db change we reinit the view
    if(database.dbParams !== self_.options_.dbParams){
        self_.cleanView_();
        self_.init(self_.viewId_, database);
    }
    else{}
};

/**
 * @private
 * @param {string} moduleName
 * @param {object} moduleParams
 */
sosimplist.Manager.prototype.loadModule_ = function(moduleName, moduleParams) {
    var self_ = this;
    if(moduleName){
        var Module = sosimplist.stringToFunction(moduleName);
        return new Module(moduleParams);
    }
    else{
        return null;
    }
};

/**
 * @private
 */
sosimplist.Manager.prototype.cleanView_ = function() {
    var self_ = this;
    var myNode = document.getElementById(self_.viewId_);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    self_.view_ = null;
};

/**
 * @private
 * @return {Object}
 */
function Sosimplist_create() {
    return new sosimplist.Manager();
}
/**
 * @private
 * Creating solsimplist manager
 */
sosimplist.mgr = Sosimplist_create(); 

/**
 * @public
 * @param {string} viewId is the element Id where to display the list manager
 * @param {object} options is used to configure the list manager
 */
sosimplist.init = function(viewId, options){
    var self_ = this;
    self_.mgr.init(viewId, options);
};




 
sosimplist.translationModule = null;

/**
 * @public
 * @constructor
 * @params {string} options 
 */
sosimplist.DefaultTranslationModule = function(options){
    var self_ = this;
    self_.lang_ = options.lang;
    self_.text_ = {
        fr:{
            'Title': 'Titre',
            'Add item': 'Ajouter un élément',
            'Selected items': 'Eléments sélectionnés',
            'Add list': 'Ajouter une liste',
            'Clear': 'Tout supprimer'
        }
    }
}

/**
 * @public
 * @params {string} toTranslate 
 */
sosimplist.DefaultTranslationModule.prototype.translate = function(toTranslate){
    var self_ = this;
    if(self_.text_ && self_.text_[self_.lang_] && self_.text_[self_.lang_][toTranslate]){
        return self_.text_[self_.lang_][toTranslate];
    }
    else{
        return toTranslate;
    }
}

 /**
  * @public
  * @param {string} toTranslate
  */
sosimplist.translate = function(toTranslate){
    var self_ = this;
    if(self_.translationModule){
        return self_.translationModule.translate(toTranslate);
    }
    else{
        return toTranslate;
    }
}