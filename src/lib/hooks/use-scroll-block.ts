"use client";

import { useEffect } from "react";


let locks = 0;
let saved = { overflow: "", gutter: "" };

export function useScrollBlock() {
  useEffect(() => {
    const html = document.documentElement;

    if (locks === 0) {
      saved = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
      html.style.overflow = "hidden";
      html.style.scrollbarGutter = "stable";
    }
    locks++;

    return () => {
      locks--;
      if (locks === 0) {
        html.style.overflow = saved.overflow;
        html.style.scrollbarGutter = saved.gutter;
      }
    };
  }, []);
}