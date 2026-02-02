"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";

function Socials() {
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
    <div className="flex flex-col items-center justify-center mx-auto mb-10 mt-40">
      <Element name="contact"></Element>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-10">
        <a href="https://discord.gg/CUY3SY8bEU" target="_blank" rel="noopener noreferrer">
        <button className="bg-[#2563eb] hover:-translate-y-2 duration-500 px-10 py-4 text-white flex items-center justify-center space-x-4 rounded-lg group">
          <Image src="/discord.png" alt="Discord" width={20} height={20} />
          <span>Discord</span>
          <Image
            src="/arrow1.png"
            alt="Arrow"
            width={16}
            height={16}
            className="transform transition-transform group-hover:translate-x-1 duration-500"
          />
        </button>
        </a>
        <a href="https://t.me/kloonservices" target="_blank" rel="noopener noreferrer">
        <button className="bg-[#24a1de] hover:-translate-y-2 duration-500 px-10 py-4 text-white flex items-center justify-center space-x-4 rounded-lg group">
          <Image src="/telegram.svg" alt="Telegram" width={20} height={20} />
          <span>Telegram</span>
          <Image
            src="/arrow1.png"
            alt="Arrow"
            width={16}
            height={16}
            className="transform transition-transform group-hover:translate-x-1 duration-500"
          />
        </button>
        </a>
      </div>
    </div>
  );
}

export default Socials;
