

export class Queue{

    collection:Array<any>;
    
    constructor(){
        this.collection = new Array();
    }

    // enqueue() – Adds an element to the queue
    enqueue(element:any){
        this.collection.push(element);
    }

    // dequeue() – Removes an element from the queue
    dequeue():any{
        return this.collection.shift();
    }

    // front() – returns the front element of the queue
    front(){
        if(this.isEmpty()===false){
            return this.collection[0];
        }
        else{
            return null;
        }
    }

    // isEmpty() – Returns true if the queue is empty
    isEmpty():boolean{
        return this.collection.length>0;
    }

}