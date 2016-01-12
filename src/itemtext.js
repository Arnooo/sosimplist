/**
 * Item simple object
 */

/**
 * @public
 * @constructor
 * @extends {ItemBase}
 * @param {object} parent
 * @param {object} options is used to configure the item
 */
function ItemText(parent, options) {
    DEBUGCheckArgumentsAreValids(arguments, 2);
    ItemBase.call(this, parent, options);
    
    console.log("ItemText ", parent, options);
}

ItemText.prototype.super = new ItemBase();

/**
 * @public
 */
ItemText.prototype.buildView = function() {
    var self_ = this;
    self_.super.buildView();
    console.log("ItemText buildView");
};

/**
 * @public
 * @return {object} return serialized object 
 */
ItemText.prototype.serialize = function() {
    var self_ = this;
    self_.super.serialize();
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
ItemText.prototype.unserialize = function(obj) {
    var self_ = this;
    self_.super.unserialize(obj);
};
