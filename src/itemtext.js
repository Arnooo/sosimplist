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
sosimplist.ItemText = function(parent, options) {
    sosimplist.ItemBase.apply(this, arguments);
}

sosimplist.ItemText.prototype = new sosimplist.ItemBase();

/**
 * @public
 */
sosimplist.ItemText.prototype.buildView = function() {
    var self_ = this;
    self_.buildBase();
};

/**
 * @public
 * @return {object} return serialized object 
 */
sosimplist.ItemText.prototype.serialize = function() {
    var self_ = this;
    dataSerialized = self_.serializeBase();
    dataSerialized.type = 'Text';
    return dataSerialized;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemText.prototype.unserialize = function(obj) {
    var self_ = this;
    self_.unserializeBase(obj);
};
