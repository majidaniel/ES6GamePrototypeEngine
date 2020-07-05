import "phaser"

export class Behaviors{ 
    /*
        Behavior: move towards target
        behaviorPayload:
            moveTargetX
            moveTargetY
            moveVelocity
    */
    moveTo(scene,actor,behaviorPayload, timeDelta){
        var targetX = behaviorPayload.moveTargetX ? behaviorPayload.moveTargetX : actor.moveTargetX;
        var targetY = behaviorPayload.moveTargetY ? behaviorPayload.moveTargetY : actor.moveTargetY;
        var velocity = behaviorPayload.moveVelocity ? behaviorPayload.moveVelocity : actor.moveVelocity;
        var vector = new Phaser.Math.Vector2(targetX - actor.x,targetY - actor.y);
        vector = vector.normalize();
        actor.recordDecision("moveTo","moving via vector "+vector.x+":"+vector.y+" to get to "+targetX + ":"+targetY + " per time delta of "+timeDelta);
        actor.recordDecision("velocity",velocity);
        actor.recordDecision("position","x:" + actor.x+", y:"+actor.y);
        actor.x += vector.x * velocity * timeDelta;
        actor.y += vector.y * velocity * timeDelta;
      }

    slide(scene, actor, behaviorPayload,timeDelta){
        var vector = actor.moveVector ? actor.moveVector : behaviorPayload.moveVector;
        var velocity = behaviorPayload.moveVelocity ? behaviorPayload.moveVelocity : actor.moveVelocity;
        actor.x += vector.x * velocity * timeDelta;
        actor.y += vector.y * velocity * timeDelta;
    }

   /*
        Behavior: Spawn another actor
   */
   periodicSpawn(scene,actor,behaviorPayload,timeDelta){
       var spawnId = behaviorPayload['spawnId'];
       var actorProperties = {definitionId: spawnId, initialLocation: {x: actor.x, y: actor.y}};
       if(!actor.lastSpawnTime)
            actor.lastSpawnTime = timeDelta;
        actor.lastSpawnTime += timeDelta;
        if(actor.lastSpawnTime > 1){
            scene.generateActor(actorProperties);
            actor.lastSpawnTime = 0;
        }
   }
   /*
    Behavior: rotate to look at mouse
   */
  lookAtMouse(scene,actor,behaviorPayload,timeDelta){
    var vector = new Phaser.Math.Vector2(scene.game.input.mousePointer.x-actor.x, scene.game.input.mousePointer.y - actor.y);
    actor.angle = Phaser.Math.RadToDeg(vector.angle()) + 90;
  }

  /*
    Behavior: check collission against target
  */
  collision(scene,actor,behaviorPayload,timeDelta){
      var targetActorId = behaviorPayload.checkTarget;
      var actors = scene.actorManager.getActorsById(targetActorId);
      for(var i = 0; i < actors.length; i++){
        if(scene.physics.overlap(actor,actors[i])){
            scene.sceneBehaviors[behaviorPayload.resultingBehavior](scene,actor);
        }
      }
  }
  /*
    Behavior: check collission against target
  */
 twoWayCollision(scene,actor,behaviorPayload,timeDelta){
    var targetActorId = behaviorPayload.checkTarget;
    var actors = scene.actorManager.getActorsById(targetActorId);
    for(var i = 0; i < actors.length; i++){
      if(scene.physics.overlap(actor,actors[i])){
        scene.sceneBehaviors[behaviorPayload.resultingBehavior](scene,actor);
        scene.sceneBehaviors[behaviorPayload.resultingBehavior](scene,actors[i]);
      }
    }
}
  /*
    Behavior: Kill actor
  */
  destroy(scene,actor){
      scene.removeActor(actor);   
  }

}