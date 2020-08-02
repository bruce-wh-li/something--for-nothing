/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-array-index-key */
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IoIosOptions } from 'react-icons/io';
import links from '../../../constants/links';
import Logo from '../../../asset/logo/logo.svg';
import AuthContext from '../../utils/context/auth-context';

const StyledNav = styled.nav`

  @media screen and (min-width: 992px) {
    height: 72px; 
    }
    background-color:var(--mainWhite);
`;

const StyledNavCenter = styled.div` 
margin: 0px;
position: -webkit-sticky;
position: sticky;

 @media screen and (min-width: 992px) {
      height:86px;
      max-width: 1170px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
 }
`;

// 这个是缩小了之后需要的css
const StyledNavBarHeader = styled.div`

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0rem;
  
`;
const StyledLinkLikeBtn = styled.button`
  display: block;
    padding: 0.7rem 1.25rem;
    text-decoration: none;
    text-transform: capitalize;
    text-align: center;
    color: var(--mainBlack);
    transition: var(--mainTransition);
    font-weight: bolder;
    letter-spacing: 2px;
    border: none;
    background: white;
    font-family: inherit;
 :hover {
    color: var(--primaryColor);
  }
`;
const StyledMenueBtn = styled.button`
 background: transparent;
    border: none;
    outline: none;
  
  .logoBtn:hover {
    cursor: pointer;
  }
  @media screen and (min-width: 992px) {
      display: none;
    }
`;

const StyledMenueIcon = styled(IoIosOptions)`
    color: var(--primaryColor);
    font-size: 2rem;
`;

const StyledImgLogo = styled.img`
  width:  150px;
}
`;

const StyledNavLinks = styled.ul`
    list-style-type: none;
    transition: var(--mainTransition);
    height: ${(props) => (!props.toggle ? '0' : '175px')};
    overflow: hidden;
    @media screen and (min-width: 992px) {
      height: auto;
      display: flex;
    }
`;

const StyledLink = styled(Link)`
    display: block;
    padding: 0.7rem 1.25rem;
    text-decoration: none;
    text-transform: capitalize;
    text-align: center;
    color: var(--mainBlack);
    transition: var(--mainTransition);
    font-weight: bolder;
    letter-spacing: 2px;
 :hover {
    color: var(--primaryColor);
  }
`;

const Header = () => {
  const [isNavOpen, setNavIcon] = useState(false);
  const toggleNav = () => {
    setNavIcon(!isNavOpen);
  };
  const auth = useContext(AuthContext);
  const onLogoutHandler = () => {
    auth.logout();
  };
  return (
    <StyledNav>
      <StyledNavCenter>
        <StyledNavBarHeader>
          <StyledImgLogo src={Logo} alt="blog logo" />
          <StyledMenueBtn type="button" onClick={toggleNav}>
            <StyledMenueIcon />
          </StyledMenueBtn>
        </StyledNavBarHeader>
        <StyledNavLinks toggle={isNavOpen}>
          {
            links.map((item, index) => (
              <li key={index}>
                <StyledLink fade="true" to={item.path}>
                  {item.text}
                </StyledLink>

              </li>
            ))

          }
          {auth.isLoggedIn
            && (
              <li>

                <StyledLinkLikeBtn onClick={onLogoutHandler} type="button">
                  Sign Out
                </StyledLinkLikeBtn>
              </li>
            )}
          {
            !auth.isLoggedIn
            && (
              <li>

                <StyledLink to="/signin">
                  Sign in
                </StyledLink>
              </li>
            )
           }
        </StyledNavLinks>

      </StyledNavCenter>
    </StyledNav>
  );
};

export default Header;
