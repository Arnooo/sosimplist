/**
 * Item text+comment object
 */

/**
 * @public
 * @constructor
 * @extends {ItemBase}
 * @param {object} parent
 * @param {object} options is used to configure the item
 */
sosimplist.ItemTextComment = function(parent, options) {
    var self_ = this;
    sosimplist.ItemBase.apply(this, arguments);
    self_.comment_='';
}

sosimplist.ItemTextComment.prototype = new sosimplist.ItemBase();

/**
 * @public
 */
sosimplist.ItemTextComment.prototype.buildView = function() {
    var self_ = this;
    self_.buildBase();
    var itemBaseView = self_.view_;
    if (itemBaseView) {
        var inputComment = sosimplist.elementfactory.create(
         'text',
         {
            id: self_.id_,
            keyup: function(event) {
                var inputThis = this;
                sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.comment_ = inputThis.innerHTML;});
            },
            text: self_.comment_,
            placeholder:'write a comment',
            edit: self_.options_.edit
        });
        itemBaseView.insertBefore(inputComment, itemBaseView.lastChild);
    }
    else {
       console.error('Item simple ID = ' + self_.id_ + ', View already builded !');
    }
};

/**
 * @public
 * @return {object} return serialized object 
 */
sosimplist.ItemTextComment.prototype.serialize = function() {
    var self_ = this;
    var dataSerialized = self_.serializeBase();
    dataSerialized.comment = self_.comment_;
    dataSerialized.type = 'TextComment';
    return dataSerialized;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemTextComment.prototype.unserialize = function(obj) {
    try {
        DEBUGCheckArgumentsAreValids(arguments, 1);
        if (obj) {
            var self_ = this;
            self_.unserializeBase(obj);
            self_.comment_ = obj.comment;
        }
        else {
            throw new Error('Input obj = ' + obj + ', does not contain data to unserialize!');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};
