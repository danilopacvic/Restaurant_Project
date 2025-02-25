
import { db } from "@/lib/prisma";
import { isValidCpf, removeCpfPunctuation } from "../menu/helpers/cpf";
import CpfForm from "./components/cpf-form";
import OrderList from "./components/order-list";

interface OrdersPageProps {
    searchParams: Promise<{ cpf: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
    const { cpf } = await searchParams;
    if (!cpf || !isValidCpf(cpf)) {
        return <CpfForm />
    }

    const orders = await db.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            customerCPF: removeCpfPunctuation(cpf),
        },
        include: {
            restaurant: {
                select: {
                    avatarImageUrl: true,
                    name: true,
                }
            },
            orderProducts: {
                include: {
                    product: true,
                }
            }
        }
    });
    return (
        <OrderList orders={orders}/>
    );
}
 
export default OrdersPage;