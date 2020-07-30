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
    mapStringToNumber: Map<string, number>;
    mapNumberToString: Map<number, string>;

    arrayOfValues: number[];
    arrayOfKeys: string[];

    constructor(){
        
        /*
        {-4<x<5}
        {1<y<19}
        {z=0}
        */

        this.leftBounds = -4;
        this.rightBounds = 5;


        //TODO Calculate this number based on this.leftBounds and this.rightBounds
        this.lengthHorizontal = 10; 

        this.snycClients = false;



        // this.horizontalMapper = new Map<string,number>();
        // let k =0;
        // for(let i = this.leftBounds;i<=this.rightBounds;i++,k++){
        //     this.horizontalMapper.set(i.toString(),k);    
        // }

        this.collumnChecker = [];
        this.topBounds = 19;
        this.botBounds = 1;

        this.mapStringToNumber = new Map<string,number>();
        let k = 0;
        for(let i = this.botBounds;i<=this.topBounds;i++,k++){
            this.mapStringToNumber.set(i.toString(),k);    
            this.collumnChecker.push([]);
        }
        this.arrayOfValues = Array.from(this.mapStringToNumber.values());        
        this.arrayOfKeys = Array.from(this.mapStringToNumber.keys());
        this.mapNumberToString = new Map<number, string>();
        for(let i = 0;i< this.arrayOfValues.length;i++){
            this.mapNumberToString.set(this.arrayOfValues[i],this.arrayOfKeys[i]);
        }

    }

    /**
     * @param blocks These blocks are the blocks that are placed into the board.
     */
    public lineClear(blocks:BLOCK.Block[]){

        //Add all the blocks
        const rowCount = this.calculateTotalBlocksInEachRow(blocks);
        //determine which rows are full
        const determinedRows = this.determineWhichRowsAreFull(rowCount);
        //remove those rows that are full
        this.removeRowsThatAreFull(blocks,determinedRows);

       //this.print(rowCount, determinedRows);

    }

    private calculateTotalBlocksInEachRow(blocks:BLOCK.Block[]):BLOCK.Block[][]{
        let rowCount:BLOCK.Block[][] = []; 
        for(let i = 0;i< this.arrayOfValues.length;i++){
            rowCount[i] = blocks.filter((block:BLOCK.Block)=>{
                return block.position.y === parseInt(this.mapNumberToString.get(i));
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
                let parsedInt = parseInt(this.mapNumberToString.get(i));
                //console.log("deleting " + parsedInt.toString());
                this.snycClients = true;
                shiftAmount++;
                for(let k = 0;k< blocks.length;k++){
                    if(blocks[k].position.y === parsedInt){
                        blocks.splice(k,1);
                        k = -1;
                    }
                }
                this.shiftEverythingAbove(parsedInt,blocks);
            }
        }
        return shiftAmount;
    }

    private shiftEverythingAbove(num:number,blocks:BLOCK.Block[],){
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

    private print(rowCount:BLOCK.Block[][], determineWhichRowsAreFull:boolean[]){
        console.log("TICK");
        for(let i = 0;i< this.arrayOfValues.length;i++){
            console.log("row " + this.mapNumberToString.get(i) +": " + rowCount[i].length.toString() +" shouldClear: " + determineWhichRowsAreFull[i].toString());
        }
 
    }


}