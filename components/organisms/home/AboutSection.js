import Button from "@/components/atoms/Button";
import Countdown from "@/components/atoms/Countdown";
import FlashParagraph from "@/components/atoms/FlashParagraph";
import { Container } from "../../../components";
import Text from "@/components/atoms/Text";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const AboutSection = () => {
  return (
    <section id="about" className=" w-full">
      <Container>
        <div className="w-11/12 mx-auto flex flex-col  md:flex-row  md:items-center ">
          <article className="w-11/12  md:w-6/12 flex flex-col space-y-4 ml-3 md:ml-0 justify-center">
            <div className="text-center w-full mt-10 text-xs md:text-md lg:text-lg">
              <FlashParagraph
                isHorizontal={true}
                value={"Show your skill to the world"}
              />
            </div>
            <Text
              size={"mdtitle"}
              additionals={
                "leading-relaxed text-xl md:text-3xl lg:text-4xl mb-10 md:mb-0"
              }
              color={"dark"}
              weight={"bold"}
            >
              Tunjukan skillmu dan raih kemenangan mutlak !
            </Text>
            <Text color={"dark"} additionals="text-justify md:text-start ">
              Event ini di adakan untuk anak muda generasi Z yang bersaing
              secara sportif dan juga penuh semangat, penilaian dalam event ini
              sepenuhnya dilakukan secara adil dan profesional.
            </Text>
            <Countdown />
            <Link href={"/signup"}>
              <Button size={"lg"} additionals={"w-60"}>
                Daftar Sekarang
              </Button>
            </Link>
          </article>

          <Image
            src={"/images/showofFix.png"}
            alt="Gambar Tunjukan Skill"
            width={1080}
            height={1080}
            className="md:w-6/12 md:bg-contain self-start w-full object-cover bg-red-500 -ml-5 md:-ml-0"
          />
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
