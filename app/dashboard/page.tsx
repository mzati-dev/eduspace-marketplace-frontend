'use client';

import { useAppContext } from '../../context/AppContext';
import Header from '../../components/common/Header';
import CartModal from '../../components/common/CartModal';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import { useState } from 'react';
import SideMenu from '@/components/common/SideMenu';

export default function Dashboard() {
    const { user } = useAppContext();
    const [isCartOpen, setCartOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); // ADD THIS

    // ===== START CHANGE 2: Add state for side menu =====
    const [isSideMenuOpen, setSideMenuOpen] = useState(false);
    // ===== END CHANGE 2 =====


    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            {/* ===== START CHANGE 3: Add SideMenu component ===== */}
            <SideMenu
                userRole={user.role}
                isOpen={isSideMenuOpen}
                onClose={() => setSideMenuOpen(false)}
                onMenuClick={() => setSideMenuOpen(true)}
                onCollapse={setIsCollapsed}
            />
            {/* ===== END CHANGE 3 ===== */}

            {/* ===== CHANGE 2: UPDATE this div with dynamic margin ===== */}
            <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                {/* ===== END CHANGE 4 ===== */}
                {/* ===== START CHANGE 5: Add onMenuClick to Header ===== */}
                <Header
                    onCartClick={() => setCartOpen(true)}
                    onMenuClick={() => setSideMenuOpen(true)}
                />
                {/* ===== END CHANGE 5 ===== */}
                <main className="px-4 sm:px-6 lg:px-8 py-8">
                    {user.role === 'student' ? <StudentDashboard isSidebarOpen={!isCollapsed} /> : <TeacherDashboard isSidebarOpen={!isCollapsed} />}
                </main>
                {/* ===== START CHANGE 4 (closing div) ===== */}
            </div>
            {/* ===== END CHANGE 4 ===== */}
            <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
}


// 'use client';
// import { useAppContext } from '../../context/AppContext';
// import Header from '../../components/common/Header';
// import CartModal from '../../components/common/CartModal';
// import StudentDashboard from '../../components/dashboard/StudentDashboard';
// import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
// import { useState } from 'react';
// import SideMenu from '@/components/common/SideMenu';

// export default function Dashboard() {
//     const { user } = useAppContext();
//     const [isCartOpen, setCartOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(false); // ADD THIS

//     // ===== START CHANGE 2: Add state for side menu =====
//     const [isSideMenuOpen, setSideMenuOpen] = useState(false);
//     // ===== END CHANGE 2 =====


//     if (!user) {
//         return null;
//     }

//     return (
//         <div className="min-h-screen bg-slate-900 text-white font-sans">
//             {/* ===== START CHANGE 3: Add SideMenu component ===== */}
//             <SideMenu
//                 userRole={user.role}
//                 isOpen={isSideMenuOpen}
//                 onClose={() => setSideMenuOpen(false)}
//                 onMenuClick={() => setSideMenuOpen(true)} // ADD THIS
//             />
//             {/* ===== END CHANGE 3 ===== */}

//             {/* ===== START CHANGE 4: Add left margin wrapper for desktop ===== */}
//             <div className="lg:ml-64">
//                 {/* ===== END CHANGE 4 ===== */}
//                 {/* ===== START CHANGE 5: Add onMenuClick to Header ===== */}
//                 <Header
//                     onCartClick={() => setCartOpen(true)}
//                     onMenuClick={() => setSideMenuOpen(true)}
//                 />
//                 {/* ===== END CHANGE 5 ===== */}
//                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     {user.role === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
//                 </main>
//                 {/* ===== START CHANGE 4 (closing div) ===== */}
//             </div>
//             {/* ===== END CHANGE 4 ===== */}
//             <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
//         </div>
//     );
// }