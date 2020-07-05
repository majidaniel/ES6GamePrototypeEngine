import "phaser";
import {GameScene} from "./engine/gameScene"

export class BaseGame extends Phaser.Game {
  constructor(gameConfig) {
    super(gameConfig);
  }
}

export class ActorDefinitions {
  constructor(){
    this.definitions = [];
  }
  parseDefinitions(definitionArray){
    for(var i = 0; i < definitionArray.length; i++){
      this.definitions[definitionArray[i].id] = definitionArray[i];
    }
  }
  getDefinition(actorId){
    return this.definitions[actorId];
  }
  getAllDefinitions(){
    return this.definitions;
  }
}

window.onload = () => {
  //Parse out definitions
  var actorDefinitions = new ActorDefinitions();

  //Load in all definition jsons from definition folder
  var rawSchemaDefinitions = [];
  const definitionContext = require.context('../schema/definitions', false, /\.json$/);
  definitionContext.keys().forEach((key) => {
    const obj = definitionContext(key);
    for(var i = 0; i < obj.length; i++){
      rawSchemaDefinitions.push(obj[i]);
    }  
  });
  
  actorDefinitions.parseDefinitions(rawSchemaDefinitions);

  //Load in all scene definitions from scene folder
  var scenes = {};
  const sceneContext = require.context('../schema/scenes', false, /\.json$/);
  sceneContext.keys().forEach((key) => {
    const obj = sceneContext(key);
    scenes[obj.id] = new GameScene('GameScene',actorDefinitions,obj.contains,obj.fps ? obj.fps : 60);
  });

  window.scenes = scenes;

  var gameJson =  require("../schema/game.json");
  console.log(gameJson);

  var game = new BaseGame(
    {
      title: "Base Game",
      width: gameJson.width,
      height: gameJson.height,
      parent: "game",
      backgroundColor: gameJson.backgroundColor,
      scene: [scenes[gameJson.initialScene]],
      physics: {
                      default: "arcade",
                      arcade: {
                        debug: false
                      }
                    }
    }

  );
  
};



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}