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
    itemsimple = new ItemSimple(parent);
    spyOn(parent, "dispatch");
  });

  it("should be initialized", function() {
    var itemId = itemsimple.getId();

    expect(itemsimple.getView()).toEqual(null);
    expect(itemsimple.getId()).toEqual(itemsimple.id_);
    expect(itemsimple.isChecked()).toEqual(false);
    expect(itemsimple.text_).toEqual('');
   // expect(itemsimple.parent_).toEqual(undefined);
  });

  describe("when view is build", function() {
    beforeEach(function() {
      itemsimple.buildView();
      setFixtures(itemsimple.getView());
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
      expect($('.sosimplist-item-text')).toEqual('input');
      expect($('.sosimplist-item-text')).toHaveAttr('type', 'text');
      expect($('.sosimplist-item-text')).toHaveAttr('placeholder', 'write something');
      expect($('.sosimplist-item-text')).toHaveValue('');

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
        $('.sosimplist-item-text').val('Task 1');
      });

      it("should change the text displayed", function() {
        expect($('.sosimplist-item-text')).toHaveValue('Task 1');
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
  });
});
