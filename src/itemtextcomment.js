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
        var inputComment = document.createElement('div');
        inputComment.id = 'sosimplist-item-text' + self_.id_;
        inputComment.className = 'sosimplist-item-text sosimplist-editable';
        //enable eddition
        if (self_.options_.edit) {
            inputComment.contentEditable = true;
        }
        else {
            inputComment.className += ' sosimplist-edit-false';
        }
        inputComment.setAttribute('placeholder', 'write a comment');
        if (self_.comment_ !== '') {
            inputComment.innerHTML = self_.comment_;
        }else {}
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
    return self_.serializeBase();
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
