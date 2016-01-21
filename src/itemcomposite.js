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
            var data = self_.elements_[i].serialize();
            if(data && data.content){
                content.elements.push(data);
            }
            else{
                //Do nothing
            }
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
            var found = false;
            for(var j = 0; j < self_.elements_.length && !found; j++){
                if(self_.elements_[j].getName() === obj.elements[i].name){
                    self_.elements_[j].unserialize(obj.elements[i]);
                    found = true;
                }
                else{
                    //Do nothing
                }
            }
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};