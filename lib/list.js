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
         this.arrayOfItem_ = [];

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
             this.view_.id = 'list'+this.id_;

             var inputTitle = document.createElement("input");
             inputTitle.id = 'title'+this.id_;
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
             this.itemContainer_.id = 'container-item';
             this.view_.appendChild(this.itemContainer_);

             for (var i = 0; i < this.arrayOfItem_.length; i++) {
                this.itemContainer_.appendChild(this.arrayOfItem_[i].getView());
            }

             var buttonAddItem = document.createElement("input");
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
    var content = {
        id_: this.id_,
        title_: this.title_,
        arrayOfItem_: [] 
    };
    for (var i = 0; i < this.arrayOfItem_.length; i++) {
        content.arrayOfItem_[i] = this.arrayOfItem_[i].serialize();
    }
    return btoa(JSON.stringify(content));
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
List.prototype.unserialize = function(str) {
    try {
        var content = JSON.parse(atob(str));
        this.id_ = content.id_;
        this.title_ = content.title_;
        this.arrayOfItem_ = [];
        for (var i = 0; i < content.arrayOfItem_.length; i++) {
            var myItem = new ItemSimple();
            myItem.unserialize(content.arrayOfItem_[i]);
            myItem.buildView();
            this.arrayOfItem_[i] = myItem;
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
        var myItem = new ItemSimple();
        myItem.buildView();
        this.arrayOfItem_.push(myItem);
        if(this.view_ !== null){
            this.itemContainer_.appendChild(myItem.getView());
        }else{}

        this.serialize();
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


