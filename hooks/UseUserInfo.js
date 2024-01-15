import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function UseUserInfo() {
    const {data: Session, status} = useSession();
    const [userInfo, setUserInfo] = useState(null);
    const [customStatus, setCustomStatus] = useState('loading');
  
    async function getUserInfo() {
      if (status === 'loading') return setCustomStatus('loading');
      if (Session === null) return setCustomStatus('loading');
      axios.get('/api/users?id=' + Session.user.id)
      .then(response => {
        setUserInfo(response.data.user);
        setCustomStatus('loaded');
      })
    }

    useEffect(() => {
      getUserInfo();
    }, [status])

    return {userInfo, setUserInfo, customStatus}
}