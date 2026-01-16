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
  price: string;
  guarantees: string[];
  sellixProductId: string;
}

const Pricing = () => {
  const [activeFilter, setActiveFilter] = useState<string>("boosts");
  const [activeBoostDuration, setActiveBoostDuration] =
    useState<string>("1month");

  const boostProducts: Product[] = [
    {
      category: "boosts",
      subCategory: "1month",
      title: "4 Server Boosts",
      price: "$2.49",
      guarantees: ["30 Days Warranty", "Instant Delivery", "Server Level 1"],
      sellixProductId: "278603",
    },
    {
      category: "boosts",
      subCategory: "1month",
      title: "8 Server Boosts",
      price: "$4.99",
      guarantees: ["30 Days Warranty", "Instant Delivery", "Server Level 2"],
      sellixProductId: "278606",
    },
    {
      category: "boosts",
      subCategory: "1month",
      title: "14 Server Boosts",
      price: "$7.99",
      guarantees: ["30 Days Warranty", "Instant Delivery", "Server Level 3"],
      sellixProductId: "278607",
    },
    {
      category: "boosts",
      subCategory: "1month",
      title: "30 Server Boosts",
      price: "$17.49",
      guarantees: ["30 Days Warranty", "Instant Delivery", "Server Level 3"],
      sellixProductId: "278608",
    },
    {
      category: "boosts",
      subCategory: "3month",
      title: "4 Server Boosts",
      price: "$3.99",
      guarantees: ["90 Days Warranty", "Instant Delivery", "Server Level 1"],
      sellixProductId: "278609",
    },
    {
      category: "boosts",
      subCategory: "3month",
      title: "8 Server Boosts",
      price: "$7.99",
      guarantees: ["90 Days Warranty", "Instant Delivery", "Server Level 2"],
      sellixProductId: "278610",
    },
    {
      category: "boosts",
      subCategory: "3month",
      title: "14 Server Boosts",
      price: "$13.99",
      guarantees: ["90 Days Warranty", "Instant Delivery", "Server Level 3"],
      sellixProductId: "278611",
    },
    {
      category: "boosts",
      subCategory: "3month",
      title: "30 Server Boosts",
      price: "$29.99",
      guarantees: ["90 Days Warranty", "Instant Delivery", "Server Level 3"],
      sellixProductId: "278613",
    },
    {
      category: "boosts",
      subCategory: "1year",
      title: "14 Server Boosts",
      price: "$49.99",
      guarantees: ["365 Days Warranty", "Instant Delivery", "Server Level 3"],
      sellixProductId: "278615",
    },
    {
      category: "boosts",
      subCategory: "1year",
      title: "30 Server Boosts",
      price: "$94.99",
      guarantees: ["365 Days Warranty", "Instant Delivery", "Server Level 3"],
      sellixProductId: "278616",
    },
  ];

  const regularProducts: Product[] = [
    {
      category: "members",
      title: "Online Members",
      price: "$0.99/100",
      guarantees: ["Instant Delivery", "Realistic Members"],
      sellixProductId: "278678",
    },
    {
      category: "members",
      title: "Offline Members",
      price: "$0.79/100",
      guarantees: ["Instant Delivery", "Realistic Members"],
      sellixProductId: "278677",
    },
    {
      category: "members",
      title: "VC Bots",
      price: "$0.49",
      guarantees: [
        "Instant Delivery",
        "Realistic Members",
        "Stays in Voice Chat",
      ],
      sellixProductId: "278680",
    },
    {
      category: "members",
      title: "Chat Bots",
      price: "$0.49",
      guarantees: [
        "Instant Delivery",
        "Realistic Members",
        "Talks in Chat",
        "Interacts with Members",
      ],
      sellixProductId: "278681",
    },
    {
      category: "reactions",
      title: "Emoji Reaction",
      price: "$0.99/100",
      guarantees: ["Instant Delivery", "Custom Emoji Reactions"],
      sellixProductId: "278682",
    },
    {
      category: "reactions",
      title: "Button Reaction",
      price: "$0.99/100",
      guarantees: ["Instant Delivery", "Custom Button Clicks"],
      sellixProductId: "278683",
    },
  ];

  const allProducts = [...boostProducts, ...regularProducts];
  const categories = Array.from(
    new Set(allProducts.map((item) => item.category))
  );

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
            activeBoostDuration === duration.id ? "bg-blue-600" : "bg-[#1d1d2d]"
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
        <div
          className={`flex flex-wrap justify-center gap-8 ${
            activeFilter === "boosts" ? "max-w-[1000px]" : "max-w-[1600px]"
          }`}
        >
          {activeFilter === "boosts"
            ? boostProducts
                .filter((item) => item.subCategory === activeBoostDuration)
                .map((product) => (
                  <div
                    key={product.sellixProductId}
                    className="bg-[#1d1d2d] rounded-xl flex flex-col items-center justify-center p-6 w-[300px]"
                  >
                    <p className="text-lg text-white/70 font-medium">
                      {product.price}
                    </p>
                    <h4 className="text-2xl text-white mt-1 font-medium">
                      {product.title}
                    </h4>
                    <hr className="w-[70%] mt-4 mb-4 bg-white/30 h-[2px] border-0" />
                    <button
                      type="button"
                      data-sell-store="57232"
                      data-sell-product={product.sellixProductId}
                      data-sell-theme=""
                      data-sell-darkmode="true"
                      className="hover:scale-95 duration-500 px-10 py-2 rounded-lg bg-blue-600 text-white font-medium mb-4"
                    >
                      Purchase Now
                    </button>
                    <div className="flex flex-col items-center w-full">
                      {product.guarantees.map((guarantee, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="#2563eb"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-white/80 text-sm">
                            {guarantee}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            : regularProducts
                .filter((item) => item.category === activeFilter)
                .map((product) => (
                  <div
                    key={product.sellixProductId}
                    className="bg-[#1d1d2d] rounded-xl flex flex-col items-center justify-center p-6 w-[300px]"
                  >
                    <p className="text-lg text-white/70 font-medium">
                      {product.price}
                    </p>
                    <h4 className="text-2xl text-white mt-1 font-medium">
                      {product.title}
                    </h4>
                    <hr className="w-[70%] mt-4 mb-4 bg-white/30 h-[2px] border-0" />
                    <button
                    type="button"
                    data-sell-store="57232"
                    data-sell-product={product.sellixProductId}
                    data-sell-theme=""
                    data-sell-darkmode="true"
                      className="hover:scale-95 duration-500 px-10 py-2 rounded-lg bg-blue-600 text-white font-medium mb-4"
                    >
                      Purchase Now
                    </button>
                    <div className="flex flex-col items-center w-full">
                      {product.guarantees.map((guarantee, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="#2563eb"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-white/80 text-sm">
                            {guarantee}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
        </div>
      </div>

      <p className="text-xl mt-8 text-white/10 font-medium text-center">
        and more...
      </p>
      <div className="flex-row gap-4 hidden md:flex justify-center mx-auto mt-10">
        <img
          src="payment/pp.png"
          className="h-10"
          draggable="false"
          alt="PayPal"
        />
        <img
          src="payment/tether.png"
          className="h-10"
          draggable="false"
          alt="Tether"
        />
        <img
          src="payment/usdc.png"
          className="h-10"
          draggable="false"
          alt="USDC"
        />
        <img
          src="payment/btc.png"
          className="h-10"
          draggable="false"
          alt="Bitcoin"
        />
        <img
          src="payment/eth.png"
          className="h-10"
          draggable="false"
          alt="Ethereum"
        />
        <img
          src="payment/ltc.png"
          className="h-10"
          draggable="false"
          alt="Litecoin"
        />
        <img
          src="payment/bnb.png"
          className="h-10"
          draggable="false"
          alt="BNB"
        />
      </div>
      <div className="flex-row gap-4 md:hidden flex justify-center mx-auto mt-10">
        <img
          src="payment/pp.png"
          className="h-10"
          draggable="false"
          alt="PayPal"
        />
        <img
          src="payment/tether.png"
          className="h-10"
          draggable="false"
          alt="Tether"
        />
        <img
          src="payment/usdc.png"
          className="h-10"
          draggable="false"
          alt="USDC"
        />
        <img
          src="payment/btc.png"
          className="h-10"
          draggable="false"
          alt="Bitcoin"
        />
      </div>
      <div className="flex-row gap-4 md:hidden flex justify-center mx-auto mt-5">
        <img
          src="payment/eth.png"
          className="h-10"
          draggable="false"
          alt="Ethereum"
        />
        <img
          src="payment/ltc.png"
          className="h-10"
          draggable="false"
          alt="Litecoin"
        />
        <img
          src="payment/bnb.png"
          className="h-10"
          draggable="false"
          alt="BNB"
        />
      </div>
      <div className="w-[20rem] h-[20rem] rounded-full blur-[200px] absolute mt-52 right-1 -left-52 bg-[#6583e3]" />
    </div>
  );
};

export default Pricing;
