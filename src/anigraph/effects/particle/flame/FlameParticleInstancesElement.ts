import {Mat4} from "src/anigraph";
import {AParticleInstancesElement} from "../AParticleInstancesElement";
import {FlameParticle} from "./FlameParticle";

export class FlameParticleInstancesElement extends AParticleInstancesElement{
    setParticle(index: number, particle: FlameParticle) {
        // this.setMatrixAt(index, Mat4.Scale2D(300));
        // this.setColorAt(index, Color.Random());
        this.setColorAt(index,
            particle.color
        );
        if(!particle.hidden){
            this.setColorAt(index,
                particle.color
            );
            this.setMatrixAt(index,
                // Mat4.Rotation2D((particle.age/particle.lifespan)*Math.PI*10).times(Mat4.Scale2D(particle.radius)).times(Mat4.Translation3D(particle.position))
                Mat4.Translation3D(particle.position)
                    .times(Mat4.Scale2D(particle.radius))
                    .times(Mat4.Rotation2D((particle.age/particle.lifespan)*Math.PI*10))
            );

        }else {
            this.setMatrixAt(index,
                Mat4.Translation2D(particle.position).times(Mat4.Scale2D(0))
            );
        }

    }
}
