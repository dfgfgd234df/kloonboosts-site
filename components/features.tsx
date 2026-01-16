"use client";

import React, { useEffect } from "react";
import {
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";

function Features() {
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
    <div className="flex justify-center mx-auto items-center text-center mb-12">
      <Element name="features"></Element>
      <div className="w-[20rem] h-[20rem] md:block hidden rounded-full blur-[200px] absolute bg-[#6583e3] left-[1800px]"></div>
      <div className="mt-32 grid grid-cols-1 space-y-10 md:space-y-0 lg:grid-cols-4 mx-auto justify-center gap-8">
        <div className="w-[250px] hover:-translate-y-2 duration-500 flex flex-col justify-start items-center h-[330px] bg-[#1d1d2d] !z-50 rounded-xl">
          <img src="support.png" className="w-14 mb-2 -mt-8" />
          <div className="bg-blue-600 mt-4 rounded-md py-2 text-white font-semibold text-lg w-[70%] text-center">
            24/7 Support
          </div>
          <p className="text-white font-medium max-w-[13rem] mt-5">
            Round-the-clock assistance for a
            <span className="text-blue-600"> seamless</span> experience
          </p>
          <p className="text-white/50 text-sm font-light max-w-[13rem] mt-5">
            Our dedicated team is always ready to help, ensuring your queries
            and issues are resolved promptly.
          </p>
        </div>
        <div className="w-[250px] hover:-translate-y-2 duration-500 flex flex-col justify-start items-center h-[330px] bg-[#1d1d2d] !z-50 rounded-xl">
          <img src="rush.png" className="w-14 mb-2 -mt-8" />
          <div className="bg-blue-600 mt-4 rounded-md py-2 text-white font-semibold text-lg w-[70%] text-center">
            Fast Delivery
          </div>
          <p className="text-white font-medium max-w-[13rem] mt-5">
            <span className="text-blue-600">Instant</span> access to digital
            luxury
          </p>
          <p className="text-white/50 text-sm font-light max-w-[13rem] mt-5">
            We prioritize quick delivery, ensuring you can enjoy your purchases
            without any delay.
          </p>
        </div>
        <div className="w-[250px] hover:-translate-y-2 duration-500 flex flex-col justify-start items-center h-[330px] bg-[#1d1d2d] !z-50 rounded-xl">
          <img src="guarantee.png" className="w-14 mb-2 -mt-8" />
          <div className="bg-blue-600 mt-4 rounded-md py-2 text-white font-semibold text-lg w-[70%] text-center">
            100% Warranty
          </div>
          <p className="text-white font-medium max-w-[13rem] mt-5">
            Peace of mind with
            <span className="text-blue-600"> every</span> purchase
          </p>
          <p className="text-white/50 text-sm font-light max-w-[13rem] mt-5">
            We offer a full warranty on our products, guaranteeing their
            authenticity and functionality.
          </p>
        </div>
        <div className="w-[250px] hover:-translate-y-2 duration-500 flex flex-col justify-start items-center h-[330px] bg-[#1d1d2d] !z-50 rounded-xl">
          <img src="like.png" className="w-14 mb-2 -mt-8" />
          <div className="bg-blue-600 mt-4 rounded-md py-2 text-white font-semibold text-lg w-[70%] text-center">
            Legal Purchases
          </div>
          <p className="text-white font-medium max-w-[13rem] mt-5">
            Committed to
            <span className="text-blue-600"> legality</span> and
            <span className="text-blue-600"> transparency</span>
          </p>
          <p className="text-white/50 text-sm font-light max-w-[13rem] mt-5">
            All our products are legally obtained through regional pricing
            advantages. This means we provide genuine, legal products at lower
            prices.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
