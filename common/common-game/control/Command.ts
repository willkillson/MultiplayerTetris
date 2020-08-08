/**
 * Entity for storing all information regarding
 * a command.
 */
export class Command<T>{

    public id: string;
    public cmdType: string;
    public cmdValue: T;
    public isSent: boolean;
    public isRepliedTo: boolean;
    
    constructor(owner:string, cmdType: string, cmdValue: T){
        this.id = owner;
        this.cmdType = cmdType;
        this.cmdValue = cmdValue;
        this.isSent = false;
        this.isRepliedTo = false;
    }

}