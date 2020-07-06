import piece_template from './piece-template';
import {Vector3} from "three";


const I_color = 0xffa500;
const T_color = 0xadd8e6;
const L_color = 0xfed8b1;
const J_color = 0x0000ff;
const S_color = 0x800080;
const Z_color = 0x00ff00;
const O_color = 0xffff00;


const pieceFactory = (pieceType = 0) =>{

    let retPiece;

    switch(pieceType){
        case 0://T
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(1,0,0),
                    new Vector3(0,-1,0)];
                retPiece = new piece_template(blocks,T_color);
                break;
            }
        case 1://S
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(0,1,0),
                    new Vector3(1,1,0)];
                retPiece = new piece_template(blocks,S_color);
                break;
            }
        case 2://I
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(1,0,0),
                    new Vector3(2,0,0)];
                retPiece = new piece_template(blocks,I_color);
                break;
            }
        case 3://L
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(1,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(-1,-1,0)];
                retPiece = new piece_template(blocks,L_color);
                break;
            }
        case 4://J
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(1,0,0),
                new Vector3(1,-1,0)];
            retPiece = new piece_template(blocks,J_color);
            break;
        }
        case 5://Z
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(0,-1,0),
                new Vector3(1,-1,0)];
            retPiece = new piece_template(blocks,Z_color);
            break;
        }
        case 6://O
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(1,0,0),
                new Vector3(1,-1,0),
                new Vector3(0,-1,0)];
            retPiece = new piece_template(blocks,O_color);
            break;
        }
    }
    
    return retPiece;
}

export default pieceFactory;