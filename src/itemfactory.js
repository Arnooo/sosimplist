
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