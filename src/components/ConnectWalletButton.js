
import React from "react"

const ConnectWalletButton = ({connectWallet, ...props}) => {
  return (
    <button
    onClick={connectWallet}
    className="cta-button connect-to-wallet-button"
  >
    Connect to Wallet
  </button>
  )
}

export default ConnectWalletButton;