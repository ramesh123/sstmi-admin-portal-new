
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import AddServiceForm from "./AddServiceForm";
import ServiceControls from "./SericeControls";
interface Service {
    id: string;
    name: string;
    price: number;
    image: string;
}

const Services = () => {
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [newService, setNewService] = useState({
        name: "",
        price: "",
        image: "🔔"
    });

    const [services, setServices] = useState<Service[]>([
        {
            id: "puja-basic",
            name: "Basic Puja",
            price: 25,
            image: "🙏"
        },
        {
            id: "puja-special",
            name: "Special Ceremony",
            price: 75,
            image: "🔥"
        },
        {
            id: "blessing-home",
            name: "Home Blessing",
            price: 150,
            image: "🏠"
        },
        {
            id: "wedding-ceremony",
            name: "Wedding Ceremony",
            price: 500,
            image: "💒"
        },
        {
            id: "donation-general",
            name: "General Donation",
            price: 50,
            image: "🎁"
        },
        {
            id: "prasadam",
            name: "Blessed Prasadam",
            price: 15,
            image: "🍯"
        }
    ]);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (service: Service) => {
        addToCart({
            id: service.id,
            name: service.name,
            price: service.price,
            description: service.name
        });

        toast({
            title: "Added to Cart",
            description: `${service.name} has been added to your cart.`,
        });
    };

    const handleAddService = () => {
        if (!newService.name || !newService.price) {
            toast({
                title: "Error",
                description: "Please fill in all fields.",
                variant: "destructive"
            });
            return;
        }

        const service: Service = {
            id: `custom-${Date.now()}`,
            name: newService.name,
            price: parseFloat(newService.price),
            image: newService.image
        };

        setServices([...services, service]);
        setNewService({
            name: "",
            price: "",
            image: "🔔"
        });
        setShowAddForm(false);

        toast({
            title: "Service Added",
            description: `${service.name} has been added to services.`,
        });
    };

    const handleDeleteService = (serviceId: string) => {
        setServices(services.filter(s => s.id !== serviceId));
        toast({
            title: "Service Deleted",
            description: "The service has been removed.",
        });
    };

    return (
        <section id="services" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="container mx-auto px-4">
                <ServiceControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onAddServiceClick={() => setShowAddForm(!showAddForm)}
                />

                {showAddForm && (
                    <AddServiceForm
                        newService={newService}
                        setNewService={setNewService}
                        onAddService={handleAddService}
                        onCancel={() => setShowAddForm(false)}
                    />
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Edit
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredServices.map((service) => (
                                <tr key={service.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${service.price}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-900"
                                            onClick={() => {
                                                // Placeholder for edit functionality
                                                toast({ title: "Edit", description: `Editing ${service.name}` });
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteService(service.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-amber-700 text-lg">No services found matching your search.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;