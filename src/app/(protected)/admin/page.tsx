'use client';
import { AppSidebar } from '@/components/ui/AppSidebar';
import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import nextDynamic from 'next/dynamic';
import Services from '@/components/services'; // Make sure this exists
import PriestServices from '@/components/Priestservice'; // Make sure this exists
import Abishekam from '@/components/Abishekam'; // Make sure this exists
import Donations from '@/components/donations'; // Make sure this exists
import Pooja from '@/components/pooja'; // Make sure this exists
import 'react-toastify/dist/ReactToastify.css';
import { SidebarProvider } from '@/components/ui/sidebar'; // <-- Add this import
//import Header from '@/components/Header'; // Add this import

// Dynamically import components with SSR disabled
const Transactions = nextDynamic(() => import('@/components/Transactions'), { ssr: false });
const EditTransactions = nextDynamic(() => import('@/components/Edit-Transactions'), { ssr: false });
const DevoteeTypeahead = nextDynamic(() => import('@/components/DevoteeTypeahead'), { ssr: false });
const SingleTaxLetter = nextDynamic(() => import('@/components/SingleTaxLetter'), { ssr: false });
const BackendUtilities = nextDynamic(() => import('@/components/BackendUtilities'), { ssr: false });
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
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function AdminPage() {
    const [activeSection, setActiveSection] = useState('home');
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedDevotee, setSelectedDevotee] = useState<{
        Name: string;
        Email: string;
    } | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        setSelectedDevotee(null);
    };

    const handleDevoteeSelect = (devotee: {
        Name: string;
        Email: string;
        PhoneNumber: string;
        Address: string;
    }) => {
        setSelectedDevotee({
            Name: devotee.Name,
            Email: devotee.Email
        });
    };

    const handleNewDevotee = (name: string) => {
        console.log('New devotee name:', name);
    };

    // Render main content based on sidebar selection
    const renderMainContent = () => {
        switch (activeSection) {
            case 'services':
                return <Services />;
            case 'Abhishekam':
                return <Abishekam />;
            case 'Pooja':
                return <Pooja />;
            case 'Donations':
                return <Donations />;
            case 'PriestServices':
                return <PriestServices/>;

            case 'home':
            default:
                return (
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={currentTab}
                                onChange={handleTabChange}
                                aria-label="admin tabs"
                                variant="scrollable"
                                scrollButtons="auto"
                                allowScrollButtonsMobile
                                sx={{
                                    '& .MuiTab-root': {
                                        minWidth: 120,
                                        '@media (min-width: 600px)': {
                                            minWidth: 160
                                        }
                                    }
                                }}
                            >
                                <Tab label="Find Devotee" />
                                <Tab label="Transactions" />
                                <Tab label="Tax Letters" />
                                <Tab label="Edit Transactions" />
                                <Tab label="Backend Utilities" />
                                <Tab label="Website Media Update" />
                            </Tabs>
                        </Box>

                        <TabPanel value={currentTab} index={0}>
                            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Search Devotee
                                </Typography>
                                <DevoteeTypeahead
                                    onSelect={handleDevoteeSelect}
                                    onNewName={handleNewDevotee}
                                    className="mb-8"
                                />

                                {selectedDevotee && (
                                    <Box sx={{ mt: 4 }}>
                                        <Transactions
                                            devoteeFilter={{
                                                DevoteeName: selectedDevotee.Name,
                                                DevoteeEmail: selectedDevotee.Email
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </TabPanel>

                        <TabPanel value={currentTab} index={1}>
                            <Transactions />
                        </TabPanel>

                        <TabPanel value={currentTab} index={2}>
                            <SingleTaxLetter />
                        </TabPanel>

                        <TabPanel value={currentTab} index={3}>
                            <EditTransactions />
                        </TabPanel>

                        <TabPanel value={currentTab} index={4}>
                            <BackendUtilities />
                        </TabPanel>

                        <TabPanel value={currentTab} index={5}>
                            <WebsiteMediaUpdate />
                        </TabPanel>
                    </Box>
                );
        }
    };

    return (
        <SidebarProvider>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <AppSidebar onNavigate={setActiveSection} />
                <div style={{ flex: 1, background: '#f1f5f9', padding: '2rem' }}>
                    {renderMainContent()}
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
                </div>
            </div>
        </SidebarProvider>
    );
}

export default AdminPage;