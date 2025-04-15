import React from "react";
import { Text } from "../ui/common";
import { Link } from "react-router-dom";
import { Button } from "../ui/common";

export default function Header() {
  return (
    <header className="w-full h-full px-5 py-5 flex justify-between items-center ">
      <div className="flex items-center">
        <img
          src="/favicon.png"
          alt="NFT Nexus Logo"
          className="h-10 w-10 mr-2"
        />
        <Text
          variant="h2"
          weight="semibold"
          className="bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
        >
          NFT Nexus
        </Text>
      </div>
      <div className="flex items-center justify-center px-5">
        <Link to="/">
          <Button variant="default" >
            Home
          </Button>
        </Link>
      </div>
    </header>
  );
}
