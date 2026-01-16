"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChevronIconProps {
  isOpen: boolean;
}

const ChevronIcon: React.FC<ChevronIconProps> = ({ isOpen }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.3 }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </motion.svg>
);

interface FAQItem {
  question: string;
  answer: string;
}
import {
  Link,
  Button,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";
import { InfiniteMovingImages } from "./ui/infinite-moving-cards";

export function FAQ() {
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "Will I get banned for using your service?",
      answer: "All purchases are made legally and will not get you banned."
    },
    {
      question: "Which payment methods do you accept?",
      answer: "We only accept all cryptocurrencies as well as Binance pay and PayPal."
    },
    {
      question: "I have an issue with my order, what do I do?",
      answer: "You can contact our Support center on Discord."
    },
    {
      question: "I am not satisfied with my order, can I get a refund?",
      answer: "We are sorry to hear that, please contact us to discuss your issue further."
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center items-center mt-36 bg-transparent p-4">
      <Element name='faq'></Element>
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Frequently Asked Questions</h2>
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            className="mb-4 overflow-hidden rounded-lg bg-white bg-opacity-15 backdrop-filter backdrop-blur-md"
            initial={false}
            animate={{ 
              backgroundColor: activeIndex === index ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)"
            }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="w-full text-left p-4 focus:outline-none text-white"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item.question}</span>
                <ChevronIcon isOpen={activeIndex === index} />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-4 text-white">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;