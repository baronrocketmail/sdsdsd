import '../styles/globals.css'
import {useContext, useState} from "react"

function MyApp({ Component, pageProps }) {
  return (
      <div className={"light"}>
      <Component  {...pageProps} />
      </div>
  )
}

export default MyApp
