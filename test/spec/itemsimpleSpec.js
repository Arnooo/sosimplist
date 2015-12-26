describe("ItemSimple", function() {
  var itemsimple;

  beforeEach(function() {
    itemsimple = new ItemSimple();
  });

  it("should be initialized", function() {
    var itemId = itemsimple.getId();

    expect(itemsimple.getView()).toEqual(null);
    expect(itemsimple.getId()).toEqual(itemsimple.id_);
    expect(itemsimple.isChecked()).toEqual(false);
    expect(itemsimple.text_).toEqual('');
    expect(itemsimple.parent_).toEqual(undefined);
  });

  describe("when view is build", function() {
    beforeEach(function() {
      itemsimple.buildView();
      setFixtures(itemsimple.getView());
    });

    it("should initialized the view", function() {
      var view = itemsimple.getView();
      var itemId = itemsimple.getId();
      expect(view).not.toEqual(null);
      expect(view.id).toEqual(itemId);
      expect(view.className).toEqual('sosimplist-item');
    });

    describe("when item is checked", function() {
      beforeEach(function() {
        $('.sosimplist-item-checkbox').trigger('click');
      });

      it("should checked the checkbox", function() {
        expect(itemsimple.isChecked()).toEqual(true);
        expect($('.sosimplist-item-checkbox').is(":checked")).toBe(true);
      });
    });
  });
});
