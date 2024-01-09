import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function useUserInfo() {
    const {data: Session, status} = useSession();
    const [userInfo, setUserInfo] = useState({});
    const [customStatus, setCustomStatus] = useState('loading');
  
    async function getUserInfo() {
      if (status === 'loading') return;
      await fetch('/api/users?id=' + Session.user.id)
      .then(res => res.json())
      .then(res => {
        setUserInfo(res.user);
        setCustomStatus('loaded');
      })
    }

    useEffect(() => {
      getUserInfo();
    }, [status])

    return {userInfo, customStatus}
}