/**
 * List object
 */

 /**
  * @public
  * @constructor
  */
 function List() {
     try {
         var self_ = this;
         this.id_ = new Date().getTime();
         this.view_ = null;
         this.title_ = '';
         this.mapOfItem_ = {};
         this.drag = {
            dragged : null
         }

         //add default item
         this.addItem();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 }

 /**
 * @public
 */
List.prototype.buildView = function() {
    try {
        if(this.view_ === null){
             var self_ = this;
             this.view_ = document.createElement("div");
             this.view_.id = 'sosimplist-list'+this.id_;
             this.view_.className = 'sosimplist-list';

             var inputTitle = document.createElement("input");
             inputTitle.id = 'sosimplist-title'+this.id_;
             inputTitle.type = 'text';
             inputTitle.placeholder = 'Title';
             inputTitle.addEventListener(
                 "keyup",
                 function() { self_.title_ = this.value;},
                 false
             );
             if(this.title_ !== ''){
                inputTitle.value = this.title_;
             }else{}
             this.view_.appendChild(inputTitle);

             this.itemContainer_ = document.createElement("div");
             this.itemContainer_.id = 'sosimplist-container-item';
             this.itemContainer_.addEventListener(
                 "dragstart",
                 function( event ) { 
                    self_.drag.dragged = event.target;
                 },
                 false
             );
             this.itemContainer_.addEventListener(
                 "dragenter",
                 function( event ) { 
                    //swap two elements when dragenter event is fire 
                    self_.drag.dragged.nextSibling === event.target.parentNode
                    ? event.target.parentNode.parentNode.insertBefore(self_.drag.dragged, event.target.parentNode.nextSibling)
                    : event.target.parentNode.parentNode.insertBefore(self_.drag.dragged, event.target.parentNode); 
                 },
                 false
             );
             this.view_.appendChild(this.itemContainer_);

             for (var itemId in this.mapOfItem_) {
                this.itemContainer_.appendChild(this.mapOfItem_[itemId].getView());
             }

             var buttonAddItem = document.createElement("input");
             buttonAddItem.className = 'sosimplist-button';
             buttonAddItem.type = 'button';
             buttonAddItem.value = 'Add item';
             buttonAddItem.addEventListener(
                 "click",
                 function() { self_.addItem(); },
                 false
             );
             this.view_.appendChild(buttonAddItem);
         }
         else{
            console.log('List ID = '+this.id_+', View already builded !');
         }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
}

/**
* @public
* @return {string} return content serialize in a base64 string
*/
List.prototype.serialize = function() {
    try {
        var content = {
            id_: this.id_,
            title_: this.title_,
            arrayOfItem_: [] // parse element array to save item order 
        };
        for (var i = 0; i < this.itemContainer_.children.length; i++) {
            content.arrayOfItem_.push(this.mapOfItem_[this.itemContainer_.children[i].id].serialize());
        }
        return btoa(JSON.stringify(content));
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
List.prototype.unserialize = function(str) {
    try {
        var self_ = this;
        var content = JSON.parse(atob(str));
        this.id_ = content.id_;
        this.title_ = content.title_;
        this.mapOfItem_ = {};
        for (var i = 0; i < content.arrayOfItem_.length; i++) {
            var myItem = new ItemSimple(self_);
            myItem.unserialize(content.arrayOfItem_[i]);
            myItem.buildView();
            this.mapOfItem_[myItem.getId()] = myItem;
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
List.prototype.getListId = function() {
    return this.id_;
};

/**
* @public
* Add item to this list
*/
List.prototype.addItem = function() {
    try {
        var self_ = this;
        var myItem = new ItemSimple(self_);
        myItem.buildView();
        this.mapOfItem_[myItem.getId()] = myItem;
        if(this.view_ !== null){
            this.itemContainer_.appendChild(myItem.getView());
        }else{}
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
List.prototype.removeItem = function(item) {
    try {
        var self_ = this;
        self_.mapOfItem_[item.getId()] = undefined;
        self_.itemContainer_.removeChild(document.getElementById(item.getId()));
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

 /**
  * @public
  * @return {string} return view as Element object to be placed in the view
  */
 List.prototype.getView = function() {
     return this.view_;
 };


