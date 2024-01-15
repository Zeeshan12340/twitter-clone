import { useRouter } from 'next/router'

export default function Layout({children, userInfo, logout}) {
    const router = useRouter()
    function redirectLogin() {
        router.push('/login')
    }

    return (
        <>
        <div className="">
            {/* left content */}
            <div>

            </div>

            {/* main content */}
            <div className="max-w-lg mx-auto min-h-screen border-l border-r border-socialBorder">
                {children}
            </div>

            {/* right content */}
            <div className="fixed" style={{ right: 0, top: 0 }} >
                {!userInfo && (router.pathname == "/") && (
                    <div className="mr-8 my-5">
                        <button className="bg-socialWhite text-black px-5 py-2 rounded-full" onClick={redirectLogin}>Login</button>
                    </div>
                )}
                {userInfo && (router.pathname == "/") && (
                    <div className="mr-8 my-5">
                        <button className="bg-socialWhite text-black px-5 py-2 rounded-full" onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}