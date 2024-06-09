import  { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';

export const TextGenerateEffect = ({ words, className }) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      { opacity: 1 },
      { duration: 2, delay: stagger(0.07) }
    );
  }, [scope.current]);

  const randomColors = [
    "blueGrey1",
    "blueGrey2",
    "blueGrey3",
    "blueGrey4",
    "blueGrey5",
    "blueGrey6",
  ]


  const renderWords = () => {
    return (
      <motion.div ref={scope} >
        {wordsArray.map((word, idx) => (
          <motion.span key={word + idx} className="text-slate-500 text-black opacity-0">
            {word} {" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={`font-bold ${className}`}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide text-justify">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
