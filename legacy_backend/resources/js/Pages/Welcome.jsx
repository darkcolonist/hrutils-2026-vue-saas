import ApplicationLogo from '@/SvgIcons/ApplicationLogo';
import { Link, Head } from '@inertiajs/react';
import WelcomeTile from './Welcome/Partials/WelcomeTile';

export default function Welcome({ auth, appName, year, canRegister }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            {canRegister ? <Link
                              href={route('register')}
                              className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                              Register
                            </Link> : null}
                        </>
                    )}
                </div>

                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex justify-center">
                      <ApplicationLogo
                        sx={{
                          fontSize: 64
                        }}
                      />
                    </div>

                    <div className="mt-16">
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 lg:gap-8">
                        <WelcomeTile title="Clarity"
                          content={[
                            `If you find yourself here without a clear purpose, it's possible that you've taken a wrong turn or wandered off your intended path. Perhaps you've navigated to this place by accident or without a specific destination in mind. Regardless of the reason, being in a situation where you lack a clear objective can feel disorienting or unsettling.`
                            , `However, this unexpected detour also presents an opportunity for reflection and exploration. Sometimes, being lost can lead to unexpected discoveries or new perspectives. It provides a chance to pause, reassess your surroundings, and consider alternative routes or possibilities that you may not have otherwise encountered. Embracing the uncertainty of the moment can open doors to unexpected adventures or insights.`
                            , `So, if you're finding yourself in this moment with no apparent reason or direction, take a moment to breathe and embrace the uncertainty. Allow yourself to wander, both physically and metaphorically, and see where the journey takes you. Sometimes, the most meaningful experiences emerge from the unexpected twists and turns of life's unpredictable paths.`
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mt-16 px-6 sm:items-center sm:justify-between">
                      <div className="ml-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:ml-0">
                        &copy; {year} {appName}
                      </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </>
    );
}
