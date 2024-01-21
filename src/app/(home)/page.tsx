"use client";

import Image from "next/image";
import { Box, Fade, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

const xSpeed = 2;
const ySpeed = 2;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [count]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scene = new THREE.Scene();

      // const axesHelper = new THREE.AxesHelper();
      // scene.add(axesHelper);
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);

      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 5;

      // Add ambient light for overall illumination
      const ambientLight = new THREE.AmbientLight(0x404040, 3);
      scene.add(ambientLight);

      // Add directional light for shadows
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Enable shadows for the renderer
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // create cube
      const geometry = new THREE.TorusGeometry();
      const material = new THREE.MeshStandardMaterial({
        color: 0x44d910,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.scale.set(0.25, 0.25, 0.25);
      scene.add(cube);

      const renderScene = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };

      renderScene();

      // * event listener for resizing the window
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      const animateCubeMovement = (targetPosition: THREE.Vector3) => {
        if (!hasMoved) {
          setHasMoved(true);
        }
        const duration = 500; // Animation duration in milliseconds
        const startPosition = cube.position.clone();
        const startTime = Date.now();

        const updatePosition = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Interpolate between the start and target positions
          const newPosition = new THREE.Vector3().lerpVectors(
            startPosition,
            targetPosition,
            progress
          );

          // Calculate boundaries based on renderer size
          const minX = -window.innerWidth / 2;
          const minY = -window.innerHeight / 2;
          const maxX = window.innerWidth / 2;
          const maxY = window.innerHeight / 2;

          console.log(
            "minX:",
            minX,
            "minY:",
            minY,
            "maxX:",
            maxX,
            "maxY:",
            maxY
          );

          newPosition.x = Math.max(minX, Math.min(maxX, newPosition.x));
          newPosition.y = Math.max(minY, Math.min(maxY, newPosition.y));

          console.log(newPosition.x, newPosition.y);

          cube.position.copy(newPosition);

          renderer.render(scene, camera);

          if (progress < 1) {
            requestAnimationFrame(updatePosition);
          }
        };

        requestAnimationFrame(updatePosition);
      };

      const onDocumentKeyDown = (event: KeyboardEvent) => {
        const keyCode = event.key;
        const targetPosition = cube.position.clone();

        if (keyCode == "ArrowUp" || keyCode == "w") {
          targetPosition.y += ySpeed;
        } else if (keyCode == "ArrowDown" || keyCode == "s") {
          targetPosition.y -= ySpeed;
        } else if (keyCode == "ArrowLeft" || keyCode == "a") {
          targetPosition.x -= xSpeed;
        } else if (keyCode == "ArrowRight" || keyCode == "d") {
          targetPosition.x += xSpeed;
        } else if (keyCode == "Enter" || keyCode == " ") {
          targetPosition.set(0, 0, 0);
        }

        animateCubeMovement(targetPosition);
      };
      window.addEventListener("keydown", onDocumentKeyDown);

      // Clean up the event listener when the component is unmounted
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("keydown", onDocumentKeyDown);
      };
    }
  }, []);
  return (
    <>
      <Fade in={count >= 2}>
        <Box
          ref={containerRef}
          position={"absolute"}
          top={0}
          left={0}
          zIndex={1}
        />
      </Fade>
      <Box position={"absolute"} top={0} left={0} w="100%">
        <Flex
          h={"100vh"}
          position={"absolute"}
          w="100%"
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Flex
            p={12}
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            border={"1px solid white"}
            w="40%"
            h={"40vh"}
            transition="box-shadow 2s"
            style={{
              boxShadow: !hasMoved
                ? "none"
                : "white 0px 0px 0px 2px inset, rgb(0, 0, 0) 10px -10px 0px -3px, rgb(31, 193, 27) 10px -10px, rgb(0, 0, 0) 20px -20px 0px -3px, rgb(0, 217, 19) 20px -20px, rgb(0, 0, 0) 30px -30px 0px -3px, rgb(0, 156, 85) 30px -30px, rgb(0, 0, 0) 40px -40px 0px -3px, rgb(0, 85, 85) 40px -40px",
              transition: "box-shadow 2s",
            }}
          >
            <Fade in={!hasMoved && count >= 5}>
              <Text>you can move...</Text>
            </Fade>
            <Fade in={!hasMoved && count >= 7}>
              <Text>with WASD or Arrow Keys</Text>
            </Fade>
            <Fade in={hasMoved}>
              <Text>click ENTER or SPACE to center yourself</Text>
            </Fade>
          </Flex>
        </Flex>

        <VStack mt={24}>
          <Fade in={count >= 1}>
            <Heading size="3xl">Griffin Cook</Heading>
          </Fade>
          <Fade in={count >= 2}>
            <Text>Think outside the box</Text>
          </Fade>
        </VStack>
      </Box>
    </>
  );
}
