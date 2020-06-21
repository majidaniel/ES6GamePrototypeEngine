import "phaser";
import {Behaviors} from "../engine/behaviors"
import {EventManager} from "../engine/eventManager"
import {UserInputManager} from "../engine/userInputManager"
import { ActorManager } from "../engine/actorManager";

export class GameScene extends Phaser.Scene {
    constructor(sceneKey,actorDefinitions,actorInfo) {
        super({
            key: sceneKey
        });
        this.actorInfo = actorInfo;
        this.actorDefinitions = actorDefinitions;
        this.freeze = false;

        //There be dragons here
        //This section is scanning the behaviors folder, then using reflection to copy functionality there into the behaviors class
        this.sceneBehaviors = new Behaviors();
        const behaviorContext = require.context('../../schema/behaviors', false, /\.js$/);
        var cache = [];
        behaviorContext.keys().forEach(key => cache[key] = behaviorContext(key));
        window.debug = cache;
        for(var key in cache){
           var subBehaviors = new cache[key].Behaviors();
           var functions = Object.getOwnPropertyNames(Object.getPrototypeOf(subBehaviors));
            console.log(functions);
            for(var i = 0; i < functions.length; i++){
              this.sceneBehaviors[functions[i]] = subBehaviors[functions[i]];
            }
        }
    }

    init(params) {
        this.eventManager = new EventManager(this);
        this.UserInputManager = new UserInputManager(this);
        this.actorManager = new ActorManager(this,this.actorDefinitions);
    }
    
    preload() {
      var ads = this.actorDefinitions.getAllDefinitions();
      for(var i in ads){
        this.actorManager.preloadActor(ads[i]);
      }
    }

    create() {
      for(var i = 0; i < this.actorInfo.length; i++){
        this.actorManager.generateActor(this.actorInfo[i]);
      } 
    }
    
    update(time,delta) {
        if(this.freeze)
          return;
        for(var i = 0; i < this.actorManager.actorList.length; i++){
          var actor = this.actorManager.actorList[i];
          for(var j = 0; j < actor.behaviors.length; j++){
              try{
                this.sceneBehaviors[actor.behaviors[j].behavior](this,actor,actor.behaviors[j],delta/1000);
              }catch(e){
                console.log("Behavior actor in "+actor.behaviors[j].behavior + " on actor:");
                console.log(actor);
                console.log(e);
              }
          }
        }

        this.UserInputManager.tick();
    }

    generateActor(props){
      this.actorManager.generateActor(props);
    }

    removeActor(actor){
      this.actorManager.removeActor(actor);
      this.eventManager.removeActor(actor);
      actor.destroy();
    }
    
    saveState(){
      return JSON.stringify(this.actorManager.actorList);
    }
    loadState(state){
      for(var i = 0; i < state.length; i++){
        this.generateActor(state);
      }
    }
};