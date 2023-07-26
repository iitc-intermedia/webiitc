import React from "react";
import Navbar from "./Navbar";
import Container from "@/components/molecules/Container";

const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden h-screen shadow">
      <div className="absolute inset-0 ">
        <div
          className="w-full bg-cover bg-no-repeat h-screen max-h-screen mt-20 bg-left  lg:bg-center"
          style={{
            backgroundImage: "url('/images/Website/bghero.svg')",
          }}
        />
      </div>
      <Container className="flex flex-col-reverse lg:flex-row h-[90vh] items-center justify-center z-10">
        <Navbar />

        <p className="font-black text-slate-800 z-10 text-2xl md:text-3xl lg:text-4xl leading-10 md:w-8/12 lg:w-6/12 text-center -mt-10">
          <span className="text-transparent bg-gradient-to-tr from-orange-500 to bg-yellow-300 bg-clip-text">
            Buktikan
          </span>{" "}
          bahwa kamu memiliki potensi emas dan{" "}
          <span className="text-transparent bg-gradient-to-tr from-orange-500 to bg-yellow-300 bg-clip-text">
            menangkan
          </span>{" "}
          event ini
        </p>
      </Container>
    </section>
  );
};

export default HeroSection;
