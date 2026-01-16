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

export function Footer() {
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
    <>
      <footer className="bg-[#1d1d2d] p-8 mt-40 text-white hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-start">
            <div className="w-full md:w-auto mb-8 md:mb-0">
              <h2 className="text-2xl font-bold">
                Kloon<span className="text-blue-600">boosts</span>
              </h2>
            </div>
            <div className="w-full md:w-auto mb-6 md:mb-0">
              <h3 className="font-semibold mb-2">Navigate</h3>
              <ul>
                <li>
                  <Link
                    activeClass="active"
                    to="home"
                    spy={true}
                    smooth={true}
                    offset={-1050}
                    duration={500}
                    onSetActive={handleSetActive}
                    className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="Why Us"
                    spy={true}
                    smooth={true}
                    offset={-50}
                    duration={500}
                    onSetActive={handleSetActive}
                    className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                  >
                    Why Us
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="pricing"
                    spy={true}
                    smooth={true}
                    offset={-50}
                    duration={500}
                    onSetActive={handleSetActive}
                    className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="reviews"
                    spy={true}
                    smooth={true}
                    offset={-50}
                    duration={500}
                    onSetActive={handleSetActive}
                    className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                  >
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="reviews"
                    spy={true}
                    smooth={true}
                    offset={500}
                    duration={500}
                    onSetActive={handleSetActive}
                    className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-auto">
              <h3 className="font-semibold mb-2">Support</h3>
              <ul>
                <li>
                  <a
                    href="#"
                    className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>
              Copyright © 2025{" "}
              <span className="font-semibold">
                Kloon<span className="text-blue-600">boosts</span>
              </span>
              , All rights reserved
            </p>
          </div>
        </div>
      </footer>
      <footer className="bg-[#1d1d2d] p-8 mt-40 text-white block md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-start text-center">
            <div className="w-full mb-8">
              <h2 className="text-2xl font-bold">
                Kloon<span className="text-blue-600">boosts</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center w-full gap-12">
              <div className="w-full sm:w-auto mb-6">
                <h3 className="font-semibold mb-2">Navigate</h3>
                <ul>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                    >
                      Why Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                    >
                      Reviews
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div className="w-full sm:w-auto mb-6">
                <h3 className="font-semibold mb-2">Support</h3>
                <ul>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 duration-300 !cursor-pointer hover:text-blue-600/85"
                    >
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>
              Copyright © 2025{" "}
              <span className="font-semibold">
                Kloon<span className="text-blue-600">boosts</span>
              </span>
              , All rights reserved
            </p>
          </div>
        </div>
        <img
          src="graphic.png"
          className="bottom-0 left-0 fixed opacity-5 -z-50"
        />
      </footer>
    </>
  );
}

export default Footer;
