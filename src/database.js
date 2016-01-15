 
 /**
  * Constant
  */
var E_DB_SERVICE = {
    NONE: 'none',
    URL: 'url',
    FIREBASE: 'firebase'
};

sosimplist.databaseModule = null;

/**
 * @public
 * @constructor
 * @params {object} dbParams use to connect to the database
 */
sosimplist.DefaultDatabaseModule = function(dbParams){
    var self_ = this;
    self_.dbParams_ = dbParams;
}

/**
 * @public
 * @params {string} dataName to get from database
 */
sosimplist.DefaultDatabaseModule.prototype.get = function(dataName){
    var self_ = this;
    var dataToUnserialize = null;
    if(self_.dbParams_.dbService === E_DB_SERVICE.URL){
        var hrefArray = window.location.href.split('#');
        if(hrefArray[1]){
            dataToUnserialize = atob(hrefArray[1]);
        }
        else{
            //Do nothing
        }
    }
    else if(self_.dbParams_.dbService === E_DB_SERVICE.FIREBASE){
        //Do nothing yet
    }
    //E_DB_SERVICE.None
    else{
        if(self_.dbParams_.dbData &&
           self_.dbParams_.dbData.length>0){
            dataToUnserialize = JSON.stringify(self_.dbParams_.dbData);
        }
        else{
            //Do nothing
        }
    }
    return dataToUnserialize;
}

/**
 * @private
 * @param {string} data to set
 */
sosimplist.DefaultDatabaseModule.prototype.set = function(data) {
    var self_ = this;
    if(self_.dbParams_.dbService === E_DB_SERVICE.URL){
        window.location.href = window.location.href.split('#')[0] + '#' + btoa(data);
    }
    else if(self_.dbParams_.dbService === E_DB_SERVICE.FIREBASE){
        //Do nothing yet
    }
    //E_DB_SERVICE.None
    else{
        //Do nothing 
    }
};
