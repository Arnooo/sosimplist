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
 sosimplist.ElementFactory.prototype.getElementConfiguration = function(elementType, options) {
    var element = {};
    if(elementType === 'selector'){
        element = {
            name: elementType,
            type: elementType,
            view: {
                type: 'div',
                properties: {
                    id: 'sosimplist-item-selector',
                    className: 'sosimplist-item-selector'
                },
                childs:[]
            },
            model: [],
            controller: []
        };
        if(options){
            element.view.properties.id += options.id;
        }
        else{
            //Do nothing
        }
    }
    else if(elementType === 'checkbox'){
        element = {
            name: elementType,
            type: elementType,
            view: {
                type: 'input',
                properties: {
                    id: 'sosimplist-item-checkbox',
                    className: 'sosimplist-item-checkbox',
                    type: 'checkbox',
                    checked:false
                },
                childs:[]
            },
            model: ['checked'], //to be serialized
            controller: [{onEvent:'change',dispatch:'checked'}]
        };
        if(options){
            element.name = options.name;
            element.view.properties.id += options.id;
        }
        else{
            //Do nothing
        }
    }
    else if(elementType === 'text'){
        element = {
            name: elementType,
            type: elementType,
            view: {
                type: 'div',
                properties: {
                    id: 'sosimplist-item-text',
                    className: 'sosimplist-item-text',
                    contentEditable: true,
                    innerHTML:''
                },
                attributes:{
                    placeholder: sosimplist.translate('write something'),
                },
                childs:[]
            },
            model: ['innerHTML'],
            controller: []
        };
        
        if(options){
            element.name = options.name;
            element.view.properties.id += options.id;
            element.view.properties.contentEditable = options.edit;
            element.view.attributes.placeholder = sosimplist.translate(options.content);
            if(options.edit){
                element.view.properties.className += ' sosimplist-editable';
            }
            else{
                element.view.properties.className += ' sosimplist-edit-false';
            }
        }
        else{
            //Do nothing
        }
    }
    else if(elementType === 'number'){
        element = {
            name: elementType,
            type: elementType,
            view: {
                type: 'input',
                properties: {
                    id: 'sosimplist-item-number',
                    className: 'sosimplist-item-number',
                    type: 'number',
                    value: 0
                },
                childs:[]
            },
            model: ['value'], //to be serialized
            controller: [{onEvent:'change',dispatch:'value'}]
        };
        if(options){
            element.name = options.name;
            element.view.properties.id += options.id;
        }
        else{
            //Do nothing
        }
    }
    else if(elementType === 'select'){
        element = {
            name: elementType,
            type: elementType,
            view: {
                type: 'select',
                properties: {
                    id: 'sosimplist-item-select',
                    className: 'sosimplist-item-select',
                    value:''
                },
                childs:[
                    {
                        type: 'option',
                        properties: {
                            text: '---',
                            value: ''
                        }
                    }
                ]
            },
            model: ['value'], //to be serialized
            controller: [{onEvent:'change',dispatch:'value'}]
        };
        if(options){
            element.name = options.name;
            element.view.properties.id += options.id;
        }
        else{
            //Do nothing
        }
    }
    else if(elementType === 'delete'){
        element = {
            name: elementType,
            type: elementType,
            view: {
                type: 'div',
                properties: {
                    id: 'sosimplist-item-delete',
                    className: 'sosimplist-item-delete'
                },
                childs:[]
            },
            model: [],
            controller: [{onEvent:'click',dispatch:'delete'}]
        };
        if(options){
            element.view.properties.id += options.id;
        }
        else{
            //Do nothing
        }
    }
    else{
        //Do nothing
    }
    return element;
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
        var imgElement = document.createElement('img');
        imgElement.className = 'sosimplist-list-image';
        imgElement.style.display = 'table-cell';
        imgElement.src = options.src;
        if(options.position === 'top' ||
           options.position === 'bottom'){
            var divImg = document.createElement('div');
            divImg.style.display = 'table-row';
            divImg.className = 'sosimplist-list-row';
            divImg.appendChild(imgElement);
            return divImg;
        }
        else {
          imgElement.style.height = '100%';
          return imgElement;
        }
        
     }
     else if(elementType === 'button'){
        var buttonElement = document.createElement('input');
        buttonElement.type = 'button';
        buttonElement.className = 'sosimplist-button';
        buttonElement.id = options.id;
        buttonElement.value = options.value;
        buttonElement.addEventListener('click', options.click, false);
        return buttonElement;
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