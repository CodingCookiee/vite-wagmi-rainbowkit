import React from 'react'
import { Text } from '../ui/common'

export default function Header() {
  return (
    <header className="w-full h-full p-4 flex justify-between items-center ">
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
    {/* Header wallet display - compact version */}
    {/* <div className="hidden sm:block">
      <WalletConnector showAccountInfo={false} />
    </div> */}
  </header>

  )
}
