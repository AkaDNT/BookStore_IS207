"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
    >
      <div className="flex flex-col gap-3 items-center">
        <div className="mt-6">
          <Link href="/" className="text-2xl font-bold" scroll={false}>
            WKangaroo
          </Link>
        </div>
        <nav>
          <ul className="flex justify-center items-center gap-3 mt-3 font-bold text-[0.9rem]">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
        </nav>
        <div className="flex space-x-4 mb-4">
          <a href="#" aria-label="Facebook" className="hover:text-primary-600">
            <FontAwesomeIcon size="2xl" icon={faFacebook} className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-primary-600">
            <FontAwesomeIcon
              size="2xl"
              icon={faInstagram}
              className="h-6 w-6"
            />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-primary-600">
            <FontAwesomeIcon size="2xl" icon={faTwitter} className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Linkedin" className="hover:text-primary-600">
            <FontAwesomeIcon size="2xl" icon={faLinkedin} className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Youtube" className="hover:text-primary-600">
            <FontAwesomeIcon size="2xl" icon={faYoutube} className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 flex justify-center space-x-4">
          <span>© WKangaroo. All rights reserved.</span>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterSection;
