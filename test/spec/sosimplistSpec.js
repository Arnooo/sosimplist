describe("Sosimplist", function() {
  var sosimplist; 

  beforeEach(function() {
    SAVE_DATA_IN_URL = 0;
    sosimplist = new Sosimplist();
    spyOn(console, 'error');
  });

  it("should be initialized", function() {
    expect(sosimplist.getView()).toEqual(null);
    expect(sosimplist.getId()).toEqual(sosimplist.viewId_);

    //test addItem
    expect(sosimplist.mapOfList_).toEqual({});
  });

  describe("when view is builded", function() {
    beforeEach(function() {
      setFixtures('<div id=myView></div>');
      sosimplist.init('myView');
      setFixtures(sosimplist.getView());
    });

    it("should not initialized a second time the view calling buildView", function() {
      sosimplist.init();
      expect(console.error).toHaveBeenCalled();
    });

    it("should initialized the view", function() {
      expect(sosimplist.getView()).not.toEqual(null);
      
      expect($('.sosimplist-container-list')).toBeInDOM(true);
      expect($('.sosimplist-container-list')).toEqual('div');

      expect($('#sosimplist-button-add-list')).toBeInDOM(true);
      expect($('#sosimplist-button-add-list')).toEqual('input');
      expect($('#sosimplist-button-add-list')).toHaveAttr('type', 'button');
      expect($('#sosimplist-button-add-list')).toHaveValue('Add list');

      expect($('#sosimplist-button-clear')).toBeInDOM(true);
      expect($('#sosimplist-button-clear')).toEqual('input');
      expect($('#sosimplist-button-clear')).toHaveAttr('type', 'button');
      expect($('#sosimplist-button-clear')).toHaveValue('Clear');
    });

    describe("when add list button is clicked", function() {
      beforeEach(function() {
        $('#sosimplist-button-add-list').trigger('click');
      });

      it("should add list", function() {
        var count = 0;
        for (var listId in sosimplist.mapOfList_) {
            count++;
        }
        expect(count).toEqual(1);
        expect($('.sosimplist-container-list')[0].children.length).toEqual(1);
      });

      describe("when clear button is clicked", function() {
        beforeEach(function() {
          $('#sosimplist-button-clear').trigger('click');
        });

        it("should remove all lists", function() {
          var count = 0;
          for (var listId in sosimplist.mapOfList_) {
              count++;
          }
          expect(count).toEqual(0);
          expect($('.sosimplist-container-list')[0].children.length).toEqual(0);
        });
      });
    });

    describe("when sosimplist is serialized", function() {
      it("should return a JSON object encoded in base64 which contains the main data", function() {
        var data = sosimplist.serialize();
        var shouldBeData = {
            viewId_: sosimplist.viewId_,
            mapOfList_: {}
        };  
        expect(data).toEqual(btoa(JSON.stringify(shouldBeData)));
      });
    });

    describe("when sosimplist is unserialized", function() {
      it("should extract data and initialize the sosimplist object", function() {    
        var inputData = {
            viewId_: sosimplist.viewId_,
            mapOfList_: {}
        }; 
        sosimplist.unserialize(btoa(JSON.stringify(inputData)));
        expect(sosimplist.getId()).toEqual(inputData.viewId_);
      });

      it("should fail when we do not send data to extract in parameter", function() { 
        sosimplist.unserialize();
        expect(console.error).toHaveBeenCalled();
      });
    });

  });

});
