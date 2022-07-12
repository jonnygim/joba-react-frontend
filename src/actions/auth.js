import { toast } from 'react-toastify';
import axios from 'axios';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function receiveLogin() {
  return {
    type: LOGIN_SUCCESS
  };
}

function loginError(payload) {
  return {
    type: LOGIN_FAILURE,
    payload,
  };
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

// logs the user out
export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('authenticated');
    dispatch(receiveLogout());
  };
}

const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/;
const BASEURL = 'http://localhost:3000/';

// 여기서 로그인 백엔드 요청 보내기
// 더미로 확인하는 법....?
export function loginUser(creds) {
  return (dispatch) => {
    dispatch(receiveLogin());
    // 여기에 요청 보내고 성공 실패 나누기 
    if (creds.email.match(pattern)!=null && creds.password.length >= 4) {
      axios({
        method: "post",
        url: BASEURL + "login",
        data: {
          email: creds.email,
          password: creds.password,
        },
      })
        .then((res) => {
          console.log(res);
          // dispatch(
          //   setUser({
          //     email: res.data.email,
          //     nickname: res.data.nickname,
          //   })
          // );
          // const accessToken = res.data.token;
          // //쿠키에 토큰 저장
          // setCookie("is_login", `${accessToken}`);
          // document.location.href = "/";
        })
        .catch((error) => {
          console.log(error);
        });
      localStorage.setItem('authenticated', true)

    } else if (!(creds.email.match(pattern) != null) ) {
      dispatch(loginError("이메일 형식이 올바르지 않습니다."));
      toast("이메일 형식이 올바르지 않습니다.");
    } else {
      dispatch(loginError('비밀번호는 4자 이상입니다.'));
      toast("비밀번호는 4자 이상입니다.");
    }
  }
}

