

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
        if(this.isEmpty()){
            return null;
        }
        else{
            return this.collection[0];
        }
    }

    /**
     * Returns true if the queue is empty
     */
    isEmpty():boolean{
        return this.collection.length===0;
    }

    /**
     * Adds the element to the front of the que.
     * @param element 
     */
    addFirst(element:T){
        let newArray = [];
        newArray.push(element);
        newArray.concat(...this.collection);
        this.collection = newArray;
    }

}