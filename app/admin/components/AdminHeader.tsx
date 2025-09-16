'use client';

import { useAppContext } from "@/context/AppContext";
import { LogOut, Users, BookCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
    const { logout } = useAppContext();
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white shadow-md z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* <div className="flex items-center gap-6"> */}
                <h1 className="text-xl font-bold">Admin Panel</h1>
                {/* <nav className="flex gap-4"> */}
                <nav className="flex gap-4 absolute left-1/2 transform -translate-x-1/2">
                    <Link
                        href="/admin/reviews"
                        className={`flex items-center gap-2 p-2 rounded ${pathname.includes('/admin/reviews') ? 'bg-slate-700' : ''}`}
                    >
                        <BookCheck size={18} />
                        Reviews
                    </Link>
                    <Link
                        href="/admin/users"
                        className={`flex items-center gap-2 p-2 rounded ${pathname === '/admin/users' ? 'bg-slate-700' : ''}`}
                    >
                        <Users size={18} />
                        Manage Users
                    </Link>
                </nav>
                {/* </div> */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </header>
    );
}


// 'use client';

// import { useAppContext } from "@/context/AppContext";
// import { LogOut, Users, BookCheck } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function AdminHeader() {
//   // 1. Get the full 'user' object from the context
//   const { user, logout } = useAppContext();
//   const pathname = usePathname();

//   return (
//     <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white shadow-md z-50">
//       <div className="container mx-auto flex justify-between items-center p-4">
//         <div className="flex items-center gap-6">
//             <h1 className="text-xl font-bold">Admin Panel</h1>
//             <nav className="flex gap-4">
//                 {/* This link is visible to all admins */}
//                 <Link
//                   href="/admin/reviews"
//                   className={`flex items-center gap-2 p-2 rounded ${pathname.includes('/admin/reviews') ? 'bg-slate-700' : ''}`}
//                 >
//                     <BookCheck size={18} />
//                     Reviews
//                 </Link>

//                 {/* 2. Conditionally render the "Manage Users" link */}
//                 {user?.role === 'chief_admin' && (
//                   <Link
//                     href="/admin/users"
//                     className={`flex items-center gap-2 p-2 rounded ${pathname === '/admin/users' ? 'bg-slate-700' : ''}`}
//                   >
//                       <Users size={18} />
//                       Manage Users
//                   </Link>
//                 )}
//             </nav>
//         </div>
//         <button
//           onClick={logout}
//           className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }

// // app/components/AdminHeader.tsx

// 'use client';

// import { useAppContext } from "@/context/AppContext";
// import { LogOut, Users, BookCheck } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function AdminHeader() {
//     const { logout } = useAppContext();
//     const pathname = usePathname();

//     return (
//         <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white shadow-md z-50">
//             <div className="container mx-auto flex justify-between items-center p-4">
//                 <div className="flex items-center gap-6">
//                     <h1 className="text-xl font-bold">Admin Panel</h1>
//                     <nav className="flex gap-4">
//                         {/* Link to the Lesson Reviews page */}
//                         <Link
//                             href="/admin/reviews"
//                             className={`flex items-center gap-2 p-2 rounded ${pathname.includes('/admin/reviews') ? 'bg-slate-700' : ''}`}
//                         >
//                             <BookCheck size={18} />
//                             Reviews
//                         </Link>

//                         {/* Link to the Manage Users page - NO LONGER CONDITIONAL */}
//                         <Link
//                             href="/admin/users"
//                             className={`flex items-center gap-2 p-2 rounded ${pathname === '/admin/users' ? 'bg-slate-700' : ''}`}
//                         >
//                             <Users size={18} />
//                             Manage Users
//                         </Link>
//                     </nav>
//                 </div>
//                 <button
//                     onClick={logout}
//                     className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
//                 >
//                     <LogOut size={18} />
//                     Logout
//                 </button>
//             </div>
//         </header>
//     );
// }


// 'use client';

// import { useAppContext } from "@/context/AppContext";
// import { LogOut, Users, BookCheck } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function AdminHeader() {
//     const { logout } = useAppContext();
//     const pathname = usePathname(); // Hook to get the current URL path

//     return (
//         <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white shadow-md z-50">
//             <div className="container mx-auto flex justify-between items-center p-4">
//                 <div className="flex items-center gap-6">
//                     <h1 className="text-xl font-bold">Admin Panel</h1>
//                     {/* This nav section contains the links */}
//                     <nav className="flex gap-4">
//                         {/* Link to the Lesson Reviews page */}
//                         <Link
//                             href="/admin/reviews"
//                             className={`flex items-center gap-2 p-2 rounded ${pathname.includes('/admin/reviews') ? 'bg-slate-700' : ''}`}
//                         >
//                             <BookCheck size={18} />
//                             Reviews
//                         </Link>

//                         {/* Link to the Manage Users page */}
//                         <Link
//                             href="/admin/users"
//                             className={`flex items-center gap-2 p-2 rounded ${pathname === '/admin/users' ? 'bg-slate-700' : ''}`}
//                         >
//                             <Users size={18} />
//                             Manage Users
//                         </Link>
//                     </nav>
//                 </div>
//                 <button
//                     onClick={logout}
//                     className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
//                 >
//                     <LogOut size={18} />
//                     Logout
//                 </button>
//             </div>
//         </header>
//     );
// }

// 'use client';

// import { useAppContext } from "@/context/AppContext";
// import { LogOut } from "lucide-react";

// export default function AdminHeader() {
//     // Get the logout function from your global context
//     const { logout } = useAppContext();

//     return (
//         // <header className="bg-slate-800 text-white shadow-md">
//         <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white shadow-md z-50">
//             <div className="container mx-auto flex justify-between items-center p-4">
//                 <h1 className="text-xl font-bold">Chief Admin Panel</h1>
//                 <button
//                     onClick={logout}
//                     className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
//                 >
//                     <LogOut size={18} />
//                     Logout
//                 </button>
//             </div>
//         </header>
//     );
// }