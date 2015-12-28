describe("List", function() {
  var list;

  beforeEach(function() {
    list = new List();
  });

  it("should be initialized", function() {
    expect(list.getView()).toEqual(null);
    expect(list.getId()).toEqual(list.id_);
    expect(list.title_).toEqual('');
    expect(list.checkedVisible_).toEqual(false);
    expect(list.dropdownButtonVisible_).toEqual(false);
    expect(list.dragData).toEqual(null);

    //test addItem
    expect(list.mapOfItem_).not.toEqual({});

  });
});
