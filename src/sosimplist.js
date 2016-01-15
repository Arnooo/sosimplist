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
                console.warning("Sosimplist will append all lists at the end of the element ID = '"+self_.viewId_+"'!");
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



