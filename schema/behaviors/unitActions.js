import "phaser"

export class Behaviors{ 
    /*
        Behavior: move to random spot on top line of scene
    */
   attackMove(scene,actor,behaviorPayload,timeDelta){

        var closeToEnemy = false;
        if(closeToEnemy){
            
        }else{
            var target = this.getEnemyTarget(actor);
            behaviorPayload.moveTargetX = target.x;
            behaviorPayload.moveTargetY = target.y;
            behaviorPayload.moveVelocity = behaviorPayload.baseMoveSpeed * 1;
            scene.sceneBehaviors['moveTo'](scene,actor,behaviorPayload, timeDelta);
        }
   }

   getEnemyTarget(actor){
       if(actor.team == 'B'){
           return {x: 100, y:0};
       }else if(actor.team == 'A'){
           return {x:100, y:500}
       }
   }
}