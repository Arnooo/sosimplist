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
      var itemtext = itemfactory.create('ItemText', parent, {edit:false, checkable:false});
      expect(itemtext.options_.edit).toEqual(false);
      expect(itemtext.parent_).toEqual(parent);
      expect(itemtext.options_.checkable).toEqual(false);
  });

  it("should be able to create an ItemTextComment with correct options", function() {
      var itemtext = itemfactory.create('ItemTextComment', parent, {edit:false, checkable:false});
      expect(itemtext.options_.edit).toEqual(false);
      expect(itemtext.parent_).toEqual(parent);
      expect(itemtext.options_.checkable).toEqual(false);
  });
});
