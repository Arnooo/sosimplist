describe("Sosimplist", function() {
  var sosimplist; 

  beforeEach(function() {
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

      expect($('.sosimplist-button')).toBeInDOM(true);
      expect($('.sosimplist-button')).toEqual('input');
      expect($('.sosimplist-button')).toHaveAttr('type', 'button');
     // expect($('.sosimplist-button')).toHaveValue('Add List');
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
