import "phaser"

export class Behaviors{ 
    /*
        Behavior: move to random spot on top line of scene
    */
   randomToplineMove(scene,actor,behaviorPayload){
       actor.y = 0;
       actor.x = scene.game.canvas.width * Math.random();
   }
   /*
        Behavior: Spawn another actor
   */
   
  /*
    Behavior: Shoot projectile
  */
  shootActiveProjectile(scene,actor,behaviorPayload,timeDelta){
    var spawnId = 'PlayerBullet';
    var actorProperties = {definitionId: spawnId, 
        initialLocation: {x: actor.x, y: actor.y}, 
        moveVector: new Phaser.Math.Vector2(scene.game.input.mousePointer.x - actor.x,scene.game.input.mousePointer.y-actor.y).normalize()};
    scene.generateActor(actorProperties);    
  }
  
}