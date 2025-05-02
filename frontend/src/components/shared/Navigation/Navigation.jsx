import React from 'react';
import styles from "./Navigation.module.css";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../../../http/index';
import {setAuth} from "../../../store/authSlice"

const Navigation = () => {

    const { isAuth, user } = useSelector((state) => state.auth);
const dispatch=useDispatch();

  async function logoutUser() {
        try {
            const { data } = await logout();
            dispatch(setAuth(data));
        } catch (err) {
            console.log(err);
        }
    }



  return (
    <div className={styles.nav}>
        <div className={styles.logo}><img src="/images/daimand.png" alt="logo" className={styles.image} /></div>
        <h1>Easy-Class</h1>
        
           {isAuth && (
                          <div className={styles.navRight}>
                              <h3>{user?.name}</h3>
                              <Link to="/">
                                  <img
                                      className={styles.avatar}
                                      src={
                                          user.avatar
                                              ? user.avatar
                                              : '/images/monkey-avatar.png'
                                      }
                                      width="40"
                                      height="40"
                                      alt="avatar"
                                  />
                              </Link>
                              <button
                                  className={styles.logoutButton}
                                  onClick={logoutUser}
                              >
                                  <img src="/images/logout.png" alt="logout" />
                              </button>
                          </div>
                      )}
       
    </div>
  )
}

export default Navigation