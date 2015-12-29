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

    describe("when add item button is clicked", function() {
      beforeEach(function() {
        $('#sosimplist-button-add-item').trigger('click');
      });

      it("should add an item to the list", function() {
        var count = 0;
        for (var itemId in list.mapOfItem_) {
            count++;
        }
        expect(count).toEqual(2);
      });
    });

    describe("when dropdown menu (which hide checked item) is clicked", function() {
      beforeEach(function() {
        $('.sosimplist-list-dropdown-checked').trigger('click');
      });

      it("should show the list of checked elements", function() {
        expect(list.checkedVisible_).toEqual(true);
        expect($('.sosimplist-container-item-checked')[0].style.display).toEqual('');
      });

      it("should hide the list of checked elements when clicked again", function() {
        $('.sosimplist-list-dropdown-checked').trigger('click');
        expect(list.checkedVisible_).toEqual(false);
        expect($('.sosimplist-container-item-checked')[0].style.display).toEqual('none');
      });
    });



    describe("when an item is removed", function() {
      beforeEach(function() {
        for (var itemId in list.mapOfItem_) {
            list.dispatch('removeItem', list.mapOfItem_[itemId]);
        }
      });

      it("should remove an item from the list", function() {
        expect(list.mapOfItem_).toEqual({});
      });

      it("should hide the dropdown menu if there is no more item checked to display", function() {
        expect(list.checkedVisible_).toEqual(false);
        expect($('.sosimplist-container-item-checked')[0].style.display).toEqual('none');
        expect($('.sosimplist-list-dropdown-checked')[0].style.display).toEqual('none');
      });
    });

    describe("when list is serialized", function() {
      it("should return a JSON object which contains the main data", function() {
        var data = list.serialize();
        var shouldBeData = {
            id_: list.id_,
            title_: list.title_,
            arrayOfItem_: []
        };   
        for (var itemId in list.mapOfItem_) {
            shouldBeData.arrayOfItem_.push(list.mapOfItem_[itemId].serialize());
        }
        expect(data).toEqual(JSON.stringify(shouldBeData));
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
        list.unserialize(JSON.stringify(inputData));
        expect(list.getId()).toEqual(inputData.id_);
        expect(list.title_).toEqual(inputData.title_);
      });

      it("should fail when we do not send data to extract in parameter", function() { 
        list.unserialize();
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
    describe("when data are unserialized and view is build", function() {
        beforeEach(function() {
            var inputData = {
                id_: 1234,
                title_: 'Title Test',
                arrayOfItem_: []
            };    
            for (var itemId in list.mapOfItem_) {
                inputData.arrayOfItem_.push(list.mapOfItem_[itemId].serialize());
            }
            list.unserialize(JSON.stringify(inputData));
            list.buildView();
            setFixtures(list.getView());
        });

        it("should initialize the Title", function() {
          expect(list.title_).toEqual('Title Test');
          expect($('.sosimplist-title')).toHaveValue('Title Test');
        });
        it("should initialize the id", function() {
          expect(list.getId()).toEqual(1234);
        });
    });
});
