import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function UseUserInfo() {
    const {data: Session, status} = useSession();
    const [userInfo, setUserInfo] = useState(null);
    const [customStatus, setCustomStatus] = useState('loading');
  
    async function getUserInfo() {
      if (status === 'loading') return setCustomStatus('loading');
      if (Session === null) return setCustomStatus('loading');
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

    return {userInfo, setUserInfo, customStatus}
}