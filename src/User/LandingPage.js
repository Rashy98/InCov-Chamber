import React from "react";
import Particles from "react-particles-js";
import particlesConfig from "./particle-config";



export default function ParticleBackground(){
    return (
        <Particles params={particlesConfig}></Particles>
        );

}