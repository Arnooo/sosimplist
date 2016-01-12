describe("ItemFactory", function() {
  var itemfactory;
  var itembase;
  var itemtext;

  beforeEach(function() {
    var Parent = function(){};
    Parent.prototype.dispatch = function(eventName, data) {};
    Parent.createInstance = function() {
      return new Parent();
    };
    parent = Parent.createInstance();
//     itembase = new ItemBase(parent, {edit:true});
//     itemtext = new ItemText(parent, {edit:true});
    itemfactory = new ItemFactory();
    spyOn(parent, "dispatch");
    spyOn(console, 'error');
  });

  it("should TODO", function() {
//       itemtext.buildView();
      var item = itemfactory.create('ItemBase');
      console.log(item);
//       itembase.buildView();
      expect(true).toEqual(true);
  });
});
