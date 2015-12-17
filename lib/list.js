/**
 * List object
 */

 /**
  * @public
  * @constructor
  */
 function List() {
     this.id_ = new Date().getTime();
     this.arrayOfItem_ = ['<p><input type=checkbox></input></p>'];
 }

/**
* @public
* @return {string} return content serialize in a base64 string 
*/
List.prototype.serialize = function() {
    var content = {
        id_ : this.id_,
        arrayOfItem_ : this.arrayOfItem_
    };
    return btoa(JSON.stringify(content));
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
List.prototype.unserialize = function(str) {
    var content = JSON.parse(atob(str));
    this.id_ = content.id_;
    this.arrayOfItem_ = content.arrayOfItem_;
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
};

 /**
  * @public
  * @return {string} return view as html code to display
  */
 List.prototype.getView = function() {
     var view = '<div>';
     if(DEBUG === 1) {
        view += '<p>List ID = ' + this.id_ + '</p>';
     }else{}
     view += '<p><input type=text placeholder=Title></input></p>';
     for (var i = 0; i < this.arrayOfItem_.length; i++) {
         view += this.arrayOfItem_[i];
     }
     view += "<button onclick='sosimplist.addItem(" + this.id_ + ")'>Add item</button>";
     view += '</div>';
     return view;
 };


