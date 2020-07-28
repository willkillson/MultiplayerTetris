

export class Queue<T> {

    collection:Array<T>;
    
    constructor(){
        this.collection = new Array();
    }

    /**
     * Adds an element to the queue
     * 
     * @param element 
     */
    enqueue(element:T){
        this.collection.push(element);
    }

    /**
     *  Removes an element from the queue
     */
    dequeue():T{
        return this.collection.shift();
    }

    /**
     *  Returns the front element of the queue
     */
    front(){
        if(this.isEmpty()===false){
            return this.collection[0];
        }
        else{
            return null;
        }
    }

    /**
     * Returns true if the queue is empty
     */
    isEmpty():boolean{
        return this.collection.length>0;
    }

}