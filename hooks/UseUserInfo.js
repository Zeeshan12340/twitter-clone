import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function UseUserInfo() {
    const {data: Session, status} = useSession();
    const [userInfo, setUserInfo] = useState(null);
  
    async function getUserInfo() {
      if (status === 'loading') return;
      if (Session === null) return;
      axios.get('/api/users?id=' + Session.user.id)
      .then(response => {
        setUserInfo(response.data.user);
      })
    }

    useEffect(() => {
      getUserInfo();
    }, [status])

    return {userInfo, setUserInfo, status}
}