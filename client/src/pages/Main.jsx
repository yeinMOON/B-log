import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateRack,
  updateShelf,
  getSearchKeyword,
  loginStateChange,
  getSearchResult,
} from "../actions/index";
import styled from "styled-components";
import SearchInput from "../components/SearchInput";
import BookGrid from "../components/BookGrid";
import BookInfoModal from "../components/BookInfoModal";
import BookMarkModal from "../components/BookMarkModal";
import Footer from "../components/Footer";
import Qwigley from "../assets/fonts/Qwigley-Regular.woff";
// import Poppins from "../assets/fonts/Poppins-ExtraLightItalic.woff";
// import Poppins from "../assets/fonts/Poppins-Light.woff";
import Poppins from "../assets/fonts/Poppins-ExtraLight.woff";
import axios from "axios";

import { noTop10 } from "../assets/dummy/noResponse";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 60px;

  .grid_container {
    padding: 40px;
  }

  .title {
    color: #443128;
    font-size: 18px;
    font-weight: 400;
    margin: 15px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid #e0e0d8;
  }
`;

const MainLogo = styled.div`
  /* @font-face {
    font-family: "Qwigley";
    src: local("Qwigley"), url(${Qwigley}) format("woff");
  }
  font-family: "Qwigley", "cursive"; */
  @font-face {
    font-family: "Poppins";
    src: local("Poppins"), url(${Poppins}) format("woff");
  }
  font-family: "Poppins", sans-serif;
  font-size: 100px;
  color: #594d49;
  margin: 70px 0px 30px 0;
  text-shadow: 5px 5px #e0e0d8;
`;

function Main() {
  const state = useSelector((state) => state.bookReducer);
  const loginState = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const { isLogIn } = loginState;
  const { rack, shelf } = state;
  const [infoOpen, setInfoOpen] = useState(false);
  const [markOpen, setMarkOpen] = useState(false);
  const [bookinfo, setBookinfo] = useState({});
  const [top10, setTop10] = useState(noTop10);
  const [new10, setNew10] = useState(noTop10);
  const myBooks = [...rack, ...shelf];

  const getTop10 = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/books`)
      .then((res) => setTop10(res.data.books))
      .catch(() => setTop10(noTop10));
  };

  const getPopular = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/books/users`)
      .then((res) => setNew10(res.data.books))
      .catch(() => setNew10(noTop10));
  };

  const getMyBooks = async () => {
    if (isLogIn) {
      const rackRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/mypage/rack`,
        { withCredentials: true }
      );
      const shelfRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/mypage/shelf`,
        { withCredentials: true }
      );
      try {
        dispatch(updateRack(rackRes.data.books));
        dispatch(updateShelf(shelfRes.data.books));
        dispatch(loginStateChange(true));
      } catch (err) {
        dispatch(loginStateChange(false));
        dispatch(updateRack([]));
        dispatch(updateShelf([]));
      }
    }
  };

  const infoModalHandler = (book) => {
    setBookinfo(book);
    setInfoOpen(true);
  };

  const markModalHandler = (book) => {
    setBookinfo(book);
    setMarkOpen(true);
  };

  useEffect(() => {
    getMyBooks();
    getTop10();
    getPopular();
    dispatch(getSearchKeyword(""));
    dispatch(getSearchResult([]));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Wrapper>
        <MainLogo>B : log</MainLogo>
        <SearchInput />
        <div className="grid_container">
          <h3 className="title">새로운 책을 찾고 있나요?</h3>
          <BookGrid
            infoModalHandler={infoModalHandler}
            markModalHandler={markModalHandler}
            myBooks={myBooks}
            books={top10}
            col={5}
          />
        </div>
        <div className="grid_container">
          <h3 className="title">다른 회원들은 지금...</h3>

          <BookGrid
            infoModalHandler={infoModalHandler}
            markModalHandler={markModalHandler}
            myBooks={myBooks}
            books={new10}
            col={5}
          />
        </div>
      </Wrapper>
      <Footer />
      {infoOpen && (
        <BookInfoModal setInfoOpen={setInfoOpen} bookinfo={bookinfo} />
      )}
      {markOpen && (
        <BookMarkModal setMarkOpen={setMarkOpen} bookinfo={bookinfo} />
      )}
    </>
  );
}

export default Main;
