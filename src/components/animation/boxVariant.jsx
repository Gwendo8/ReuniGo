const boxVariant = {
  hidden: {
    y: 100,
    opacity: 0,
    scale: 0.8,
    rotateX: -90,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    scale: 0.8,
    rotateX: 90,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

export default boxVariant;
