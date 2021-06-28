import React from "react";
import Particles from "react-particles-js";
import particlesConfig from "./particle-config";
// import logo from "../assets/img/logo.png"


export default function ParticleBackground(){
    return (
        <Particles params={particlesConfig}></Particles>

        );

}