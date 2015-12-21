/**
 * Item simple object
 */

 /**
  * @public
  * @constructor
  */
 function ItemSimple() {
    try {
         var self_ = this;
         this.id_ = new Date().getTime();
         //build view
         this.view_ = document.createElement("div");
         this.view_.id = 'item'+this.id_;

         var inputCheckbox = document.createElement("input");
         inputCheckbox.type = 'checkbox';
         inputCheckbox.placeholder = 'write something';
         inputCheckbox.addEventListener(
             "change",
             function() { console.log(self_); },
             false
         );
         this.view_.appendChild(inputCheckbox);

         var inputText = document.createElement("input");
         inputText.type = 'text';
         inputText.placeholder = 'write something';
         inputText.addEventListener(
             "keypress",
             function() { console.log(self_); },
             false
         );
         this.view_.appendChild(inputText);
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 }

 /**
* @public
* @return {string} return content serialize in a base64 string
*/
ItemSimple.prototype.serialize = function() {
    var content = {
    };
    return btoa(JSON.stringify(content));
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
ItemSimple.prototype.unserialize = function(str) {
    try {
        var content = JSON.parse(atob(str));
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
  * @public
  * @return {string} return view as Element object to be placed in the view
  */
 ItemSimple.prototype.getView = function() {
    return this.view_;
 }