/**
 * Item text object
 */

/**
 * @public
 * @constructor
 * @extends {ItemBase}
 * @param {object} parent
 * @param {object} options is used to configure the item
 */
function ItemText(parent, options) {
    ItemBase.apply(this, arguments);
}

ItemText.prototype = new ItemBase();

/**
 * @public
 */
ItemText.prototype.buildView = function() {
    var self_ = this;
    self_.buildBase();
};

/**
 * @public
 * @return {object} return serialized object 
 */
ItemText.prototype.serialize = function() {
    var self_ = this;
    self_.serializeBase();
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
ItemText.prototype.unserialize = function(obj) {
    var self_ = this;
    self_.unserializeBase(obj);
};
