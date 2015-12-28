describe("List", function() {
  var list; 

  beforeEach(function() {
    list = new List();
    spyOn(console, 'error');
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

  it("should have one default item in the list", function() {
    var count = 0;
    for (var itemId in list.mapOfItem_) {
        expect(list.mapOfItem_[itemId]).toEqual(jasmine.any(ItemSimple));
        count++;
    }
    expect(count).toEqual(1);
  });

  describe("when view is builded", function() {
    beforeEach(function() {
      list.buildView();
      setFixtures(list.getView());
    });

    it("should not initialized a second time the view calling buildView", function() {
      list.buildView();
      expect(console.error).toHaveBeenCalled();
    });

    it("should initialized the view", function() {
      expect(list.getView()).not.toEqual(null);
      
      expect($('.sosimplist-list')).toBeInDOM(true);
      expect($('.sosimplist-list')).toEqual('div');
      expect($('.sosimplist-list')).toHaveAttr('draggable', 'true');

      expect($('.sosimplist-title')).toBeInDOM(true);
      expect($('.sosimplist-title')).toEqual('input');
      expect($('.sosimplist-title')).toHaveAttr('type', 'text');
      expect($('.sosimplist-title')).toHaveAttr('placeholder', 'Title');
      expect($('.sosimplist-title')).toHaveValue('');

      expect($('.sosimplist-container-item')).toBeInDOM(true);
      expect($('.sosimplist-container-item')).toEqual('div');

      expect($('.sosimplist-button')).toBeInDOM(true);
      expect($('.sosimplist-button')).toEqual('input');
      expect($('.sosimplist-button')).toHaveAttr('type', 'button');
      expect($('.sosimplist-button')).toHaveValue('Add item');

      expect($('.sosimplist-list-dropdown-checked')).toBeInDOM(true);
      expect($('.sosimplist-list-dropdown-checked')).toEqual('div');
      expect($('.sosimplist-list-dropdown-checked')).toHaveValue('click');

      expect($('.sosimplist-list-pin')).toBeInDOM(true);
      expect($('.sosimplist-list-pin')).toEqual('div');

      expect($('.sosimplist-list-pin-label')).toBeInDOM(true);
      expect($('.sosimplist-list-pin-label')).toEqual('label');
      expect($('.sosimplist-list-pin-label')[0].innerHTML).toEqual('Selected items');

      expect($('.sosimplist-container-item-checked')).toBeInDOM(true);
      expect($('.sosimplist-container-item-checked')).toEqual('div');
    });

    describe("when list title changed", function() {
      beforeEach(function() {
        $('.sosimplist-title').val('A');
        $('.sosimplist-title').simulate('keyup');
      });

      it("should change the text displayed", function() {
        expect($('.sosimplist-title')).toHaveValue('A');
      });
    }); 

    describe("when list is serialized", function() {
      it("should return a JSON object encoded in base64 which contains the main data", function() {
        var data = list.serialize();
        var shouldBeData = {
            id_: list.id_,
            title_: list.title_,
            arrayOfItem_: []
        };   
        for (var itemId in list.mapOfItem_) {
            shouldBeData.arrayOfItem_.push(list.mapOfItem_[itemId].serialize());
        }
        expect(data).toEqual(btoa(JSON.stringify(shouldBeData)));
      });
    });

    describe("when list is unserialized", function() {
      it("should extract data and initialize the list", function() {    
        var inputData = {
            id_: list.id_,
            title_: list.title_,
            arrayOfItem_: []
        };   
        for (var itemId in list.mapOfItem_) {
            inputData.arrayOfItem_.push(list.mapOfItem_[itemId].serialize());
        }
        list.unserialize(btoa(JSON.stringify(inputData)));
        expect(list.getId()).toEqual(inputData.id_);
        expect(list.title_).toEqual(inputData.title_);
      });

      it("should fail when we do not send data to extract in parameter", function() { 
        list.unserialize();
        expect(console.error).toHaveBeenCalled();
      });
    });

  });

});
