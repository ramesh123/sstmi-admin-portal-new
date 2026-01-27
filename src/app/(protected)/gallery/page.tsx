'use client';
import { AppSidebar } from '@/components/ui/AppSidebar';
import { useState } from 'react';
import { Box, Tabs, Tab, IconButton, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer } from 'react-toastify';
import nextDynamic from 'next/dynamic';
import Services from '@/components/services';
import PriestServices from '@/components/Priestservice';
import Abishekam from '@/components/Abishekam';
import Donations from '@/components/donations';
import Pooja from '@/components/pooja';
import 'react-toastify/dist/ReactToastify.css';
import { SidebarProvider } from '@/components/ui/sidebar';

// Dynamically import components with SSR disabled
const WebsiteMediaUpdate = nextDynamic(() => import('@/components/WebsiteMediaUpdate'), { ssr: false });

export const dynamic = 'force-dynamic';

interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function AdminPage() {
    const [activeSection, setActiveSection] = useState('home');
    const [currentTab, setCurrentTab] = useState(0);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleSidebarNavigate = (section: string) => {
        setActiveSection(section);
        setMobileDrawerOpen(false);
    };

    const renderMainContent = () => {
        return (
                    <Box sx={{ width: '100%' }}>
                        <TabPanel value={currentTab} index={0}>
                            <WebsiteMediaUpdate />
                        </TabPanel>
                    </Box>
                );
    };

    return (
        <SidebarProvider>
            <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', gap: 0, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Mobile Drawer Sidebar - Hidden, triggered from header */}
                <Drawer
                    anchor="left"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                >
                    <Box sx={{ width: 250, p: 1, maxHeight: '100vh', overflowY: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                            <IconButton onClick={() => setMobileDrawerOpen(false)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <AppSidebar onNavigate={handleSidebarNavigate} />
                    </Box>
                </Drawer>

                {/* Desktop Sidebar - Only on desktop */}
                {/* <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0 }}>
                    <AppSidebar onNavigate={setActiveSection} />
                </Box> */}

                {/* Main Content Area */}
                <Box
                    sx={{
                        flex: 1,
                        width: '100%',
                        boxSizing: 'border-box',
                        overflowX: 'hidden'
                    }}
                >
                    {renderMainContent()}
                </Box>
            </Box>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </SidebarProvider>
    );
}

export default AdminPage;