describe("ItemSimple", function() {
  var parent;
  var itemsimple;

  beforeEach(function() {
    var Parent = function(){};
    Parent.prototype.dispatch = function(eventName, data) {};
    Parent.createInstance = function() {
      return new Parent();
    };
    parent = Parent.createInstance();
    itemsimple = new ItemSimple(parent, {edit:true});
    spyOn(parent, "dispatch");
    spyOn(console, 'error');
  });

  it("should be initialized with default values", function() {
    expect(itemsimple.getView()).toEqual(null);
    expect(itemsimple.getId()).toEqual(itemsimple.id_);
    expect(itemsimple.isChecked()).toEqual(false);
    expect(itemsimple.text_).toEqual('');
    expect(itemsimple.parent_).toEqual(parent);
  });

  it("should fail on calling check_ function", function() {
    itemsimple.check_(false);
    expect(console.error).toHaveBeenCalled();
  });

  describe("when view is builded", function() {
    beforeEach(function() {
      itemsimple.buildView();
      setFixtures(itemsimple.getView());
    });

    it("should not initialized a second time the view calling buildView", function() {
      itemsimple.buildView();
      expect(console.error).toHaveBeenCalled();
    });

    it("should fail on calling check_ function with wrong parameter", function() {
      itemsimple.check_(null);
      expect(console.error).toHaveBeenCalled();
    });

    it("should initialized the view", function() {
      expect(itemsimple.getView()).not.toEqual(null);
      
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
        expect(itemsimple.isChecked()).toEqual(true);
        expect($('.sosimplist-item-checkbox').is(":checked")).toBe(true);
      });
      it("should hide the selector", function() {
        expect($('.sosimplist-item-selector')).toHaveCss({visibility: "hidden"});
      });
      it("should dispatch event to parent", function() {
        expect(parent.dispatch).toHaveBeenCalledWith('moveItem', itemsimple);
      });
    });

    describe("when item text changed", function() {
      beforeEach(function() {
        $('.sosimplist-item-text')[0].innerHTML = 'A';
        $('.sosimplist-item-text').simulate('keyup');
      });

      it("should change the text displayed", function() {
        expect($('.sosimplist-item-text')[0].innerHTML).toEqual('A');
        expect(itemsimple.text_).toEqual('A');
      });
    });    

    describe("when item is deleted", function() {
      beforeEach(function() {
        $('.sosimplist-item-delete').trigger('click');
      });

      it("should dispatch event to parent", function() {
        expect(parent.dispatch).toHaveBeenCalledWith('removeItem', itemsimple);
      });
    });

    describe("when item is serialized", function() {
      it("should return an object which contains the main data", function() {
        var data = itemsimple.serialize();
        var shouldBeData = {
            checked: itemsimple.checked_,
            text: itemsimple.text_
        };
        expect(data).toEqual(shouldBeData);
      });
    });

    describe("when item is unserialized", function() {
      it("should extract data and initialize the item", function() {    
        var inputData = {
            checked: itemsimple.checked_,
            text: itemsimple.text_
        };    
        itemsimple.unserialize(inputData);
        expect(itemsimple.checked_).toEqual(inputData.checked);
        expect(itemsimple.text_).toEqual(inputData.text);
      });

      it("should fail when we do not send data to extract in parameter", function() { 
        itemsimple.unserialize();
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
        itemsimple.unserialize(inputData);
        itemsimple.buildView();
        setFixtures(itemsimple.getView());
    });

    it("should initialize the text", function() {
      expect(itemsimple.text_).toEqual('InitText');
      expect($('.sosimplist-item-text')[0].innerHTML).toEqual('InitText');
    });
    it("should initialize the checkbox", function() {
      expect(itemsimple.isChecked()).toEqual(true);
      expect($('.sosimplist-item-checkbox').is(":checked")).toBe(true);
    });
  });
});
