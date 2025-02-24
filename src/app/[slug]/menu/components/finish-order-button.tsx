"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidCpf } from "../helpers/cpf";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {PatternFormat} from "react-number-format";
import { createOrder } from "../actions/create-order";
import { useParams, useSearchParams } from "next/navigation";
import { ConsumptionMethod } from "@prisma/client";
import { CartContext } from "../contexts/cart";
import { useContext, useTransition } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
    name: z.string().trim().min(1, {
       message: "O nome é obrigatório.", 
    }),
    cpf: z.string().trim().min(1, {
      message: "O CPF é obrigatõrio.",
    }).refine((value) => isValidCpf(value), {
        message: "CPF inválido.",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

interface FinisOrderDialogProps {
  open: boolean,
  onOpenChange: (open: boolean) => void;
}


const FinishOrderDialog = ({open, onOpenChange}: FinisOrderDialogProps) => {
  const {slug} = useParams< {slug: string} >();
  const {products} = useContext(CartContext);
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          cpf: "",
        },
        shouldUnregister: true,
    });
    const onSubmit = async (data: FormSchema) => {
        try {
          const consumptionMethod = searchParams.get("consumptionMethod") as ConsumptionMethod;
          startTransition(async () => {
            await createOrder({
              consumptionMethod,
              customerCpf: data.cpf,
              customerName: data.name,
              products,
              slug,
            });
          })
        
          onOpenChange(false);
          toast.success("Pedido finalizado com sucesso");
        } catch (error) {
          console.error(error);
          toast.error("Houve um erro ao finalizar o seu pedido. Tente novamente mais tarde")
        }
    }
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
           
            </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Finalizar Pedido</DrawerTitle>
            <DrawerDescription>Insira as suas informações para finalizar o seu pedido.</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu CPF</FormLabel>
              <FormControl>
                <PatternFormat placeholder="Digite o seu CPF..." format="###.###.###-##" customInput={Input}{...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DrawerFooter>
            <Button type="submit" variant="destructive" className="rounded-full" disabled={isPending}>
              {isPending && <Loader2Icon className="animate-spin"/>}
              Finalizar
              </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full rounded-full">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
      </form>
    </Form>
        </DrawerContent>
      </Drawer>
      );
}
 
export default FinishOrderDialog;