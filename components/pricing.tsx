"use client";
import { useState, useEffect } from "react";
import {
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";

interface Product {
  category: string;
  subCategory?: string;
  title: string;
  sellixProductId: string;
  comingSoon?: boolean;
}

const Pricing = () => {
  const [activeFilter, setActiveFilter] = useState<string>("boosts");
  const [activeBoostDuration, setActiveBoostDuration] = useState<string>("1month");

  const boostProducts: Product[] = [
    {
      category: "boosts",
      subCategory: "1month",
      title: "4 Server Boosts",
      sellixProductId: "66a16e63d146b1",
    },
    {
      category: "boosts",
      subCategory: "1month",
      title: "8 Server Boosts",
      sellixProductId: "66a16e63d146b2",
    },
    {
      category: "boosts",
      subCategory: "1month",
      title: "14 Server Boosts",
      sellixProductId: "66a16e63d146b3",
    },
    {
      category: "boosts",
      subCategory: "3month",
      title: "4 Server Boosts",
      sellixProductId: "66a15df66436d1",
    },
    {
      category: "boosts",
      subCategory: "3month",
      title: "8 Server Boosts",
      sellixProductId: "66a15df66436d2",
    },
    {
      category: "boosts",
      subCategory: "3month",
      title: "14 Server Boosts",
      sellixProductId: "66a15df66436d3",
    },
    ...[4, 8, 14].map((amount, index) => ({
      category: "boosts",
      subCategory: "1year",
      title: `${amount} Server Boosts`,
      sellixProductId: `66a16e4743151${index + 1}`,
    })),
  ];

  const regularProducts: Product[] = [
    {
      category: "members",
      title: "Online Members",
      sellixProductId: "66a16e9b19bcc",
    },
    {
      category: "members",
      title: "Offline Members",
      sellixProductId: "66a16e90ad493",
    },
    {
      category: "members",
      title: "VC Bots",
      sellixProductId: "66a16e8b48722",
    },
    {
      category: "members",
      title: "Chat Bots",
      sellixProductId: "66a16e8460805",
    },
    {
      category: "reactions",
      title: "Emoji Reaction",
      sellixProductId: "66a16e788a67f",
    },
    {
      category: "reactions",
      title: "Button Reaction",
      sellixProductId: "66a16ebf3dc96",
    },
  ];

  const allProducts = [...boostProducts, ...regularProducts];
  const categories = Array.from(new Set(allProducts.map((item) => item.category)));

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

  const renderBoostDurationTabs = () => (
    <div className="flex justify-center gap-4 mb-8">
      {[
        { id: "1month", label: "1 Month" },
        { id: "3month", label: "3 Months" },
        { id: "1year", label: "1 Year" },
      ].map((duration) => (
        <button
          key={duration.id}
          className={`py-2 px-6 rounded-lg text-white ${
            activeBoostDuration === duration.id
              ? "bg-blue-600"
              : "bg-[#1d1d2d]"
          }`}
          onClick={() => setActiveBoostDuration(duration.id)}
        >
          {duration.label}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-center mx-auto flex-col text-center mt-32">
        <Element name="pricing" />
        <img
          src="r2.png"
          className="opacity-5 mx-auto w-72 -mt-64 mb-10"
          alt="background"
        />
        <p className="text-xl text-white font-medium mb-10">
          Pick the <span className="text-blue-600">best price</span> for you!
        </p>
      </div>

      <div className="mb-8">
        <div className="filter-buttons flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-button text-white py-2 px-4 rounded ${
                activeFilter === category
                  ? "active bg-blue-600"
                  : "bg-[#1d1d2d]"
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeFilter === "boosts" && renderBoostDurationTabs()}

      <div className="flex justify-center px-4">
        <div className={`flex flex-wrap justify-center gap-8 ${activeFilter === "boosts" ? "max-w-[1000px]" : "max-w-[1600px]"}`}>
          {activeFilter === "boosts"
            ? boostProducts
                .filter((item) => item.subCategory === activeBoostDuration)
                .map((product) => (
                  <div
                    key={product.sellixProductId}
                    className="bg-[#1d1d2d] rounded-xl flex flex-col items-center justify-center p-6 w-[300px]"
                  >
                    <h4 className="text-2xl text-white mt-3 font-medium">
                      {product.title}
                    </h4>
                    <hr className="w-[70%] mt-4 mb-4 bg-white/30 h-[2px] border-0" />
                    <button
                      type="button"
                      data-sellix-group={product.sellixProductId}
                      className="hover:scale-95 duration-500 px-10 py-2 rounded-lg bg-blue-600 text-white font-medium"
                    >
                      Purchase Now
                    </button>
                  </div>
                ))
            : regularProducts
                .filter((item) => item.category === activeFilter)
                .map((product) => (
                  <div
                    key={product.sellixProductId}
                    className="bg-[#1d1d2d] rounded-xl flex flex-col items-center justify-center p-6 w-[300px]"
                  >
                    <h4 className="text-2xl text-white mt-3 font-medium">
                      {product.title}
                    </h4>
                    <hr className="w-[70%] mt-4 mb-4 bg-white/30 h-[2px] border-0" />
                    <button
                      type="button"
                      data-sellix-group={product.sellixProductId}
                      className="hover:scale-95 duration-500 px-10 py-2 rounded-lg bg-blue-600 text-white font-medium"
                    >
                      Purchase Now
                    </button>
                  </div>
                ))}
        </div>
      </div>

      <p className="text-xl mt-8 text-white/10 font-medium text-center">
        and more...
      </p>
      <div className="flex-row gap-4 hidden md:flex justify-center mx-auto mt-10">
        <img src="payment/pp.png" className="h-10" draggable="false" alt="PayPal" />
        <img src="payment/tether.png" className="h-10" draggable="false" alt="Tether" />
        <img src="payment/usdc.png" className="h-10" draggable="false" alt="USDC" />
        <img src="payment/btc.png" className="h-10" draggable="false" alt="Bitcoin" />
        <img src="payment/eth.png" className="h-10" draggable="false" alt="Ethereum" />
        <img src="payment/ltc.png" className="h-10" draggable="false" alt="Litecoin" />
        <img src="payment/bnb.png" className="h-10" draggable="false" alt="BNB" />
      </div>
      <div className="flex-row gap-4 md:hidden flex justify-center mx-auto mt-10">
        <img src="payment/pp.png" className="h-10" draggable="false" alt="PayPal" />
        <img src="payment/tether.png" className="h-10" draggable="false" alt="Tether" />
        <img src="payment/usdc.png" className="h-10" draggable="false" alt="USDC" />
        <img src="payment/btc.png" className="h-10" draggable="false" alt="Bitcoin" />
      </div>
      <div className="flex-row gap-4 md:hidden flex justify-center mx-auto mt-5">
        <img src="payment/eth.png" className="h-10" draggable="false" alt="Ethereum" />
        <img src="payment/ltc.png" className="h-10" draggable="false" alt="Litecoin" />
        <img src="payment/bnb.png" className="h-10" draggable="false" alt="BNB" />
      </div>
      <div className="w-[20rem] h-[20rem] rounded-full blur-[200px] absolute mt-52 right-1 -left-52 bg-[#6583e3]" />
    </div>
  );
};

export default Pricing;