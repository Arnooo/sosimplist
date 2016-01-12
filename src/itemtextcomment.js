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
function ItemTextComment(parent, options) {
    DEBUGCheckArgumentsAreValids(arguments, 2);
    ItemBase.call(this, parent, options);
    
    console.log("ItemTextComment ", parent, options);
}

ItemTextComment.prototype.super = new ItemBase();

/**
 * @public
 */
ItemTextComment.prototype.buildView = function() {
    var self_ = this;
    self_.super.buildView();
    console.log("ItemTextComment buildView");
};

/**
 * @public
 * @return {object} return serialized object 
 */
ItemTextComment.prototype.serialize = function() {
    var self_ = this;
    self_.super.serialize();
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
ItemTextComment.prototype.unserialize = function(obj) {
    var self_ = this;
    self_.super.unserialize(obj);
};
