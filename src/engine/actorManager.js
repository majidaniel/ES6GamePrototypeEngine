//All these process
export class ActorManager{
    constructor(scene,actorDefinitions) {
        this.scene = scene;
        this.actorList = [];
        this.actorDefinitions = actorDefinitions;
        this.actorDebugs = {};
        this.heavyDebugMode = true;
    }

    getActorsById(actorId){
        var arr = [];
        for(var i = 0; i < this.actorList.length; i++){
            if(this.actorList[i].definitionId == actorId)
                arr.push(this.actorList[i]);
        }
        return arr;
    }

    generateActor(actorProperties){
        var actorDefinition = this.actorDefinitions.getDefinition(actorProperties.definitionId);
        if(actorDefinition.display){
          for(var i = 0; i < actorDefinition.display.length; i++){
            if(actorDefinition.display[i].type == "image"){   
              //this.load.image(actorProperties.id, actorProperties.display.url);
              var actor = this.scene.physics.add.image(actorProperties.initialLocation.x,actorProperties.initialLocation.y, actorDefinition.id);
              actor.setDisplaySize(actorDefinition.display[i].imageWidth ? actorDefinition.display[i].imageWidth : 50, actorDefinition.display[i].imageHeight ? actorDefinition.display[i].imageHeight : 50);
              actor.setInteractive();
              actor.behaviors = actorDefinition.behaviors;
            }
          }
        }else{
          var actor = {behaviors: actorDefinition.behaviors};
        }
        if(actorDefinition.eventMappings){
          for(var i = 0; i < actorDefinition.eventMappings.length; i++){
            this.scene.eventManager.registerListener(actor,actorDefinition.eventMappings[i].eventKey,this.scene.sceneBehaviors[actorDefinition.eventMappings[i].behavior]);
          }
        }
        //Merge actor properties onto actor
        for(var prop in actorProperties)
          actor[prop] = actorProperties[prop];
        this.actorList.push(actor);
        var self = this;
        actor.recordDecision = function(key,msg){ self.recordDecision(actor,key,msg)};
      }

      removeActor(actor){
          for(var i = 0; i < this.actorList.length; i++){
              if(this.actorList[i] == actor)
                this.actorList.splice(i,1);
          }
      }
  
      preloadActor(actorProperties){
        if(actorProperties.display){
          for(var i = 0; i < actorProperties.display.length; i++){
            if(actorProperties.display[i].type == "image"){
              this.scene.load.image(actorProperties.id, actorProperties.display[i].url);
            }
          }
        }
      }

      recordDecision(actor,key,msg){
        if(this.heavyDebugMode){
          if(!this.actorDebugs[actor]) this.actorDebugs[actor] = [];
          this.actorDebugs[actor].push(key+ ": " + msg);
        }else{
          if(!this.actorDebugs[actor]) this.actorDebugs[actor] = [];
          this.actorDebugs[actor][key] = msg;
        }
        
      }
}