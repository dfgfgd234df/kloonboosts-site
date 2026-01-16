"use client";

import React, { useEffect } from "react";
import Swiper from 'swiper';
import { Grid, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/autoplay';

import {
  Link,
  Button,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";
import { InfiniteMovingImages } from "./ui/infinite-moving-cards";

export function Reviews() {
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
  useEffect(() => {
    const swiper = new Swiper(".mySwiper", {
      modules: [Grid, Autoplay],
      slidesPerView: 1,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        700: {
          slidesPerView: 2,
          spaceBetween: 30,
          grid: {
            rows: 2,
            fill: "row",
          },
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
          grid: {
            rows: 2,
            fill: "row",
          },
        }
      },
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  const reviews = [
    { name: "Slappy", content: "Super fast service, 10/10 for sure" },
    { name: "Davoguha", content: "Fully boosted, very fast. No problems at all, I recommend these guys 100%" },
    { name: "alto", content: "Extremely fast and reliable" },
    { name: "Billy", content: "Bought 3 month boosts, super fast service" },
    { name: "Ahi", content: "+rep awesoem giveaway and fast boost delivery 11/10" },
    { name: "dxvil", content: "++vouch 1000 online members, 1000 offline members - legit, fast and super good! 10/10" },
    { name: "toes", content: "Patient and understanding as well as very fast 10/10" },
    { name: "bob", content: "My 10th time ordering products here, legit fast and easy" },
    { name: "CERTI", content: "Amazing support. Received boosts within minutes of a ticket open and payment made. Cannot recommend enough" },
    { name: ".i.m.c", content: "+vouch So Fast! I opened a ticket and i had my boosts within 10 Minutes! definetly reccomend, and i will use again." },
  ];

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" className="w-4 h-4 inline-block ml-1">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="max-w-[1500px] mt-48 mx-auto px-4">
      <Element name="reviews"></Element>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Our Reviews</h2>
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          {reviews.map((review, index) => (
            <li key={index} className="swiper-slide">
              <div className="bg-white/15 text-white backdrop-blur-md rounded-xl shadow-lg p-6 h-[200px] flex flex-col justify-between transition-all duration-300 hover:bg-white/20">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-lg font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                      {review.name}
                    </h5>
                    <span className="text-[#2563eb] font-medium flex items-center">
                      Verified
                      <StarIcon />
                    </span>
                  </div>
                  <div className="flex-grow overflow-y-auto">
                    <p className="text-sm leading-relaxed text-gray-300">{review.content}</p>
                  </div>
                </div>
                <div className="text-right mt-2 text-white font-medium">
                  <span>Kloon<span className="text-[#2563eb]">boosts</span></span>
                </div>
              </div>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews;