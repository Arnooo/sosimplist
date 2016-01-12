
 /**
  * @public
  * @constructor
  */
 function ItemFactory() {
     var self_ = this;
 }
 
 
 /**
  * @public
  * @param {string} itemType is the type of the item to be created by the factory
  * @return {object} return the object asked
  */
 ItemFactory.prototype.create = function(itemType, parent, options) {
     if(itemType === 'ItemText'){
         return new ItemText(parent, options);
     }
     else if(itemType === 'ItemTextComment'){
         return new ItemTextComment(parent, options);
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
    return new ItemFactory();
}

var itemfactory = ItemFactory_create();