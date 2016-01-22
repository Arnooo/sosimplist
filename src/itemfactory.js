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
    var itemComposite = null;
    var config = {
        id: 'sosimplist-item'+options.id,
        focusOnElementId: 'sosimplist-item-text'+options.id
    };
    var elements = [];
    if(itemType === 'ItemText' || itemType === 'ItemTextComment'){
        elements.push(sosimplist.elementfactory.getElementConfiguration('selector', {id:options.id}));
        elements.push(sosimplist.elementfactory.getElementConfiguration('checkbox', {name: 'checkbox', id:options.id}));
        elements.push(sosimplist.elementfactory.getElementConfiguration('text', {name: 'text', id:options.id, edit: options.edit, content: 'write something'}));
        if(itemType === 'ItemTextComment'){
            elements.push(sosimplist.elementfactory.getElementConfiguration('text', {name: 'comment', id:options.id+1, edit: options.edit, content:'write a comment'}));
        }
        elements.push(sosimplist.elementfactory.getElementConfiguration('delete', {id:options.id}));
        itemComposite = new sosimplist.ItemComposite(parent, config, elements);
    }
    else if(itemType === 'ItemIngredient'){
        elements.push(sosimplist.elementfactory.getElementConfiguration('number', {name: 'quantity', id:options.id}));
        elements.push(sosimplist.elementfactory.getElementConfiguration('select', {name: 'unit', id:options.id}));
        elements.push(sosimplist.elementfactory.getElementConfiguration('text', {name: 'text', id:options.id, edit: options.edit, content: 'ingredient'}));
        itemComposite = new sosimplist.ItemComposite(parent, config, elements);
    }
    else{
        console.error('Item type = ' + itemType + ' not supported yet !');
    }
    return itemComposite;
}

/**
* @private
* @return {Object}
*/
function ItemFactory_create() {
    return new sosimplist.ItemFactory();
}

sosimplist.itemfactory = ItemFactory_create();