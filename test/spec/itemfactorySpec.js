describe("ItemFactory", function() {

  beforeEach(function() {
    var Parent = function(){};
    Parent.prototype.dispatch = function(eventName, data) {};
    Parent.createInstance = function() {
      return new Parent();
    };
    parent = Parent.createInstance();
    spyOn(parent, "dispatch");
    spyOn(console, 'error');
  });

  it("should be able to create an ItemText with correct options", function() {
      var itemtext = sosimplist.itemfactory.create('ItemText', parent, {edit:false, id:12});
      expect(itemtext.id_).toEqual('sosimplist-item'+12);
      expect(itemtext.parent_).toEqual(parent);
      expect(itemtext.focusOnElementId_).toEqual('sosimplist-item-text'+12);
  });

  it("should be able to create an ItemTextComment with correct options", function() {
      var itemtext = sosimplist.itemfactory.create('ItemTextComment', parent, {edit:false, id:123});
      expect(itemtext.id_).toEqual('sosimplist-item'+123);
      expect(itemtext.parent_).toEqual(parent);
      expect(itemtext.focusOnElementId_).toEqual('sosimplist-item-text'+123);
  });
});
