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
                    if(done){done()};
                }
                else{
                    //Do nothing
                }
            }
        },
        not:{
            enter:{
                do:function(event, done){
                    if(event.keyCode !== 13 && done){
                        done();
                    }
                    else{
                        //Do nothing
                    }
                }
            }
        }
    },
    dragstart:function(event, opt) {
        var dragData = null;
        if (event.target.classList.contains(opt.source)) {
            var parentToDrag = event.target.closest(opt.closest);
            parentToDrag.style.zIndex = 1;
            parentToDrag.style.boxShadow = '3px 3px 3px grey';
            dragData = {
                elementId: parentToDrag.id,
                source: opt.source
            };

            var mask = document.createElement('div');
            mask.id = 'mask';
            mask.style.backgroundColor = 'red'; //To check if opacity is working
            mask.style.opacity = 0; // Should be not visible with opacity = 0
            mask.style.width = parentToDrag.clientWidth;
            mask.style.height = parentToDrag.clientHeight;
            mask.style.cursor = 'move';
            document.body.appendChild(mask);
            event.dataTransfer.setDragImage(mask, 0, 0);
        }
        else {
            //Do nothing
        }
        return dragData;
    },
    dragenter:function(event, dragData, opt) {
        event.preventDefault();
        if (dragData && dragData.source === opt.source) {
            var elementDragged = document.getElementById(dragData.elementId);
            var parentTarget = event.target.closest(opt.closest);
            if (elementDragged && parentTarget) {
                var isContainInThisList = parentTarget.parentNode.contains(elementDragged);
                if (isContainInThisList) {
                    elementDragged.nextSibling === parentTarget ?
                    elementDragged.parentNode.insertBefore(elementDragged, parentTarget.nextSibling) :
                    elementDragged.parentNode.insertBefore(elementDragged, parentTarget);
                }
                else {
                    //Do nothing
                }
            }
            else {
                //Do nothing
            }
        }
        else {
            //Do nothing
        }
    },
    drop:function(event, dragData, opt) {
        if (dragData && dragData.source === opt.source) {
            var elementDragged = document.getElementById(dragData.elementId);
            if (elementDragged) {
                document.body.removeChild(document.getElementById('mask'));
                elementDragged.style.boxShadow = '';
                elementDragged.style.zIndex = '0';
            }
            else {
                //Do nothing
            }
        }
        else {
            //Do nothing
        }
    }
};