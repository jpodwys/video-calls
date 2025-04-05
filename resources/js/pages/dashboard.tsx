// import { Avatar } from '@/components/ui/avatar';
// import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
// import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export default function Dashboard({ users }: { users: User[] }) {
    // const getInitials = useInitials();

    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
                    {/* {
                        users.map(({ id, name }) => {
                            return (
                                <button onClick={() => {}} key={id} className="content-center text-center border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                    <Avatar key={id} className="m-auto size-8 overflow-hidden rounded-full">
                                        <AvatarFallback className="h-full w-full text-center content-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {name}
                                </button>
                            );
                        })
                    } */}
                    <Link href="/call" className="content-center text-center border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        Join Call
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
