/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import links from '../../../constants/links';

const StyledFooter = styled.footer`
    ${'' /* position: fixed;
    left: 0;
    bottom: 0;
    width: 100%; */}
    margin-top: auto;
    background: var(--mainBlack);
    padding: 3.5rem;
    text-align: center;
    color: var(--mainWhite);
`;

const StyledLink = styled(Link)`
    display: inline-block;
    text-decoration: none;
    text-transform: uppercase;
    color: var(--mainWhite);
    margin: 0.5rem 1rem;
    letter-spacing: var(--mainSpacing);
    transition: var(--mainTransition);
    font-weight: bolder;
  :hover {
  color: var(--primaryColor);
  }
`;

const StyledCopyRight = styled.div`
    text-transform: capitalize;
    letter-spacing: var(--mainSpacing);
    line-height: 2;
`;

const Footer = () => (
  <StyledFooter>
    <div>
      {
            links.map((item, index) => (
              <StyledLink fade="true" key={index} to={item.path}>
                {item.text}
              </StyledLink>
            ))

          }
    </div>
    <StyledCopyRight>
      CopyRight &copy;Billy Li Code Challenge.

      {`${new Date().getFullYear()}.`}

      DO NOT COPY!
    </StyledCopyRight>

  </StyledFooter>

);
export default Footer;
