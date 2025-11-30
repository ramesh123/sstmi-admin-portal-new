"use client";
import { useEffect, useState } from "react";

interface Services {
    name: string;
    price: string;
    group: string;
}

interface SortConfig {
    key: keyof Services | null;
    direction: 'asc' | 'desc';
}

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
                color: 'white',
                fontWeight: '500',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 9999,
                animation: 'slideIn 0.3s ease-out',
                minWidth: '300px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0',
                        lineHeight: '1'
                    }}
                >
                    ×
                </button>
            </div>
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

const ServicesManager = () => {

    const [faqs, setFaqs] = useState<Services[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [selectedFaq, setSelectedFaq] = useState<Services | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load FAQs from storage on mount
    useEffect(() => {
        loadFaqsFromStorage();
    }, []);
    const loadFaqsFromStorage = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://esalzmioqk.execute-api.us-east-1.amazonaws.com/Prod/services', {
                credentials: 'include',
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }

            const data: Services[] = await response.json();
            setFaqs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const sortData = (data: Services[]): Services[] => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const filterData = (data: Services[]) => {
        if (!searchTerm) return data;

        return data.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.group.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSort = (key: keyof Services): void => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const filteredData: Services[] = filterData(faqs);
    const sortedData: Services[] = sortData(filteredData);

    const totalPages: number = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const paginatedData: Services[] = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const getSortIcon = (key: keyof Services) => {
        if (sortConfig.key !== key) {
            return <span className="text-gray-400">⇅</span>;
        }
        return sortConfig.direction === 'asc' ? <span>↑</span> : <span>↓</span>;
    };

    const handleAddNew = () => {
        setSelectedFaq(null);
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleSave = async (faq: Services) => {
        setIsLoading(true);
        try {
            let jsonObj = { group: faq?.group, name: faq?.name };
            const response = await fetch('https://esalzmioqk.execute-api.us-east-1.amazonaws.com/Prod/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    httpMethod: 'POST',
                    body: JSON.stringify(jsonObj)
                })
            });
            if (!response.ok) {
                throw new Error('Failed to post faqs');
            }
            const result = await response.json();
            if (result?.body) {
                loadFaqsFromStorage();
                setIsModalOpen(false);
            }
        } catch (err) {
            //setToast({ message: 'Failed to load faqs data. Please refresh the page.', type: 'error' });
            //console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (faq: any) => {
        const updatedFaqs = faqs.filter(f => f.name !== faq?.name);
        setFaqs(updatedFaqs);
        setIsLoading(true);
        try {
            let jsonObj = { name: faq?.name, price: faq?.price };
            const response = await fetch('https://esalzmioqk.execute-api.us-east-1.amazonaws.com/Prod/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    httpMethod: 'DELETE',
                    body: JSON.stringify(jsonObj)
                })
            });
            if (!response.ok) {
                throw new Error('Failed to post faqs');
            }
            const result = await response.json();
            if (result?.body) {
                setToast({ message: 'FAQ deleted successfully!', type: 'success' });
                setDeleteConfirm(null);
            }
        } catch (err) {
            //setToast({ message: 'Failed to load faqs data. Please refresh the page.', type: 'error' });
            //console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Service
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">
                                    <button
                                        onClick={() => handleSort('group')}
                                        className="flex items-center gap-2 hover:text-blue-600 transition"
                                    >
                                        Category {getSortIcon('group')}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">
                                    <button
                                        onClick={() => handleSort('name')}
                                        className="flex items-center gap-2 hover:text-blue-600 transition"
                                    >
                                        Service Name {getSortIcon('name')}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/2">
                                    <button
                                        onClick={() => handleSort('price')}
                                        className="flex items-center gap-2 hover:text-blue-600 transition"
                                    >
                                        Price {getSortIcon('price')}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((row: Services, index) => (
                                    <tr key={index} className="hover:bg-blue-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {row.group}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {row.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {row.price}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setDeleteConfirm(row)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No Services found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page: number) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesManager;
