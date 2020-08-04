import * as BLOCK from './Entities/Block'
import formatedTime from './utilities/time';



export class GameLogic {

    snycClients:boolean;

    leftBounds:number;
    rightBounds: number;
    topBounds: number;
    botBounds: number;

    lengthHorizontal: number;

    collumnChecker:BLOCK.Block[][];
    arrayBounds:number;


    // horizontalMapper: Map<string, number>;
    horiIndexToPosition: Map<number, number>;
    vertiIndexToPosition: Map<number, number>;

    constructor(){
        
        /*
        {-4<x<5}
        {1<y<19}
        {z=0}
        */




        //TODO Calculate this number based on this.leftBounds and this.rightBounds
        this.lengthHorizontal = 24-1; 

        this.snycClients = false;


        this.collumnChecker = [];
 

        this.horiIndexToPosition = new Map<number,number>();
        this.vertiIndexToPosition = new Map<number,number>();
        
        let leftBounds = -9;
        let rightBounds = 13;

        let i = 0;
        while(leftBounds<=rightBounds){
            this.horiIndexToPosition.set(i,leftBounds);
            leftBounds++;
            i++;
        }

        this.topBounds = 20;
        let botBounds = 2;

        i = 0;
        while(botBounds<=this.topBounds){
            this.vertiIndexToPosition.set(i,botBounds);
            botBounds++;
            i++;
        }

       // console.log(this.horiIndexToPosition);

        //console.log(this.vertiIndexToPosition);


    }

    /**
     * @param blocks These blocks are the blocks that are placed into the board.
     */
    public lineClear(blocks:BLOCK.Block[]){

        //console.log(blocks);

        //Add all the blocks
        let rowCount = this.calculateTotalBlocksInEachRow(blocks);

        //console.log(rowCount);
        let str = "";
        for(let i = 0;i< rowCount.length;i++){
            str += " "+rowCount[i].length;
        }
        //console.log(str);
        // //determine which rows are full
        const determinedRows = this.determineWhichRowsAreFull(rowCount);

        // //remove those rows that are full

        // //console.log(rowCount);
        // console.log(determinedRows);

        // determinedRows.findIndex()

        let index = determinedRows.findIndex(e=>{
            return e ===true;
        })
        if(index!==-1){
            // console.log("Before: ");
            // console.log(blocks);
            this.removeRowsThatAreFull(blocks,determinedRows);
            // console.log("After: ");
            // console.log(blocks);
        }

        //this.print(rowCount, determinedRows);

    }

    private calculateTotalBlocksInEachRow(blocks:BLOCK.Block[]){
        let verticalArray = Array.from(this.vertiIndexToPosition.keys());
        //console.log(verticalArray);
        let rowCount:BLOCK.Block[][] = []; 
        for(let i = 0;i< verticalArray.length;i++){
            rowCount[i] = blocks.filter((block:BLOCK.Block)=>{
                return block.position.y === this.vertiIndexToPosition.get(i);
            })
        }
        return rowCount;
    }

    private determineWhichRowsAreFull(blocks:BLOCK.Block[][]): boolean[]{
        let determinedRows:boolean[] = [];
        blocks.forEach((blocks:BLOCK.Block[])=>{
            if(blocks.length===this.lengthHorizontal){
                determinedRows.push(true);
            }
            else{
                determinedRows.push(false);
            }
        })  
        return determinedRows;
    }

    private removeRowsThatAreFull(blocks:BLOCK.Block[],  determinedRows:boolean[]): number{
        let shiftAmount = 0;
        for(let i = 0;i< determinedRows.length;i++){
            if(determinedRows[i]===true){
                let parsedInt = this.vertiIndexToPosition.get(i);
               // console.log("deleting " + parsedInt.toString());
                this.snycClients = true;
                shiftAmount++;
                for(let k = 0;k< blocks.length;k++){
                    if(blocks[k].position.y === parsedInt){
                        blocks.splice(k,1);
                        k = -1;
                    }
                }
                this.shiftEverythingAbove( parsedInt,blocks );
            }
        }
        return shiftAmount;
    }

    private shiftEverythingAbove(num:number,blocks:BLOCK.Block[]){
        let myNum = num;

        while(myNum<=this.topBounds){
            
            for(let k = 0;k< blocks.length;k++){
                if(blocks[k].position.y === myNum){
                    blocks[k].position.y--; 
                }
            }
            myNum++;
        }
    }

    // private print(rowCount:BLOCK.Block[][], determineWhichRowsAreFull:boolean[]){
    //     console.log("TICK");
    //     console.log("row " + this.mapNumberToString.get(0) +": " + rowCount[0].length.toString() +" shouldClear: " + determineWhichRowsAreFull[0].toString());
    // }


}