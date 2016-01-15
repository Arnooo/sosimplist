 
sosimplist.translationModule = null;

/**
 * @public
 * @constructor
 * @params {string} options 
 */
sosimplist.DefaultTranslationModule = function(options){
    var self_ = this;
    self_.lang_ = options.lang;
    self_.text_ = {
        fr:{
            'Title': 'Titre',
            'Add item': 'Ajouter un élément',
            'Selected items': 'Eléments sélectionnés',
            'Add list': 'Ajouter une liste',
            'Clear': 'Tout supprimer'
        }
    }
}

/**
 * @public
 * @params {string} toTranslate 
 */
sosimplist.DefaultTranslationModule.prototype.translate = function(toTranslate){
    var self_ = this;
    if(self_.text_ && self_.text_[self_.lang_] && self_.text_[self_.lang_][toTranslate]){
        return self_.text_[self_.lang_][toTranslate];
    }
    else{
        return toTranslate;
    }
}

 /**
  * @public
  * @param {string} toTranslate
  */
sosimplist.translate = function(toTranslate){
    var self_ = this;
    if(self_.translationModule){
        return self_.translationModule.translate(toTranslate);
    }
    else{
        return toTranslate;
    }
}