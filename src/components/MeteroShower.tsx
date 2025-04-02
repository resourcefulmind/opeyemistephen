import React, { useEffect, useRef } from "react";

function MeteorShower() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const createMeteor = () => {
            const meteor = document.createElement('div');
            meteor.className = 'meteor'; 
            meteor.style.left = `${Math.random() * 100}vw`; //picking a random horizontal position
            meteor.style.animationDuration = `${Math.random() * 2 + 1}s`; //picking a random dur btw 1 and 3s
            containerRef.current?.appendChild(meteor);

            //removung meteor after animation
            meteor.addEventListener('animationend', () => {
                meteor.remove();
            })
        }

        const createMeteorShower = () => {
            createMeteor();
            setTimeout(createMeteorShower, 500); //creating shower every 500ms
        };

        createMeteorShower();

        return () => {

        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0"/>;
}

export default MeteorShower;