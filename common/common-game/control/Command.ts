/**
 * Entity for storing all information regarding
 * a command.
 */
export class Command<T>{

    public clientId: string;
    public cmdType: string;
    public cmdValue: T;
    
    constructor(owner:string, cmdType: string, cmdValue: T){
        this.clientId = owner;
        this.cmdType = cmdType;
        this.cmdValue = cmdValue;
    }

}