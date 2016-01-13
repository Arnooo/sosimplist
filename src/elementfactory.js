 /**
  * @public
  * @constructor
  */
 sosimplist.ElementFactory = function() {
     var self_ = this;
 }
 
  
 /**
  * @public
  * @param {string} elementType is the type of the item to be created by the factory
  * @return {element} return the element asked
  */
 sosimplist.ElementFactory.prototype.create = function(elementType, options) {
     if(elementType === 'selector'){
        var divSelector = document.createElement('div');
        divSelector.className = 'sosimplist-item-selector';
        return divSelector;
     }
     else if(elementType === 'checkbox'){
        var inputCheckbox = document.createElement('input');
        inputCheckbox.className = 'sosimplist-item-checkbox';
        inputCheckbox.type = 'checkbox';
        inputCheckbox.checked = options.checked;
        inputCheckbox.addEventListener('change', options.change, false);
        return inputCheckbox;
     }
     else if(elementType === 'text'){
        var inputText = document.createElement('div');
        inputText.id = options.id;
        inputText.className = options.className+' sosimplist-editable';
        //enable eddition
        if (options.edit) {
            inputText.contentEditable = true;
        }
        else {
            inputText.className += ' sosimplist-edit-false';
        }
        inputText.setAttribute('placeholder', options.placeholder);
        inputText.addEventListener('keyup', options.keyup, false);
        inputText.addEventListener(
          'keydown',
          sosimplist.EventStrategy.key.enter.stop,
          false
        );
        inputText.addEventListener(
          'keypress',
          sosimplist.EventStrategy.key.enter.stop,
          false
        );
        inputText.innerHTML = options.text;
        return inputText;
     }
     else if(elementType === 'delete'){
        var divDelete = document.createElement('div');
        divDelete.className = 'sosimplist-item-delete';
        divDelete.addEventListener('click',options.click,false);
        return divDelete;
     }
     else if(elementType === 'image'){
        var divImg = document.createElement('div');
        divImg.style.display = 'table-row';
        divImg.className = 'sosimplist-list-row';
        var imgElement = document.createElement('img');
        imgElement.className = 'sosimplist-list-image';
        imgElement.style.display = 'table-cell';s
        imgElement.src = options.src;
        divImg.appendChild(imgElement);
        return divImg;
     }
     else{
         console.error('Element type = ' + elementType + ' not supported yet !');
    }
 }

 /**
 * @private
 * @return {Object}
 */
function ElementFactory_create() {
    return new sosimplist.ElementFactory();
}

sosimplist.elementfactory = ElementFactory_create();