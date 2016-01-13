describe("ItemText", function() {
  var parent;
  var itemtext;

  beforeEach(function() {
    var Parent = function(){};
    Parent.prototype.dispatch = function(eventName, data) {};
    Parent.createInstance = function() {
      return new Parent();
    };
    parent = Parent.createInstance();
    itemtext = new sosimplist.ItemText(parent, {edit:true});
    spyOn(parent, "dispatch");
    spyOn(console, 'error');
  });

  it("should be initialized with default values", function() {
    expect(itemtext.getView()).toEqual(null);
    expect(itemtext.getId()).toEqual(itemtext.id_);
    expect(itemtext.isChecked()).toEqual(false);
    expect(itemtext.text_).toEqual('');
    expect(itemtext.parent_).toEqual(parent);
  });

  it("should fail on calling check_ function", function() {
    itemtext.check_(false);
    expect(console.error).toHaveBeenCalled();
  });

  describe("when view is builded", function() {
    beforeEach(function() {
      itemtext.buildView();
      setFixtures(itemtext.getView());
    });

    it("should not initialized a second time the view calling buildView", function() {
      itemtext.buildView();
      expect(console.error).toHaveBeenCalled();
    });

    it("should fail on calling check_ function with wrong parameter", function() {
      itemtext.check_(null);
      expect(console.error).toHaveBeenCalled();
    });

    it("should initialized the view", function() {
      expect(itemtext.getView()).not.toEqual(null);
      
      expect($('.sosimplist-item')).toBeInDOM(true);
      expect($('.sosimplist-item')).toEqual('div');
      expect($('.sosimplist-item')).toHaveAttr('draggable', 'true');

      expect($('.sosimplist-item-selector')).toBeInDOM(true);
      expect($('.sosimplist-item-selector')).toEqual('div');
      expect($('.sosimplist-item-selector')).toHaveCss({visibility: "visible"});

      expect($('.sosimplist-item-checkbox')).toBeInDOM(true);
      expect($('.sosimplist-item-checkbox')).toEqual('input');
      expect($('.sosimplist-item-checkbox')).toHaveAttr('type', 'checkbox');
      expect($('.sosimplist-item-checkbox').is(":checked")).toBe(false);

      expect($('.sosimplist-item-text')).toBeInDOM(true);
      expect($('.sosimplist-item-text')).toEqual('div');
      expect($('.sosimplist-item-text')).toHaveAttr('contentEditable', 'true');
      expect($('.sosimplist-item-text')).toHaveAttr('placeholder', 'write something');
      expect($('.sosimplist-item-text')[0].innerHTML).toEqual('');

      expect($('.sosimplist-item-delete')).toBeInDOM(true);
      expect($('.sosimplist-item-delete')).toEqual('div');
    });

    describe("when item is checked", function() {
      beforeEach(function() {
        $('.sosimplist-item-checkbox').trigger('click');
      });

      it("should checked the checkbox", function() {
        expect(itemtext.isChecked()).toEqual(true);
        expect($('.sosimplist-item-checkbox').is(":checked")).toBe(true);
      });
      it("should hide the selector", function() {
        expect($('.sosimplist-item-selector')).toHaveCss({visibility: "hidden"});
      });
      it("should dispatch event to parent", function() {
        expect(parent.dispatch).toHaveBeenCalledWith('moveItem', itemtext);
      });
    });

    describe("when item text changed", function() {
      beforeEach(function() {
        $('.sosimplist-item-text')[0].innerHTML = 'A';
        $('.sosimplist-item-text').simulate('keyup');
      });

      it("should change the text displayed", function() {
        expect($('.sosimplist-item-text')[0].innerHTML).toEqual('A');
        expect(itemtext.text_).toEqual('A');
      });
    });    

    describe("when item is deleted", function() {
      beforeEach(function() {
        $('.sosimplist-item-delete').trigger('click');
      });

      it("should dispatch event to parent", function() {
        expect(parent.dispatch).toHaveBeenCalledWith('removeItem', itemtext);
      });
    });

    describe("when item is serialized", function() {
      it("should return an object which contains the main data", function() {
        var data = itemtext.serialize();
        var shouldBeData = {
            checked: itemtext.checked_,
            text: itemtext.text_
        };
        expect(data).toEqual(shouldBeData);
      });
    });

    describe("when item is unserialized", function() {
      it("should extract data and initialize the item", function() {    
        var inputData = {
            checked: itemtext.checked_,
            text: itemtext.text_
        };    
        itemtext.unserialize(inputData);
        expect(itemtext.checked_).toEqual(inputData.checked);
        expect(itemtext.text_).toEqual(inputData.text);
      });

      it("should fail when we do not send data to extract in parameter", function() { 
        itemtext.unserialize();
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  describe("when data are unserialized and view is build", function() {
    beforeEach(function() {
        var inputData = {
            checked: true,
            text: 'InitText'
        };    
        itemtext.unserialize(inputData);
        itemtext.buildView();
        setFixtures(itemtext.getView());
    });

    it("should initialize the text", function() {
      expect(itemtext.text_).toEqual('InitText');
      expect($('.sosimplist-item-text')[0].innerHTML).toEqual('InitText');
    });
    it("should initialize the checkbox", function() {
      expect(itemtext.isChecked()).toEqual(true);
      expect($('.sosimplist-item-checkbox').is(":checked")).toBe(true);
    });
  });
});
