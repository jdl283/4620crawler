import {Mat4} from "./Mat4";

class Mat4Fast extends Mat4 {
    protected _timesMatrix(m: Mat4): Mat4 {
        let cfunc: any = (this.constructor as any);

        //##################//--Matrix Multiplication--\\##################
        //<editor-fold desc="Matrix Multiplication">
        //Optimise for matrices in which bottom row is (0, 0, 0, 1) in both matrices

        if (this.elements[12] === 0.0 && this.elements[13] == 0.0 &&
            this.elements[14] == 0.0 && this.elements[15] == 1.0 &&
            m.elements[12] == 0.0 && m.elements[13] == 0.0 &&

            m.elements[14] == 0.0 && m.elements[15] == 1.0) {

            return new Mat4(this.elements[0] * m.elements[0] + this.elements[1] * m.elements[4] + this.elements[2] * m.elements[8],

                this.elements[4] * m.elements[0] + this.elements[5] * m.elements[4] + this.elements[6] * m.elements[8],

                this.elements[8] * m.elements[0] + this.elements[9] * m.elements[4] + this.elements[10] * m.elements[8],

                0.0,

                this.elements[0] * m.elements[1] + this.elements[1] * m.elements[5] + this.elements[2] * m.elements[9],

                this.elements[4] * m.elements[1] + this.elements[5] * m.elements[5] + this.elements[6] * m.elements[9],

                this.elements[8] * m.elements[1] + this.elements[9] * m.elements[5] + this.elements[10] * m.elements[9],

                0.0,

                this.elements[0] * m.elements[2] + this.elements[1] * m.elements[6] + this.elements[2] * m.elements[10],

                this.elements[4] * m.elements[2] + this.elements[5] * m.elements[6] + this.elements[6] * m.elements[10],

                this.elements[8] * m.elements[2] + this.elements[9] * m.elements[6] + this.elements[10] * m.elements[10],

                0.0,

                this.elements[0] * m.elements[3] + this.elements[1] * m.elements[7] + this.elements[2] * m.elements[11] + this.elements[3],

                this.elements[4] * m.elements[3] + this.elements[5] * m.elements[7] + this.elements[6] * m.elements[11] + this.elements[7],

                this.elements[8] * m.elements[3] + this.elements[9] * m.elements[7] + this.elements[10] * m.elements[11] + this.elements[11],

                1.0);

        }


        //Optimise for when bottom row of 1st matrix is (0, 0, 0, 1)

        if (this.elements[12] == 0.0 && this.elements[13] == 0.0 && this.elements[14] == 0.0 && this.elements[15] == 1.0) {

            return new Mat4(this.elements[0] * m.elements[0] + this.elements[1] * m.elements[4] + this.elements[2] * m.elements[8] + this.elements[3] * m.elements[12],

                this.elements[4] * m.elements[0] + this.elements[5] * m.elements[4] + this.elements[6] * m.elements[8] + this.elements[7] * m.elements[12],

                this.elements[8] * m.elements[0] + this.elements[9] * m.elements[4] + this.elements[10] * m.elements[8] + this.elements[11] * m.elements[12],

                m.elements[12],

                this.elements[0] * m.elements[1] + this.elements[1] * m.elements[5] + this.elements[2] * m.elements[9] + this.elements[3] * m.elements[13],

                this.elements[4] * m.elements[1] + this.elements[5] * m.elements[5] + this.elements[6] * m.elements[9] + this.elements[7] * m.elements[13],

                this.elements[8] * m.elements[1] + this.elements[9] * m.elements[5] + this.elements[10] * m.elements[9] + this.elements[11] * m.elements[13],

                m.elements[13],

                this.elements[0] * m.elements[2] + this.elements[1] * m.elements[6] + this.elements[2] * m.elements[10] + this.elements[3] * m.elements[14],

                this.elements[4] * m.elements[2] + this.elements[5] * m.elements[6] + this.elements[6] * m.elements[10] + this.elements[7] * m.elements[14],

                this.elements[8] * m.elements[2] + this.elements[9] * m.elements[6] + this.elements[10] * m.elements[10] + this.elements[11] * m.elements[14],

                m.elements[14],

                this.elements[0] * m.elements[3] + this.elements[1] * m.elements[7] + this.elements[2] * m.elements[11] + this.elements[3] * m.elements[15],

                this.elements[4] * m.elements[3] + this.elements[5] * m.elements[7] + this.elements[6] * m.elements[11] + this.elements[7] * m.elements[15],

                this.elements[8] * m.elements[3] + this.elements[9] * m.elements[7] + this.elements[10] * m.elements[11] + this.elements[11] * m.elements[15],

                m.elements[15]);

        }


        //Optimise for when bottom row of 2nd matrix is (0, 0, 0, 1)

        if (m.elements[12] == 0.0 && m.elements[13] == 0.0 &&

            m.elements[14] == 0.0 && m.elements[15] == 1.0) {

            return new Mat4(this.elements[0] * m.elements[0] + this.elements[1] * m.elements[4] + this.elements[2] * m.elements[8],

                this.elements[4] * m.elements[0] + this.elements[5] * m.elements[4] + this.elements[6] * m.elements[8],

                this.elements[8] * m.elements[0] + this.elements[9] * m.elements[4] + this.elements[10] * m.elements[8],

                this.elements[12] * m.elements[0] + this.elements[13] * m.elements[4] + this.elements[14] * m.elements[8],

                this.elements[0] * m.elements[1] + this.elements[1] * m.elements[5] + this.elements[2] * m.elements[9],

                this.elements[4] * m.elements[1] + this.elements[5] * m.elements[5] + this.elements[6] * m.elements[9],

                this.elements[8] * m.elements[1] + this.elements[9] * m.elements[5] + this.elements[10] * m.elements[9],

                this.elements[12] * m.elements[1] + this.elements[13] * m.elements[5] + this.elements[14] * m.elements[9],

                this.elements[0] * m.elements[2] + this.elements[1] * m.elements[6] + this.elements[2] * m.elements[10],

                this.elements[4] * m.elements[2] + this.elements[5] * m.elements[6] + this.elements[6] * m.elements[10],

                this.elements[8] * m.elements[2] + this.elements[9] * m.elements[6] + this.elements[10] * m.elements[10],

                this.elements[12] * m.elements[2] + this.elements[13] * m.elements[6] + this.elements[14] * m.elements[10],

                this.elements[0] * m.elements[3] + this.elements[1] * m.elements[7] + this.elements[2] * m.elements[11] + this.elements[3],

                this.elements[4] * m.elements[3] + this.elements[5] * m.elements[7] + this.elements[6] * m.elements[11] + this.elements[7],

                this.elements[8] * m.elements[3] + this.elements[9] * m.elements[7] + this.elements[10] * m.elements[11] + this.elements[11],

                this.elements[12] * m.elements[3] + this.elements[13] * m.elements[7] + this.elements[14] * m.elements[11] + this.elements[15]);

        }


        return new cfunc(this.elements[0] * m.elements[0] + this.elements[1] * m.elements[4] + this.elements[2] * m.elements[8] + this.elements[3] * m.elements[12],

            this.elements[4] * m.elements[0] + this.elements[5] * m.elements[4] + this.elements[6] * m.elements[8] + this.elements[7] * m.elements[12],

            this.elements[8] * m.elements[0] + this.elements[9] * m.elements[4] + this.elements[10] * m.elements[8] + this.elements[11] * m.elements[12],

            this.elements[12] * m.elements[0] + this.elements[13] * m.elements[4] + this.elements[14] * m.elements[8] + this.elements[15] * m.elements[12],

            this.elements[0] * m.elements[1] + this.elements[1] * m.elements[5] + this.elements[2] * m.elements[9] + this.elements[3] * m.elements[13],

            this.elements[4] * m.elements[1] + this.elements[5] * m.elements[5] + this.elements[6] * m.elements[9] + this.elements[7] * m.elements[13],

            this.elements[8] * m.elements[1] + this.elements[9] * m.elements[5] + this.elements[10] * m.elements[9] + this.elements[11] * m.elements[13],

            this.elements[12] * m.elements[1] + this.elements[13] * m.elements[5] + this.elements[14] * m.elements[9] + this.elements[15] * m.elements[13],

            this.elements[0] * m.elements[2] + this.elements[1] * m.elements[6] + this.elements[2] * m.elements[10] + this.elements[3] * m.elements[14],

            this.elements[4] * m.elements[2] + this.elements[5] * m.elements[6] + this.elements[6] * m.elements[10] + this.elements[7] * m.elements[14],

            this.elements[8] * m.elements[2] + this.elements[9] * m.elements[6] + this.elements[10] * m.elements[10] + this.elements[11] * m.elements[14],

            this.elements[12] * m.elements[2] + this.elements[13] * m.elements[6] + this.elements[14] * m.elements[10] + this.elements[15] * m.elements[14],

            this.elements[0] * m.elements[3] + this.elements[1] * m.elements[7] + this.elements[2] * m.elements[11] + this.elements[3] * m.elements[15],

            this.elements[4] * m.elements[3] + this.elements[5] * m.elements[7] + this.elements[6] * m.elements[11] + this.elements[7] * m.elements[15],

            this.elements[8] * m.elements[3] + this.elements[9] * m.elements[7] + this.elements[10] * m.elements[11] + this.elements[11] * m.elements[15],

            this.elements[12] * m.elements[3] + this.elements[13] * m.elements[7] + this.elements[14] * m.elements[11] + this.elements[15] * m.elements[15]);

    }

    protected _timesMatrixCOLMAJ(m: Mat4): Mat4 {
        let cfunc: any = (this.constructor as any);

        //##################//--Matrix Multiplication--\\##################
        //<editor-fold desc="Matrix Multiplication">
        //Optimise for matrices in which bottom row is (0, 0, 0, 1) in both matrices

        if (this.elements[3] === 0.0 && this.elements[7] == 0.0 &&
            this.elements[11] == 0.0 && this.elements[15] == 1.0 &&
            m.elements[3] == 0.0 && m.elements[7] == 0.0 &&

            m.elements[11] == 0.0 && m.elements[15] == 1.0) {

            return new Mat4(this.elements[0] * m.elements[0] + this.elements[4] * m.elements[1] + this.elements[8] * m.elements[2],

                this.elements[1] * m.elements[0] + this.elements[5] * m.elements[1] + this.elements[9] * m.elements[2],

                this.elements[2] * m.elements[0] + this.elements[6] * m.elements[1] + this.elements[10] * m.elements[2],

                0.0,

                this.elements[0] * m.elements[4] + this.elements[4] * m.elements[5] + this.elements[8] * m.elements[6],

                this.elements[1] * m.elements[4] + this.elements[5] * m.elements[5] + this.elements[9] * m.elements[6],

                this.elements[2] * m.elements[4] + this.elements[6] * m.elements[5] + this.elements[10] * m.elements[6],

                0.0,

                this.elements[0] * m.elements[8] + this.elements[4] * m.elements[9] + this.elements[8] * m.elements[10],

                this.elements[1] * m.elements[8] + this.elements[5] * m.elements[9] + this.elements[9] * m.elements[10],

                this.elements[2] * m.elements[8] + this.elements[6] * m.elements[9] + this.elements[10] * m.elements[10],

                0.0,

                this.elements[0] * m.elements[12] + this.elements[4] * m.elements[13] + this.elements[8] * m.elements[14] + this.elements[12],

                this.elements[1] * m.elements[12] + this.elements[5] * m.elements[13] + this.elements[9] * m.elements[14] + this.elements[13],

                this.elements[2] * m.elements[12] + this.elements[6] * m.elements[13] + this.elements[10] * m.elements[14] + this.elements[14],

                1.0);

        }


        //Optimise for when bottom row of 1st matrix is (0, 0, 0, 1)

        if (this.elements[3] == 0.0 && this.elements[7] == 0.0 && this.elements[11] == 0.0 && this.elements[15] == 1.0) {

            return new Mat4(this.elements[0] * m.elements[0] + this.elements[4] * m.elements[1] + this.elements[8] * m.elements[2] + this.elements[12] * m.elements[3],

                this.elements[1] * m.elements[0] + this.elements[5] * m.elements[1] + this.elements[9] * m.elements[2] + this.elements[13] * m.elements[3],

                this.elements[2] * m.elements[0] + this.elements[6] * m.elements[1] + this.elements[10] * m.elements[2] + this.elements[14] * m.elements[3],

                m.elements[3],

                this.elements[0] * m.elements[4] + this.elements[4] * m.elements[5] + this.elements[8] * m.elements[6] + this.elements[12] * m.elements[7],

                this.elements[1] * m.elements[4] + this.elements[5] * m.elements[5] + this.elements[9] * m.elements[6] + this.elements[13] * m.elements[7],

                this.elements[2] * m.elements[4] + this.elements[6] * m.elements[5] + this.elements[10] * m.elements[6] + this.elements[14] * m.elements[7],

                m.elements[7],

                this.elements[0] * m.elements[8] + this.elements[4] * m.elements[9] + this.elements[8] * m.elements[10] + this.elements[12] * m.elements[11],

                this.elements[1] * m.elements[8] + this.elements[5] * m.elements[9] + this.elements[9] * m.elements[10] + this.elements[13] * m.elements[11],

                this.elements[2] * m.elements[8] + this.elements[6] * m.elements[9] + this.elements[10] * m.elements[10] + this.elements[14] * m.elements[11],

                m.elements[11],

                this.elements[0] * m.elements[12] + this.elements[4] * m.elements[13] + this.elements[8] * m.elements[14] + this.elements[12] * m.elements[15],

                this.elements[1] * m.elements[12] + this.elements[5] * m.elements[13] + this.elements[9] * m.elements[14] + this.elements[13] * m.elements[15],

                this.elements[2] * m.elements[12] + this.elements[6] * m.elements[13] + this.elements[10] * m.elements[14] + this.elements[14] * m.elements[15],

                m.elements[15]);

        }


        //Optimise for when bottom row of 2nd matrix is (0, 0, 0, 1)

        if (m.elements[3] == 0.0 && m.elements[7] == 0.0 &&

            m.elements[11] == 0.0 && m.elements[15] == 1.0) {

            return new Mat4(this.elements[0] * m.elements[0] + this.elements[4] * m.elements[1] + this.elements[8] * m.elements[2],

                this.elements[1] * m.elements[0] + this.elements[5] * m.elements[1] + this.elements[9] * m.elements[2],

                this.elements[2] * m.elements[0] + this.elements[6] * m.elements[1] + this.elements[10] * m.elements[2],

                this.elements[3] * m.elements[0] + this.elements[7] * m.elements[1] + this.elements[11] * m.elements[2],

                this.elements[0] * m.elements[4] + this.elements[4] * m.elements[5] + this.elements[8] * m.elements[6],

                this.elements[1] * m.elements[4] + this.elements[5] * m.elements[5] + this.elements[9] * m.elements[6],

                this.elements[2] * m.elements[4] + this.elements[6] * m.elements[5] + this.elements[10] * m.elements[6],

                this.elements[3] * m.elements[4] + this.elements[7] * m.elements[5] + this.elements[11] * m.elements[6],

                this.elements[0] * m.elements[8] + this.elements[4] * m.elements[9] + this.elements[8] * m.elements[10],

                this.elements[1] * m.elements[8] + this.elements[5] * m.elements[9] + this.elements[9] * m.elements[10],

                this.elements[2] * m.elements[8] + this.elements[6] * m.elements[9] + this.elements[10] * m.elements[10],

                this.elements[3] * m.elements[8] + this.elements[7] * m.elements[9] + this.elements[11] * m.elements[10],

                this.elements[0] * m.elements[12] + this.elements[4] * m.elements[13] + this.elements[8] * m.elements[14] + this.elements[12],

                this.elements[1] * m.elements[12] + this.elements[5] * m.elements[13] + this.elements[9] * m.elements[14] + this.elements[13],

                this.elements[2] * m.elements[12] + this.elements[6] * m.elements[13] + this.elements[10] * m.elements[14] + this.elements[14],

                this.elements[3] * m.elements[12] + this.elements[7] * m.elements[13] + this.elements[11] * m.elements[14] + this.elements[15]);

        }


        return new cfunc(this.elements[0] * m.elements[0] + this.elements[4] * m.elements[1] + this.elements[8] * m.elements[2] + this.elements[12] * m.elements[3],

            this.elements[1] * m.elements[0] + this.elements[5] * m.elements[1] + this.elements[9] * m.elements[2] + this.elements[13] * m.elements[3],

            this.elements[2] * m.elements[0] + this.elements[6] * m.elements[1] + this.elements[10] * m.elements[2] + this.elements[14] * m.elements[3],

            this.elements[3] * m.elements[0] + this.elements[7] * m.elements[1] + this.elements[11] * m.elements[2] + this.elements[15] * m.elements[3],

            this.elements[0] * m.elements[4] + this.elements[4] * m.elements[5] + this.elements[8] * m.elements[6] + this.elements[12] * m.elements[7],

            this.elements[1] * m.elements[4] + this.elements[5] * m.elements[5] + this.elements[9] * m.elements[6] + this.elements[13] * m.elements[7],

            this.elements[2] * m.elements[4] + this.elements[6] * m.elements[5] + this.elements[10] * m.elements[6] + this.elements[14] * m.elements[7],

            this.elements[3] * m.elements[4] + this.elements[7] * m.elements[5] + this.elements[11] * m.elements[6] + this.elements[15] * m.elements[7],

            this.elements[0] * m.elements[8] + this.elements[4] * m.elements[9] + this.elements[8] * m.elements[10] + this.elements[12] * m.elements[11],

            this.elements[1] * m.elements[8] + this.elements[5] * m.elements[9] + this.elements[9] * m.elements[10] + this.elements[13] * m.elements[11],

            this.elements[2] * m.elements[8] + this.elements[6] * m.elements[9] + this.elements[10] * m.elements[10] + this.elements[14] * m.elements[11],

            this.elements[3] * m.elements[8] + this.elements[7] * m.elements[9] + this.elements[11] * m.elements[10] + this.elements[15] * m.elements[11],

            this.elements[0] * m.elements[12] + this.elements[4] * m.elements[13] + this.elements[8] * m.elements[14] + this.elements[12] * m.elements[15],

            this.elements[1] * m.elements[12] + this.elements[5] * m.elements[13] + this.elements[9] * m.elements[14] + this.elements[13] * m.elements[15],

            this.elements[2] * m.elements[12] + this.elements[6] * m.elements[13] + this.elements[10] * m.elements[14] + this.elements[14] * m.elements[15],

            this.elements[3] * m.elements[12] + this.elements[7] * m.elements[13] + this.elements[11] * m.elements[14] + this.elements[15] * m.elements[15]);

    }
}

export {};
