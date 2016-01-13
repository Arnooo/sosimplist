/**
 * Event strategy object
 * This object synthetise events function do execute
 */
 sosimplist.EventStrategy = {
    key:{
        enter:{
            stop:function(event, done){
                if(event.keyCode === 13){
                    event.preventDefault();
                    event.stopPropagation();
                    if(done){done();};
                }
                else{
                    //Do nothing
                }
            }
        },
        not:{
            enter:{
                todo:function(event, done){
                    if(event.keyCode !== 13 && done){
                        done();
                    }
                    else{
                        //Do nothing
                    }
                }
            }
        }
    }
};