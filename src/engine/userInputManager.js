//User Input Manager listens for user inputs and translates them into easily usable events

export class UserInputManager{
    constructor(scene) {
        this.scene = scene;
        this.eventMappings = [];

        this.previous_states = [];
    }

    tick(){
        if(this.scene.game.input.activePointer.leftButtonDown()){
            if(this.previous_states['leftMouseButton'] != true){
                this.scene.eventManager.triggerEvent('Input.LeftMouseClick');
                this.previous_states['leftMouseButton'] = true;
            }
        }else{
            this.previous_states['leftMouseButton'] = false;
        }

    }

}
