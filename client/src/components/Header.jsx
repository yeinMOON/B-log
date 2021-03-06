import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStateChange,
  updateRack,
  updateShelf,
  notify,
} from "../actions/index";
import styled from "styled-components";
import axios from "axios";
import logo from "../assets/images/logo.svg";

export const HeaderBox = styled.div`
  width: 100vw;
  padding: 10px 0;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f5f5f5;
  box-shadow: 0px 2px 20px rgba(141, 141, 141, 0.3);
  z-index: 1000;
`;

export const LogoBox = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  flex: 1 0 auto;
`;

const Logo = styled.img`
  display: inline-block;
  width: 120px;
  height: 60px;
  margin-left: 40px;
`;

export const Nav = styled.nav`
  flex: 0 0 auto;
`;

export const Menu = styled.div`
  display: inline-block;
  padding: 10px 20px;
  letter-spacing: 0.1em;
  cursor: pointer;
  &:last-child {
    margin: 0px 40px;
  }
  :hover {
    font-weight: 700;
  }
`;

function Header() {
  const state = useSelector((state) => state.loginReducer);
  const { isLogIn } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/logout`, null, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/");
        dispatch(loginStateChange(false));
        dispatch(updateRack([]));
        dispatch(updateShelf([]));
        dispatch(notify("로그아웃 되었습니다."));
      });
  };

  return (
    <HeaderBox>
      <LogoBox>
        <Link to="/">
          <Logo src={logo} />
        </Link>
      </LogoBox>
      <Nav>
        {isLogIn ? (
          <Menu onClick={() => navigate("/mypage")}>내 책장</Menu>
        ) : null}
        {isLogIn ? (
          <Menu onClick={logoutHandler}>로그아웃</Menu>
        ) : (
          <Link to="/login">
            <Menu>로그인</Menu>
          </Link>
        )}
      </Nav>
    </HeaderBox>
  );
}
export default Header;
