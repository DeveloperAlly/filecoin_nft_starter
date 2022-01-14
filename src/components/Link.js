import React from "react"

  const Link = ({link, description, ...props}) => {
    return (
      <p>
      <a className="footer-text" href={link} target="_blank" rel="noreferrer">
        {description}
      </a>
    </p>
    )
  }

  export default Link;