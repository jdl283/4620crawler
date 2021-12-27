export class Walker {

    furthest_pos: [number, number];
    start_pos:[number, number];
    current_pos:[number, number];
    dir:number;
    x_min:number;
    x_max:number;
    y_min:number;
    y_max:number;
    step_history:[number, number][];
    steps_since_turn:number;

    constructor(xmin:number, xmax:number, ymin:number, ymax:number, start:[number, number]) {
        this.furthest_pos = start;
        this.start_pos = start;
        this.current_pos = start;
        this.dir = 2;
        this.x_min = xmin;
        this.x_max = xmax;
        this.y_min = ymin;
        this.y_max = ymax;
        this.step_history = [start];
        this.steps_since_turn = 0;
    }

    tup_add(t1:[number, number], t2:[number, number]):[number, number]{
        return [t1[0] + t2[0], t1[1] + t2[1]]
    }

    eval_dir(d:number):[number,number] {
        switch (d) {
            case(d = 1):
                return [0, 1]
            case(d = 3):
                return [0, -1]
            case(d = 2):
                return [1, 0]
            case(d = 4):
                return [-1, 0]
        }
        return [0, 1]
    }

    determineBorder(target:[number, number]){
        let targx = target[0];
        let targy = target[1];

        return !((targx >= this.x_max - 1 || targx <= this.x_min) ||
            (targy <= this.y_min || targy >= this.y_max - 1));
    }

    step(){
        let target_pos = this.tup_add(this.current_pos, this.eval_dir(this.dir))
        let current = this.furthest_pos;
        if(this.determineBorder(target_pos)){
            let newxdist = target_pos[0] - this.start_pos[0];
            let newydist = target_pos[1] - this.start_pos[1];
            let oldxdist = current[0] - this.start_pos[0];
            let oldydist = current[1] - this.start_pos[1];

            if((newxdist * newxdist) + (newydist * newydist) >
                (oldxdist * oldxdist) + (oldydist * oldydist)){
                this.furthest_pos = target_pos;
            }
            else{
                this.furthest_pos = current;
            }
            this.steps_since_turn += 1;
            this.current_pos = target_pos;
            return true;
        }
        return false;
    }

    changeDirection(){
        let rand = Math.random() > 0.5;
        if(this.dir === 1 || this.dir === 3){
            if(rand){
                this.dir = 4;
            }
            else{
                this.dir = 2;
            }
        }
        else{
            if(rand){
                this.dir = 1;
            }
            else{
                this.dir = 3;
            }
        }
    }

    walkHelper() {
        if(Math.random() > 0.4 || this.steps_since_turn > 8){
            this.steps_since_turn = 0;
            this.changeDirection();
        }
        else if(this.step()){
            this.step_history.push(this.current_pos);
        }
        else{
            this.changeDirection();
        }
    }

    walk(steps:number){
        for(let i = 0; i < steps; i++){
            this.walkHelper();
        }
        return this.step_history;
    }

    getFurthestPos(){
        return this.furthest_pos;
    }
}

export{}