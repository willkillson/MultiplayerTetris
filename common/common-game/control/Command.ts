/**
 * Entity for storing all information regarding
 * a command.
 */
export class Command<T>{

    /*

    setPiece is the only command that requires a reply.

     cmd.cmdType        cmd.cmdValue
    'setPiece'    |     string: denotes position the piece is in.
    'rotation'    |     Vector3: the rotation applied to the euler vec
    'movement'    |     Vector3: denotes the direction to add to the current position
    'newPlayer'   |     Client: 

    */

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