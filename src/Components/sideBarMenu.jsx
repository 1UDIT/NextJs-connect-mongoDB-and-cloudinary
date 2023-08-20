"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import Link from "next/link";

const navigationRoutes = ["home", "Blog", "About", "contact"];

const menuAnimation = {
  hidden: {
    opacity: 0,
    height: 0,
    padding: 0,
    transition: { duration: 0.3, when: "afterChildren" },
  },
  show: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
    },
  },
};
const menuItemAnimation = {
  hidden: (i) => ({
    padding: 0,
    x: "-100%",
    transition: {
      duration: (i + 1) * 0.1,
    },
  }),
  show: (i) => ({
    x: 0,
    transition: {
      duration: (i + 1) * 0.1,
    },
  }),
};

const SidebarMenu = ({ route, showAnimation, isOpen, setIsOpen }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen]);
  return (
    <>
      <div className="menu" onClick={toggleMenu}>
        <div className="menu_item">
          <div className="icon">{route.icon}</div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="link_text"
              >
                {route.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isOpen && (
          <motion.div
            animate={
              isMenuOpen
                ? {
                  rotate: -90,
                }
                : { rotate: 0 }
            }
          >
            <FaAngleDown />
          </motion.div>
        )}
      </div>{" "}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="menu_container"
          >
            {/* {navigationRoutes.map((singleRoute) => {
              return (
                <NavigationLink
                  key={singleRoute}
                  href={`/${singleRoute}`}
                  text={singleRoute}
                  router={router}
                />
              );
            })} */}

            {route.subRoutes.map((subRoute, i) => (
              <motion.div variants={menuItemAnimation} key={i} custom={i}>
                <Link to={subRoute.path} className="link" prefetch={true}
                  aria-label={subRoute.path}
                  rel="stylesheet preload" >
                  <div className="icon">{subRoute.icon}</div>
                  <motion.div className="link_text">{subRoute.name}</motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}{" "}
      </AnimatePresence>
    </>
  );
};

// function NavigationLink({ href, text, router }) {
//   const isActive = router.asPath === (href === "/home" ? "/" : href);
//   return (
//       <Link href={href === "/home" ? "/" : href} passHref className={`${isActive && "nav_item_active"} nav_item`}>
//           {text}
//       </Link>
//   );
// }

export default SidebarMenu;