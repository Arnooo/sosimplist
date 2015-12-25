describe("ItemSimple", function() {
  var itemsimple;

  beforeEach(function() {
    itemsimple = new ItemSimple();
  });

  it("should be initialized", function() {
    expect(itemsimple.getView()).toEqual(null);
  });

  describe("when view is build", function() {
    beforeEach(function() {
      itemsimple.buildView();
    });

    it("should initialized the view", function() {
      var itemsimple2 = new ItemSimple();
      itemsimple2.buildView();
      console.log(itemsimple2);
        expect(itemsimple2.getView()).not.toEqual(null);
    });
  });
});
