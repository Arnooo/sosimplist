describe("ItemBase", function() {
  var parent;
  var itembase;

  beforeEach(function() {
    var Parent = function(){};
    Parent.prototype.dispatch = function(eventName, data) {};
    Parent.createInstance = function() {
      return new Parent();
    };
    parent = Parent.createInstance();
    itembase = new ItemBase(parent, {edit:true});
    spyOn(parent, "dispatch");
    spyOn(console, 'error');
  });

  it("should be initialized with default values", function() {
    expect(itembase.getView()).toEqual(null);
    expect(itembase.getId()).toEqual(itembase.id_);
    expect(itembase.isChecked()).toEqual(false);
    expect(itembase.text_).toEqual('');
    expect(itembase.parent_).toEqual(parent);
  });

  it("should fail on calling check_ function", function() {
    itembase.check_(false);
    expect(console.error).toHaveBeenCalled();
  });

  describe("when view is builded", function() {
    beforeEach(function() {
      itembase.buildBase();
      setFixtures(itembase.getView());
    });

    it("should not initialized a second time the view calling buildView", function() {
      itembase.buildBase();
      expect(console.error).toHaveBeenCalled();
    });

    it("should fail on calling check_ function with wrong parameter", function() {
      itembase.check_(null);
      expect(console.error).toHaveBeenCalled();
    });

    it("should initialized the view", function() {
      expect(itembase.getView()).not.toEqual(null);
      
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
        expect(itembase.isChecked()).toEqual(true);
        expect($('.sosimplist-item-checkbox').is(":checked")).toBe(true);
      });
      it("should hide the selector", function() {
        expect($('.sosimplist-item-selector')).toHaveCss({visibility: "hidden"});
      });
      it("should dispatch event to parent", function() {
        expect(parent.dispatch).toHaveBeenCalledWith('moveItem', itembase);
      });
    });

    describe("when item text changed", function() {
      beforeEach(function() {
        $('.sosimplist-item-text')[0].innerHTML = 'A';
        $('.sosimplist-item-text').simulate('keyup');
      });

      it("should change the text displayed", function() {
        expect($('.sosimplist-item-text')[0].innerHTML).toEqual('A');
        expect(itembase.text_).toEqual('A');
      });
    });    

    describe("when item is deleted", function() {
      beforeEach(function() {
        $('.sosimplist-item-delete').trigger('click');
      });

      it("should dispatch event to parent", function() {
        expect(parent.dispatch).toHaveBeenCalledWith('removeItem', itembase);
      });
    });

    describe("when item is serialized", function() {
      it("should return an object which contains the main data", function() {
        var data = itembase.serializeBase();
        var shouldBeData = {
            checked: itembase.checked_,
            text: itembase.text_
        };
        expect(data).toEqual(shouldBeData);
      });
    });

    describe("when item is unserialized", function() {
      it("should extract data and initialize the item", function() {    
        var inputData = {
            checked: itembase.checked_,
            text: itembase.text_
        };    
        itembase.unserializeBase(inputData);
        expect(itembase.checked_).toEqual(inputData.checked);
        expect(itembase.text_).toEqual(inputData.text);
      });

      it("should fail when we do not send data to extract in parameter", function() { 
        itembase.unserializeBase();
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
        itembase.unserializeBase(inputData);
        itembase.buildBase();
        setFixtures(itembase.getView());
    });

    it("should initialize the text", function() {
      expect(itembase.text_).toEqual('InitText');
      expect($('.sosimplist-item-text')[0].innerHTML).toEqual('InitText');
    });
    it("should initialize the checkbox", function() {
      expect(itembase.isChecked()).toEqual(true);
      expect($('.sosimplist-item-checkbox').is(":checked")).toBe(true);
    });
  });
});
