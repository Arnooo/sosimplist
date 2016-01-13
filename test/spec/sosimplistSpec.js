describe("sosimplist.Manager", function() {

  beforeEach(function() {
    sosimplist.mgr = Sosimplist_create(); 
    spyOn(console, 'error');
  });

  it("should be initialized", function() {
    expect(sosimplist.mgr.getView()).toEqual(null);
    expect(sosimplist.mgr.getId()).toEqual(sosimplist.mgr.viewId_);

    //test addItem
    expect(sosimplist.mgr.mapOfList_).toEqual({});
  });

  describe("when view is builded", function() {
    beforeEach(function() {
      setFixtures('<div id=myView></div>');
      sosimplist.init('myView', {save:E_SAVE_IN.NONE});
      setFixtures(sosimplist.mgr.getView());
    });

    it("should not initialized a second time the view calling buildView", function() {
      sosimplist.init();
      expect(console.error).toHaveBeenCalled();
    });

    it("should initialized the view", function() {

      expect(sosimplist.mgr.options_).toEqual({data:[],save:E_SAVE_IN.NONE, edit:true, checkable : true});

      expect(sosimplist.mgr.getView()).not.toEqual(null);
      
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
        for (var listId in sosimplist.mgr.mapOfList_) {
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
          for (var listId in sosimplist.mgr.mapOfList_) {
              count++;
          }
          expect(count).toEqual(0);
          expect($('.sosimplist-container-list')[0].children.length).toEqual(0);
        });
      });
    });

    describe("when sosimplist is serialized", function() {
      it("should return a JSON object encoded which contains the main data", function() {
        var data = sosimplist.mgr.serialize();
        var shouldBeData = [];
        expect(data).toEqual(JSON.stringify(shouldBeData));
      });
    });

    describe("when sosimplist is unserialized", function() {
      it("should extract data and initialize the sosimplist object", function() {    
        var inputData = [];
        sosimplist.mgr.unserialize(JSON.stringify(inputData));
        expect(sosimplist.mgr.mapOfList_).toEqual({});
      });

      it("should fail when we do send empty or corrupted data to extract in parameter", function() { 
        sosimplist.mgr.unserialize({});
        expect(console.error).toHaveBeenCalled();
      });
      
      it("should fail when we do not send data to extract in parameter", function() { 
          sosimplist.mgr.unserialize();
          expect(console.error).toHaveBeenCalled();
      });
    });

  });

  describe("when view is builded with options {edit:false}", function() {
    beforeEach(function() {
      setFixtures('<div id=myView></div>');
      sosimplist.init('myView', {edit:false});
      setFixtures(sosimplist.mgr.getView());
    });

    it("should init list mangager with correct options", function() {
      expect(sosimplist.mgr.options_.edit).toEqual(false);
    });

  });

  describe("when view is builded with options which does not exist", function() {
    beforeEach(function() {
      setFixtures('<div id=myView></div>');
      sosimplist.init('myView', {patate:'frite'});
      setFixtures(sosimplist.mgr.getView());
    });

    it("should fail", function() {
      expect(console.error).toHaveBeenCalled();
    });

  });
});
