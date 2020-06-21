
//All these process
export class EventManager{
    constructor(scene) {
        this.scene = scene;
        this.eventListeners = [];
    }

    registerListener(actor,eventKey,listenerFunction){
        window.regDebug = listenerFunction;
        if(listenerFunction instanceof Function){
            if(!this.eventListeners[eventKey])
                this.eventListeners[eventKey] = [];
            this.eventListeners[eventKey].push({actor:actor,function:listenerFunction});
        }else{
            console.log("ERROR: invalid function submitted");
            console.log("-- Actor:"); console.log(actor);
            console.log("-- Key:"); console.log(eventKey);
            console.log("-- Listener function:"); 
            console.log(listenerFunction);
            return;
        }
    }

    removeActor(actor){
        for(var i = 0; i < this.eventListeners.length; i++){
            if(this.eventListeners[i].actor == actor)
                this.eventListeners.splice(i,1);
        }
    }

    triggerEvent(eventKey,eventPayload,sourceActor){
        //Include source actor in event payload
        if(! eventPayload) eventPayload = {};
        eventPayload.sourceActor = sourceActor;
        if(this.eventListeners[eventKey]){
            for(var i = 0; i < this.eventListeners[eventKey].length; i++){
                try{
                    this.eventListeners[eventKey][i].function(this.scene,this.eventListeners[eventKey][i].actor,eventPayload,0);
                }catch(e){
                    console.log("Error triggering event " + eventKey + " on actor:");
                    console.log(this.eventListeners[eventKey][i]);
                    console.log(e);
                }
            }
        }
    }
}