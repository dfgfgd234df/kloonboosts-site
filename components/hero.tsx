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
import { InfiniteMovingImages } from "./ui/infinite-moving-cards";

export function Hero() {
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
    <div className="mt-10">
      <Element name="home"></Element>
      <div className="w-[20rem] h-[20rem] rounded-full blur-[200px] absolute bg-[#6583e3]"></div>
      <div className="mx-auto w-full max-w-[1159px] px-2 flex items-center">
        <div className="flex flex-row items-center">
          <div className="lg:w-1/2 flex !float-left flex-col gap-3 md:items-start items-center md:text-start text-center">
            <h1 className="text-[3.1rem] leading-[3rem] text-white font-semibold mb-4">
            Snag <span className="text-blue-600">Premium</span> Features for Less
              <br />
            </h1>
            <p className="text-[1.5rem] leading-[1.8rem] text-white/70 font-light mb-3">
            Get elite Discord features at unbeatable rates! Access premium perks without breaking the bank, all while enjoying reliable service and instant delivery.
            </p>
            <Link
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              offset={0}
              duration={500}
              onSetActive={handleSetActive}
              className="bg-black/[0.01] backdrop-blur border-blue-600 border mt-4 hover:scale-95 !cursor-pointer duration-500 rounded-lg px-10 py-3 text-white font-semibold text-lg flex justify-between items-center gap-4 group"
            >
              <span className="flex-1 text-left">Purchase now</span>
              <img
                src="arrow2.png"
                className="w-4 transform group-hover:translate-x-3 transition-transform duration-500"
              />
            </Link>
          </div>

          <div className="w-1/2 md:block hidden">
            <div>
              <div>
                <img src="logo.png" className="w-[80%] float-right bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[5rem] -mt-10 mb-20 rounded-md mx-auto flex flex-col items-center justify-center relative overflow-hidden">
      </div>
      <div className="items-center bounce2 mx-auto flex mt-20 md:mt-2 justify-center relative">
        <img src="arrow1.png" className="w-20 rotate-90 opacity-5" />
        <img
          src="arrow1.png"
          className="w-6 rotate-90 opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="flex justify-center mx-auto text-center">
        <Link
          activeClass="active"
          to="faq"
          spy={true}
          smooth={true}
          offset={-400}
          duration={500}
          onSetActive={handleSetActive}
          className="mx-auto text-white text-2xl font-semibold scale-90 hover:scale-95 duration-500 cursor-pointer mt-6"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
const images = [
  {
    src: "/marquee/nitro.png",
    alt: "",
  },
  {
    src: "/marquee/boost.png",
    alt: "",
  },
  {
    src: "/marquee/cc.svg",
    alt: "",
  },
  {
    src: "/marquee/crew.png",
    alt: "",
  },
  {
    src: "/marquee/destiny.png",
    alt: "",
  },
  {
    src: "/marquee/fn.png",
    alt: "",
  },
  {
    src: "/marquee/prem.png",
    alt: "",
  },
  {
    src: "/marquee/robux.png",
    alt: "",
  },
];
export default Hero;
