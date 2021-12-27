import {Walker} from "./Walker";
import {Cell} from "./Cell";

export class Maze{
    public cells:Cell[][];
    public furthestPos:[number, number];

    searchWalkedSpace(x:number, y:number, w:[number,number][]){
        for(let i = 0; i<w.length; i++){
            if(x === w[i][0]){
                if(y === w[i][1]){
                    return true;
                }
            }
        }
        return false;
    }

    constructor(xdim:number, ydim:number) {
        this.cells = [];
        let markedForDeath:[number, number][] = [];

        for(let i = 0; i<xdim; i++) {
            this.cells[i] = [];
            for (let j = 0; j < ydim; j++) {
                this.cells[i][j] = new Cell();
            }
        }

        let w = new Walker(0,xdim,0,ydim,[1,1]);
        let walkedspace = w.walk((xdim * ydim) * 3);
        this.furthestPos = w.getFurthestPos();
        for(let i = 0; i<xdim; i++){
            for(let j = 0; j<ydim; j++){
                if(this.searchWalkedSpace(i, j, walkedspace)){
                    this.cells[i][j].setType(0);
                }
            }
        }
        for(let i = 1; i<xdim-1; i++){
            for(let j = 1; j<ydim-1; j++){
                if(this.cells[i][j].isWall === 1 &&
                    this.cells[i + 1][j].isWall === 1 &&
                    this.cells[i - 1][j].isWall === 1 &&
                    this.cells[i][j + 1].isWall === 1 &&
                    this.cells[i][j - 1].isWall === 1
                ){
                    markedForDeath.push([i,j]);
                }
            }
        }
        for(let i = 0; i<xdim; i++){
            for(let j = 0; j<ydim; j++){
                if(this.searchWalkedSpace(i, j, markedForDeath)){
                    this.cells[i][j].setType(0);
                }
            }
        }
    }

    public printMaze(){
        let s = "";
        for(let i = 0; i<this.cells.length; i++){
            for(let j = 0; j<this.cells[0].length; j++) {
                if(this.cells[i][j].isWall === 0){
                    s += ".";
                }
                else if(this.cells[i][j].isWall === 1) {
                    s += "#";
                }
            }
            s += "\n";
        }
        console.log(s);
    }
}

export{}