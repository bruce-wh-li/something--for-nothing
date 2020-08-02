import React from 'react';
import BackgroundImage from 'react-background-image';
import styled from 'styled-components';

// home props means the size and ingredians
const StyledHero = ({
  src, className, children, height,
}) => (
  <BackgroundImage className={className} src={src} height={height}>
    {children}
  </BackgroundImage>
);

export default styled(StyledHero)`
    min-height:${(props) => (props.height ? props.height : '100vh')};
    background-position: center;
    background-size:cover;
    display:block;
    justify-content:center;
    align-items:center;

`;
