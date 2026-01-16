"use client";

import { useEffect } from "react";
import {
  Link,
  Button,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";

export function Navbar() {
  useEffect(() => {
    Events.scrollEvent.register("begin", (to, element) => {
      console.log("begin", to, element);
    });

    Events.scrollEvent.register("end", (to, element) => {
      console.log("end", to, element);
    });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  const handleSetActive = (to: any) => {
    console.log(to);
  };

  return (
    <nav className="py-4 mt-2 top-0 w-full !z-50">
      <div className="w-[90%] 2xl:w-[60%] mt-6 rounded-full bg-white/10 p-4 px-8 md:px-12 border border-white/15 z-30 mx-auto flex items-center justify-between">
        <div className="ml-3 flex items-center justify-center">
          <img draggable="false" src="logo.png" className="w-8 z-20" />
          <a href="/" className="text-white text-[1.15rem] ml-4 font-medium">
          Kloon<span className="text-blue-600">boosts</span>
          </a>
        </div>
        <div className="md:flex flex-1 justify-center space-x-6 hidden">
          <Link
            activeClass="active"
            to="features"
            spy={true}
            smooth={true}
            offset={-300}
            duration={500}
            onSetActive={handleSetActive}
            className="cursor-pointer text-white hover:-translate-y-0.5 transition-all duration-300"
          >
            Why Us
          </Link>

          <Link
            activeClass="active"
            to="pricing"
            spy={true}
            smooth={true}
            offset={-50}
            duration={500}
            onSetActive={handleSetActive}
            className="cursor-pointer text-white hover:-translate-y-0.5 transition-all duration-300"
          >
            Products
          </Link>

          <Link
            activeClass="active"
            to="reviews"
            spy={true}
            smooth={true}
            offset={-100}
            duration={500}
            onSetActive={handleSetActive}
            className="cursor-pointer text-white hover:-translate-y-0.5 transition-all duration-300"
          >
            Reviews
          </Link>

          <Link
            activeClass="active"
            to="faq"
            spy={true}
            smooth={true}
            offset={-300}
            duration={500}
            onSetActive={handleSetActive}
            className="cursor-pointer text-white hover:-translate-y-0.5 transition-all duration-300"
          >
            FAQ
          </Link>
        </div>
        <div className="flex flex-row space-x-6">
          <a
            href="https://discord.gg/kloonservices"
            target="_blank"
            className="hover:-translate-y-0.5 duration-300"
          >
            <img src="discord.png" className="h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
