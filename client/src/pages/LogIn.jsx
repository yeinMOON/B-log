import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify, loginStateChange } from "../actions/index";
import { useDispatch } from "react-redux";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import styled from "styled-components";
import welcome from "../assets/images/welcome-page.jpg";
import Poppins from "../assets/fonts/Poppins-ExtraLight.woff";
import Button from "../components/Button";

const LoginSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 80px;
`;

const ImgAndLogin = styled.div`
  height: 650px;
  width: 1000px;
  display: flex;
`;

const Img = styled.img`
  @media screen and (max-width: 900px) {
    display: none;
  }
  width: 50%;
  height: 100%;
  object-fit: cover;
  box-shadow: -30px -30px 76px #d8d8d8;
`;

const LoginWrapper = styled.div`
  @media screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin-left: 250px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  box-shadow: 19px 19px 76px #d8d8d8;
  width: 50%;
  height: 100%;
  > a {
    color: #202123;
    text-decoration: none;
    :hover {
      font-weight: 700;
    }
  }
  .input_container {
    position: relative;
  }
`;

const LoginLogo = styled.h2`
  @font-face {
    font-family: "Poppins";
    src: local("Poppins"), url(${Poppins}) format("woff");
  }
  font-family: "Poppins", sans-serif;
  font-size: 40px;
  font-weight: 500;
  margin-bottom: 40px;
  letter-spacing: 2px;
  text-shadow: 2px 2px #dadada7a;
  color: #5a5553;
`;

const Icon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 0;
  top: 10px;
`;

const LoginInput = styled.input`
  margin-bottom: 40px;
  border: none;
  border-bottom: 1px solid #8d8d8d;
  outline: none;
  width: 180px;
  height: 36px;
  background-color: transparent;
  :focus {
    background-color: transparent;
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #6e6e6e;
    text-shadow: 0.5px 0.5px #ffffff;
    font-size: 12px;
    letter-spacing: 1px;
  }
`;

const LoginBtn = styled.div`
  margin: 40px 0;
`;

function LogIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regExpEmail =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });

  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };

  const loginHandler = () => {
    if (!loginInfo.email.length) {
      dispatch(notify("???????????? ??????????????????."));
    } else if (!loginInfo.password.length) {
      dispatch(notify("??????????????? ??????????????????."));
    } else if (!regExpEmail.test(loginInfo.email)) {
      dispatch(notify("????????? ????????? ????????? ????????????."));
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/auth/login`,
          { email: loginInfo.email, password: loginInfo.password },
          { withCredentials: true }
        )
        .then(() => {
          dispatch(loginStateChange(true));
          navigate("/");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatch(notify("????????? ????????? ????????? ??????????????? ???????????????."));
          } else {
            dispatch(notify("???????????? ??? ?????? ??????????????????."));
          }
        });
    }
  };

  const pressEnter = (e) => {
    if (e.key === "Enter") {
      loginHandler();
    }
  };

  return (
    <LoginSection>
      <ImgAndLogin>
        <Img src={welcome} alt="welcome page" />
        <LoginWrapper>
          <LoginLogo>Login</LoginLogo>
          <div className="input_container">
            <LoginInput
              type="text"
              placeholder=" ?????????"
              onChange={handleInputValue("email")}
            />
            <Icon icon={faUser} />
          </div>
          <div className="input_container">
            <LoginInput
              type="password"
              placeholder=" ????????????"
              onChange={handleInputValue("password")}
              onKeyUp={(e) => pressEnter(e)}
            />
            <Icon icon={faLock} />
          </div>
          <LoginBtn onClick={loginHandler}>
            <Button message={"?????????"} />
          </LoginBtn>
          <a href="/signup">????????????</a>
        </LoginWrapper>
      </ImgAndLogin>
    </LoginSection>
  );
}
export default LogIn;
