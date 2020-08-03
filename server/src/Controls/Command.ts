/**
 * Entity for storing all information regarding
 * a command.
 */
export class Command<T>{

    public owner: string;
    public cmdType: string;
    public cmdValue: T;
    
    constructor(owner:string, cmdType: string, cmdValue: T){
        this.owner = owner;
        this.cmdType = cmdType;
        this.cmdValue = cmdValue;
    }

}