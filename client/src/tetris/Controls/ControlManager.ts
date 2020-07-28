import * as QUEUE from '../utilities/DataTypes/Queue'


export class ControlManager extends QUEUE.Queue{

    //controlQue:Array<string>
    isProcessingCommand: boolean;

    constructor(){
        super();
        
        this.isProcessingCommand = false;

    }

    addCommand(cmd:string){

    }

    processCommand(){
        
        if(this.isProcessingCommand===false){
            
        }

    }




}
